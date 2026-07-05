import { useState } from "react";
import { useListPhrases, useListPhraseCategories, useRequestPhraseAudio } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Mic, MicOff, CircleCheck, Send, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFavorites } from "@/hooks/use-favorites";

const categoryLabels: Record<string, string> = {
  greetings: "Приветствия",
  everyday: "Обиходные фразы",
  requests: "Просьбы",
  questions: "Вопросы",
  numbers: "Числа",
  time: "Время",
  family: "Семья",
  food: "Еда",
  home: "Дом",
  actions: "Действия",
  animals: "Животные",
  colors: "Цвета",
  body: "Части тела",
  weather: "Погода",
  clothing: "Одежда",
  nature: "Природа",
};

const audioStatusMeta: Record<string, { label: string; icon: typeof Mic; className: string }> = {
  missing: { label: "Нет аудио", icon: MicOff, className: "text-muted-foreground border-muted-foreground/40" },
  requested: { label: "Запись запрошена", icon: Send, className: "text-amber-700 border-amber-400 dark:text-amber-400" },
  recorded: { label: "Записано (не проверено)", icon: Mic, className: "text-blue-700 border-blue-400 dark:text-blue-400" },
  verified: { label: "Проверено носителем", icon: CircleCheck, className: "text-green-700 border-green-500 dark:text-green-400" },
};

function AudioStatusBadge({ status }: { status: string }) {
  const meta = audioStatusMeta[status] || audioStatusMeta.missing;
  const Icon = meta.icon;
  return (
    <Badge variant="outline" className={`gap-1 ${meta.className}`}>
      <Icon className="h-3 w-3" />
      {meta.label}
    </Badge>
  );
}

export default function Phrasebank() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [showFavOnly, setShowFavOnly] = useState(false);
  const { toast } = useToast();
  const { favorites, toggle: toggleFavorite } = useFavorites("phrase");

  const { data: categories } = useListPhraseCategories();
  const { data, isLoading } = useListPhrases({
    search: search || undefined,
    category: category !== "all" ? category : undefined,
  });

  const requestAudio = useRequestPhraseAudio({
    mutation: {
      onSuccess: () => {
        toast({ title: "Запрос отправлен", description: "Фраза добавлена в очередь на запись носителем языка." });
      },
    },
  });

  const allPhrases = data?.phrases || [];
  const phrases = showFavOnly ? allPhrases.filter(p => favorites.has(p.id)) : allPhrases;
  const grouped = phrases.reduce<Record<string, typeof phrases>>((acc, p) => {
    (acc[p.category] ||= []).push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-primary">Фразник</h1>
          <p className="text-muted-foreground mt-1">
            Готовые фразы для повседневного общения. Часть фраз — черновые конструкции, отмечены и требуют проверки носителем языка.
          </p>
        </div>
        <Button
          variant={showFavOnly ? "default" : "outline"}
          size="sm"
          className="gap-2"
          onClick={() => setShowFavOnly(v => !v)}
        >
          <Heart className={`h-4 w-4 ${showFavOnly ? "fill-current" : ""}`} />
          Избранное {favorites.size > 0 && `(${favorites.size})`}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по фразам..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            {(categories || []).map((c) => (
              <SelectItem key={c.label} value={c.label}>
                {categoryLabels[c.label] || c.label} ({c.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      ) : phrases.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg bg-card/50">
          {showFavOnly ? (
            <>
              <Heart className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-lg">Нет избранных фраз</p>
              <p className="text-sm mt-1 opacity-70">Нажмите ♡ на любой фразе, чтобы сохранить</p>
            </>
          ) : (
            <p>Фразы не найдены.</p>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} className="space-y-3">
              <h2 className="text-lg font-semibold text-primary/90 border-b border-border pb-1">
                {categoryLabels[cat] || cat}
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                {items.map((p) => {
                  const confidencePct = p.confidence != null ? Math.round(p.confidence * 100) : null;
                  const isDraft = p.confidence != null && p.confidence < 0.5;
                  const isFav = favorites.has(p.id);
                  return (
                    <Card key={p.id} className={isDraft ? "border-amber-300/60 bg-amber-50/40 dark:bg-amber-950/10" : "bg-card"}>
                      <CardContent className="pt-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-lg font-semibold">{p.andi}</p>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => toggleFavorite(p.id)}
                              className={`p-1 rounded-full transition-colors ${
                                isFav ? "text-rose-500 hover:text-rose-600" : "text-muted-foreground opacity-30 hover:opacity-70 hover:text-rose-400"
                              }`}
                              title={isFav ? "Убрать из избранного" : "В избранное"}
                            >
                              <Heart className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
                            </button>
                            <AudioStatusBadge status={p.audioStatus} />
                          </div>
                        </div>
                        <p className="text-muted-foreground">{p.russian}</p>
                        {p.english && <p className="text-sm text-muted-foreground/80">{p.english}</p>}
                        {p.transliteration && (
                          <p className="text-xs font-mono text-muted-foreground">/{p.transliteration}/</p>
                        )}
                        {p.breakdown && (
                          <p className="text-xs text-muted-foreground italic">{p.breakdown}</p>
                        )}
                        {p.exampleUsage && (
                          <p className="text-xs bg-muted/60 rounded px-2 py-1">{p.exampleUsage}</p>
                        )}
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {isDraft && <Badge variant="outline" className="text-amber-700 border-amber-400 text-[10px]">черновик</Badge>}
                            {confidencePct !== null && <span>достоверность: {confidencePct}%</span>}
                          </div>
                          {p.audioStatus === "missing" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 gap-1 text-xs"
                              disabled={requestAudio.isPending}
                              onClick={() => requestAudio.mutate({ id: p.id })}
                            >
                              <Send className="h-3 w-3" />
                              Запросить запись
                            </Button>
                          )}
                        </div>
                        {p.source && (
                          <p className="text-[10px] text-muted-foreground/70 pt-1 border-t border-border/50">
                            Источник: {p.source}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
