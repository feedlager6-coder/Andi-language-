# AGENT GUIDE — Andi Language Learning Platform

> Навигатор по проекту для будущих агентов и разработчиков.
> Читайте этот файл полностью перед тем как начинать работу.

---

## Что за проект

**Andi Language Learning Platform** — веб-приложение для изучения андийского языка (нахско-дагестанская семья, гагатлинский говор). Интерфейс полностью на русском языке. Стек: React + Vite + Wouter (фронтенд), Express 5 (API), Drizzle ORM + PostgreSQL (БД), pnpm монорепо.

---

## Архитектура

```
/
├── artifacts/
│   ├── andi-language/           ← React+Vite фронтенд (preview /)
│   │   ├── src/pages/           ← dictionary, phrasebank, translator, lessons, flashcards, grammar, morphology
│   │   ├── src/components/      ← shadcn/ui компоненты
│   │   └── src/App.tsx          ← роутер Wouter
│   │
│   └── api-server/              ← Express 5 API (preview /api)
│       ├── src/routes/          ← words, phrases, lessons, exercises, flashcards, translate, grammar, morphology, health
│       ├── src/seed-*.ts        ← скрипты наполнения данных
│       ├── src/app.ts           ← Express app (CORS, статика в production)
│       └── src/index.ts         ← точка входа (читает PORT)
│
├── lib/
│   ├── db/src/                  ← Drizzle ORM + schema (words, phrases, lessons, exercises, flashcards, word_forms, activity_log, user_stats)
│   ├── api-spec/openapi.yaml    ← источник правды для API-контракта
│   ├── api-client-react/        ← React Query хуки (Orval, не редактировать вручную)
│   └── api-zod/                 ← Zod-схемы (Orval, не редактировать вручную)
│
├── railway.json                 ← Railway deployment config
├── PROJECT_PLAYBOOK.md          ← подробный playbook (добавление данных, аудио, приоритеты)
└── AGENT_GUIDE.md               ← этот файл
```

---

## Обязательные переменные окружения

| Переменная | Обязательно | Описание |
|---|---|---|
| `DATABASE_URL` | ✅ Да | PostgreSQL connection string. Пример: `postgresql://user:pass@host/db` |
| `PORT` | ✅ Да | Порт для запуска сервера. Устанавливается хостинг-платформой автоматически |
| `NODE_ENV` | Рекомендуется | `production` включает статическую раздачу фронтенда и SSL для Postgres |
| `CORS_ORIGIN` | Нет | Если задан (например `https://myapp.railway.app`), ограничивает CORS. В production без него CORS отключён (same-origin) |
| `SESSION_SECRET` | ✅ Да (для Replit Auth) | Секрет сессии Express. На Replit управляется автоматически через Replit Auth интеграцию |

---

## Аутентификация (Replit Auth)

Реализована через OpenID Connect (Replit Auth) с PKCE. Все данные пользователя (избранное, история переводчика, настройки, статистика) сохраняются per-user в БД, а не в анонимном `localStorage`.

**Backend:**
- `artifacts/api-server/src/auth.ts` — конфигурация OIDC-клиента
- `artifacts/api-server/src/authMiddleware.ts` — middleware `requireAuth` для защищённых роутов
- `artifacts/api-server/src/routes/auth.ts` — `/api/login`, `/api/logout`, `/api/auth/user`
- `artifacts/api-server/src/routes/user-data.ts` — `/api/me/favorites`, `/api/me/translation-history`, `/api/me/settings`, `/api/me/stats`
- Схема БД: `lib/db/src/schema/auth.ts` (users, sessions), `lib/db/src/schema/user_data.ts` (favorites, translation_history, user_settings, user_stats)

**Frontend:**
- Пакет `@workspace/replit-auth-web` → хук `useAuth()` (user, isAuthenticated, isLoading, login, logout)
- `src/hooks/use-favorites.ts` и `src/hooks/use-translator-history.ts` — двойной режим: синхронизация с backend если пользователь вошёл, иначе fallback на `localStorage`. Это намеренно — гость не теряет функциональность, но данные не переносятся автоматически при входе в систему (известное ограничение, см. ниже).
- `src/pages/settings.tsx` — личные настройки (дневная цель, транслитерация), требует входа
- `src/components/layout.tsx` → `SidebarAuthFooter` — кнопка "Войти"/"Выйти" + ссылка на настройки

**Известное ограничение:** при входе в систему локальные (гостевые) избранное/история НЕ переносятся автоматически на аккаунт — это будущая задача (миграция localStorage → backend при первом логине).

**Анонимный `/api/progress` vs `/api/me/stats`:** `/api/progress` — старый эндпоинт, глобальная (не per-user) строка статистики, используется только для гостей. Авторизованные пользователи используют `/api/me/stats` (индивидуальные streak, exercisesDone, wordsLearned, lessonsCompleted).

---

## Как запускать локально (Replit)

```bash
# 1. Установить зависимости
pnpm install

# 2. Применить схему к БД (один раз или после изменений schema)
pnpm --filter @workspace/db run push

# 3. Заполнить БД данными (идемпотентно, безопасно запускать повторно)
pnpm --filter @workspace/api-server run seed:all

# 4. Запустить сервисы (workflows в Replit запускаются автоматически)
pnpm --filter @workspace/api-server run dev    # API, порт из $PORT
pnpm --filter @workspace/andi-language run dev  # фронтенд, порт из $PORT
```

> **Важно:** `dev`-скрипт api-server = `build (esbuild) + start`. Это одноразовая сборка, **не watch-режим**. После любого изменения backend-кода нужно перезапустить workflow `API Server`. Иначе изменения будут невидимы.

---

## Как задеплоить на Railway

### Предварительные требования
- GitHub репозиторий подключён к Railway
- Railway сервис создан из этого репозитория
- PostgreSQL плагин добавлен к сервису

### Переменные окружения для Railway
Railway устанавливает `DATABASE_URL` и `PORT` автоматически. Нужно добавить вручную:
- `NODE_ENV=production`
- `CORS_ORIGIN=https://your-app.railway.app` (если нужно ограничить CORS)

### Railway автоматически выполняет (из `railway.json`):
```bash
# Build
pnpm install --frozen-lockfile
pnpm run build:railway
# → собирает фронтенд в artifacts/andi-language/dist/public
# → компилирует API в artifacts/api-server/dist/index.mjs

# Start
pnpm run start
# → node --enable-source-maps artifacts/api-server/dist/index.mjs
# → сервер поднимается на $PORT, раздаёт /api/* + статический фронтенд
```

### Миграция и сид после первого деплоя
После деплоя нужно выполнить **один раз** через Railway CLI или Railway Shell:
```bash
pnpm --filter @workspace/db run push       # создать таблицы
pnpm --filter @workspace/api-server run seed:all   # заполнить данными
```

### Healthcheck
Railway пингует `GET /api/healthz` после деплоя. Ответ: `{"status":"ok"}`.

---

## Deployment Checklist

- [ ] GitHub репозиторий подключён к Railway
- [ ] Railway service создан, PostgreSQL плагин добавлен
- [ ] `DATABASE_URL` — автоматически из Railway Postgres
- [ ] `NODE_ENV=production` задан в Railway Variables
- [ ] `PORT` — задаётся Railway автоматически
- [ ] Build прошёл без ошибок (`railway logs` → смотреть build output)
- [ ] `pnpm --filter @workspace/db run push` — выполнен через Railway Shell
- [ ] `pnpm --filter @workspace/api-server run seed:all` — выполнен через Railway Shell
- [ ] Публичный домен сгенерирован (Settings → Networking → Generate Domain)
- [ ] `GET https://your-app.railway.app/api/healthz` → `{"status":"ok"}`
- [ ] Словарь открывается в браузере
- [ ] Уроки загружаются
- [ ] Переводчик отвечает
- [ ] Фразник загружается

---

## Содержимое БД после seed:all

| Таблица | Количество записей |
|---|---|
| words | ~5 122 (словарь Салимова + расширенный учебный) |
| phrases | 74 фразы в 16 категориях (greetings, everyday, numbers, family, food, home, requests, questions, time, actions, animals, colors, body, weather, clothing, nature) |
| lessons | 22 урока (15 грамматических + 7 практических) |
| exercises | 129 упражнений |
| users / sessions | Растёт по мере регистрации через Replit Auth |
| favorites / translation_history / user_settings / user_stats | Per-user данные, создаются при первом действии авторизованного пользователя |

> seed:all — идемпотентен. Проверяет количество строк перед вставкой, не создаёт дубликатов при повторном запуске.

---

## Как обновить API

1. Отредактировать `lib/api-spec/openapi.yaml`
2. Запустить кодогенерацию:
   ```bash
   pnpm --filter @workspace/api-client-react run codegen
   pnpm --filter @workspace/api-zod run codegen
   ```
3. Реализовать роут в `artifacts/api-server/src/routes/`
4. ⚠️ Зарегистрировать роут в `artifacts/api-server/src/routes/index.ts`
5. Перезапустить workflow `API Server`

**Порядок регистрации роутов важен:** `morphologyRouter` должен быть зарегистрирован ДО `wordsRouter` — иначе `POST /words/analyze` перехватывается обработчиком `GET /words/:id`.

---

## Что нельзя ломать

| Правило | Причина |
|---|---|
| Не редактировать `lib/api-client-react/src/**` и `lib/api-zod/src/**` вручную | Генерируется Orval из openapi.yaml |
| `morphologyRouter` зарегистрирован до `wordsRouter` | Иначе POST /words/analyze → 404 |
| `orderIndex` в таблице lessons — уникальный | Иначе сортировка уроков сломается |
| При вставке слова через `db.insert(wordsTable)` — добавить запись в `flashcardsTable` | Иначе слово не появится в системе повторений |
| `PORT` и `DATABASE_URL` берутся из env, не захардкожены | Иначе не запустится на Railway/Replit |

---

## Типичные ошибки и их решения

### `Cannot find package 'esbuild'`
**Причина:** зависимости не установлены.
**Решение:** `pnpm install`

### API возвращает 404 после изменения роута
**Причина:** api-server не хот-релоадит роуты.
**Решение:** перезапустить workflow `API Server`.

### `DATABASE_URL must be set`
**Причина:** не задана переменная окружения.
**Решение:** на Replit — переменная приходит автоматически из модуля postgresql-16. На Railway — автоматически из PostgreSQL плагина.

### SSL-ошибка при подключении к Postgres в production
**Причина:** Railway Postgres требует SSL.
**Решение:** уже реализовано в `lib/db/src/index.ts` — при `NODE_ENV=production` добавляется `ssl: { rejectUnauthorized: false }`.

### Фронтенд не открывается в production / белый экран
**Причина:** фронтенд не собран перед стартом сервера.
**Решение:** убедитесь что `pnpm run build:railway` выполнен (`artifacts/andi-language/dist/public/index.html` должен существовать).

### Дубликаты в БД после повторного сида
**Причина:** запущен не `seed:all` (оркестратор), а отдельный `seed:*` скрипт.
**Решение:** всегда использовать `pnpm --filter @workspace/api-server run seed:all` для первичного заполнения. Он идемпотентен.

### `BASE_PATH environment variable is required`
**Причина:** при сборке фронтенда не задан BASE_PATH.
**Решение:** `BASE_PATH=/ pnpm --filter @workspace/andi-language run build`. Команда `pnpm run build:railway` это делает автоматически.

---

## Как проверять работоспособность после деплоя

```bash
# API здоров?
curl https://your-app.railway.app/api/healthz
# → {"status":"ok"}

# Словарь отвечает?
curl "https://your-app.railway.app/api/words?limit=3"
# → {"data":[...],"total":5122,...}

# Уроки загружаются?
curl https://your-app.railway.app/api/lessons | python3 -c "import sys,json; print(len(json.load(sys.stdin)))"
# → 22

# Переводчик работает?
curl -X POST https://your-app.railway.app/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"привет"}'
```

---

## Ограничения и честный статус

| Тема | Статус |
|---|---|
| Аудио | ❌ Нет. Структура готова, нужны записи носителей языка |
| Система пользователей | ✅ Replit Auth (OIDC). Избранное/история/настройки/статистика — per-user в БД. Гости используют localStorage-fallback (см. раздел «Аутентификация») |
| Мобильное приложение | ❌ Только веб |
| TTS | ❌ Нет моделей для андийского |
| Морфоанализатор | ⚠️ Предварительный (rule-based, помечен `isPreliminary: true`) |
| Переводчик | ⚠️ Не полный машинный перевод — фраза → n-грамма → слово за словом. Никогда не синтезирует перевод без опоры на грамматическую модель/словарь — при отсутствии данных возвращает частичный результат с пометкой, а не выдумку |
| Фразник | ⚠️ 74 фразы. Одиночные слова взяты напрямую из словаря Салимова (2010) с точным указанием источника; составные фразы-черновики помечены «черновик, требует проверки носителем языка» — это честно отражённая незавершённость, а не готовый контент |
| Визуальное/интерактивное обучение | ❌ Не начато в этой сессии (анимированные карточки, drag-and-drop, прогресс-бары, диаграммы предложений) — приоритет ниже auth/UX/данных, отложено на следующую сессию |
| Sidebar/мобильный UX | ✅ Исправлены все 4 бага: положение заголовка, наведение на «Главная», расположение мобильной панели, рассинхронизация иконки кнопки закрытия (иконка теперь читает `openMobile`, а не desktop-state `open`) |
| SSL для Postgres | ✅ Настроен для production |
| Healthcheck | ✅ GET /api/healthz |
| Railway конфиг | ✅ railway.json в корне |

---

*Обновлён: 5 июля 2026 (добавлена аутентификация Replit Auth, исправлен sidebar/mobile UX, расширен фразник до 74 фраз). Следующие приоритеты — визуальные/интерактивные элементы обучения (drag-and-drop, прогресс-бары, диаграммы), перенос гостевых данных в аккаунт при первом логине.*
