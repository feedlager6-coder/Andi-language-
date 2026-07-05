import { Router } from "express";
import { db, flashcardsTable, wordsTable, userStatsTable, activityLogTable } from "@workspace/db";
import { eq, lte, sql } from "drizzle-orm";
import {
  GetDueFlashcardsQueryParams,
  ReviewFlashcardParams,
  ReviewFlashcardBody,
} from "@workspace/api-zod";

const router = Router();

function sm2(repetitions: number, easeFactor: number, interval: number, quality: number) {
  if (quality < 2) {
    return { repetitions: 0, easeFactor, interval: 1 };
  }
  const newEaseFactor = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  let newInterval: number;
  if (repetitions === 0) newInterval = 1;
  else if (repetitions === 1) newInterval = 6;
  else newInterval = Math.round(interval * newEaseFactor);
  return { repetitions: repetitions + 1, easeFactor: newEaseFactor, interval: newInterval };
}

router.get("/flashcards/due", async (req, res) => {
  const query = GetDueFlashcardsQueryParams.safeParse(req.query);
  if (!query.success) return res.status(400).json({ error: "Invalid query" });
  const limit = query.data.limit ?? 10;

  const now = new Date();
  const dueCards = await db
    .select()
    .from(flashcardsTable)
    .where(lte(flashcardsTable.dueDate, now))
    .limit(limit);

  const result = await Promise.all(
    dueCards.map(async (card) => {
      const [word] = await db.select().from(wordsTable).where(eq(wordsTable.id, card.wordId));
      return {
        wordId: card.wordId,
        word,
        dueDate: card.dueDate.toISOString(),
        repetitions: card.repetitions,
        easeFactor: card.easeFactor,
        interval: card.interval,
      };
    })
  );

  return res.json(result);
});

router.post("/flashcards/:wordId/review", async (req, res) => {
  const params = ReviewFlashcardParams.safeParse({ wordId: Number(req.params.wordId) });
  const body = ReviewFlashcardBody.safeParse(req.body);
  if (!params.success || !body.success) return res.status(400).json({ error: "Invalid request" });

  const [card] = await db.select().from(flashcardsTable).where(eq(flashcardsTable.wordId, params.data.wordId));
  if (!card) return res.status(404).json({ error: "Flashcard not found" });

  const { repetitions, easeFactor, interval } = sm2(card.repetitions, card.easeFactor, card.interval, body.data.quality);
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + interval);

  const [updated] = await db
    .update(flashcardsTable)
    .set({ repetitions, easeFactor, interval, dueDate })
    .where(eq(flashcardsTable.id, card.id))
    .returning();

  await db.insert(activityLogTable).values({ type: "flashcard_review", wordId: params.data.wordId });

  const [stats] = await db.select().from(userStatsTable);
  if (stats) {
    await db.update(userStatsTable).set({ wordsLearned: stats.wordsLearned + 1, lastActivityAt: new Date() }).where(eq(userStatsTable.id, stats.id));
  }

  const [word] = await db.select().from(wordsTable).where(eq(wordsTable.id, updated.wordId));
  return res.json({
    wordId: updated.wordId,
    word,
    dueDate: updated.dueDate.toISOString(),
    repetitions: updated.repetitions,
    easeFactor: updated.easeFactor,
    interval: updated.interval,
  });
});

export default router;
