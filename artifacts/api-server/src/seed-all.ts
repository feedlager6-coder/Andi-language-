/**
 * Мастер-скрипт полного заполнения базы данных.
 *
 * Запускать один раз после `pnpm --filter @workspace/db run push`
 * (например, сразу после импорта проекта в новый Repl):
 *
 *   pnpm --filter @workspace/api-server run seed:all
 *
 * Скрипт идемпотентен: перед каждым шагом проверяет, есть ли уже данные
 * нужного типа в базе, и пропускает шаг, если они уже есть. Поэтому его
 * безопасно запускать повторно — он не создаст дубликатов.
 *
 * Порядок шагов важен: словарные шаги должны выполняться раньше уроков
 * и фразника, так как практические уроки и фразник ссылаются на слова
 * из словаря по тексту (для консистентности примеров), а не по внешнему ключу.
 */
import { db, wordsTable, phrasesTable, lessonsTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function countRows(table: any): Promise<number> {
  const [row] = await db.select({ count: sql<number>`count(*)::int` }).from(table);
  return row?.count ?? 0;
}

function runScript(relPath: string, label: string) {
  console.log(`\n=== ${label} ===`);
  execFileSync("tsx", [join(__dirname, relPath)], {
    stdio: "inherit",
    cwd: join(__dirname, ".."),
  });
}

async function main() {
  console.log("Проверка текущего состояния базы данных...");
  const wordCount = await countRows(wordsTable);
  const phraseCount = await countRows(phrasesTable);
  const lessonCount = await countRows(lessonsTable);
  console.log(`Слова: ${wordCount}, фразы: ${phraseCount}, уроки: ${lessonCount}`);

  // 1. Базовый словарь (учебные слова с полной морфологией)
  if (wordCount === 0) {
    runScript("seed-enhanced.ts", "1/7 Базовый словарь (seed-enhanced)");
    runScript("seed-words-expanded.ts", "2/7 Расширенный словарь (seed-words-expanded)");
    runScript("seed-vocab-expanded.ts", "3/7 Доп. лексика (seed-vocab-expanded)");
  } else {
    console.log("Пропуск шагов 1–3: слова уже есть в базе.");
  }

  // 2. Большой словарь Салимова (требует src/salimov_words.json, уже в репозитории)
  const wordCountAfterBase = await countRows(wordsTable);
  if (wordCountAfterBase < 1000) {
    runScript("seed-salimov.ts", "4/7 Словарь Салимова, 2010 (seed-salimov)");
  } else {
    console.log("Пропуск шага 4: словарь Салимова уже импортирован.");
  }

  // 3. Уроки (грамматика + практика)
  if (lessonCount === 0) {
    runScript("seed-lessons.ts", "5/7 Уроки: алфавит и базовая грамматика (seed-lessons)");
    runScript("seed-lessons-part2.ts", "6/7 Уроки: продвинутая грамматика (seed-lessons-part2)");
  } else {
    console.log("Пропуск шага 5–6: уроки уже есть в базе.");
  }

  // 4. Фразник (должен идти до практических уроков, которые на него ссылаются)
  if (phraseCount === 0) {
    runScript("seed-phrasebank.ts", "7/7a Фразник (seed-phrasebank)");
  } else {
    console.log("Пропуск шага 7a: фразник уже заполнен.");
  }

  const lessonCountAfterGrammar = await countRows(lessonsTable);
  if (lessonCountAfterGrammar < 22) {
    runScript("seed-lessons-practical.ts", "7/7b Практические уроки (seed-lessons-practical)");
  } else {
    console.log("Пропуск шага 7b: практические уроки уже есть.");
  }

  const finalWords = await countRows(wordsTable);
  const finalPhrases = await countRows(phrasesTable);
  const finalLessons = await countRows(lessonsTable);
  console.log("\n=== Готово ===");
  console.log(`Итого в базе: слова — ${finalWords}, фразы — ${finalPhrases}, уроки — ${finalLessons}`);
  console.log("Если что-то не досчиталось — смотрите вывод выше по конкретному шагу.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Ошибка при заполнении базы данных:", err);
  process.exit(1);
});
