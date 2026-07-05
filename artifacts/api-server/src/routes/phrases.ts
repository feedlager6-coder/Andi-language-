import { Router } from "express";
import { db, phrasesTable } from "@workspace/db";
import { eq, ilike, or, sql, asc } from "drizzle-orm";
import {
  ListPhrasesQueryParams,
  CreatePhraseBody,
  GetPhraseParams,
  UpdatePhraseParams,
  UpdatePhraseBody,
  RequestPhraseAudioParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/phrases/categories", async (_req, res) => {
  const rows = await db
    .select({ label: phrasesTable.category, count: sql<number>`count(*)::int` })
    .from(phrasesTable)
    .groupBy(phrasesTable.category)
    .orderBy(phrasesTable.category);
  return res.json(rows);
});

router.get("/phrases", async (req, res) => {
  const query = ListPhrasesQueryParams.safeParse(req.query);
  if (!query.success) return res.status(400).json({ error: "Invalid query" });
  const { search, category, audioStatus } = query.data;

  const conditions: any[] = [];
  if (search) {
    conditions.push(
      or(
        ilike(phrasesTable.andi, `%${search}%`),
        ilike(phrasesTable.russian, `%${search}%`),
        ilike(phrasesTable.english, `%${search}%`)
      )
    );
  }
  if (category) conditions.push(eq(phrasesTable.category, category));
  if (audioStatus) conditions.push(eq(phrasesTable.audioStatus, audioStatus));

  const whereClause = conditions.length > 0 ? conditions.reduce((a, b) => sql`${a} AND ${b}`) : undefined;

  const [phrases, [{ count }]] = await Promise.all([
    db.select().from(phrasesTable).where(whereClause).orderBy(asc(phrasesTable.category), asc(phrasesTable.orderIndex)),
    db.select({ count: sql<number>`count(*)::int` }).from(phrasesTable).where(whereClause),
  ]);

  return res.json({ phrases, total: count });
});

router.post("/phrases", async (req, res) => {
  const body = CreatePhraseBody.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "Invalid body" });
  const [phrase] = await db.insert(phrasesTable).values(body.data).returning();
  return res.status(201).json(phrase);
});

router.get("/phrases/:id", async (req, res) => {
  const params = GetPhraseParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) return res.status(400).json({ error: "Invalid id" });
  const [phrase] = await db.select().from(phrasesTable).where(eq(phrasesTable.id, params.data.id));
  if (!phrase) return res.status(404).json({ error: "Phrase not found" });
  return res.json(phrase);
});

router.patch("/phrases/:id", async (req, res) => {
  const params = UpdatePhraseParams.safeParse({ id: Number(req.params.id) });
  const body = UpdatePhraseBody.safeParse(req.body);
  if (!params.success || !body.success) return res.status(400).json({ error: "Invalid request" });
  const [phrase] = await db.update(phrasesTable).set(body.data).where(eq(phrasesTable.id, params.data.id)).returning();
  if (!phrase) return res.status(404).json({ error: "Phrase not found" });
  return res.json(phrase);
});

router.post("/phrases/:id/request-audio", async (req, res) => {
  const params = RequestPhraseAudioParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) return res.status(400).json({ error: "Invalid id" });
  const [phrase] = await db.select().from(phrasesTable).where(eq(phrasesTable.id, params.data.id));
  if (!phrase) return res.status(404).json({ error: "Phrase not found" });
  if (phrase.audioStatus === "missing") {
    const [updated] = await db
      .update(phrasesTable)
      .set({ audioStatus: "requested" })
      .where(eq(phrasesTable.id, params.data.id))
      .returning();
    return res.json(updated);
  }
  return res.json(phrase);
});

export default router;
