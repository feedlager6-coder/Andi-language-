---
name: Andi Language Platform
description: Architecture decisions, known issues, and durable lessons for the Andi Language Learning Platform monorepo.
---

## Stack
- **Monorepo**: pnpm workspaces
- **Frontend**: `artifacts/andi-language` — React 19, Vite 7, Wouter, TanStack Query, Tailwind, shadcn/ui
- **Backend**: `artifacts/api-server` — Express 5, Drizzle ORM, ESBuild
- **DB lib**: `lib/db` — Drizzle + node-postgres, schema in `lib/db/src/schema/`
- **API types**: `lib/api-client-react`, `lib/api-zod`, `lib/api-spec`

## Database — Critical Issue
**The DATABASE_URL in Replit secrets is a Railway INTERNAL URL** (`postgres.railway.internal`).
This URL is only accessible from within Railway's private network — NOT from Replit.

- **On Railway (production)**: the internal URL works fine for the deployed app.
- **From Replit (dev)**: all DB queries fail with `ENOTFOUND postgres.railway.internal`.

**Fix needed**: User must add the Railway PUBLIC PostgreSQL URL to the Replit `DATABASE_URL` secret.
Railway dashboard → PostgreSQL service → "Connect" → Public URL (looks like `postgresql://postgres:pass@monorail.proxy.rlwy.net:PORT/railway`).

## SSL Fix
`lib/db/src/index.ts` and `lib/db/drizzle.config.ts` now enable SSL for any DATABASE_URL that is not localhost/127.0.0.1.
**Why**: Railway (and most cloud PG hosts) require SSL; localhost dev does not.

## Salimov Data — ALL CAPS Fix
- 4,909 of 4,921 words in `salimov_words.json` were ALL CAPS (OCR artifact from PDF parsing).
- **Fixed**: `salimov_words.json` has been normalized to lowercase.
- `seed-salimov.ts` now normalizes case before insert (using `toAndiCase()` helper).
- One-time DB fix script: `pnpm --filter @workspace/api-server run fix:salimov-case` (in `fix-salimov-case.ts`).
- After getting correct DATABASE_URL: run `pnpm --filter @workspace/db run push` then `pnpm --filter @workspace/api-server run seed:all` then optionally `fix:salimov-case` if data already exists.

## UI — Completed Features
- `dictionary.tsx`: alphabet A–Я navigation bar + ♡ favorites (localStorage `dict_favorites`)
- `translator.tsx`: example queries, recent history (localStorage `translator_history`), clear button
- `lessons.tsx`: search filter + localStorage completed indicator (`completed_lessons`)
- `practice.tsx`: replaced disabled Dictation card with "Письменный перевод" (write translation) mode
- `layout.tsx`: mobile hamburger menu via shadcn Sidebar + `setOpenMobile` to close on navigation
- `index.html`: SEO meta tags (title, description, keywords, OG)

## Drizzle execute() return type
`db.execute<RowType>(sql\`...\`)` returns `QueryResult<RowType>` — access rows via `.rows` array.
Do NOT cast the return value to `any[]` directly; use `result.rows[0]` pattern.

## useSidebar hook
The shadcn Sidebar component exposes: `toggleSidebar`, `open`, `openMobile`, `setOpenMobile`, `isMobile`, `state`.
`setOpenMobile(false)` closes the mobile sheet overlay — call it in nav link `onClick` handlers.
