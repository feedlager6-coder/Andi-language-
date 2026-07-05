import { Router } from "express";
import { db, lessonsTable, exercisesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateLessonBody,
  GetLessonParams,
  UpdateLessonParams,
  UpdateLessonBody,
} from "@workspace/api-zod";

const router = Router();

router.get("/lessons", async (req, res) => {
  const lessons = await db.select().from(lessonsTable).orderBy(lessonsTable.orderIndex);
  return res.json(lessons);
});

router.get("/lessons/:id", async (req, res) => {
  const params = GetLessonParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) return res.status(400).json({ error: "Invalid id" });
  const [lesson] = await db.select().from(lessonsTable).where(eq(lessonsTable.id, params.data.id));
  if (!lesson) return res.status(404).json({ error: "Lesson not found" });
  const exercises = await db.select().from(exercisesTable).where(eq(exercisesTable.lessonId, params.data.id));
  return res.json({ ...lesson, exercises });
});

router.post("/lessons", async (req, res) => {
  const body = CreateLessonBody.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "Invalid body" });
  const [lesson] = await db.insert(lessonsTable).values(body.data).returning();
  return res.status(201).json(lesson);
});

router.patch("/lessons/:id", async (req, res) => {
  const params = UpdateLessonParams.safeParse({ id: Number(req.params.id) });
  const body = UpdateLessonBody.safeParse(req.body);
  if (!params.success || !body.success) return res.status(400).json({ error: "Invalid request" });
  const [lesson] = await db.update(lessonsTable).set(body.data).where(eq(lessonsTable.id, params.data.id)).returning();
  if (!lesson) return res.status(404).json({ error: "Lesson not found" });
  return res.json(lesson);
});

export default router;
