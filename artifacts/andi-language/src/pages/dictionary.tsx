import { useState, useEffect } from "react";
import { useListWords } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronLeft, ChevronRight, Heart, Volume2 } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";

const PAGE_SIZE = 30;

// Cyrillic alphabet for navigation
const CYRILLIC_LETTERS = "А Б В Г Д Е Ж З И К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Э Ю Я".split(" ");

export default function Dictionary() {
  const [search, setSearch] = useState("");
  const [partOfSpeech, setPartOfSpeech] = useState<string>("all");
  const [level, setLevel] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [letterFilter, setLetterFilter] = useState<string>("");
  const { favorites, toggle: toggleFavorite } = useFavorites("word");
  const [showFavOnly, setShowFavOnly] = useState(false);

  const offset = page * PAGE_SIZE;

  const { data, isLoading } = useListWords({
    search: search || undefined,
    letter: letterFilter || undefined,
    partOfSpeech: partOfSpeech !== "all" ? partOfSpeech : undefined,
    level: level !== "all" ? level : undefined,
    limit: PAGE_SIZE,
    offset,
  });

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(0);
  };

  const handlePosChange = (val: string) => {
    setPartOfSpeech(val);
    setPage(0);
  };

  const handleLevelChange = (val: string) => {
    setLevel(val);
    setPage(0);
  };

  const handleLetterFilter = (letter: string) => {
    const newLetter = letterFilter === letter ? "" : letter;
    setLetterFilter(newLetter);
    setSearch("");
    setPage(0);
  };

  const handleToggleFav = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  const levelLabel = (l: string | null | undefined) => {
    if (!l) return null;
    const map: Record<string, string> = {
      beginner: "Начальный",
      intermediate: "Средний",
      advanced: "Продвинутый",
    };
    return map[l] ?? l;
  };

  const levelColor = (l: string | null | undefined) => {
    if (l === "beginner") return "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20";
    if (l === "intermediate") return "text-amber-600 bg-amber-50 dark:bg-amber-900/20";
    if (l === "advanced") return "text-rose-600 bg-rose-50 dark:bg-rose-900/20";
    return "text-muted-foreground bg-muted";
  };

  const posLabel = (pos: string) => {
    const map: Record<string, string> = {
      "существительное": "сущ.",
      "глагол": "гл.",
      "прилагательное": "прил.",
      "местоимение": "мест.",
      "числительное": "числ.",
      "наречие": "нар.",
      "частица": "частица",
      "послелог": "послелог",
    };
    return map[pos] ?? pos;
  };

  // Apply favorites filter client-side
  const displayedWords = showFavOnly
    ? (data?.words ?? []).filter(w => favorites.has(w.id))
    : (data?.words ?? []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-4xl font-serif font-bold text-foreground">Словарь</h1>
          <p className="text-muted-foreground mt-2">
            Лексика андийского языка — горного нахско-дагестанского языка Ботлихского района Дагестана.
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

      {/* Алфавитная навигация */}
      <div className="overflow-x-auto pb-1">
        <div className="flex gap-1 min-w-max">
          {CYRILLIC_LETTERS.map(letter => (
            <button
              key={letter}
              onClick={() => handleLetterFilter(letter)}
              className={`h-8 w-8 rounded text-sm font-medium transition-colors shrink-0 ${
                letterFilter === letter
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {letter}
            </button>
          ))}
          {letterFilter && (
            <button
              onClick={() => handleLetterFilter("")}
              className="h-8 px-2 rounded text-xs text-muted-foreground hover:bg-muted transition-colors"
            >
              ✕ сброс
            </button>
          )}
        </div>
      </div>

      {/* Фильтры */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по андийскому, русскому или английскому..."
            className="pl-9 h-10"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={partOfSpeech} onValueChange={handlePosChange}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Часть речи" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все части речи</SelectItem>
              <SelectItem value="существительное">Существительное</SelectItem>
              <SelectItem value="глагол">Глагол</SelectItem>
              <SelectItem value="прилагательное">Прилагательное</SelectItem>
              <SelectItem value="местоимение">Местоимение</SelectItem>
              <SelectItem value="числительное">Числительное</SelectItem>
              <SelectItem value="наречие">Наречие</SelectItem>
              <SelectItem value="частица">Частица</SelectItem>
              <SelectItem value="послелог">Послелог</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-44">
          <Select value={level} onValueChange={handleLevelChange}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Уровень" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все уровни</SelectItem>
              <SelectItem value="beginner">Начальный</SelectItem>
              <SelectItem value="intermediate">Средний</SelectItem>
              <SelectItem value="advanced">Продвинутый</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Счётчик */}
      {data && (
        <div className="flex items-center justify-between text-sm text-muted-foreground flex-wrap gap-2">
          <span>
            {letterFilter && <span className="font-semibold text-foreground mr-1">«{letterFilter}»:</span>}
            Найдено: <span className="font-semibold text-foreground">{data.total}</span> слов
            {totalPages > 1 && (
              <span className="ml-2">· Страница {page + 1} из {totalPages}</span>
            )}
          </span>
          {!search && !letterFilter && partOfSpeech === "all" && level === "all" && (
            <span className="text-xs opacity-60">
              Источник: Intercontinental Dictionary Series (ids.clld.org), ср. Церцвадзе И.И. 1967
            </span>
          )}
        </div>
      )}

      {/* Список слов */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))
        ) : showFavOnly && favorites.size === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg bg-card/50">
            <Heart className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-lg">Нет избранных слов</p>
            <p className="text-sm mt-1 opacity-70">Нажмите ♡ на любом слове, чтобы сохранить</p>
          </div>
        ) : displayedWords.length > 0 ? (
          displayedWords.map((word) => (
            <Link key={word.id} href={`/dictionary/${word.id}`}>
              <Card className="hover-elevate cursor-pointer transition-all hover:border-primary/30 hover:bg-card/70">
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <h3 className="text-xl font-bold text-primary">{word.andiWord}</h3>
                      <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded shrink-0">
                        {posLabel(word.partOfSpeech)}
                      </span>
                      {word.nounClass && (
                        <span className="text-xs text-muted-foreground opacity-60 shrink-0">
                          кл. {word.nounClass}
                        </span>
                      )}
                      {word.level && (
                        <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${levelColor(word.level)}`}>
                          {levelLabel(word.level)}
                        </span>
                      )}
                    </div>
                    <div className="text-sm mt-1 space-y-0.5">
                      <div>
                        <span className="text-muted-foreground text-xs mr-1">РУ</span>
                        {word.russian}
                      </div>
                      {word.english && (
                        <div>
                          <span className="text-muted-foreground text-xs mr-1">EN</span>
                          {word.english}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {word.phonetic && (
                      <span className="text-sm font-mono text-muted-foreground opacity-60">
                        /{word.phonetic}/
                      </span>
                    )}
                    <button
                      onClick={(e) => handleToggleFav(e, word.id)}
                      className={`p-1.5 rounded-full transition-colors ${
                        favorites.has(word.id)
                          ? "text-rose-500 hover:text-rose-600"
                          : "text-muted-foreground opacity-30 hover:opacity-70 hover:text-rose-400"
                      }`}
                      title={favorites.has(word.id) ? "Убрать из избранного" : "В избранное"}
                    >
                      <Heart className={`h-4 w-4 ${favorites.has(word.id) ? "fill-current" : ""}`} />
                    </button>
                    <div
                      className="p-2 rounded-full text-muted-foreground opacity-20 cursor-not-allowed"
                      title="Аудио недоступно (требуются записи носителей языка)"
                    >
                      <Volume2 className="h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg bg-card/50">
            <p className="text-lg">Ничего не найдено</p>
            <p className="text-sm mt-1 opacity-70">Попробуйте изменить фильтры или поисковый запрос</p>
          </div>
        )}
      </div>

      {/* Пагинация */}
      {totalPages > 1 && !showFavOnly && (
        <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(0)}
            disabled={page === 0}
          >«</Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Назад
          </Button>
          <span className="text-sm text-muted-foreground px-2">
            {page + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="flex items-center gap-1"
          >
            Вперёд
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(totalPages - 1)}
            disabled={page === totalPages - 1}
          >»</Button>
        </div>
      )}

      {/* Информация об аудио */}
      <div className="text-xs text-muted-foreground border-t pt-4 opacity-60">
        <span className="inline-flex items-center gap-1">
          <Volume2 className="h-3 w-3" />
          Аудиопроизношение: записи носителей языка ещё не добавлены.
        </span>
      </div>
    </div>
  );
}
