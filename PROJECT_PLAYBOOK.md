# PROJECT PLAYBOOK — Andi Language Learning Platform

> Этот файл написан для будущих Replit Agents и разработчиков.
> Прочитайте его полностью перед тем, как начинать работу.

---

## Что такое этот проект

**Andi Language Learning Platform** — веб-приложение для изучения андийского языка (нахско-дагестанская семья, Ботлихский район Дагестана). Интерфейс на русском языке. Целевая аудитория — носители русского, желающие выучить андийский.

Стек: React + Vite + Wouter (фронтенд), Express 5 (API), Drizzle ORM + PostgreSQL (БД), pnpm monorepo.

---

## Архитектура (монорепо pnpm)

```
/
├── artifacts/
│   ├── andi-language/        ← React+Vite фронтенд (основное приложение)
│   │   └── src/
│   │       ├── pages/        ← Страницы: lessons.tsx, lesson-detail.tsx, dictionary.tsx, ...
│   │       ├── components/   ← UI-компоненты (shadcn/ui)
│   │       └── main.tsx      ← Точка входа
│   │
│   └── api-server/           ← Express 5 API-сервер
│       └── src/
│           ├── routes/       ← words.ts, lessons.ts, exercises.ts, flashcards.ts
│           ├── seed-*.ts     ← Скрипты наполнения базы данных
│           └── index.ts      ← Точка входа API
│
├── lib/
│   ├── db/                   ← Drizzle ORM + PostgreSQL
│   │   └── src/schema/       ← words.ts, lessons.ts, exercises.ts, flashcards.ts
│   ├── api-spec/             ← openapi.yaml (единый источник правды для API)
│   ├── api-client-react/     ← Сгенерированные React Query хуки (Orval)
│   └── api-zod/              ← Сгенерированные Zod-схемы (Orval)
│
└── PROJECT_PLAYBOOK.md       ← Этот файл
```

---

## Как запускать локально

### 1. Установить зависимости
```bash
pnpm install
```

### 2. Применить схему к БД (только при изменении схемы)
```bash
cd lib/db && pnpm run push
```

### 3. Запустить сервисы
Workflows запускаются автоматически в Replit. Вручную:
```bash
# API сервер (порт из $PORT, обычно 3001)
pnpm --filter @workspace/api-server run dev

# Фронтенд (порт из $PORT, обычно 5173)
pnpm --filter @workspace/andi-language run dev
```

### 4. Проверить работу
```bash
curl http://localhost:3001/api/healthz
curl http://localhost:3001/api/words?limit=5
curl http://localhost:3001/api/lessons
```

---

## Как добавлять данные

### Добавить слова в словарь

1. Создайте или расширьте `artifacts/api-server/src/seed-words-*.ts`
2. Используйте существующий шаблон (например `seed-words-expanded.ts`)
3. Поля таблицы `words`:

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| `andiWord` | text | ✓ | Написание слова на андийском |
| `russian` | text | ✓ | Перевод на русский |
| `english` | text | | Перевод на английский |
| `partOfSpeech` | text | ✓ | существительное / глагол / прилагательное / числительное / местоимение / наречие / частица / послелог |
| `nounClass` | text | | I / II / III / IV |
| `phonetic` | text | | IPA транскрипция |
| `examples` | text | | Примеры употребления |
| `source` | text | | Библиографическая ссылка |
| `confidence` | real | | 0.0–1.0 (точность данных) |
| `level` | text | | beginner / intermediate / advanced |

4. Добавьте скрипт в `artifacts/api-server/package.json`:
```json
"seed:words-new": "tsx src/seed-words-new.ts"
```

5. Запустите из директории `artifacts/api-server`:
```bash
pnpm run seed:words-new
```

### Добавить уроки

1. Создайте `artifacts/api-server/src/seed-lessons-partN.ts`
2. Структура урока:
```typescript
{
  title: string,           // Название урока
  description: string,     // Короткое описание (1 предложение)
  level: 'beginner' | 'intermediate' | 'advanced',
  orderIndex: number,      // Порядковый номер (уникальный!)
  content: string,         // HTML-строка с контентом урока
  exercises: [{
    type: 'multiple_choice' | 'translation',
    prompt: string,
    options: string[] | null,  // null для translation
    answer: string,
    explanation: string,
  }]
}
```
3. Контент урока — HTML-строка. Детектируется автоматически по `content.trimStart().startsWith("<")`.
4. Используйте теги: `<table>`, `<h2>`, `<p class="lesson-intro">`, `<p class="lesson-source">`, `<ul>`, `<li>`, `<strong>`.

### Импорт из учебника

Автоматический импорт невозможен: книги защищены авторским правом и недоступны онлайн.

**Что нужно загрузить вручную для дальнейшего импорта:**
- `Салимов Х.А. Андийско-русский словарь (2010)` — главный источник
- `Мадиева Г.И. Морфология андийского языка (1980)` — грамматика
- `Cercignani F. Andi (1979)` — фонологическое описание

Когда файл загружен, добавьте парсер в `artifacts/api-server/src/import-*.ts`.

---

## Как обновить API

Единый источник правды: `lib/api-spec/openapi.yaml`

1. Отредактируйте `openapi.yaml`
2. Запустите кодогенерацию:
```bash
pnpm --filter @workspace/api-client-react run codegen
pnpm --filter @workspace/api-zod run codegen
```
3. Обновите реальный роут в `artifacts/api-server/src/routes/`

**НИКОГДА** не редактируйте файлы в `lib/api-client-react/src/` вручную — они генерируются автоматически.

---

## Аудио

### Текущий статус
**Аудиозаписей НЕТ.** Структура для будущих файлов подготовлена.

### Структура файлов
```
artifacts/andi-language/public/audio/
├── words/
│   ├── {word_id}.mp3      ← По ID из таблицы words
│   └── README.md          ← Инструкции для звукозаписи
└── lessons/
    └── {lesson_id}/
        └── intro.mp3      ← Вводная аудиодорожка урока
```

### Что нужно для полноценного аудио
Требуется запись от носителей андийского языка (с. Анди, Ботлихский район, Дагестан).

**Минимальный набор записей:**
- Все слова словаря (каждое отдельным файлом ~1–3 сек)
- Примеры предложений из уроков
- Запись должна вестись в тихом помещении, моно, 44100 Hz, нормированная по уровню

**Рекомендуемые организации для контакта:**
- ИЯЛИ ДНЦ РАН (Махачкала) — издатели словаря Салимова
- МГУ, кафедра языков народов России
- Местные школы с. Анди

### Как подключить аудио в компонент
```tsx
// В словаре или уроке
const audioRef = useRef<HTMLAudioElement>(null);
const playAudio = (wordId: number) => {
  const audio = new Audio(`/audio/words/${wordId}.mp3`);
  audio.play().catch(() => {/* файл не загружен */});
};
```

---

## Что нельзя ломать

### 1. Схема базы данных
- Изменение полей `words`, `lessons`, `exercises` требует миграции: `cd lib/db && pnpm run push`
- Удаление поля без миграции = потеря данных
- Поле `orderIndex` в `lessons` должно быть уникальным

### 2. Кодогенерация
- Файлы в `lib/api-client-react/src/` и `lib/api-zod/src/` генерируются — не редактировать вручную
- Всегда обновляйте `openapi.yaml` при изменении API

### 3. Рендеринг контента уроков
- `lesson-detail.tsx` рендерит HTML если `content.trimStart().startsWith("<")`
- Иначе рендерит как markdown. Не меняйте это условие без проверки.

### 4. Флэшкарты
- При добавлении слова через `db.insert(wordsTable)` — обязательно добавить запись в `flashcardsTable`
- Без этого слово не появится в системе повторений

### 5. Порты
- Сервисы читают порт из `process.env.PORT` — не захардкоживайте порт

---

## Известные ограничения

| Ограничение | Подробности |
|-------------|-------------|
| Нет аудио | Требуются записи носителей языка |
| Нет импорта из PDF/DOCX | Нужен ручной upload + парсер |
| Словарь ~230 слов | Цель: 300–500 слов из двух источников |
| Нет системы пользователей | Прогресс хранится анонимно (localStorage / sessionStorage) |
| Нет мобильного приложения | Только веб |
| Уроки только на русском | Нет локализации на английский |
| Нет TTS | Синтез речи не реализован (нет готовых моделей для андийского) |

---

## Текущее состояние (июль 2026)

### Словарь
- ~230 слов в базе после выполнения всех seed-скриптов
- Источники: Салимов 2010 (главный), Мадиева 1980, Kibrik 1977
- Категории: базовые, части тела, еда, животные, дом, природа, числа, время, цвета, прилагательные, глаголы, вопросы, наречия, люди

### Уроки
- 15 уроков (orderIndex 1–15)
- Уроки 1–8: `seed-lessons.ts`
- Уроки 9–15: `seed-lessons-part2.ts`
- Каждый урок: HTML-контент + 7 заданий (multiple_choice / translation)

### Гейм-механика
- XP за правильные ответы (+10 XP каждый)
- Прогресс-бар во время урока
- Итоговый экран с результатом

---

## Порядок выполнения seed-скриптов

```bash
# Из директории artifacts/api-server/

# 1. Базовые слова (30 слов)
pnpm run seed:enhanced

# 2. Уроки 1–8 (57 заданий)
pnpm run seed:lessons

# 3. Расширенный словарь (~200 слов)
pnpm run seed:words-expanded

# 4. Уроки 9–15 (49 заданий)
pnpm run seed:lessons-part2
```

---

## Приоритеты следующей итерации

1. **Аудио** — записать слова с носителями; подключить плеер в словарь
2. **Расширить словарь до 500 слов** — нужна загрузка PDF Салимова 2010
3. **Система пользователей** — Replit Auth или Clerk, сохранение прогресса в БД
4. **Мобильная адаптация** — проверить и улучшить отображение на смартфонах
5. **Практика произношения** — Web Speech API для распознавания речи
6. **Автопроверка упражнений на перевод** — нечёткое совпадение (fuzzy match)
7. **Страница статистики** — графики прогресса, тепловая карта активности
8. **Импорт из PDF** — парсер для Салимова 2010 (если загрузить файл)

---

## Как проверять работоспособность

```bash
# API здоров?
curl http://localhost:3001/api/healthz

# Сколько слов в словаре?
curl "http://localhost:3001/api/words?limit=1" | grep total

# Сколько уроков?
curl http://localhost:3001/api/lessons | python3 -c "import sys,json; d=json.load(sys.stdin); print(len(d))"

# Проверить конкретный урок (1)
curl http://localhost:3001/api/lessons/1
```

Фронтенд: откройте в браузере, пройдите Урок 1 (Алфавит) до конца. Если XP зачисляются и показывается итоговый экран — всё работает.

---

*Обновлён: июль 2026. Следующее обновление — после добавления аудио или системы пользователей.*
