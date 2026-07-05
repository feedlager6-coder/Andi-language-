import { useParams } from "wouter";
import { useGetWord, getGetWordQueryKey, useRequestWordAudio } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Microscope, Mic, MicOff, CircleCheck, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const audioStatusMeta: Record<string, { label: string; icon: typeof Mic; className: string }> = {
  missing: { label: "Нет аудио", icon: MicOff, className: "text-muted-foreground border-muted-foreground/40" },
  requested: { label: "Запись запрошена", icon: Send, className: "text-amber-700 border-amber-400 dark:text-amber-400" },
  recorded: { label: "Записано (не проверено)", icon: Mic, className: "text-blue-700 border-blue-400 dark:text-blue-400" },
  verified: { label: "Проверено носителем", icon: CircleCheck, className: "text-green-700 border-green-500 dark:text-green-400" },
};

const levelMap: Record<string, string> = {
  beginner: "начальный",
  intermediate: "средний",
  advanced: "продвинутый",
};

const classColors: Record<string, string> = {
  "I":   "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-200",
  "II":  "bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900/30 dark:text-pink-200",
  "III": "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-200",
  "IV":  "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-200",
};

export default function WordDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  const { toast } = useToast();

  const { data: word, isLoading } = useGetWord(id, {
    query: { enabled: !!id, queryKey: getGetWordQueryKey(id) }
  });

  const requestAudio = useRequestWordAudio({
    mutation: {
      onSuccess: () => {
        toast({ title: "Запрос отправлен", description: "Слово добавлено в очередь на запись носителем языка." });
      },
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!word) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Слово не найдено.
      </div>
    );
  }

  const confidencePct = word.confidence ? Math.round(word.confidence * 100) : null;

  return (
    <div className="space-y-8 max-w-3xl mx-auto animate-in fade-in duration-500">
      <Button asChild variant="ghost" className="gap-2 text-muted-foreground -ml-2">
        <Link href="/dictionary">
          <ArrowLeft className="h-4 w-4" />
          Назад в словарь
        </Link>
      </Button>

      {/* Заголовок */}
      <div className="border-b border-border pb-6 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-5xl font-bold text-primary">{word.andiWord}</h1>
            {word.lemma && word.lemma !== word.andiWord && (
              <p className="text-sm text-muted-foreground mt-1">лемма: <span className="font-mono">{word.lemma}</span></p>
            )}
          </div>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href={`/morphology?word=${encodeURIComponent(word.andiWord)}`}>
              <Microscope className="h-3.5 w-3.5" />
              Разобрать
            </Link>
          </Button>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <Badge variant="secondary" className="font-mono">{word.partOfSpeech}</Badge>
          {word.nounClass && (
            <Badge className={`border font-semibold ${classColors[word.nounClass] || "bg-muted text-muted-foreground"}`}>
              Класс {word.nounClass}
            </Badge>
          )}
          {word.phonetic && (
            <span className="text-muted-foreground font-mono text-sm">/{word.phonetic}/</span>
          )}
          {word.level && (
            <Badge variant="outline">{levelMap[word.level] || word.level}</Badge>
          )}
          {confidencePct !== null && (
            <span className="text-xs text-muted-foreground">достоверность: {confidencePct}%</span>
          )}
          {(() => {
            const status = word.audioStatus || "missing";
            const meta = audioStatusMeta[status] || audioStatusMeta.missing;
            const Icon = meta.icon;
            return (
              <Badge variant="outline" className={`gap-1 ${meta.className}`}>
                <Icon className="h-3 w-3" />
                {meta.label}
              </Badge>
            );
          })()}
          {(word.audioStatus || "missing") === "missing" && (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 gap-1 text-xs px-2"
              disabled={requestAudio.isPending}
              onClick={() => requestAudio.mutate({ id: word.id })}
            >
              <Send className="h-3 w-3" />
              Запросить запись
            </Button>
          )}
        </div>
      </div>

      {/* Переводы */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Переводы</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-xs font-semibold text-muted-foreground block mb-1">Русский</span>
              <p className="text-lg font-medium">{word.russian}</p>
            </div>
            {word.english && (
              <div>
                <span className="text-xs font-semibold text-muted-foreground block mb-1">Английский</span>
                <p className="text-lg">{word.english}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Морфология */}
        {(word.root || word.affixes || word.morphology || word.grammaticalFunction) && (
          <Card className="bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Морфология</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {word.morphology && (
                <div>
                  <span className="text-xs font-semibold text-muted-foreground block mb-1">Разбор</span>
                  <code className="text-sm bg-muted px-2 py-1 rounded font-mono block">{word.morphology}</code>
                </div>
              )}
              {word.root && (
                <div className="flex gap-4">
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground block mb-1">Корень</span>
                    <code className="text-sm font-mono text-amber-700 dark:text-amber-400">{word.root}</code>
                  </div>
                  {word.affixes && (
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground block mb-1">Аффиксы</span>
                      <code className="text-sm font-mono text-rose-700 dark:text-rose-400">{word.affixes}</code>
                    </div>
                  )}
                </div>
              )}
              {word.grammaticalFunction && (
                <div>
                  <span className="text-xs font-semibold text-muted-foreground block mb-1">Грамматическая функция</span>
                  <p className="text-sm">{word.grammaticalFunction}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Примеры */}
      {word.examples && (
        <Card className="bg-card/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Примеры употребления</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg italic font-serif whitespace-pre-line leading-relaxed">{word.examples}</p>
          </CardContent>
        </Card>
      )}

      {/* Метаданные */}
      {(word.dialect || word.editorNotes) && (
        <Card className="bg-card/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Дополнительно</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {word.dialect && (
              <div>
                <span className="text-xs font-semibold text-muted-foreground block mb-1">Диалект</span>
                <p className="text-sm">{word.dialect}</p>
              </div>
            )}
            {word.editorNotes && (
              <div>
                <span className="text-xs font-semibold text-muted-foreground block mb-1">Заметки редактора</span>
                <p className="text-sm text-muted-foreground">{word.editorNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Источник */}
      {(word.source || word.license) && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground border-t border-border pt-4">
          {word.source && <span>Источник: {word.source}</span>}
          {word.license && <Badge variant="outline" className="text-xs">{word.license}</Badge>}
        </div>
      )}
    </div>
  );
}
