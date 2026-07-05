import { useListLessons } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BookOpen } from "lucide-react";

const levelMap: Record<string, { label: string; color: string }> = {
  beginner:     { label: "Начальный",    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  intermediate: { label: "Средний",      color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
  advanced:     { label: "Продвинутый",  color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300" },
};

export default function Lessons() {
  const { data: lessons, isLoading } = useListLessons();
  const sorted = [...(lessons ?? [])].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-serif font-bold">Уроки</h1>
        <p className="text-muted-foreground mt-2">
          Пошаговое изучение андийского языка. Каждый урок — новая тема, слова и задания.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
        </div>
      ) : !sorted.length ? (
        <div className="text-center py-16 border border-dashed rounded-xl text-muted-foreground">
          Уроков пока нет. Добавьте их в панели лингвиста.
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((lesson, i) => {
            const lvl = levelMap[lesson.level] ?? { label: lesson.level, color: "bg-muted text-muted-foreground" };
            return (
              <Card key={lesson.id} className="bg-card transition-all hover:shadow-md">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold bg-primary/10 text-primary">
                      {lesson.orderIndex}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${lvl.color}`}>{lvl.label}</span>
                        {i === 0 && <Badge className="text-xs bg-primary text-primary-foreground">Начните здесь</Badge>}
                      </div>
                      <h3 className="text-lg font-semibold">{lesson.title}</h3>
                      {lesson.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{lesson.description}</p>
                      )}
                    </div>
                    <Button asChild variant={i === 0 ? "default" : "outline"} size="sm" className="shrink-0">
                      <Link href={`/lessons/${lesson.id}`}>Начать</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border text-sm text-muted-foreground">
        <BookOpen className="h-4 w-4 mt-0.5 shrink-0" />
        <div>
          <strong className="text-foreground">Как заниматься:</strong> Проходите уроки по порядку. После каждого урока выполните задания — они помогут закрепить слова. Раздел «Практика» позволит повторить всё пройденное.
        </div>
      </div>
    </div>
  );
}
