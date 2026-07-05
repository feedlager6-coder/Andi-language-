import { Router, type IRouter } from "express";
import { db, favoritesTable, translationHistoryTable, userSettingsTable, userStatsTable } from "@workspace/db";
import { and, desc, eq } from "drizzle-orm";
import { AddMyFavoriteBody, AddMyHistoryEntryBody, UpdateMySettingsBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.use((req, res, next) => {
  if (!req.path.startsWith("/me")) return next();
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Требуется вход в аккаунт" });
    return;
  }
  next();
});

router.get("/me/favorites", async (req, res) => {
  const rows = await db
    .select()
    .from(favoritesTable)
    .where(eq(favoritesTable.userId, req.user!.id))
    .orderBy(desc(favoritesTable.createdAt));
  return res.json(rows);
});

router.post("/me/favorites", async (req, res) => {
  const body = AddMyFavoriteBody.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "Invalid body" });

  const [existing] = await db
    .select()
    .from(favoritesTable)
    .where(
      and(
        eq(favoritesTable.userId, req.user!.id),
        eq(favoritesTable.itemType, body.data.itemType),
        eq(favoritesTable.itemId, body.data.itemId),
      ),
    );
  if (existing) return res.status(201).json(existing);

  const [created] = await db
    .insert(favoritesTable)
    .values({ userId: req.user!.id, itemType: body.data.itemType, itemId: body.data.itemId })
    .returning();
  return res.status(201).json(created);
});

router.delete("/me/favorites/:itemType/:itemId", async (req, res) => {
  const itemType = req.params.itemType;
  const itemId = Number(req.params.itemId);
  if (!Number.isFinite(itemId)) return res.status(400).json({ error: "Invalid itemId" });

  await db
    .delete(favoritesTable)
    .where(
      and(
        eq(favoritesTable.userId, req.user!.id),
        eq(favoritesTable.itemType, itemType),
        eq(favoritesTable.itemId, itemId),
      ),
    );
  return res.status(204).send();
});

router.get("/me/history", async (req, res) => {
  const limit = Number(req.query.limit) || 50;
  const rows = await db
    .select()
    .from(translationHistoryTable)
    .where(eq(translationHistoryTable.userId, req.user!.id))
    .orderBy(desc(translationHistoryTable.createdAt))
    .limit(limit);
  return res.json(rows);
});

router.post("/me/history", async (req, res) => {
  const body = AddMyHistoryEntryBody.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "Invalid body" });

  const [created] = await db
    .insert(translationHistoryTable)
    .values({
      userId: req.user!.id,
      inputText: body.data.inputText,
      resultText: body.data.resultText ?? null,
      confidence: body.data.confidence ?? null,
    })
    .returning();
  return res.status(201).json(created);
});

router.delete("/me/history", async (req, res) => {
  await db.delete(translationHistoryTable).where(eq(translationHistoryTable.userId, req.user!.id));
  return res.status(204).send();
});

router.get("/me/settings", async (req, res) => {
  const [row] = await db.select().from(userSettingsTable).where(eq(userSettingsTable.userId, req.user!.id));
  if (row) return res.json(row);

  const [created] = await db
    .insert(userSettingsTable)
    .values({ userId: req.user!.id })
    .returning();
  return res.json(created);
});

router.put("/me/settings", async (req, res) => {
  const body = UpdateMySettingsBody.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "Invalid body" });

  const [existing] = await db.select().from(userSettingsTable).where(eq(userSettingsTable.userId, req.user!.id));

  if (!existing) {
    const [created] = await db
      .insert(userSettingsTable)
      .values({ userId: req.user!.id, ...body.data })
      .returning();
    return res.json(created);
  }

  const [updated] = await db
    .update(userSettingsTable)
    .set({ ...body.data, updatedAt: new Date() })
    .where(eq(userSettingsTable.userId, req.user!.id))
    .returning();
  return res.json(updated);
});

router.get("/me/stats", async (req, res) => {
  const [row] = await db.select().from(userStatsTable).where(eq(userStatsTable.userId, req.user!.id));
  if (row) return res.json(row);

  const [created] = await db
    .insert(userStatsTable)
    .values({ userId: req.user!.id })
    .returning();
  return res.json(created);
});

export default router;
