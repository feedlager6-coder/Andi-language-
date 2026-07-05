import { useState } from "react";
import { useGetDueFlashcards, useReviewFlashcard, getGetDueFlashcardsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, RotateCcw } from "lucide-react";

export default function Flashcards() {
  const queryClient = useQueryClient();
  const { data: cards, isLoading } = useGetDueFlashcards({ limit: 50 });
  const reviewMutation = useReviewFlashcard();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  const card = cards?.[currentIndex];

  const handleReview = (quality: number) => {
    if (!card) return;

    reviewMutation.mutate(
      { wordId: card.wordId, data: { quality } },
      {
        onSuccess: () => {
          setIsFlipped(false);
          if (currentIndex < (cards?.length || 0) - 1) {
            setCurrentIndex(prev => prev + 1);
          } else {
            setSessionComplete(true);
            queryClient.invalidateQueries({ queryKey: getGetDueFlashcardsQueryKey() });
          }
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Skeleton className="h-[400px] w-full max-w-md rounded-xl" />
      </div>
    );
  }

  if (sessionComplete || !cards || cards.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center animate-in fade-in duration-500 space-y-6">
        <div className="h-24 w-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-serif font-bold mb-2">Всё повторено!</h2>
          <p className="text-muted-foreground">Вы проработали все карточки на сегодня.</p>
        </div>
        <Button onClick={() => {
          setCurrentIndex(0);
          setSessionComplete(false);
          queryClient.invalidateQueries({ queryKey: getGetDueFlashcardsQueryKey() });
        }} variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" /> Проверить снова
        </Button>
      </div>
    );
  }

  if (!card) return null;

  return (
    <div className="max-w-xl mx-auto py-8 space-y-8 animate-in fade-in">
      <div>
        <h1 className="text-4xl font-serif font-bold text-foreground">Карточки</h1>
        <p className="text-muted-foreground mt-1">Интервальное повторение по методу SM-2.</p>
      </div>

      <div className="flex justify-between text-sm font-medium text-muted-foreground">
        <span>Осталось карточек: {cards.length - currentIndex}</span>
        <span>Карточка {currentIndex + 1} из {cards.length}</span>
      </div>

      <div className="relative h-[400px] perspective-1000">
        <div
          className={`absolute inset-0 w-full h-full transition-transform duration-500 transform-style-3d cursor-pointer shadow-lg rounded-xl ${isFlipped ? 'rotate-y-180' : ''}`}
          onClick={() => !isFlipped && setIsFlipped(true)}
        >
          {/* Лицевая сторона — андийское слово */}
          <Card className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 bg-card border-2">
            <span className="text-sm font-mono text-muted-foreground mb-4 uppercase tracking-wider">
              {card.word.partOfSpeech}
            </span>
            <h2 className="text-5xl font-bold text-primary text-center mb-4">{card.word.andiWord}</h2>
            {card.word.phonetic && (
              <span className="text-muted-foreground font-mono text-sm mb-6">/{card.word.phonetic}/</span>
            )}
            <div className="mt-auto text-sm text-muted-foreground animate-pulse">
              Нажмите, чтобы открыть
            </div>
          </Card>

          {/* Обратная сторона — перевод */}
          <Card className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col p-8 bg-card border-2 border-primary/20">
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Русский</h3>
                <p className="text-3xl font-medium">{card.word.russian}</p>
              </div>
              {card.word.english && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Английский</h3>
                  <p className="text-2xl">{card.word.english}</p>
                </div>
              )}
            </div>

            <div className="space-y-2 mt-6">
              <p className="text-xs text-center text-muted-foreground mb-3">Насколько хорошо вы вспомнили слово?</p>
              <div className="grid grid-cols-4 gap-2">
                <Button variant="destructive" onClick={(e) => { e.stopPropagation(); handleReview(0); }} className="w-full text-xs">
                  Снова
                </Button>
                <Button variant="secondary" onClick={(e) => { e.stopPropagation(); handleReview(1); }} className="w-full text-xs">
                  Сложно
                </Button>
                <Button variant="default" onClick={(e) => { e.stopPropagation(); handleReview(2); }} className="w-full text-xs bg-blue-600 hover:bg-blue-700">
                  Хорошо
                </Button>
                <Button variant="default" onClick={(e) => { e.stopPropagation(); handleReview(3); }} className="w-full text-xs bg-green-600 hover:bg-green-700">
                  Легко
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
