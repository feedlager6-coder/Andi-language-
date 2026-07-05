import { Router } from "express";
import { db, exercisesTable, userStatsTable, activityLogTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import {
  ListExercisesQueryParams,
  CreateExerciseBody,
  SubmitExerciseParams,
  SubmitExerciseBody,
} from "@workspace/api-zod";

const router = Router();

router.get("/exercises", async (req, res) => {
  const query = ListExercisesQueryParams.safeParse(req.query);
  if (!query.success) return res.status(400).json({ error: "Invalid query" });
  const { lessonId, type } = query.data;

  let exercises = db.select().from(exercisesTable);
  if (lessonId) exercises = exercises.where(eq(exercisesTable.lessonId, lessonId)) as any;
  if (type) exercises = exercises.where(eq(exercisesTable.type, type)) as any;

  return res.json(await exercises);
});

router.post("/exercises", async (req, res) => {
  const body = CreateExerciseBody.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "Invalid body" });
  const [exercise] = await db.insert(exercisesTable).values(body.data).returning();
  return res.status(201).json(exercise);
});

router.post("/exercises/:id/submit", async (req, res) => {
  const params = SubmitExerciseParams.safeParse({ id: Number(req.params.id) });
  const body = SubmitExerciseBody.safeParse(req.body);
  if (!params.success || !body.success) return res.status(400).json({ error: "Invalid request" });

  const [exercise] = await db.select().from(exercisesTable).where(eq(exercisesTable.id, params.data.id));
  if (!exercise) return res.status(404).json({ error: "Exercise not found" });

  const correct = body.data.answer.trim().toLowerCase() === exercise.answer.trim().toLowerCase();

  if (correct) {
    await db
      .insert(userStatsTable)
      .values({ exercisesDone: 1, streak: 1, lastActivityAt: new Date() })
      .onConflictDoUpdate({
        target: userStatsTable.id,
        set: { exercisesDone: sql`user_stats.exercises_done + 1`, lastActivityAt: new Date() },
      })
      .catch(() => {});

    const [stats] = await db.select().from(userStatsTable);
    if (stats) {
      await db.update(userStatsTable).set({ exercisesDone: stats.exercisesDone + 1, lastActivityAt: new Date() }).where(eq(userStatsTable.id, stats.id));
    }

    await db.insert(activityLogTable).values({ type: "exercise", exerciseId: exercise.id });
  }

  return res.json({ correct, correctAnswer: exercise.answer, explanation: exercise.explanation ?? null });
});

export default router;
