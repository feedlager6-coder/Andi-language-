import { Router } from "express";
import { db, wordsTable, lessonsTable, exercisesTable, activityLogTable } from "@workspace/db";
import { sql, gte } from "drizzle-orm";
import { GetActivityFeedQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/stats/summary", async (req, res) => {
  const [{ totalWords }] = await db.select({ totalWords: sql<number>`count(*)::int` }).from(wordsTable);
  const [{ totalLessons }] = await db.select({ totalLessons: sql<number>`count(*)::int` }).from(lessonsTable);
  const [{ totalExercises }] = await db.select({ totalExercises: sql<number>`count(*)::int` }).from(exercisesTable);

  const posCounts = await db
    .select({
      label: wordsTable.partOfSpeech,
      count: sql<number>`count(*)::int`,
    })
    .from(wordsTable)
    .groupBy(wordsTable.partOfSpeech);

  const levelCounts = await db
    .select({
      label: wordsTable.level,
      count: sql<number>`count(*)::int`,
    })
    .from(wordsTable)
    .where(sql`${wordsTable.level} is not null`)
    .groupBy(wordsTable.level);

  return res.json({
    totalWords,
    totalLessons,
    totalExercises,
    partOfSpeechBreakdown: posCounts.map((r) => ({ label: r.label ?? "Unknown", count: r.count })),
    levelBreakdown: levelCounts.map((r) => ({ label: r.label ?? "Unknown", count: r.count })),
  });
});

router.get("/stats/activity", async (req, res) => {
  const query = GetActivityFeedQueryParams.safeParse(req.query);
  if (!query.success) return res.status(400).json({ error: "Invalid query" });
  const days = query.data.days ?? 7;

  const since = new Date();
  since.setDate(since.getDate() - days);

  const logs = await db
    .select({ date: sql<string>`date(created_at)::text`, type: activityLogTable.type, count: sql<number>`count(*)::int` })
    .from(activityLogTable)
    .where(gte(activityLogTable.createdAt, since))
    .groupBy(sql`date(created_at)`, activityLogTable.type);

  const byDate: Record<string, { exercisesDone: number; wordsReviewed: number }> = {};
  for (const row of logs) {
    if (!byDate[row.date]) byDate[row.date] = { exercisesDone: 0, wordsReviewed: 0 };
    if (row.type === "exercise") byDate[row.date].exercisesDone += row.count;
    if (row.type === "flashcard_review") byDate[row.date].wordsReviewed += row.count;
  }

  const result = Object.entries(byDate)
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return res.json(result);
});

export default router;
