import { useState } from "react";
import { useParams } from "wouter";
import { useGetLesson, useSubmitExercise, getGetLessonQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, XCircle, Trophy, RotateCcw } from "lucide-react";

const levelMap: Record<string, string> = {
  beginner: "Начальный", intermediate: "Средний", advanced: "Продвинутый",
};

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

  const options: string[] | null = ex.options ? (() => { try { return JSON.parse(ex.options!); } catch { return null; } })() : null;

  const handleAnswer = (answer: string) => {
    if (result) return;
    setSelected(answer);
    submitMutation.mutate({ id: ex.id, data: { answer } }, {
      onSuccess: (res) => setResult(res)
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Задание {index + 1} из {total}</span>
        <div className="flex gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className={`h-1.5 w-6 rounded-full transition-all ${
              i < index ? "bg-primary" : i === index ? "bg-primary/40" : "bg-muted"
            }`} />
          ))}
        </div>
      </div>

      <Card className="bg-card">
        <CardContent className="pt-6 pb-5">
          <Badge variant="outline" className="mb-3 text-xs">{
            ex.type === "multiple_choice" ? "Выбор ответа" :
            ex.type === "translation" ? "Перевод" :
            ex.type === "fill_blank" ? "Заполните пропуск" : ex.type
          }</Badge>
          <p className="text-xl font-medium">{ex.prompt}</p>
        </CardContent>
      </Card>

      {options ? (
        <div className="space-y-2">
          {options.map(opt => {
            let cls = "w-full text-left px-5 py-3.5 rounded-xl border-2 font-medium text-base transition-all ";
            if (!result) {
              cls += "border-border hover:border-primary hover:bg-primary/5";
            } else if (opt === result.correctAnswer) {
              cls += "border-green-500 bg-green-50 dark:bg-green-900/20";
            } else if (opt === selected) {
              cls += "border-red-400 bg-red-50 dark:bg-red-900/20 line-through opacity-70";
            } else {
              cls += "border-border opacity-40";
            }
            return (
              <button key={opt} className={cls} disabled={!!result} onClick={() => handleAnswer(opt)}>
                {opt}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          <input
            className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-base focus:outline-none focus:border-primary disabled:opacity-60"
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

      {result && (
        <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-200">
          <div className={`flex items-start gap-3 p-4 rounded-xl text-sm ${
            result.correct
              ? "bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800"
              : "bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800"
          }`}>
            {result.correct
              ? <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
              : <XCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />}
            <div>
              <div className="font-semibold mb-1">
                {result.correct ? "Верно! Отличная работа." : `Ошибка. Правильный ответ: «${result.correctAnswer}»`}
              </div>
              {result.explanation && (
                <div className="text-muted-foreground">{result.explanation}</div>
              )}
            </div>
          </div>
          <Button className="w-full text-base" onClick={() => onNext(result.correct)}>
            {index < total - 1 ? "Следующее задание →" : "Завершить урок →"}
          </Button>
        </div>
      )}
    </div>
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

  // Phase: Done
  if (phase === "done") {
    const pct = exercises.length ? Math.round((score / exercises.length) * 100) : 100;
    return (
      <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
        <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center">
          <div className={`h-24 w-24 rounded-full flex items-center justify-center ${pct >= 70 ? "bg-green-100 dark:bg-green-900/30" : "bg-amber-100 dark:bg-amber-900/30"}`}>
            <Trophy className={`h-12 w-12 ${pct >= 70 ? "text-green-600" : "text-amber-600"}`} />
          </div>
          <h2 className="text-3xl font-serif font-bold">
            {pct >= 70 ? "Урок пройден!" : "Урок завершён!"}
          </h2>
          <p className="text-muted-foreground">
            Правильных ответов: <strong>{score} из {exercises.length}</strong> ({pct}%)
          </p>
          {pct < 70 && (
            <p className="text-sm text-muted-foreground max-w-sm">
              Попробуйте пройти урок ещё раз — повторение помогает лучше запомнить материал.
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
        </div>
        <h1 className="text-4xl font-serif font-bold">{lesson.title}</h1>
        {lesson.description && (
          <p className="text-muted-foreground mt-3 text-lg">{lesson.description}</p>
        )}
      </div>

      {lesson.content && (
        <div className="prose dark:prose-invert max-w-none text-base leading-relaxed">
          <div dangerouslySetInnerHTML={{
            __html: lesson.content
              .replace(/\n/g, "<br/>")
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              .replace(/`(.*?)`/g, "<code class='font-mono bg-muted px-1 rounded text-primary'>$1</code>")
          }} />
        </div>
      )}

      {exercises.length > 0 ? (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <div>
              <div className="font-semibold">В этом уроке {exercises.length} {exercises.length === 1 ? "задание" : exercises.length < 5 ? "задания" : "заданий"}</div>
              <div className="text-sm text-muted-foreground">Выполните их, чтобы закрепить материал</div>
            </div>
          </div>
          <Button size="lg" className="w-full text-base" onClick={() => setPhase("exercises")}>
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
