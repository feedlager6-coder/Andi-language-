import { useListLessons } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BookOpen, Zap, CheckCircle2, Lock } from "lucide-react";

const levelMap: Record<string, { label: string; color: string }> = {
  beginner:     { label: "Начальный",    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  intermediate: { label: "Средний",      color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
  advanced:     { label: "Продвинутый",  color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300" },
};

const levelOrder = ["beginner", "intermediate", "advanced"];

export default function Lessons() {
  const { data: lessons, isLoading } = useListLessons();
  const sorted = [...(lessons ?? [])].sort((a, b) => a.orderIndex - b.orderIndex);

  const grouped = levelOrder.reduce<Record<string, typeof sorted>>((acc, lvl) => {
    acc[lvl] = sorted.filter(l => l.level === lvl);
    return acc;
  }, {});

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-serif font-bold">Уроки</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Пошаговое изучение андийского языка. Каждый урок — новая тема, объяснение и задания.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
        </div>
      ) : !sorted.length ? (
        <div className="text-center py-16 border border-dashed rounded-xl text-muted-foreground">
          Уроков пока нет. Добавьте их в панели лингвиста.
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
                  <span className="text-sm text-muted-foreground">{lvlLessons.length} урок{lvlLessons.length > 1 ? "а" : ""}</span>
                </div>
                <div className="space-y-3">
                  {lvlLessons.map((lesson, i) => {
                    const isFirst = lesson.orderIndex === 1;
                    return (
                      <Card key={lesson.id} className={`bg-card transition-all hover:shadow-md ${isFirst ? "border-primary/30 shadow-sm" : ""}`}>
                        <CardContent className="pt-5 pb-5">
                          <div className="flex items-start gap-4">
                            <div className={`h-11 w-11 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${isFirst ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>
                              {lesson.orderIndex}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                {isFirst && <Badge className="text-xs bg-primary text-primary-foreground">Начните здесь</Badge>}
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
                              variant={isFirst ? "default" : "outline"}
                              size="sm"
                              className="shrink-0"
                            >
                              <Link href={`/lessons/${lesson.id}`}>
                                {i === 0 && lvlKey === "beginner" ? "Начать" : "Открыть"}
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
