/**
 * Скрипт исправления регистра слов Салимова в базе данных.
 *
 * Слова в словаре Салимова были импортированы как ЗАГЛАВНЫЕ БУКВЫ
 * (артефакт OCR-парсинга PDF). Андийская орфография использует строчные буквы.
 *
 * Запуск: pnpm --filter @workspace/api-server run fix:salimov-case
 */

import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

type CountRow = { cnt: number };
type WordRow = { id: number; andi_word: string; russian: string };

async function main() {
  console.log("🔍 Проверяем количество слов с ЗАГЛАВНЫМИ буквами...");

  const countRows = await db.execute<CountRow>(sql`
    SELECT COUNT(*)::int AS cnt
    FROM words
    WHERE andi_word = UPPER(andi_word)
      AND LENGTH(andi_word) > 1
      AND andi_word ~ '^[А-ЯЁA-Z]'
  `);

  const total = countRows.rows?.[0]?.cnt ?? 0;
  console.log(`Найдено слов ALL CAPS: ${total}`);

  if (!total) {
    console.log("✅ Нет слов для исправления.");
    process.exit(0);
  }

  // Show a few samples before fixing
  const sampleRows = await db.execute<WordRow>(sql`
    SELECT id, andi_word, russian
    FROM words
    WHERE andi_word = UPPER(andi_word) AND LENGTH(andi_word) > 1
    ORDER BY id
    LIMIT 5
  `);
  console.log("Примеры до исправления:");
  for (const r of sampleRows.rows ?? []) {
    console.log(`  ID ${r.id}: ${r.andi_word} → ${r.russian}`);
  }

  // Fix andi_word and lemma to lowercase
  const updateResult = await db.execute(sql`
    UPDATE words
    SET
      andi_word = LOWER(andi_word),
      lemma     = CASE WHEN lemma IS NOT NULL THEN LOWER(lemma) ELSE NULL END
    WHERE andi_word = UPPER(andi_word)
      AND LENGTH(andi_word) > 1
      AND andi_word ~ '^[А-ЯЁA-Z]'
  `);

  console.log(`✅ Исправлено слов: ${(updateResult as any).rowCount ?? "неизвестно"}`);

  // Verify
  const afterRows = await db.execute<CountRow>(sql`
    SELECT COUNT(*)::int AS cnt
    FROM words
    WHERE andi_word = UPPER(andi_word) AND LENGTH(andi_word) > 1
  `);
  console.log(`Оставшихся ALL CAPS слов: ${afterRows.rows?.[0]?.cnt ?? 0}`);

  // Show samples after
  const samplesAfter = await db.execute<WordRow>(sql`
    SELECT andi_word, russian FROM words ORDER BY id LIMIT 5
  `);
  console.log("Примеры после исправления:");
  for (const r of samplesAfter.rows ?? []) {
    console.log(`  ${r.andi_word} → ${r.russian}`);
  }

  process.exit(0);
}

main().catch((e) => {
  console.error("Ошибка:", e.message);
  process.exit(1);
});
