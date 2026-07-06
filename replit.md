# Andi Language Learning Platform

Практическая платформа для изучения андийского языка (гагатлинский говор): словарь, фразник, переводчик с честной оценкой достоверности, уроки грамматики и практические мини-курсы, морфологический анализатор и план честной озвучки.

## Run & Operate

- `pnpm --filter @workspace/andi-language run dev` — фронтенд (React+Vite+Wouter)
- `pnpm --filter @workspace/api-server run dev` — backend API (Express 5, порт задаётся через `PORT`)
- `pnpm run typecheck` — полная проверка типов по всем пакетам
- `pnpm run build` — typecheck + сборка всех пакетов
- `pnpm --filter @workspace/api-spec run codegen` — перегенерировать API-хуки и Zod-схемы из OpenAPI-спеки после изменения роутов
- `pnpm --filter @workspace/db run push` — применить схему БД (только для разработки)
- `pnpm --filter @workspace/api-server run seed:all` — **заполнить базу данными** (словарь, фразник, уроки). Идемпотентно: безопасно запускать повторно, пропускает уже заполненные таблицы.
- Обязательная переменная окружения: `DATABASE_URL` — строка подключения к Postgres

### После импорта проекта в новый Repl / клонирования

1. `pnpm install`
2. `pnpm --filter @workspace/db run push` — создать таблицы по схеме
3. `pnpm --filter @workspace/api-server run seed:all` — заполнить словарь (5122 слова), фразник (33 фразы), уроки (22 урока, 129 упражнений)
4. Запустить workflows (`web`, `API Server`)

Все исходные данные для сидов (включая `src/salimov_words.json` — распарсенный словарь Салимова) закоммичены в репозиторий, внешние файлы вне репозитория не требуются.

## Auth

- **Аутентификация:** username + password (bcrypt, нет email-верификации, нет OIDC).
- Регистрация: `POST /api/auth/register` — логин (3–32 символа), пароль (≥6), displayName опционально.
- Вход: `POST /api/auth/login`. Выход: `POST /api/auth/logout`. Текущий пользователь: `GET /api/auth/user`.
- Сессии в PostgreSQL (`sessions`-таблица), cookie `sid`, TTL 7 дней.
- Страница входа: `/login` — отдельный роут вне AppLayout.
- `Express.User` расширяется через `artifacts/api-server/src/types.ts` (`SessionUser`); **не** импортировать `AuthUser` из `api-client-react` на сервере.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Wouter, `artifacts/andi-language`
- Backend: Express 5, `artifacts/api-server` (роуты собираются esbuild в `dist/index.mjs` — **dev-скрипт не хот-релоадит роуты**, см. Gotchas)
- DB: PostgreSQL + Drizzle ORM (`lib/db`)
- Validation: Zod (из каталога `"zod": "catalog:"` в `pnpm-workspace.yaml`), `drizzle-zod`
- API-контракт: OpenAPI-спека → Orval-codegen → хуки в `@workspace/api-client-react`
- Весь пользовательский интерфейс — на русском языке

## Where things live

- `lib/db/src/schema/` — схема БД (words, phrases, lessons, exercises, flashcards, word_forms, activity_log, user_stats)
- `lib/api-spec/openapi.yaml` — источник истины для API-контракта
- `artifacts/api-server/src/routes/` — Express-роуты (words, phrases, lessons, translate, grammar, morphology, flashcards)
- `artifacts/api-server/src/seed-*.ts` — скрипты заполнения данных; `seed-all.ts` — оркестратор, запускающий все по порядку
- `artifacts/andi-language/src/pages/` — страницы: словарь, фразник (`phrasebank.tsx`), переводчик (`translator.tsx`), уроки, флеш-карточки, практика, морфоанализатор, грамматика
- `RECORDING_GUIDE.md` — инструкция для записи аудио носителями языка

## Architecture decisions

- **Честность важнее полноты.** Ни одного синтезированного или поддельного аудио. У каждого слова/фразы есть `audioStatus` (`missing` → `requested` → `recorded` → `verified`), кнопка «Запросить запись», и реальная числовая `confidence` (0–1), а не выдуманная.
- **Переводчик не выдаёт полноценный машинный перевод.** Ищет точные фразы → словосочетания → пословный разбор, всегда показывает достоверность по каждому фрагменту и явное предупреждение, что это черновик.
- **Морфоанализатор помечен как предварительный** (`isPreliminary: true`) — он основан на правилах (Мадиева 1980, Салимов 2010), а не на полноценной лингвистической модели.
- **Роуты регистрируются в строгом порядке**: `morphologyRouter` — до `wordsRouter`, иначе `/words/analyze` перехватывается обработчиком `/words/:id`.
- **Навигация разделена**: обычные разделы для всех пользователей vs. свёрнутый блок «Для специалистов» (морфоанализатор, грамматика, панель лингвиста) для продвинутых.

## Product

- Словарь: 5122 слова (словарь Салимова, 2010 + расширенный учебный словарь) с морфологией, произношением, примерами
- Фразник: 33 фразы в 10 категориях (приветствия, обиходные, просьбы, вопросы, числа, время, семья, еда, дом, действия)
- Переводчик: сегмент-за-сегментом перевод с честной оценкой достоверности
- Уроки: 22 урока (129 упражнений) — 15 грамматических + 7 практических («Как поздороваться», «Как спросить имя» и т.д.)
- Флеш-карточки с интервальным повторением (SM-2)
- Морфологический анализатор и грамматический справочник (падежи, классы существительных, дриллы)

## User preferences

- Все данные должны быть честными: если что-то не проверено носителем языка, это должно быть явно помечено (например, «черновик, требует проверки») и иметь пониженную confidence, а не выдаваться за подтверждённый факт.
- Все изменения должны сохраняться в git и пушиться на GitHub, чтобы проект можно было корректно импортировать/клонировать с нуля со всеми сидами данных.

## Gotchas

- `pnpm --filter @workspace/api-server run dev` = `build (esbuild) && start` — это **одноразовая сборка, не watch-режим**. После любого изменения в `artifacts/api-server/src/routes/**` или другой backend-логике нужно перезапустить workflow `API Server`, иначе изменения не подхватятся (будет 404 или старое поведение).
- Сиды не защищены уникальными constraint'ами в БД (`words`, `phrases`, `lessons` не имеют unique-индексов) — повторный прямой запуск отдельного `seed:*` скрипта создаст дубликаты. Всегда используйте `seed:all` для первичного заполнения — он идемпотентен за счёт проверки количества строк перед каждым шагом.
- `seed-salimov.ts` читает `src/salimov_words.json` (уже сгенерирован и закоммичен) — пересоздавать его через `parse:salimov` нужно только если меняется исходный текстовый словарь.
- Orval-сгенерированные хуки с TanStack Query v5 требуют `queryKey` в полном `UseQueryOptions` — в call-sites передавайте опции через `as any` (или `as Partial<...>`). Это известное несоответствие типов между orval v8 и @tanstack/react-query v5.
- **Не используйте `"zod/v4"`** — esbuild не разрешает этот путь. Используйте просто `"zod"` (каталог). Аналогично, `@workspace/api-client-react` не должен импортироваться в api-server (только фронтенд-пакет); типы пользователя сессии определены в `artifacts/api-server/src/types.ts`.

## Pointers

- См. skill `pnpm-workspace` для структуры workspace, настройки TypeScript и деталей по пакетам
