import { useState, useCallback, useRef } from "react";
import {
  useGetDueFlashcards, useReviewFlashcard, getGetDueFlashcardsQueryKey,
  useListWords, useListExercises, useSubmitExercise,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, XCircle, RotateCcw, LayersIcon, HelpCircle, PencilLine } from "lucide-react";

type Mode = "choose" | "flashcards" | "quiz" | "exercises" | "write";

// ─── Flashcard component (SM-2) ─────────────────────────────
function FlashcardSession({ onDone }: { onDone: () => void }) {
  const queryClient = useQueryClient();
  const { data: cards, isLoading } = useGetDueFlashcards({ limit: 20 });
  const reviewMutation = useReviewFlashcard();
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);

  const card = cards?.[idx];

  const handleReview = (quality: number) => {
    if (!card) return;
    reviewMutation.mutate({ wordId: card.wordId, data: { quality } }, {
      onSuccess: () => {
        setFlipped(false);
        if (idx < (cards?.length ?? 0) - 1) {
          setIdx(i => i + 1);
        } else {
          setDone(true);
          queryClient.invalidateQueries({ queryKey: getGetDueFlashcardsQueryKey() });
        }
      }
    });
  };

  if (isLoading) return <Skeleton className="h-72 w-full rounded-xl" />;

  if (done || !cards || cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-5">
        <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-serif font-bold">Готово!</h3>
        <p className="text-muted-foreground text-center">
          {(cards?.length ?? 0) === 0
            ? "На сегодня карточек нет — вы молодец!"
            : `Проработали ${cards?.length ?? 0} карточек. Отличная сессия!`}
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => { setIdx(0); setDone(false); setFlipped(false); queryClient.invalidateQueries({ queryKey: getGetDueFlashcardsQueryKey() }); }}>
            <RotateCcw className="mr-2 h-4 w-4" /> Ещё раз
          </Button>
          <Button onClick={onDone}>К выбору режима</Button>
        </div>
      </div>
    );
  }

  if (!card) return null;

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Карточка {idx + 1} из {cards.length}</span>
        <div className="flex gap-1">
          {cards.map((_, i) => (
            <div key={i} className={`h-1.5 w-5 rounded-full ${i < idx ? "bg-primary" : i === idx ? "bg-primary/50" : "bg-muted"}`} />
          ))}
        </div>
      </div>

      <div className="relative h-64" style={{ perspective: "1000px" }}>
        <div
          className="absolute inset-0 w-full h-full cursor-pointer"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: "transform 0.45s ease",
          }}
          onClick={() => !flipped && setFlipped(true)}
        >
          <Card className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-card border-2 select-none"
            style={{ backfaceVisibility: "hidden" }}>
            <Badge variant="secondary" className="mb-4 font-mono text-xs">{card.word.partOfSpeech}</Badge>
            <div className="text-5xl font-bold text-primary text-center mb-3">{card.word.andiWord}</div>
            {card.word.phonetic && <div className="text-muted-foreground font-mono text-sm mb-4">/{card.word.phonetic}/</div>}
            <div className="text-xs text-muted-foreground animate-pulse mt-4">Нажмите, чтобы узнать перевод</div>
          </Card>

          <Card className="absolute inset-0 flex flex-col p-8 bg-card border-2 border-primary/20 select-none"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
              <div className="text-3xl font-semibold">{card.word.russian}</div>
              {card.word.english && <div className="text-muted-foreground">{card.word.english}</div>}
              {card.word.examples && (
                <div className="text-sm italic text-muted-foreground border-l-2 border-primary/30 pl-3 text-left">
                  {card.word.examples.split("—")[0]?.trim()}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-xs text-center text-muted-foreground">Как хорошо вспомнили?</p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Снова", q: 0, cls: "bg-red-600 hover:bg-red-700 text-white" },
                  { label: "Сложно", q: 1, cls: "bg-orange-500 hover:bg-orange-600 text-white" },
                  { label: "Хорошо", q: 2, cls: "bg-blue-600 hover:bg-blue-700 text-white" },
                  { label: "Легко", q: 3, cls: "bg-green-600 hover:bg-green-700 text-white" },
                ].map(({ label, q, cls }) => (
                  <Button key={q} size="sm" className={`text-xs ${cls}`} onClick={e => { e.stopPropagation(); handleReview(q); }}>
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Mini-quiz component ────────────────────────────────────
function QuizSession({ onDone }: { onDone: () => void }) {
  const { data: wordsData, isLoading } = useListWords({ limit: 40 });
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const words = wordsData?.words ?? [];

  const buildQuestions = useCallback(() => {
    if (words.length < 4) return [];
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(8, shuffled.length)).map((word) => {
      const distractors = words
        .filter(w => w.id !== word.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.russian);
      const options = [word.russian, ...distractors].sort(() => Math.random() - 0.5);
      return { word, answer: word.russian, options };
    });
  }, [words]);

  const [questions] = useState(() => buildQuestions());

  if (isLoading) return <Skeleton className="h-72 w-full rounded-xl" />;
  if (words.length < 4) return <div className="text-center text-muted-foreground py-12">Недостаточно слов для теста.</div>;

  const q = questions[qIdx];

  if (finished || !q) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-5">
        <div className={`h-20 w-20 rounded-full flex items-center justify-center ${score >= questions.length * 0.7 ? "bg-green-100" : "bg-amber-100"}`}>
          {score >= questions.length * 0.7
            ? <CheckCircle2 className="h-10 w-10 text-green-600" />
            : <HelpCircle className="h-10 w-10 text-amber-600" />}
        </div>
        <h3 className="text-2xl font-serif font-bold">
          {score >= questions.length * 0.7 ? "Отлично!" : "Неплохо!"}
        </h3>
        <p className="text-muted-foreground text-center">
          Правильных ответов: {score} из {questions.length}
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => { setQIdx(0); setSelected(null); setScore(0); setFinished(false); }}>
            <RotateCcw className="mr-2 h-4 w-4" /> Пройти снова
          </Button>
          <Button onClick={onDone}>К выбору режима</Button>
        </div>
      </div>
    );
  }

  const isAnswered = selected !== null;
  const isCorrect = selected === q.answer;

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Вопрос {qIdx + 1} из {questions.length}</span>
        <span>✓ {score}</span>
      </div>

      <Card className="bg-card">
        <CardContent className="pt-8 pb-6 text-center space-y-2">
          <div className="text-xs text-muted-foreground font-mono">{q.word.partOfSpeech}</div>
          <div className="text-5xl font-bold text-primary">{q.word.andiWord}</div>
          {q.word.phonetic && <div className="text-muted-foreground font-mono text-sm">/{q.word.phonetic}/</div>}
          <p className="text-muted-foreground text-sm pt-2">Выберите правильный перевод</p>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {q.options.map(opt => {
          let cls = "w-full text-left px-5 py-3 rounded-xl border-2 text-base font-medium transition-all ";
          if (!isAnswered) {
            cls += "border-border hover:border-primary hover:bg-primary/5";
          } else if (opt === q.answer) {
            cls += "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200";
          } else if (opt === selected) {
            cls += "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200";
          } else {
            cls += "border-border opacity-50";
          }
          return (
            <button key={opt} className={cls} onClick={() => {
              if (isAnswered) return;
              setSelected(opt);
              if (opt === q.answer) setScore(s => s + 1);
            }}>
              {opt}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="space-y-3">
          <div className={`flex items-start gap-2 p-3 rounded-lg text-sm ${isCorrect ? "bg-green-50 border border-green-200 dark:bg-green-900/20" : "bg-red-50 border border-red-200 dark:bg-red-900/20"}`}>
            {isCorrect ? <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> : <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />}
            <span>{isCorrect ? "Верно!" : `Ошибка. Правильный ответ: «${q.answer}»`}</span>
          </div>
          <Button className="w-full" onClick={() => {
            setSelected(null);
            if (qIdx < questions.length - 1) setQIdx(i => i + 1);
            else setFinished(true);
          }}>
            {qIdx < questions.length - 1 ? "Следующий вопрос →" : "Завершить тест"}
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Exercise session ────────────────────────────────────────
function ExerciseSession({ onDone }: { onDone: () => void }) {
  const { data: exercises, isLoading } = useListExercises({});
  const submitMutation = useSubmitExercise();
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<{ correct: boolean; correctAnswer: string; explanation?: string | null } | null>(null);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);

  const exList = exercises ?? [];
  const ex = exList[idx];

  if (isLoading) return <Skeleton className="h-72 w-full rounded-xl" />;
  if (!exList.length) return <div className="text-center text-muted-foreground py-12">Упражнений пока нет. Добавьте через панель лингвиста.</div>;

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-5">
        <div className={`h-20 w-20 rounded-full flex items-center justify-center ${score >= exList.length * 0.7 ? "bg-green-100" : "bg-amber-100"}`}>
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-serif font-bold">Упражнения завершены!</h3>
        <p className="text-muted-foreground">Правильно: {score} из {exList.length}</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => { setIdx(0); setSelected(null); setResult(null); setDone(false); setScore(0); }}>
            <RotateCcw className="mr-2 h-4 w-4" /> Сначала
          </Button>
          <Button onClick={onDone}>К выбору режима</Button>
        </div>
      </div>
    );
  }

  const options = ex?.options ? JSON.parse(ex.options) as string[] : null;

  const handleSubmit = (answer: string) => {
    if (!ex) return;
    submitMutation.mutate({ id: ex.id, data: { answer } }, {
      onSuccess: (res) => {
        setResult(res);
        if (res.correct) setScore(s => s + 1);
      }
    });
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Упражнение {idx + 1} из {exList.length}</span>
        <Badge variant="outline" className="text-xs">{ex?.type}</Badge>
      </div>

      <Card className="bg-card">
        <CardContent className="pt-6 pb-5 text-center">
          <p className="text-xl font-medium">{ex?.prompt}</p>
        </CardContent>
      </Card>

      {options ? (
        <div className="space-y-2">
          {options.map(opt => {
            let cls = "w-full text-left px-5 py-3 rounded-xl border-2 text-base font-medium transition-all ";
            if (!result) {
              cls += selected === opt ? "border-primary bg-primary/5" : "border-border hover:border-primary";
            } else if (opt === result.correctAnswer) {
              cls += "border-green-500 bg-green-50 dark:bg-green-900/20";
            } else if (opt === selected) {
              cls += "border-red-400 bg-red-50 dark:bg-red-900/20 opacity-70";
            } else {
              cls += "border-border opacity-50";
            }
            return (
              <button key={opt} className={cls} disabled={!!result} onClick={() => {
                setSelected(opt);
                handleSubmit(opt);
              }}>{opt}</button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          <input
            className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-base focus:outline-none focus:border-primary"
            placeholder="Введите ответ..."
            value={selected ?? ""}
            onChange={e => setSelected(e.target.value)}
            disabled={!!result}
            onKeyDown={e => e.key === "Enter" && selected && !result && handleSubmit(selected)}
          />
          {!result && (
            <Button className="w-full" disabled={!selected} onClick={() => selected && handleSubmit(selected)}>
              Проверить
            </Button>
          )}
        </div>
      )}

      {result && (
        <div className="space-y-3">
          <div className={`flex items-start gap-2 p-3 rounded-lg text-sm ${result.correct ? "bg-green-50 border border-green-200 dark:bg-green-900/20" : "bg-red-50 border border-red-200 dark:bg-red-900/20"}`}>
            {result.correct ? <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> : <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />}
            <div>
              <div>{result.correct ? "Верно!" : `Правильный ответ: «${result.correctAnswer}»`}</div>
              {result.explanation && <div className="text-muted-foreground mt-1">{result.explanation}</div>}
            </div>
          </div>
          <Button className="w-full" onClick={() => {
            setSelected(null); setResult(null);
            if (idx < exList.length - 1) setIdx(i => i + 1);
            else setDone(true);
          }}>
            {idx < exList.length - 1 ? "Следующее →" : "Завершить"}
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Write translation session ───────────────────────────────
function WriteSession({ onDone }: { onDone: () => void }) {
  const { data: wordsData, isLoading } = useListWords({ limit: 30, level: "beginner" });
  const words = wordsData?.words ?? [];
  const [qIdx, setQIdx] = useState(0);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const questions = words.slice(0, Math.min(8, words.length));
  const q = questions[qIdx];

  const normalize = (s: string) => s.trim().toLowerCase().replace(/ё/g, "е");

  const handleCheck = () => {
    if (!q || !input.trim()) return;
    setChecked(true);
    const correct = normalize(input) === normalize(q.russian);
    if (correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    setInput("");
    setChecked(false);
    if (qIdx < questions.length - 1) setQIdx(i => i + 1);
    else setDone(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  if (isLoading) return <Skeleton className="h-72 w-full rounded-xl" />;
  if (!questions.length) return <div className="text-center text-muted-foreground py-12">Слов пока нет.</div>;

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-5">
        <div className={`h-20 w-20 rounded-full flex items-center justify-center ${score >= questions.length * 0.6 ? "bg-green-100" : "bg-amber-100"}`}>
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-serif font-bold">
          {score >= questions.length * 0.6 ? "Отличный результат!" : "Продолжайте практиковаться!"}
        </h3>
        <p className="text-muted-foreground">Правильно: {score} из {questions.length}</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => { setQIdx(0); setInput(""); setChecked(false); setScore(0); setDone(false); }}>
            <RotateCcw className="mr-2 h-4 w-4" /> Снова
          </Button>
          <Button onClick={onDone}>К выбору режима</Button>
        </div>
      </div>
    );
  }

  const isCorrect = checked && normalize(input) === normalize(q?.russian ?? "");

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Слово {qIdx + 1} из {questions.length}</span>
        <span>✓ {score}</span>
      </div>

      <Card className="bg-card">
        <CardContent className="pt-8 pb-6 text-center space-y-2">
          <p className="text-xs text-muted-foreground">Напишите перевод на русском:</p>
          <div className="text-5xl font-bold text-primary">{q?.andiWord}</div>
          {q?.phonetic && <div className="text-muted-foreground font-mono text-sm">/{q.phonetic}/</div>}
        </CardContent>
      </Card>

      <div className="space-y-3">
        <input
          ref={inputRef}
          autoFocus
          className={`w-full px-4 py-3 rounded-xl border-2 text-base focus:outline-none transition-colors ${
            !checked ? "border-border focus:border-primary" :
            isCorrect ? "border-green-500 bg-green-50 dark:bg-green-900/20" :
            "border-red-400 bg-red-50 dark:bg-red-900/20"
          }`}
          placeholder="Введите перевод на русском..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={checked}
          onKeyDown={e => {
            if (e.key === "Enter") checked ? handleNext() : handleCheck();
          }}
        />

        {!checked && (
          <Button className="w-full" disabled={!input.trim()} onClick={handleCheck}>
            Проверить
          </Button>
        )}
      </div>

      {checked && (
        <div className="space-y-3">
          <div className={`flex items-start gap-2 p-3 rounded-lg text-sm ${isCorrect ? "bg-green-50 border border-green-200 dark:bg-green-900/20" : "bg-red-50 border border-red-200 dark:bg-red-900/20"}`}>
            {isCorrect ? <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> : <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />}
            <div>
              <div>{isCorrect ? "Верно!" : `Правильно: «${q?.russian}»`}</div>
              {q?.examples && !isCorrect && (
                <div className="text-xs text-muted-foreground mt-1 italic">{q.examples}</div>
              )}
            </div>
          </div>
          <Button className="w-full" onClick={handleNext}>
            {qIdx < questions.length - 1 ? "Следующее слово →" : "Завершить"}
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Main Practice Page ─────────────────────────────────────
export default function Practice() {
  const [mode, setMode] = useState<Mode>("choose");

  if (mode === "flashcards") return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => setMode("choose")}>← Назад</Button>
        <h1 className="text-2xl font-serif font-bold">Карточки</h1>
      </div>
      <p className="text-sm text-muted-foreground">Андийское слово → вспомните перевод → оцените себя. Система автоматически выбирает, что повторять.</p>
      <FlashcardSession onDone={() => setMode("choose")} />
    </div>
  );

  if (mode === "quiz") return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => setMode("choose")}>← Назад</Button>
        <h1 className="text-2xl font-serif font-bold">Мини-тест</h1>
      </div>
      <p className="text-sm text-muted-foreground">Выберите правильный перевод андийского слова. 8 вопросов, мгновенная обратная связь.</p>
      <QuizSession onDone={() => setMode("choose")} />
    </div>
  );

  if (mode === "exercises") return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => setMode("choose")}>← Назад</Button>
        <h1 className="text-2xl font-serif font-bold">Упражнения</h1>
      </div>
      <ExerciseSession onDone={() => setMode("choose")} />
    </div>
  );

  if (mode === "write") return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => setMode("choose")}>← Назад</Button>
        <h1 className="text-2xl font-serif font-bold">Письменный перевод</h1>
      </div>
      <p className="text-sm text-muted-foreground">Смотрите на андийское слово и напишите его перевод на русском. 8 слов начального уровня.</p>
      <WriteSession onDone={() => setMode("choose")} />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-serif font-bold">Практика</h1>
        <p className="text-muted-foreground mt-2">Выберите режим тренировки.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Card
          className="bg-card cursor-pointer hover:border-primary/60 transition-colors border-2 hover:bg-primary/5"
          onClick={() => setMode("flashcards")}
        >
          <CardContent className="pt-8 pb-7 space-y-3 text-center">
            <LayersIcon className="h-10 w-10 text-primary mx-auto" />
            <h3 className="text-xl font-semibold">Карточки</h3>
            <p className="text-sm text-muted-foreground">
              Слово — перевод — оценка. Умная система повторения запоминает, что вам тяжелее даётся.
            </p>
            <Button className="w-full mt-2">Начать</Button>
          </CardContent>
        </Card>

        <Card
          className="bg-card cursor-pointer hover:border-primary/60 transition-colors border-2 hover:bg-primary/5"
          onClick={() => setMode("quiz")}
        >
          <CardContent className="pt-8 pb-7 space-y-3 text-center">
            <HelpCircle className="h-10 w-10 text-violet-500 mx-auto" />
            <h3 className="text-xl font-semibold">Мини-тест</h3>
            <p className="text-sm text-muted-foreground">
              8 вопросов с вариантами ответов. Быстрая проверка того, что вы уже знаете.
            </p>
            <Button variant="outline" className="w-full mt-2">Начать</Button>
          </CardContent>
        </Card>

        <Card
          className="bg-card cursor-pointer hover:border-primary/60 transition-colors border-2 hover:bg-primary/5"
          onClick={() => setMode("write")}
        >
          <CardContent className="pt-8 pb-7 space-y-3 text-center">
            <PencilLine className="h-10 w-10 text-emerald-500 mx-auto" />
            <h3 className="text-xl font-semibold">Письменный перевод</h3>
            <p className="text-sm text-muted-foreground">
              Смотрите на андийское слово и напишите перевод на русском. Развивает активную память.
            </p>
            <Button variant="outline" className="w-full mt-2">Начать</Button>
          </CardContent>
        </Card>

        <Card
          className="bg-card cursor-pointer hover:border-primary/60 transition-colors border-2 hover:bg-primary/5"
          onClick={() => setMode("exercises")}
        >
          <CardContent className="pt-8 pb-7 space-y-3 text-center">
            <CheckCircle2 className="h-10 w-10 text-amber-500 mx-auto" />
            <h3 className="text-xl font-semibold">Упражнения</h3>
            <p className="text-sm text-muted-foreground">
              Структурированные задания по грамматике и лексике.
            </p>
            <Button variant="outline" className="w-full mt-2">Начать</Button>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border border-border bg-card/50 p-5">
        <h3 className="font-semibold mb-2 text-sm text-muted-foreground uppercase tracking-wider">Совет дня</h3>
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Занимайтесь каждый день по 5–10 минут</strong> — это эффективнее, чем редкие длинные сессии.
          Карточки с интервальным повторением сами напомнят, что пора повторить нужное слово.
        </p>
      </div>
    </div>
  );
}
