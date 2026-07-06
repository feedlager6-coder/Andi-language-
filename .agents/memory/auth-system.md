---
name: Auth system (username/password)
description: How authentication works after replacing Replit OIDC with local bcrypt auth.
---

## Rule
The platform uses username + password auth (bcryptjs). No email, no OIDC, no Replit SSO.

## Key files
- `lib/db/src/schema/auth.ts` — `usersTable` has `username` (unique, nullable) and `passwordHash` (nullable)
- `artifacts/api-server/src/lib/auth.ts` — `hashPassword`, `verifyPassword`, session CRUD, `setSessionCookie`
- `artifacts/api-server/src/routes/auth.ts` — `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/user`
- `artifacts/api-server/src/middlewares/authMiddleware.ts` — reads session cookie → sets `req.user`
- `artifacts/api-server/src/types.ts` — `SessionUser` interface + `Express.User` / `Express.Request` augmentation
- `artifacts/andi-language/src/pages/login.tsx` — login/register UI at `/login`
- `lib/replit-auth-web/src/use-auth.ts` — `login()` navigates to `BASE_URL/login`; `logout()` calls `POST /api/auth/logout`

## Why
User requested username/password auth without email verification. OIDC was too heavyweight.

## How to apply
- `Express.User` is extended via `types.ts` (NOT in `authMiddleware.ts`). Import `"../types"` side-effect in authMiddleware.
- `SessionUser` type lives in `src/types.ts` — do NOT import `AuthUser` from `@workspace/api-client-react` on the server (that's a frontend package).
- After schema changes: `pnpm --filter @workspace/db run push`.
- After route changes: restart `artifacts/api-server: API Server` workflow (esbuild, not watch).
