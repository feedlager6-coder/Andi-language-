import { Router } from "express";
import { db, wordsTable, flashcardsTable } from "@workspace/db";
import { eq, ilike, or, sql, desc } from "drizzle-orm";
import { mkdirSync, writeFileSync, existsSync, createReadStream } from "node:fs";
import path from "node:path";
import {
  ListWordsQueryParams,
  CreateWordBody,
  GetWordParams,
  UpdateWordParams,
  UpdateWordBody,
  DeleteWordParams,
  RequestWordAudioParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/words", async (req, res) => {
  const query = ListWordsQueryParams.safeParse(req.query);
  if (!query.success) return res.status(400).json({ error: "Invalid query" });
  const { search, letter, audioStatus, partOfSpeech, level, limit = 50, offset = 0 } = query.data;

  const conditions: any[] = [];
  if (letter) {
    // Filter by first letter of Andi word (case-insensitive)
    conditions.push(ilike(wordsTable.andiWord, `${letter}%`));
  }
  if (search) {
    conditions.push(
      or(
        ilike(wordsTable.andiWord, `%${search}%`),
        ilike(wordsTable.russian, `%${search}%`),
        ilike(wordsTable.english, `%${search}%`)
      )
    );
  }
  if (audioStatus) conditions.push(eq(wordsTable.audioStatus, audioStatus));
  if (partOfSpeech) conditions.push(eq(wordsTable.partOfSpeech, partOfSpeech));
  if (level) conditions.push(eq(wordsTable.level, level));

  const whereClause = conditions.length > 0 ? conditions.reduce((a, b) => sql`${a} AND ${b}`) : undefined;

  const [words, [{ count }]] = await Promise.all([
    db.select().from(wordsTable).where(whereClause).orderBy(wordsTable.andiWord).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(wordsTable).where(whereClause),
  ]);

  return res.json({ words, total: count });
});

router.get("/words/random", async (req, res) => {
  const [word] = await db.select().from(wordsTable).orderBy(sql`random()`).limit(1);
  if (!word) return res.status(404).json({ error: "No words found" });
  return res.json(word);
});

router.get("/words/:id", async (req, res) => {
  const params = GetWordParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) return res.status(400).json({ error: "Invalid id" });
  const [word] = await db.select().from(wordsTable).where(eq(wordsTable.id, params.data.id));
  if (!word) return res.status(404).json({ error: "Word not found" });
  return res.json(word);
});

router.post("/words", async (req, res) => {
  const body = CreateWordBody.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "Invalid body" });
  const [word] = await db.insert(wordsTable).values(body.data).returning();
  await db.insert(flashcardsTable).values({ wordId: word.id, dueDate: new Date() });
  return res.status(201).json(word);
});

router.patch("/words/:id", async (req, res) => {
  const params = UpdateWordParams.safeParse({ id: Number(req.params.id) });
  const body = UpdateWordBody.safeParse(req.body);
  if (!params.success || !body.success) return res.status(400).json({ error: "Invalid request" });
  const [word] = await db.update(wordsTable).set(body.data).where(eq(wordsTable.id, params.data.id)).returning();
  if (!word) return res.status(404).json({ error: "Word not found" });
  return res.json(word);
});

router.post("/words/:id/request-audio", async (req, res) => {
  const params = RequestWordAudioParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) return res.status(400).json({ error: "Invalid id" });
  const [word] = await db.select().from(wordsTable).where(eq(wordsTable.id, params.data.id));
  if (!word) return res.status(404).json({ error: "Word not found" });
  if (word.audioStatus === "missing") {
    const [updated] = await db
      .update(wordsTable)
      .set({ audioStatus: "requested" })
      .where(eq(wordsTable.id, params.data.id))
      .returning();
    return res.json(updated);
  }
  return res.json(word);
});

router.delete("/words/:id", async (req, res) => {
  const params = DeleteWordParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) return res.status(400).json({ error: "Invalid id" });
  await db.delete(flashcardsTable).where(eq(flashcardsTable.wordId, params.data.id));
  await db.delete(wordsTable).where(eq(wordsTable.id, params.data.id));
  return res.status(204).send();
});

export default router;
