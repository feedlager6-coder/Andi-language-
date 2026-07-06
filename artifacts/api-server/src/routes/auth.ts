import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { db, usersTable } from "@workspace/db";
import { eq, or } from "drizzle-orm";
import {
  clearSession,
  getSessionId,
  createSession,
  setSessionCookie,
  hashPassword,
  verifyPassword,
} from "../lib/auth";
import { GetCurrentAuthUserResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const RegisterBody = z.object({
  username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_а-яёА-ЯЁ]+$/),
  password: z.string().min(6).max(128),
  displayName: z.string().min(1).max(64).optional(),
});

const LoginBody = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

router.get("/auth/user", (req: Request, res: Response) => {
  res.json(
    GetCurrentAuthUserResponse.parse({
      user: req.isAuthenticated() ? req.user : null,
    }),
  );
});

router.post("/auth/register", async (req: Request, res: Response) => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Неверные данные. Логин: 3–32 символа (буквы, цифры, _). Пароль: минимум 6 символов." });
    return;
  }

  const { username, password, displayName } = parsed.data;

  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username))
    .limit(1);

  if (existing.length > 0) {
    res.status(409).json({ error: "Этот логин уже занят." });
    return;
  }

  const passwordHash = await hashPassword(password);

  const [user] = await db
    .insert(usersTable)
    .values({
      username,
      passwordHash,
      firstName: displayName ?? username,
    })
    .returning();

  const sid = await createSession({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
    },
  });

  setSessionCookie(res, sid);
  res.status(201).json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
    },
  });
});

router.post("/auth/login", async (req: Request, res: Response) => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Введите логин и пароль." });
    return;
  }

  const { username, password } = parsed.data;

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username))
    .limit(1);

  if (!user || !user.passwordHash) {
    res.status(401).json({ error: "Неверный логин или пароль." });
    return;
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Неверный логин или пароль." });
    return;
  }

  const sid = await createSession({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
    },
  });

  setSessionCookie(res, sid);
  res.json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
    },
  });
});

router.post("/auth/logout", async (req: Request, res: Response) => {
  const sid = getSessionId(req);
  await clearSession(res, sid);
  res.json({ success: true });
});

// Keep GET /logout for backward compat (e.g. direct navigation)
router.get("/logout", async (req: Request, res: Response) => {
  const sid = getSessionId(req);
  await clearSession(res, sid);
  res.redirect("/");
});

export default router;
