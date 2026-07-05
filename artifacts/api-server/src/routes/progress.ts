import { Router } from "express";
import { db, userStatsTable, flashcardsTable, wordsTable, lessonsTable } from "@workspace/db";
import { lte, sql } from "drizzle-orm";

const router = Router();

router.get("/progress", async (req, res) => {
  const [stats] = await db.select().from(userStatsTable);
  const [{ totalWords }] = await db.select({ totalWords: sql<number>`count(*)::int` }).from(wordsTable);
  const [{ lessonsCompleted }] = await db.select({ lessonsCompleted: sql<number>`count(*)::int` }).from(lessonsTable);
  const now = new Date();
  const [{ dueToday }] = await db.select({ dueToday: sql<number>`count(*)::int` }).from(flashcardsTable).where(lte(flashcardsTable.dueDate, now));

  return res.json({
    wordsLearned: stats?.wordsLearned ?? 0,
    exercisesDone: stats?.exercisesDone ?? 0,
    streak: stats?.streak ?? 0,
    totalWords,
    lessonsCompleted,
    dueToday,
  });
});

export default router;
