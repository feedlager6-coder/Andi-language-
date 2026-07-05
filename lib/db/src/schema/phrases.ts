import { pgTable, serial, text, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const phrasesTable = pgTable("phrases", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  andi: text("andi").notNull(),
  russian: text("russian").notNull(),
  english: text("english"),
  transliteration: text("transliteration"),
  breakdown: text("breakdown"),
  exampleUsage: text("example_usage"),
  source: text("source"),
  confidence: real("confidence").default(0.7),
  audioStatus: text("audio_status").notNull().default("missing"),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPhraseSchema = createInsertSchema(phrasesTable).omit({ id: true, createdAt: true });
export type InsertPhrase = z.infer<typeof insertPhraseSchema>;
export type Phrase = typeof phrasesTable.$inferSelect;
