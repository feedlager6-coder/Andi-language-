import { useState, useEffect } from "react";
import { useListLessons } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { BookOpen, Zap, CheckCircle2, Search } from "lucide-react";

const levelMap: Record<string, { label: string; color: string }> = {
  beginner:     { label: "Начальный",    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  intermediate: { label: "Средний",      color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
  advanced:     { label: "Продвинутый",  color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300" },
};

const levelOrder = ["beginner", "intermediate", "advanced"];

function getCompletedLessons(): Set<number> {
  try {
    return new Set(JSON.parse(localStorage.getItem("completed_lessons") || "[]"));
  } catch { return new Set(); }
}

function markLessonVisited(id: number) {
  const completed = getCompletedLessons();
  completed.add(id);
  localStorage.setItem("completed_lessons", JSON.stringify([...completed]));
}

export default function Lessons() {
  const { data: lessons, isLoading } = useListLessons();
  const [search, setSearch] = useState("");
  const [completed, setCompleted] = useState<Set<number>>(getCompletedLessons);

  // Refresh completed from localStorage on mount
  useEffect(() => {
    setCompleted(getCompletedLessons());
  }, []);

  const sorted = [...(lessons ?? [])].sort((a, b) => a.orderIndex - b.orderIndex);

  const filtered = search
    ? sorted.filter(l =>
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        (l.description && l.description.toLowerCase().includes(search.toLowerCase()))
      )
    : sorted;

  const grouped = levelOrder.reduce<Record<string, typeof sorted>>((acc, lvl) => {
    acc[lvl] = filtered.filter(l => l.level === lvl);
    return acc;
  }, {});

  const completedCount = sorted.filter(l => completed.has(l.id)).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold">Уроки</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Пошаговое изучение андийского языка. Каждый урок — новая тема, объяснение и задания.
          </p>
        </div>
        {completedCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-medium">{completedCount} из {sorted.length} завершено</span>
          </div>
        )}
      </div>

      {/* Поиск */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Поиск по урокам..."
          className="pl-9"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
        </div>
      ) : !sorted.length ? (
        <div className="text-center py-16 border border-dashed rounded-xl text-muted-foreground">
          Уроков пока нет. Добавьте их в панели лингвиста.
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-xl text-muted-foreground">
          <Search className="h-8 w-8 mx-auto mb-2 opacity-30" />
          <p>Ничего не найдено по запросу «{search}»</p>
          <Button variant="ghost" size="sm" className="mt-2" onClick={() => setSearch("")}>
            Сбросить поиск
          </Button>
        </div>
      ) : (
        <div className="space-y-10">
          {levelOrder.map(lvlKey => {
            const lvlLessons = grouped[lvlKey];
            if (!lvlLessons?.length) return null;
            const lvl = levelMap[lvlKey];
            return (
              <div key={lvlKey}>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${lvl.color}`}>{lvl.label}</span>
                  <span className="text-sm text-muted-foreground">{lvlLessons.length} урок{lvlLessons.length !== 1 ? "а" : ""}</span>
                  {!search && (
                    <span className="text-xs text-muted-foreground opacity-60">
                      {lvlLessons.filter(l => completed.has(l.id)).length} завершено
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  {lvlLessons.map((lesson, i) => {
                    const isFirst = lesson.orderIndex === 1;
                    const isDone = completed.has(lesson.id);
                    return (
                      <Card
                        key={lesson.id}
                        className={`bg-card transition-all hover:shadow-md ${
                          isDone
                            ? "border-green-300/60 dark:border-green-700/40 bg-green-50/30 dark:bg-green-900/10"
                            : isFirst
                            ? "border-primary/30 shadow-sm"
                            : ""
                        }`}
                      >
                        <CardContent className="pt-5 pb-5">
                          <div className="flex items-start gap-4">
                            <div className={`h-11 w-11 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                              isDone
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                : isFirst
                                ? "bg-primary text-primary-foreground"
                                : "bg-primary/10 text-primary"
                            }`}>
                              {isDone ? <CheckCircle2 className="h-5 w-5" /> : lesson.orderIndex}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                {isFirst && !isDone && <Badge className="text-xs bg-primary text-primary-foreground">Начните здесь</Badge>}
                                {isDone && <Badge className="text-xs bg-green-600 text-white">Завершён</Badge>}
                              </div>
                              <h3 className="text-lg font-semibold">{lesson.title}</h3>
                              {lesson.description && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{lesson.description}</p>
                              )}
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
                                  <Zap className="h-3 w-3" /> до 70–80 XP
                                </span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3" /> 7–8 заданий
                                </span>
                              </div>
                            </div>
                            <Button
                              asChild
                              variant={isDone ? "outline" : isFirst ? "default" : "outline"}
                              size="sm"
                              className="shrink-0"
                              onClick={() => markLessonVisited(lesson.id)}
                            >
                              <Link href={`/lessons/${lesson.id}`}>
                                {isDone ? "Повторить" : i === 0 && lvlKey === "beginner" ? "Начать" : "Открыть"}
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border text-sm text-muted-foreground">
        <BookOpen className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
        <div>
          <strong className="text-foreground">Как заниматься:</strong> Проходите уроки по порядку. Прочитайте объяснение, затем выполните задания — они принесут XP и помогут запомнить материал. Раздел «Практика» позволит повторить всё пройденное.
        </div>
      </div>
    </div>
  );
}
