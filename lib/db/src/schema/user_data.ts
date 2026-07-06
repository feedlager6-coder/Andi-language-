import { pgTable, serial, text, real, integer, boolean, timestamp, varchar, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./auth";

export const favoritesTable = pgTable(
  "favorites",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    itemType: text("item_type").notNull(),
    itemId: integer("item_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [unique().on(table.userId, table.itemType, table.itemId)],
);

export const insertFavoriteSchema = createInsertSchema(favoritesTable).omit({ id: true, createdAt: true });
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favoritesTable.$inferSelect;

export const translationHistoryTable = pgTable("translation_history", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  inputText: text("input_text").notNull(),
  resultText: text("result_text"),
  confidence: real("confidence"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTranslationHistorySchema = createInsertSchema(translationHistoryTable).omit({ id: true, createdAt: true });
export type InsertTranslationHistory = z.infer<typeof insertTranslationHistorySchema>;
export type TranslationHistory = typeof translationHistoryTable.$inferSelect;

export const userSettingsTable = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().unique().references(() => usersTable.id, { onDelete: "cascade" }),
  dailyGoal: integer("daily_goal").notNull().default(10),
  showTransliteration: boolean("show_transliteration").notNull().default(true),
  theme: text("theme").notNull().default("light"),
  preferredDialect: text("preferred_dialect").notNull().default("верхнеандийский"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSettingsSchema = createInsertSchema(userSettingsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type UserSettingsRow = typeof userSettingsTable.$inferSelect;

export const lessonCompletionsTable = pgTable(
  "lesson_completions",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    lessonId: integer("lesson_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [unique().on(table.userId, table.lessonId)],
);

export const insertLessonCompletionSchema = createInsertSchema(lessonCompletionsTable).omit({ id: true, createdAt: true });
export type InsertLessonCompletion = z.infer<typeof insertLessonCompletionSchema>;
export type LessonCompletion = typeof lessonCompletionsTable.$inferSelect;
