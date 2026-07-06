import { Link } from "wouter";
import { useGetProgress, useGetMyStats, useGetRandomWord, useGetDueFlashcards, useGetStatsSummary } from "@workspace/api-client-react";
import { useAuth } from "@workspace/replit-auth-web";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { BookText, Dumbbell, Flame, Layers, Star, TrendingUp, Volume2 } from "lucide-react";

const PHRASES = [
  { andi: "Дун рукIана.", ru: "Я здесь / Я есть.", note: "базовая фраза бытия" },
  { andi: "Гьалъи!", ru: "Вода!", note: "повседневная лексика" },
  { andi: "Инсуди рокъо.", ru: "Отцовский дом.", note: "родительный падеж" },
  { andi: "Хьарал б-ихьана.", ru: "Солнце взошло.", note: "класс III (б-)" },
  { andi: "Дида гьикIана.", ru: "Я знаю.", note: "1 лицо эргатив" },
];

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: anonProgress, isLoading: loadingAnonProgress } = useGetProgress({ query: { enabled: !isAuthenticated } as any });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: myStats, isLoading: loadingMyStats } = useGetMyStats({ query: { enabled: isAuthenticated } as any });
  const { data: randomWord, isLoading: loadingWord } = useGetRandomWord();
  const { data: dueCards } = useGetDueFlashcards({ limit: 5 });
  const { data: stats } = useGetStatsSummary();

  const loadingProgress = isAuthenticated ? loadingMyStats : loadingAnonProgress;
  const progress = isAuthenticated
    ? (myStats ? { ...myStats, totalWords: stats?.totalWords ?? 0 } : undefined)
    : anonProgress;

  const dueCount = dueCards?.length ?? 0;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">

      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8">
        <Badge variant="outline" className="mb-4 text-primary border-primary/30">Андийский язык · Дагестан</Badge>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-3">
          {isAuthenticated && user?.firstName ? (
            <>С возвращением, {user.firstName}!</>
          ) : (
            <>Учите андийский.<br /><span className="text-primary">5 минут в день.</span></>
          )}
        </h1>
        <p className="text-muted-foreground text-lg mb-6 max-w-xl">
          Андийский — один из редких языков Дагестана. Здесь вы найдёте словарь, уроки и практику — всё что нужно для начала.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" className="text-base px-6">
            <Link href="/lessons">Начать учиться</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/practice">Практиковать</Link>
          </Button>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: Flame, color: "text-orange-500",
            label: "Дней подряд",
            value: loadingProgress ? null : (progress?.streak ?? 0),
            sub: "серия",
          },
          {
            icon: BookText, color: "text-primary",
            label: "Слов изучено",
            value: loadingProgress ? null : (progress?.wordsLearned ?? 0),
            sub: `из ${progress?.totalWords ?? (stats?.totalWords ?? 0)}`,
          },
          {
            icon: Layers, color: "text-violet-500",
            label: "Уроков пройдено",
            value: loadingProgress ? null : (progress?.lessonsCompleted ?? 0),
            sub: "завершено",
          },
          {
            icon: Star, color: "text-amber-500",
            label: "Повторить сегодня",
            value: dueCount,
            sub: dueCount === 0 ? "всё готово!" : "карточек ждут",
          },
        ].map(({ icon: Icon, color, label, value, sub }) => (
          <Card key={label} className="bg-card">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`h-4 w-4 ${color}`} />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
              {value === null
                ? <Skeleton className="h-8 w-12" />
                : <div className="text-3xl font-bold">{value}</div>}
              <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Слово дня */}
      <div>
        <h2 className="text-xl font-serif font-semibold mb-4 flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-500" /> Слово дня
        </h2>
        {loadingWord ? (
          <Skeleton className="h-32 w-full rounded-xl" />
        ) : randomWord ? (
          <Card className="bg-card border-l-4 border-l-amber-400">
            <CardContent className="pt-6 pb-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-4xl font-bold text-primary">{randomWord.andiWord}</span>
                    {randomWord.phonetic && (
                      <span className="text-muted-foreground font-mono text-sm">/{randomWord.phonetic}/</span>
                    )}
                  </div>
                  <div className="text-xl mt-1 font-medium">{randomWord.russian}</div>
                  {randomWord.english && (
                    <div className="text-muted-foreground text-sm mt-0.5">{randomWord.english}</div>
                  )}
                  {randomWord.examples && (
                    <div className="mt-3 italic text-sm text-muted-foreground border-l-2 border-amber-300 pl-3">
                      {randomWord.examples}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="gap-2" disabled>
                    <Volume2 className="h-3.5 w-3.5" /> Слушать
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/dictionary/${randomWord.id}`}>Подробнее</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>

      {/* Быстрые разделы */}
      <div>
        <h2 className="text-xl font-serif font-semibold mb-4">Куда пойти дальше?</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="bg-card hover:bg-accent/50 transition-colors cursor-pointer">
            <Link href="/lessons">
              <CardContent className="pt-6 pb-5 space-y-2">
                <Layers className="h-7 w-7 text-violet-500" />
                <h3 className="font-semibold text-lg">Уроки</h3>
                <p className="text-sm text-muted-foreground">Пошаговое изучение с упражнениями. Начните с урока 1.</p>
                <div className="pt-1">
                  <span className="text-sm text-primary font-medium">Открыть уроки →</span>
                </div>
              </CardContent>
            </Link>
          </Card>
          <Card className="bg-card hover:bg-accent/50 transition-colors cursor-pointer">
            <Link href="/practice">
              <CardContent className="pt-6 pb-5 space-y-2">
                <Dumbbell className="h-7 w-7 text-primary" />
                <h3 className="font-semibold text-lg">Практика</h3>
                <p className="text-sm text-muted-foreground">Карточки, тесты, упражнения. Повторяйте пока не запомните.</p>
                <div className="pt-1">
                  <span className="text-sm text-primary font-medium">Начать практику →</span>
                </div>
              </CardContent>
            </Link>
          </Card>
          <Card className="bg-card hover:bg-accent/50 transition-colors cursor-pointer">
            <Link href="/dictionary">
              <CardContent className="pt-6 pb-5 space-y-2">
                <BookText className="h-7 w-7 text-green-600" />
                <h3 className="font-semibold text-lg">Словарь</h3>
                <p className="text-sm text-muted-foreground">Ищите слова, смотрите произношение и примеры.</p>
                <div className="pt-1">
                  <span className="text-sm text-primary font-medium">Открыть словарь →</span>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>

      {/* Фразы для начинающих */}
      <div>
        <h2 className="text-xl font-serif font-semibold mb-2">Несколько фраз для начала</h2>
        <p className="text-sm text-muted-foreground mb-4">Примеры из словаря — чтобы почувствовать язык.</p>
        <div className="space-y-3">
          {PHRASES.map((p, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-primary text-lg">{p.andi}</div>
                <div className="text-foreground">{p.ru}</div>
              </div>
              <Badge variant="outline" className="text-xs text-muted-foreground shrink-0 hidden sm:inline-flex">
                {p.note}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Прогресс */}
      {progress && progress.wordsLearned > 0 && (
        <div className="rounded-xl border border-border bg-card p-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <div>
              <div className="font-semibold">Ваш прогресс</div>
              <div className="text-sm text-muted-foreground">
                {progress.wordsLearned} слов · {progress.exercisesDone} упражнений · серия {progress.streak} дней
              </div>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/progress">Подробнее</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
