import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const userStatsTable = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  streak: integer("streak").notNull().default(0),
  exercisesDone: integer("exercises_done").notNull().default(0),
  wordsLearned: integer("words_learned").notNull().default(0),
  lessonsCompleted: integer("lessons_completed").notNull().default(0),
  lastActivityAt: timestamp("last_activity_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserStatsSchema = createInsertSchema(userStatsTable).omit({ id: true, createdAt: true });
export type InsertUserStats = z.infer<typeof insertUserStatsSchema>;
export type UserStats = typeof userStatsTable.$inferSelect;
