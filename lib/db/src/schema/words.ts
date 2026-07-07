import { pgTable, serial, text, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const wordsTable = pgTable("words", {
  id: serial("id").primaryKey(),
  andiWord: text("andi_word").notNull(),
  lemma: text("lemma"),
  russian: text("russian").notNull(),
  english: text("english"),
  partOfSpeech: text("part_of_speech").notNull(),
  nounClass: text("noun_class"),
  grammaticalFunction: text("grammatical_function"),
  root: text("root"),
  affixes: text("affixes"),
  morphology: text("morphology"),
  phonetic: text("phonetic"),
  examples: text("examples"),
  dialect: text("dialect"),
  source: text("source"),
  license: text("license"),
  confidence: real("confidence").default(0.8),
  editorNotes: text("editor_notes"),
  level: text("level"),
  audioStatus: text("audio_status").notNull().default("missing"),
  audioUrl: text("audio_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWordSchema = createInsertSchema(wordsTable).omit({ id: true, createdAt: true });
export type InsertWord = z.infer<typeof insertWordSchema>;
export type Word = typeof wordsTable.$inferSelect;
