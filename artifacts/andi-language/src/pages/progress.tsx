import { useGetProgress, useGetStatsSummary } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame, BookOpen, Layers, Target } from "lucide-react";

const levelMap: Record<string, string> = {
  beginner: "Начальный",
  intermediate: "Средний",
  advanced: "Продвинутый",
};

export default function Progress() {
  const { data: progress, isLoading: loadingProgress } = useGetProgress();
  const { data: stats, isLoading: loadingStats } = useGetStatsSummary();

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-serif font-bold text-foreground">Мой прогресс</h1>
        <p className="text-muted-foreground mt-2">Отслеживайте своё путешествие в андийский язык.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Серия дней</CardTitle>
            <Flame className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            {loadingProgress ? <Skeleton className="h-8 w-16" /> : (
              <>
                <div className="text-3xl font-bold">{progress?.streak || 0}</div>
                <p className="text-xs text-muted-foreground">дней активности</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Слов изучено</CardTitle>
            <BookOpen className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            {loadingProgress ? <Skeleton className="h-8 w-16" /> : (
              <>
                <div className="text-3xl font-bold">{progress?.wordsLearned || 0}</div>
                <p className="text-xs text-muted-foreground">из {progress?.totalWords || 0} в словаре</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Уроки</CardTitle>
            <Layers className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {loadingProgress ? <Skeleton className="h-8 w-16" /> : (
              <>
                <div className="text-3xl font-bold">{progress?.lessonsCompleted || 0}</div>
                <p className="text-xs text-muted-foreground">завершено</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Упражнений</CardTitle>
            <Target className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {loadingProgress ? <Skeleton className="h-8 w-16" /> : (
              <>
                <div className="text-3xl font-bold">{progress?.exercisesDone || 0}</div>
                <p className="text-xs text-muted-foreground">выполнено</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Словарь по уровням</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingStats ? <Skeleton className="h-32 w-full" /> : (
              <div className="space-y-3">
                {stats?.levelBreakdown?.length ? stats.levelBreakdown.map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span>{levelMap[item.label] || item.label}</span>
                    <span className="font-bold">{item.count} слов</span>
                  </div>
                )) : <span className="text-muted-foreground">Нет данных</span>}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Части речи</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingStats ? <Skeleton className="h-32 w-full" /> : (
              <div className="space-y-3">
                {stats?.partOfSpeechBreakdown?.length ? stats.partOfSpeechBreakdown.map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="capitalize">{item.label}</span>
                    <span className="font-bold">{item.count} слов</span>
                  </div>
                )) : <span className="text-muted-foreground">Нет данных</span>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>О платформе</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Андийский язык (самоназвание: <em>гьванал мицIи</em>) — нахско-дагестанский язык, распространённый в сёлах Андийской группы Ботлихского района Дагестана, Россия.</p>
          <p>Язык находится под угрозой исчезновения. Данная платформа создана для сохранения и изучения андийского языка.</p>
          <p className="pt-2">Всего в словаре: <span className="font-semibold text-foreground">{stats?.totalWords ?? "..."}</span> слов · Уроков: <span className="font-semibold text-foreground">{stats?.totalLessons ?? "..."}</span> · Упражнений: <span className="font-semibold text-foreground">{stats?.totalExercises ?? "..."}</span></p>
        </CardContent>
      </Card>
    </div>
  );
}
