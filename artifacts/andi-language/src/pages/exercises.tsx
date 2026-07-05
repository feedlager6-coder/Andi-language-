import { useState } from "react";
import { useListExercises, useSubmitExercise, getListExercisesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle } from "lucide-react";

const typeMap: Record<string, string> = {
  translation: "Перевод",
  multiple_choice: "Выбор ответа",
  fill_blank: "Заполните пропуск",
};

function ExerciseCard({ ex }: { ex: { id: number; type: string; prompt: string; options?: string | null; answer: string; explanation?: string | null; lessonId?: number | null } }) {
  const submitMutation = useSubmitExercise();
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [result, setResult] = useState<{ correct: boolean; correctAnswer: string; explanation?: string | null } | null>(null);

  const options: string[] = (() => {
    try { return ex.options ? JSON.parse(ex.options) : []; } catch { return []; }
  })();

  const handleSubmit = () => {
    const answer = ex.type === "multiple_choice" ? (selectedOption || "") : userAnswer;
    submitMutation.mutate({ id: ex.id, data: { answer } }, {
      onSuccess: (data) => setResult(data),
    });
  };

  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span>{typeMap[ex.type] || ex.type}</span>
          {ex.lessonId && (
            <span className="text-xs font-normal bg-muted px-2 py-1 rounded text-muted-foreground">
              Урок {ex.lessonId}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-foreground font-medium">{ex.prompt}</p>

        {result ? (
          <div className={`p-3 rounded-lg flex items-start gap-3 ${result.correct ? "bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800" : "bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800"}`}>
            {result.correct
              ? <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
              : <XCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />}
            <div>
              <p className={`font-semibold ${result.correct ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"}`}>
                {result.correct ? "Верно!" : `Правильный ответ: ${result.correctAnswer}`}
              </p>
              {result.explanation && (
                <p className="text-sm mt-1 text-muted-foreground">{result.explanation}</p>
              )}
            </div>
          </div>
        ) : ex.type === "multiple_choice" && options.length > 0 ? (
          <div className="space-y-2">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => setSelectedOption(opt)}
                className={`w-full text-left px-4 py-2 rounded-lg border transition-colors ${selectedOption === opt ? "border-primary bg-primary/10" : "border-border hover:bg-muted/60"}`}
              >
                {opt}
              </button>
            ))}
            <Button
              onClick={handleSubmit}
              disabled={!selectedOption || submitMutation.isPending}
              className="w-full mt-2"
            >
              Проверить
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Input
              placeholder="Введите ответ..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && userAnswer && handleSubmit()}
            />
            <Button
              onClick={handleSubmit}
              disabled={!userAnswer || submitMutation.isPending}
              className="w-full"
            >
              Проверить
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Exercises() {
  const { data: exercises, isLoading } = useListExercises();

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-serif font-bold text-foreground">Упражнения</h1>
        <p className="text-muted-foreground mt-2">Практикуйте перевод, грамматику и морфологию андийского языка.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
        </div>
      ) : exercises && exercises.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {exercises.map(ex => <ExerciseCard key={ex.id} ex={ex} />)}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg bg-card/50">
          Упражнения пока не добавлены.
        </div>
      )}
    </div>
  );
}
