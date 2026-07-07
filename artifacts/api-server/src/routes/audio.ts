import { Router } from "express";
import { db, wordsTable, phrasesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { mkdirSync, writeFileSync, existsSync, createReadStream } from "node:fs";
import path from "node:path";
import express from "express";

const router = Router();

const audioDir = path.join(process.cwd(), "uploads", "audio");

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

// Stream audio file for a word
router.get("/audio/words/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).send(); return; }
  const filePath = path.join(audioDir, "words", `${id}.webm`);
  if (!existsSync(filePath)) { res.status(404).send(); return; }
  res.setHeader("Content-Type", "audio/webm");
  res.setHeader("Cache-Control", "public, max-age=3600");
  createReadStream(filePath).pipe(res);
});

// Stream audio file for a phrase
router.get("/audio/phrases/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).send(); return; }
  const filePath = path.join(audioDir, "phrases", `${id}.webm`);
  if (!existsSync(filePath)) { res.status(404).send(); return; }
  res.setHeader("Content-Type", "audio/webm");
  res.setHeader("Cache-Control", "public, max-age=3600");
  createReadStream(filePath).pipe(res);
});

// Upload audio for a word
router.post("/audio/words/:id", express.raw({ type: "audio/*", limit: "20mb" }), async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const [word] = await db.select().from(wordsTable).where(eq(wordsTable.id, id));
  if (!word) return res.status(404).json({ error: "Word not found" });

  const dir = path.join(audioDir, "words");
  ensureDir(dir);
  const filePath = path.join(dir, `${id}.webm`);
  writeFileSync(filePath, req.body as Buffer);

  const audioUrl = `/api/audio/words/${id}`;
  const [updated] = await db
    .update(wordsTable)
    .set({ audioStatus: "recorded", audioUrl })
    .where(eq(wordsTable.id, id))
    .returning();

  return res.json(updated);
});

// Upload audio for a phrase
router.post("/audio/phrases/:id", express.raw({ type: "audio/*", limit: "20mb" }), async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const [phrase] = await db.select().from(phrasesTable).where(eq(phrasesTable.id, id));
  if (!phrase) return res.status(404).json({ error: "Phrase not found" });

  const dir = path.join(audioDir, "phrases");
  ensureDir(dir);
  const filePath = path.join(dir, `${id}.webm`);
  writeFileSync(filePath, req.body as Buffer);

  const audioUrl = `/api/audio/phrases/${id}`;
  const [updated] = await db
    .update(phrasesTable)
    .set({ audioStatus: "recorded", audioUrl })
    .where(eq(phrasesTable.id, id))
    .returning();

  return res.json(updated);
});

export default router;
