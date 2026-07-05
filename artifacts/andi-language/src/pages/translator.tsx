import { useState } from "react";
import { useTranslateText } from "@workspace/api-client-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Languages, Send, TriangleAlert, CheckCircle2, HelpCircle, ArrowRightLeft, History } from "lucide-react";
import { useTranslatorHistory } from "@/hooks/use-translator-history";

const matchTypeMeta: Record<string, { label: string; icon: typeof CheckCircle2; className: string }> = {
  phrase: { label: "найдена фраза", icon: CheckCircle2, className: "text-green-700 border-green-500 dark:text-green-400" },
  word: { label: "слово из словаря", icon: CheckCircle2, className: "text-blue-700 border-blue-400 dark:text-blue-400" },
  unmatched: { label: "не найдено", icon: HelpCircle, className: "text-muted-foreground border-muted-foreground/40" },
};

const EXAMPLE_QUERIES = [
  { text: "привет", desc: "приветствие" },
  { text: "вода", desc: "базовое слово" },
  { text: "мой брат", desc: "семья" },
  { text: "я здесь", desc: "короткая фраза" },
  { text: "отец мать", desc: "родственники" },
  { text: "хорошо", desc: "ответ" },
];

export default function Translator() {
  const [text, setText] = useState("");
  const { history, record } = useTranslatorHistory();
  const translate = useTranslateText();
  const result = translate.data;

  const handleSubmit = (query?: string) => {
    const q = (query ?? text).trim();
    if (!q) return;
    if (query) setText(query);
    translate.mutate({ data: { text: q } }, {
      onSuccess: (data) => {
        record(q, data?.draftTranslation ?? null, data?.overallConfidence ?? null);
      },
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <Languages className="h-7 w-7" />
          Переводчик
        </h1>
        <p className="text-muted-foreground mt-1">
          Помощник перевода на основе словаря и фразника. Это не полноценный машинный перевод —
          андийский язык слишком мало документирован для этого. Переводчик честно показывает,
          что найдено точно, а что — предположение.
        </p>
      </div>

      {/* Направление перевода */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 px-4 py-2 rounded-lg w-fit">
        <span className="font-medium text-foreground">Русский</span>
        <ArrowRightLeft className="h-4 w-4" />
        <span className="font-medium text-foreground">Андийский</span>
        <Badge variant="outline" className="text-xs ml-1">только это направление</Badge>
      </div>

      {/* Примеры запросов */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Попробуйте:
        </p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_QUERIES.map(({ text: t, desc }) => (
            <button
              key={t}
              onClick={() => handleSubmit(t)}
              className="px-3 py-1.5 rounded-full border border-border bg-card hover:bg-primary/5 hover:border-primary/40 text-sm transition-colors"
            >
              <span className="font-medium">{t}</span>
              <span className="text-muted-foreground ml-1 text-xs">({desc})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Форма ввода */}
      <Card>
        <CardContent className="pt-4 space-y-3">
          <Textarea
            placeholder="Введите текст на русском для перевода на андийский..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
            }}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Ctrl+Enter для отправки</span>
            <Button onClick={() => handleSubmit()} disabled={!text.trim() || translate.isPending} className="gap-2">
              <Send className="h-4 w-4" />
              {translate.isPending ? "Перевожу..." : "Перевести"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* История */}
      {history.length > 0 && !result && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
            <History className="h-3 w-3" /> Недавние запросы
          </p>
          <div className="flex flex-wrap gap-2">
            {history.map(h => (
              <button
                key={h}
                onClick={() => handleSubmit(h)}
                className="px-3 py-1 rounded-full border border-border bg-card hover:bg-primary/5 text-sm transition-colors"
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Результат */}
      {result && (
        <div className="space-y-4">
          <Alert
            variant={result.overallConfidence < 0.5 ? "destructive" : "default"}
            className="border-amber-300/60 bg-amber-50/40 dark:bg-amber-950/10"
          >
            <TriangleAlert className="h-4 w-4" />
            <AlertDescription>{result.disclaimer}</AlertDescription>
          </Alert>

          {result.isDraft && result.draftTranslation && (
            <Card className="bg-muted/40">
              <CardContent className="pt-4">
                <span className="text-xs font-semibold text-muted-foreground block mb-1">
                  Черновой перевод (пословный, требует проверки)
                </span>
                <p className="text-lg font-medium">{result.draftTranslation}</p>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Разбор по фрагментам
            </span>
            {result.segments.map((seg, i) => {
              const meta = matchTypeMeta[seg.matchType] || matchTypeMeta.unmatched;
              const Icon = meta.icon;
              const confPct = Math.round(seg.confidence * 100);
              return (
                <Card key={i} className="bg-card">
                  <CardContent className="py-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium">{seg.sourceText}</p>
                      {seg.translatedText ? (
                        <p className="text-muted-foreground text-lg font-semibold text-primary">{seg.translatedText}</p>
                      ) : (
                        <p className="text-muted-foreground italic">нет перевода</p>
                      )}
                      {seg.notes && <p className="text-xs text-muted-foreground/80 mt-1">{seg.notes}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className={`gap-1 ${meta.className}`}>
                        <Icon className="h-3 w-3" />
                        {meta.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{confPct}%</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Общая достоверность: {Math.round(result.overallConfidence * 100)}%
            </p>
            <Button variant="ghost" size="sm" onClick={() => translate.reset()}>
              Очистить
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
