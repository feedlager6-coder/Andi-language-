import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const wordFormsTable = pgTable("word_forms", {
  id: serial("id").primaryKey(),
  wordId: integer("word_id").notNull(),
  form: text("form").notNull(),
  caseName: text("case_name"),
  caseNameRu: text("case_name_ru"),
  number: text("number"),
  nounClass: text("noun_class"),
  grammarNote: text("grammar_note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWordFormSchema = createInsertSchema(wordFormsTable).omit({ id: true, createdAt: true });
export type InsertWordForm = z.infer<typeof insertWordFormSchema>;
export type WordForm = typeof wordFormsTable.$inferSelect;
