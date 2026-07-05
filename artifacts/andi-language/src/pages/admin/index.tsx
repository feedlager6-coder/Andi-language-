import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useListWords, useListLessons, useGetStatsSummary } from "@workspace/api-client-react";

export default function AdminDashboard() {
  const { data: wordsData } = useListWords({ limit: 1 });
  const { data: lessons } = useListLessons();
  const { data: stats } = useGetStatsSummary();

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in">
      <div>
        <h1 className="text-4xl font-serif font-bold text-foreground">Панель лингвиста</h1>
        <p className="text-muted-foreground mt-2">Управление словарём, уроками и упражнениями платформы.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 text-sm text-muted-foreground">
        <div className="p-4 rounded-lg border bg-card text-center">
          <div className="text-3xl font-bold text-foreground">{stats?.totalWords ?? "—"}</div>
          <div>слов в словаре</div>
        </div>
        <div className="p-4 rounded-lg border bg-card text-center">
          <div className="text-3xl font-bold text-foreground">{stats?.totalLessons ?? "—"}</div>
          <div>уроков</div>
        </div>
        <div className="p-4 rounded-lg border bg-card text-center">
          <div className="text-3xl font-bold text-foreground">{stats?.totalExercises ?? "—"}</div>
          <div>упражнений</div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 rounded-lg border border-border bg-card space-y-4">
          <div>
            <h2 className="text-xl font-bold">Словарь</h2>
            <p className="text-sm text-muted-foreground mt-1">Добавляйте слова, фонетику, морфологию, примеры употребления.</p>
          </div>
          <Button asChild className="w-full">
            <Link href="/admin/words/new">Добавить слово</Link>
          </Button>
        </div>

        <div className="p-6 rounded-lg border border-border bg-card space-y-4">
          <div>
            <h2 className="text-xl font-bold">Уроки</h2>
            <p className="text-sm text-muted-foreground mt-1">Создавайте структурированные уроки с грамматическим содержанием.</p>
          </div>
          <Button asChild className="w-full">
            <Link href="/admin/lessons/new">Добавить урок</Link>
          </Button>
        </div>
      </div>

      <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-200">
        <strong>Примечание для лингвистов:</strong> Морфологические описания и данные об именных классах взяты из академических источников. При добавлении новых слов указывайте источник и диалект. Неподтверждённые формы отмечайте соответствующим образом.
      </div>
    </div>
  );
}
