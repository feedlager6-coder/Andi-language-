import { useState } from "react";
import { useGetCaseParadigms, useGetNounClasses, useGetGrammarDrills } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, XCircle } from "lucide-react";

type Tab = "cases" | "classes" | "drills";

function DrillItem({ drill }: { drill: { id: string; topicRu?: string; question: string; answer: string; options?: string[]; explanation: string } }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const isCorrect = selected === drill.answer;

  return (
    <Card className="bg-card">
      <CardContent className="pt-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <p className="font-medium">{drill.question}</p>
          <Badge variant="outline" className="text-xs shrink-0">{drill.topicRu}</Badge>
        </div>

        {drill.options && drill.options.length > 0 ? (
          <div className="space-y-2">
            {drill.options.map((opt) => {
              let className = "w-full text-left px-4 py-2 rounded-lg border transition-all text-sm ";
              if (!selected) {
                className += "border-border hover:bg-muted/60";
              } else if (opt === drill.answer) {
                className += "border-green-500 bg-green-50 dark:bg-green-900/20 font-semibold";
              } else if (opt === selected) {
                className += "border-red-400 bg-red-50 dark:bg-red-900/20";
              } else {
                className += "border-border opacity-60";
              }
              return (
                <button key={opt} className={className} onClick={() => !selected && setSelected(opt)}>
                  {opt}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            <Button variant="outline" size="sm" onClick={() => setRevealed(true)} disabled={revealed}>
              Показать ответ
            </Button>
            {revealed && (
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 font-mono font-bold text-primary">
                {drill.answer}
              </div>
            )}
          </div>
        )}

        {selected && (
          <div className={`flex items-start gap-2 p-3 rounded-lg text-sm ${isCorrect ? "bg-green-50 border border-green-200 dark:bg-green-900/20" : "bg-red-50 border border-red-200 dark:bg-red-900/20"}`}>
            {isCorrect
              ? <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
              : <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />}
            <p className="leading-relaxed">{drill.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Grammar() {
  const [activeTab, setActiveTab] = useState<Tab>("classes");
  const [drillTopic, setDrillTopic] = useState<string | undefined>(undefined);

  const { data: cases, isLoading: casesLoading } = useGetCaseParadigms();
  const { data: classes, isLoading: classesLoading } = useGetNounClasses();
  const { data: drills, isLoading: drillsLoading } = useGetGrammarDrills(
    { topic: drillTopic },
    { query: { queryKey: ["drills", drillTopic] as readonly unknown[] } }
  );

  const tabs: { id: Tab; label: string }[] = [
    { id: "classes", label: "Именные классы" },
    { id: "cases", label: "Система падежей" },
    { id: "drills", label: "Тренажёр грамматики" },
  ];

  const drillTopics = [
    { id: undefined, label: "Все темы" },
    { id: "noun_classes", label: "Классы" },
    { id: "cases", label: "Падежи" },
    { id: "numerals", label: "Числительные" },
    { id: "vocabulary", label: "Лексика" },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-serif font-bold text-foreground">Грамматика</h1>
        <p className="text-muted-foreground mt-2">
          Справочник по грамматической системе андийского языка: именные классы, падежи, морфология.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-0 -mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Именные классы ── */}
      {activeTab === "classes" && (
        <div className="space-y-6 pt-2">
          {classesLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : classes ? (
            <>
              <p className="text-muted-foreground text-sm leading-relaxed">{classes.description}</p>
              <div className="grid gap-6 md:grid-cols-2">
                {classes.classes.map((cls) => (
                  <Card key={cls.classNumber} className="bg-card border-l-4 border-l-primary">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center justify-between">
                        <span>Класс {cls.classNumber} — {cls.nameRu}</span>
                        <code className="text-base font-mono bg-muted px-2 py-0.5 rounded">{cls.marker}</code>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Семантика: </span>
                        {cls.semantics}
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Позиция маркера: </span>
                        {cls.markerPosition}
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Примеры:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {cls.examples.map(ex => (
                            <code key={ex} className="text-sm bg-muted px-2 py-0.5 rounded font-mono">{ex}</code>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Agreement table */}
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="text-lg">Таблица согласования</CardTitle>
                  <p className="text-sm text-muted-foreground">Как именной класс влияет на глагол и прилагательное</p>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 pr-6 text-muted-foreground">Класс</th>
                        <th className="text-left py-2 pr-6 text-muted-foreground">Существительное</th>
                        <th className="text-left py-2 pr-6 text-muted-foreground">Префикс</th>
                        <th className="text-left py-2 text-muted-foreground">Пример согласования</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50"><td className="py-2 pr-6 font-semibold">I</td><td className="py-2 pr-6 font-mono text-primary">инсу (отец)</td><td className="py-2 pr-6 font-mono font-bold">в-</td><td className="py-2 text-muted-foreground">в-ихьа (большой-м)</td></tr>
                      <tr className="border-b border-border/50"><td className="py-2 pr-6 font-semibold">II</td><td className="py-2 pr-6 font-mono text-primary">эбел (мать)</td><td className="py-2 pr-6 font-mono font-bold">й-</td><td className="py-2 text-muted-foreground">й-ихьа (большой-ж)</td></tr>
                      <tr className="border-b border-border/50"><td className="py-2 pr-6 font-semibold">III</td><td className="py-2 pr-6 font-mono text-primary">гьалъи (вода)</td><td className="py-2 pr-6 font-mono font-bold">б-</td><td className="py-2 text-muted-foreground">б-ихьа (большой-III)</td></tr>
                      <tr><td className="py-2 pr-6 font-semibold">IV</td><td className="py-2 pr-6 font-mono text-primary">рокъо (дом)</td><td className="py-2 pr-6 font-mono font-bold">р-</td><td className="py-2 text-muted-foreground">р-ихьа (большой-IV)</td></tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>
      )}

      {/* ── Падежи ── */}
      {activeTab === "cases" && (
        <div className="space-y-6 pt-2">
          {casesLoading ? (
            <Skeleton className="h-96 w-full" />
          ) : cases ? (
            <>
              <p className="text-muted-foreground text-sm leading-relaxed">{cases.description}</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-border bg-muted/30">
                      <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Падеж</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Суффикс</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Функция</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Пример</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cases.cases.map((c, i) => (
                      <tr key={c.name} className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                        <td className="py-3 px-4 font-semibold">{c.nameRu}</td>
                        <td className="py-3 px-4 font-mono text-primary font-bold">{c.suffix}</td>
                        <td className="py-3 px-4 text-muted-foreground">{c.function}</td>
                        <td className="py-3 px-4">
                          <code className="font-mono text-primary">{c.example}</code>
                          {c.exampleTranslation && (
                            <span className="text-muted-foreground ml-2 text-xs">'{c.exampleTranslation}'</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                <CardContent className="pt-4 text-sm text-amber-800 dark:text-amber-200 space-y-2">
                  <p><strong>Эргативный строй:</strong> В андийском языке субъект непереходного глагола стоит в именительном (абсолютном) падеже, а субъект переходного — в эргативном. Это принципиальное отличие от русского языка.</p>
                  <p><strong>Локативные серии:</strong> Каждая пространственная основа (на, под, в, за, перед...) образует серию из трёх форм: эссив (где?), латив (куда?) и элатив (откуда?).</p>
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>
      )}

      {/* ── Тренажёр ── */}
      {activeTab === "drills" && (
        <div className="space-y-6 pt-2">
          <div className="flex flex-wrap gap-2">
            {drillTopics.map(t => (
              <Button
                key={String(t.id)}
                variant={drillTopic === t.id ? "default" : "outline"}
                size="sm"
                onClick={() => setDrillTopic(t.id)}
              >
                {t.label}
              </Button>
            ))}
          </div>

          {drillsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
            </div>
          ) : drills && drills.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {drills.map(drill => <DrillItem key={drill.id} drill={drill} />)}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
              Упражнений по этой теме пока нет.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
