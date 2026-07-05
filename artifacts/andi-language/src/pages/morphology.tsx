import { useState } from "react";
import { useAnalyzeWord, useGetWordForms, getGetWordFormsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { AlertTriangle, ArrowRight, Search } from "lucide-react";

const segmentColors: Record<string, string> = {
  root: "bg-amber-100 border-amber-400 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200",
  prefix: "bg-blue-100 border-blue-400 text-blue-900 dark:bg-blue-900/30 dark:text-blue-200",
  suffix: "bg-rose-100 border-rose-400 text-rose-900 dark:bg-rose-900/30 dark:text-rose-200",
  stem: "bg-green-100 border-green-400 text-green-900 dark:bg-green-900/30 dark:text-green-200",
  unknown: "bg-muted border-border text-muted-foreground",
};

const segmentTypeRu: Record<string, string> = {
  root: "корень",
  prefix: "префикс",
  suffix: "суффикс",
  stem: "основа",
  unknown: "неизв.",
};

export default function Morphology() {
  const [inputWord, setInputWord] = useState("");
  const [submittedWord, setSubmittedWord] = useState("");
  const [formsWordId, setFormsWordId] = useState<number | null>(null);

  const analyzeMutation = useAnalyzeWord();
  const { data: wordForms, isLoading: formsLoading } = useGetWordForms(formsWordId!, {
    query: { enabled: formsWordId !== null, queryKey: getGetWordFormsQueryKey(formsWordId!) }
  });

  const handleAnalyze = () => {
    if (!inputWord.trim()) return;
    setSubmittedWord(inputWord.trim());
    analyzeMutation.mutate({ data: { word: inputWord.trim() } }, {
      onSuccess: (data) => {
        if (data.matchedWord?.id) {
          setFormsWordId(data.matchedWord.id);
        } else {
          setFormsWordId(null);
        }
      }
    });
  };

  const result = analyzeMutation.data;

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-serif font-bold text-foreground">Морфологический анализатор</h1>
        <p className="text-muted-foreground mt-2">
          Разбор андийских слов на морфемы: корень, аффиксы, падежные суффиксы, классовые маркеры.
        </p>
      </div>

      <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 flex items-start gap-3 text-sm text-amber-800 dark:text-amber-200">
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
        <span>
          <strong>Предварительная версия.</strong> Анализатор основан на rule-based правилах по академическим описаниям андийского языка (Мадиева, 1980; Салимов, 2010). Результаты могут быть неточными — используйте как ориентир для изучения, не как эталон.
        </span>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Input
            value={inputWord}
            onChange={(e) => setInputWord(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            placeholder="Введите андийское слово для анализа..."
            className="h-12 text-lg pr-4"
          />
        </div>
        <Button onClick={handleAnalyze} disabled={!inputWord.trim() || analyzeMutation.isPending} size="lg" className="h-12 px-6">
          <Search className="mr-2 h-4 w-4" />
          Разобрать
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {["дида", "гьалъи", "рокъо", "гьалъилъун", "гьалъиди", "бахъине"].map(word => (
          <Button
            key={word}
            variant="outline"
            size="sm"
            className="font-mono justify-start"
            onClick={() => {
              setInputWord(word);
              setSubmittedWord(word);
              analyzeMutation.mutate({ data: { word } }, {
                onSuccess: (data) => {
                  if (data.matchedWord?.id) setFormsWordId(data.matchedWord.id);
                  else setFormsWordId(null);
                }
              });
            }}
          >
            <ArrowRight className="mr-2 h-3 w-3 text-muted-foreground" />
            {word}
          </Button>
        ))}
      </div>

      {analyzeMutation.isPending && (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {result && !analyzeMutation.isPending && (
        <div className="space-y-6">
          <Card className="bg-card">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="font-serif">
                  Анализ слова: <span className="text-primary">{result.input}</span>
                </CardTitle>
                <div className="flex items-center gap-2">
                  {result.isPreliminary && (
                    <Badge variant="outline" className="text-amber-600 border-amber-300">предварительно</Badge>
                  )}
                  <Badge variant="secondary">
                    уверенность: {Math.round((result.confidence || 0) * 100)}%
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Морфемный разбор */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Морфемный разбор</h3>
                <div className="flex flex-wrap gap-2 items-start">
                  {result.segments.map((seg, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className={`px-3 py-2 rounded border-2 font-bold text-xl font-mono ${segmentColors[seg.type] || segmentColors.unknown}`}>
                        {seg.text}
                      </div>
                      <div className="text-xs text-muted-foreground text-center max-w-[100px]">
                        <div className="font-semibold">{segmentTypeRu[seg.type] || seg.type}</div>
                        <div className="leading-tight">{seg.labelRu}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Грамматические категории */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {result.partOfSpeech && (
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="text-xs text-muted-foreground mb-1">Часть речи</div>
                    <div className="font-semibold">{result.partOfSpeech}</div>
                  </div>
                )}
                {result.nounClass && (
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="text-xs text-muted-foreground mb-1">Именной класс</div>
                    <div className="font-semibold">{result.nounClass}</div>
                  </div>
                )}
                {result.case && (
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="text-xs text-muted-foreground mb-1">Падеж</div>
                    <div className="font-semibold">{result.case}</div>
                  </div>
                )}
                {result.number && (
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="text-xs text-muted-foreground mb-1">Число</div>
                    <div className="font-semibold">{result.number}</div>
                  </div>
                )}
              </div>

              {/* Объяснение */}
              <div className="p-4 rounded-lg bg-card border border-border">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Объяснение</h3>
                <p className="text-sm leading-relaxed">{result.explanation}</p>
              </div>

              {/* Совпадение в словаре */}
              {result.matchedWord ? (
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h3 className="text-sm font-semibold text-primary mb-2">Найдено в словаре</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-lg text-primary">{result.matchedWord.andiWord}</span>
                      <span className="text-muted-foreground ml-3">{result.matchedWord.russian}</span>
                      {result.matchedWord.phonetic && (
                        <span className="text-muted-foreground ml-2 font-mono text-sm">/{result.matchedWord.phonetic}/</span>
                      )}
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dictionary/${result.matchedWord.id}`}>Открыть</Link>
                    </Button>
                  </div>
                  {result.matchedWord.morphology && (
                    <p className="text-sm text-muted-foreground mt-2 font-mono">{result.matchedWord.morphology}</p>
                  )}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic">
                  Точного совпадения в словаре не найдено. Анализ выполнен по правилам.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Парадигма склонения */}
          {formsWordId !== null && (
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="font-serif text-xl">Парадигма склонения</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Автоматически сгенерированные формы на основе базовой формы слова.
                  <Badge variant="outline" className="ml-2 text-amber-600 border-amber-300 text-xs">авто</Badge>
                </p>
              </CardHeader>
              <CardContent>
                {formsLoading ? (
                  <Skeleton className="h-40 w-full" />
                ) : wordForms?.forms && wordForms.forms.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 pr-4 text-muted-foreground font-semibold">Форма</th>
                          <th className="text-left py-2 pr-4 text-muted-foreground font-semibold">Падеж</th>
                          <th className="text-left py-2 pr-4 text-muted-foreground font-semibold">Число</th>
                          <th className="text-left py-2 text-muted-foreground font-semibold">Функция</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wordForms.forms.map((f, i) => (
                          <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                            <td className="py-2 pr-4 font-mono font-bold text-primary">{f.form}</td>
                            <td className="py-2 pr-4">{f.caseNameRu || f.caseName}</td>
                            <td className="py-2 pr-4 text-muted-foreground">{f.number === "plural" ? "мн.ч." : "ед.ч."}</td>
                            <td className="py-2 text-muted-foreground text-xs">{f.grammarNote}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Легенда */}
      <Card className="bg-card/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Условные обозначения</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {Object.entries(segmentColors).filter(([k]) => k !== "unknown").map(([type, cls]) => (
            <div key={type} className="flex items-center gap-2">
              <div className={`px-2 py-0.5 rounded border-2 text-xs font-bold font-mono ${cls}`}>аб</div>
              <span className="text-sm text-muted-foreground">{segmentTypeRu[type]}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
