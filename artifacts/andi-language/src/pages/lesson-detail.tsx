import { useState } from "react";
import { useParams } from "wouter";
import { useGetLesson, useSubmitExercise, getGetLessonQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, XCircle, Trophy, RotateCcw, Zap, BookOpen } from "lucide-react";

const levelMap: Record<string, string> = {
  beginner: "Начальный", intermediate: "Средний", advanced: "Продвинутый",
};

const XP_PER_CORRECT = 10;

interface ExerciseCardProps {
  ex: {
    id: number;
    type: string;
    prompt: string;
    options?: string | null;
    answer: string;
    explanation?: string | null;
  };
  index: number;
  total: number;
  onNext: (correct: boolean) => void;
}

function ExerciseCard({ ex, index, total, onNext }: ExerciseCardProps) {
  const submitMutation = useSubmitExercise();
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<{ correct: boolean; correctAnswer: string; explanation?: string | null } | null>(null);
  const [textInput, setTextInput] = useState("");
  const [showXp, setShowXp] = useState(false);

  const options: string[] | null = ex.options ? (() => { try { return JSON.parse(ex.options!); } catch { return null; } })() : null;

  const handleAnswer = (answer: string) => {
    if (result) return;
    setSelected(answer);
    submitMutation.mutate({ id: ex.id, data: { answer } }, {
      onSuccess: (res) => {
        setResult(res);
        if (res.correct) setShowXp(true);
      }
    });
  };

  const progressPct = Math.round((index / total) * 100);

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground font-medium">Задание {index + 1} из {total}</span>
          <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
            <Zap className="h-3.5 w-3.5" />
            {index * XP_PER_CORRECT} XP
          </div>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <Card className="bg-card shadow-sm">
        <CardContent className="pt-6 pb-5">
          <Badge variant="outline" className="mb-3 text-xs font-medium">{
            ex.type === "multiple_choice" ? "Выбор ответа" :
            ex.type === "translation" ? "Перевод" :
            ex.type === "fill_blank" ? "Заполните пропуск" : ex.type
          }</Badge>
          <p className="text-xl font-medium leading-snug">{ex.prompt}</p>
        </CardContent>
      </Card>

      {/* Answer options */}
      {options ? (
        <div className="space-y-2.5">
          {options.map((opt, i) => {
            const letters = ["А", "Б", "В", "Г"];
            let cls = "w-full text-left px-5 py-3.5 rounded-xl border-2 font-medium text-base transition-all flex items-center gap-3 ";
            if (!result) {
              cls += "border-border hover:border-primary hover:bg-primary/5 cursor-pointer";
            } else if (opt === result.correctAnswer) {
              cls += "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300";
            } else if (opt === selected && !result.correct) {
              cls += "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 line-through opacity-70";
            } else {
              cls += "border-border opacity-40";
            }
            return (
              <button key={opt} className={cls} disabled={!!result} onClick={() => handleAnswer(opt)}>
                <span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold shrink-0 text-muted-foreground">
                  {letters[i] ?? (i + 1)}
                </span>
                <span>{opt}</span>
                {result && opt === result.correctAnswer && (
                  <CheckCircle2 className="h-5 w-5 text-green-600 ml-auto shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          <input
            className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-base focus:outline-none focus:border-primary disabled:opacity-60 transition-colors"
            placeholder="Введите ответ..."
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            disabled={!!result}
            onKeyDown={e => e.key === "Enter" && textInput.trim() && handleAnswer(textInput.trim())}
          />
          {!result && (
            <Button className="w-full" disabled={!textInput.trim() || submitMutation.isPending}
              onClick={() => handleAnswer(textInput.trim())}>
              {submitMutation.isPending ? "Проверяю..." : "Проверить"}
            </Button>
          )}
        </div>
      )}

      {/* Result feedback */}
      {result && (
        <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-200">
          <div className={`flex items-start gap-3 p-4 rounded-xl text-sm relative overflow-hidden ${
            result.correct
              ? "bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800"
              : "bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800"
          }`}>
            {result.correct
              ? <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
              : <XCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />}
            <div className="flex-1">
              <div className="font-semibold mb-1">
                {result.correct ? "Верно! Отличная работа." : `Ошибка. Правильный ответ: «${result.correctAnswer}»`}
              </div>
              {result.explanation && (
                <div className="text-muted-foreground leading-relaxed">{result.explanation}</div>
              )}
            </div>
            {showXp && result.correct && (
              <div className="absolute top-2 right-3 flex items-center gap-1 text-amber-600 font-bold text-sm animate-in fade-in zoom-in duration-300">
                <Zap className="h-4 w-4" />
                +{XP_PER_CORRECT} XP
              </div>
            )}
          </div>
          <Button className="w-full text-base font-semibold" size="lg" onClick={() => onNext(result.correct)}>
            {index < total - 1 ? "Следующее задание →" : "Завершить урок →"}
          </Button>
        </div>
      )}
    </div>
  );
}

function LessonContent({ content }: { content: string }) {
  const isHtml = content.trimStart().startsWith("<");

  if (isHtml) {
    return (
      <div className="lesson-rich-content">
        <style>{`
          .lesson-rich-content p { margin-bottom: 0.75rem; line-height: 1.7; }
          .lesson-rich-content h2 { font-size: 1.2rem; font-weight: 700; margin: 1.5rem 0 0.75rem; padding-bottom: 0.375rem; border-bottom: 1px solid hsl(var(--border)); }
          .lesson-rich-content ul { margin: 0.5rem 0 1rem 1.25rem; list-style-type: disc; }
          .lesson-rich-content ul li { margin-bottom: 0.4rem; line-height: 1.6; }
          .lesson-rich-content table { width: 100%; border-collapse: collapse; margin: 1rem 0 1.5rem; font-size: 0.92rem; }
          .lesson-rich-content thead { background: hsl(var(--muted)); }
          .lesson-rich-content th { padding: 0.6rem 0.9rem; text-align: left; font-weight: 600; color: hsl(var(--foreground)); border: 1px solid hsl(var(--border)); }
          .lesson-rich-content td { padding: 0.55rem 0.9rem; border: 1px solid hsl(var(--border)); vertical-align: middle; }
          .lesson-rich-content tbody tr:nth-child(even) { background: hsl(var(--muted) / 0.3); }
          .lesson-rich-content tbody tr:hover { background: hsl(var(--muted) / 0.5); }
          .lesson-rich-content .special-row { background: hsl(var(--primary) / 0.06) !important; }
          .lesson-rich-content .special-row:hover { background: hsl(var(--primary) / 0.1) !important; }
          .lesson-rich-content .lesson-intro { background: hsl(var(--muted) / 0.5); border-left: 3px solid hsl(var(--primary)); padding: 0.75rem 1rem; border-radius: 0 0.5rem 0.5rem 0; margin-bottom: 1rem; }
          .lesson-rich-content .lesson-source { font-size: 0.8rem; color: hsl(var(--muted-foreground)); }
          .lesson-rich-content strong { color: hsl(var(--foreground)); }
          .lesson-rich-content em { color: hsl(var(--muted-foreground)); }
        `}</style>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    );
  }

  return (
    <div
      className="prose dark:prose-invert max-w-none text-base leading-relaxed"
      dangerouslySetInnerHTML={{
        __html: content
          .replace(/\n/g, "<br/>")
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/`(.*?)`/g, "<code class='font-mono bg-muted px-1 rounded text-primary'>$1</code>")
      }}
    />
  );
}

export default function LessonDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  const { data: lesson, isLoading } = useGetLesson(id, {
    query: { enabled: !!id, queryKey: getGetLessonQueryKey(id) }
  });

  const [phase, setPhase] = useState<"intro" | "exercises" | "done">("intro");
  const [exIdx, setExIdx] = useState(0);
  const [score, setScore] = useState(0);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-96" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!lesson) return <div className="text-center py-16 text-muted-foreground">Урок не найден.</div>;

  const exercises = lesson.exercises ?? [];
  const totalXp = exercises.length * XP_PER_CORRECT;

  // Phase: Done
  if (phase === "done") {
    const pct = exercises.length ? Math.round((score / exercises.length) * 100) : 100;
    const earnedXp = score * XP_PER_CORRECT;
    return (
      <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
        <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
          <div className={`h-24 w-24 rounded-full flex items-center justify-center ${pct >= 70 ? "bg-green-100 dark:bg-green-900/30" : "bg-amber-100 dark:bg-amber-900/30"}`}>
            <Trophy className={`h-12 w-12 ${pct >= 70 ? "text-green-600" : "text-amber-600"}`} />
          </div>
          <div>
            <h2 className="text-3xl font-serif font-bold mb-1">
              {pct >= 70 ? "Урок пройден!" : "Урок завершён!"}
            </h2>
            <p className="text-muted-foreground">
              Правильных ответов: <strong>{score} из {exercises.length}</strong> ({pct}%)
            </p>
          </div>

          <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <Zap className="h-6 w-6 text-amber-600" />
            <div className="text-left">
              <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">+{earnedXp} XP</div>
              <div className="text-xs text-amber-600 dark:text-amber-500">из {totalXp} максимальных</div>
            </div>
          </div>

          {pct < 70 && (
            <p className="text-sm text-muted-foreground max-w-sm">
              Попробуйте пройти урок ещё раз — повторение помогает лучше запомнить материал.
            </p>
          )}
          {pct === 100 && (
            <p className="text-sm text-green-700 dark:text-green-400 font-medium">
              Все задания выполнены верно! Отличный результат!
            </p>
          )}

          <div className="flex gap-3 flex-wrap justify-center">
            <Button variant="outline" onClick={() => { setPhase("intro"); setExIdx(0); setScore(0); }}>
              <RotateCcw className="mr-2 h-4 w-4" /> Повторить
            </Button>
            <Button asChild>
              <Link href="/lessons">К списку уроков</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Phase: Exercises
  if (phase === "exercises") {
    const ex = exercises[exIdx];
    if (!ex) return null;

    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
        <div className="flex items-center gap-4 mb-2">
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground" onClick={() => setPhase("intro")}>
            <ArrowLeft className="h-4 w-4" /> {lesson.title}
          </Button>
        </div>
        <ExerciseCard
          key={exIdx}
          ex={ex}
          index={exIdx}
          total={exercises.length}
          onNext={(correct) => {
            if (correct) setScore(s => s + 1);
            if (exIdx < exercises.length - 1) {
              setExIdx(i => i + 1);
            } else {
              setPhase("done");
            }
          }}
        />
      </div>
    );
  }

  // Phase: Intro
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <Button asChild variant="ghost" className="gap-2 text-muted-foreground -ml-2">
        <Link href="/lessons">
          <ArrowLeft className="h-4 w-4" /> К списку уроков
        </Link>
      </Button>

      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">{levelMap[lesson.level] || lesson.level}</Badge>
          <span className="text-muted-foreground text-sm">Урок {lesson.orderIndex}</span>
          {exercises.length > 0 && (
            <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
              <Zap className="h-3 w-3" /> до {totalXp} XP
            </span>
          )}
        </div>
        <h1 className="text-4xl font-serif font-bold">{lesson.title}</h1>
        {lesson.description && (
          <p className="text-muted-foreground mt-3 text-lg">{lesson.description}</p>
        )}
      </div>

      {lesson.content && (
        <LessonContent content={lesson.content} />
      )}

      {exercises.length > 0 ? (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold">
                {exercises.length} {exercises.length === 1 ? "задание" : exercises.length < 5 ? "задания" : "заданий"} в этом уроке
              </div>
              <div className="text-sm text-muted-foreground">
                Выполните все задания и заработайте до <span className="text-amber-600 font-semibold">{totalXp} XP</span>
              </div>
            </div>
          </div>
          <Button size="lg" className="w-full text-base font-semibold" onClick={() => setPhase("exercises")}>
            Приступить к заданиям →
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-6 text-center text-muted-foreground text-sm">
          Упражнения к этому уроку ещё не добавлены.
        </div>
      )}
    </div>
  );
}
