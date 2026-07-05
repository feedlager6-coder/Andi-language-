/**
 * Импорт словаря из Салимова Х.С. «Гагатлинский говор андийского языка» (2010)
 * ИЯЛИ ДНЦ РАН, Махачкала.
 *
 * Перед запуском: python3 src/parse-salimov-dict.py /tmp/salimov_full.txt
 * Это создаёт src/salimov_words.json
 *
 * Запуск: pnpm run seed:salimov
 */

import { db, wordsTable, flashcardsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { createReadStream } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type SalimovEntry = {
  andiWord: string;
  lemma: string;
  russian: string;
  english: string | null;
  partOfSpeech: string;
  nounClass: string | null;
  phonetic: string | null;
  examples: string | null;
  dialect: string | null;
  source: string;
  license: string;
  confidence: number;
  level: string;
  editorNotes: string | null;
};

async function seedSalimov() {
  const jsonPath = join(__dirname, "salimov_words.json");

  let rawData: string;
  try {
    const { readFileSync } = await import("fs");
    rawData = readFileSync(jsonPath, "utf-8");
  } catch {
    console.error(`Файл не найден: ${jsonPath}`);
    console.error("Сначала запустите: python3 src/parse-salimov-dict.py /tmp/salimov_full.txt");
    process.exit(1);
  }

  const entries: SalimovEntry[] = JSON.parse(rawData);
  console.log(`\n📖 Словарь Салимова — загружено ${entries.length} записей из JSON`);

  // Фильтрация: убрать совсем плохие записи
  const filtered = entries.filter(e => {
    if (!e.andiWord || !e.russian) return false;
    if (e.russian.length < 3) return false;
    // Убрать записи где перевод начинается с числа (артефакт OCR)
    if (/^\d/.test(e.russian)) return false;
    // Убрать если слово состоит только из латиницы
    if (/^[A-Za-z]+$/.test(e.andiWord)) return false;
    // Убрать если перевод содержит только латиницу
    if (/^[A-Za-z ]+$/.test(e.russian)) return false;
    return true;
  });

  console.log(`📋 После фильтрации: ${filtered.length} записей для импорта`);

  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  // Батчевый импорт — по 50 слов за раз
  const BATCH_SIZE = 50;

  for (let batchStart = 0; batchStart < filtered.length; batchStart += BATCH_SIZE) {
    const batch = filtered.slice(batchStart, batchStart + BATCH_SIZE);

    for (const entry of batch) {
      try {
        // Проверяем, существует ли уже это слово
        const existing = await db
          .select({ id: wordsTable.id })
          .from(wordsTable)
          .where(eq(wordsTable.andiWord, entry.andiWord))
          .limit(1);

        if (existing.length > 0) {
          skipped++;
          continue;
        }

        // Вставляем слово
        const [word] = await db
          .insert(wordsTable)
          .values({
            andiWord: entry.andiWord,
            lemma: entry.lemma,
            russian: entry.russian,
            english: entry.english,
            partOfSpeech: entry.partOfSpeech,
            nounClass: entry.nounClass,
            phonetic: entry.phonetic,
            examples: entry.examples,
            dialect: entry.dialect,
            source: entry.source,
            license: entry.license,
            confidence: entry.confidence,
            level: entry.level,
            editorNotes: entry.editorNotes,
          })
          .returning({ id: wordsTable.id });

        // Добавляем карточку для системы повторений
        await db.insert(flashcardsTable).values({
          wordId: word.id,
          dueDate: new Date(),
        });

        inserted++;
      } catch (e) {
        errors++;
      }
    }

    // Прогресс каждые 500 слов
    if (batchStart % 500 === 0 && batchStart > 0) {
      console.log(`  Прогресс: ${batchStart}/${filtered.length} (вставлено: ${inserted}, пропущено: ${skipped})`);
    }
  }

  // Итоговая статистика
  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(wordsTable);

  console.log(`\n✅ ИМПОРТ ЗАВЕРШЁН`);
  console.log(`   Вставлено новых слов:   ${inserted}`);
  console.log(`   Пропущено (уже есть):   ${skipped}`);
  console.log(`   Ошибок:                 ${errors}`);
  console.log(`\n📚 Итого слов в словаре: ${total}`);
  console.log(`\n📋 Источник: Салимов Х.С. Гагатлинский говор андийского языка, 2010`);
  console.log(`   Гагатлинский говор охватывает сс. Анди, Гагатль, Риквани, Зило`);
  console.log(`\n⚠️  АУДИО: Нет. Нужна запись от носителей языка из Ботлихского района.`);

  // Статистика по частям речи
  const pos = await db
    .select({
      pos: wordsTable.partOfSpeech,
      count: sql<number>`count(*)::int`,
    })
    .from(wordsTable)
    .groupBy(wordsTable.partOfSpeech)
    .orderBy(sql`count(*) desc`);

  console.log(`\n📊 Словарь по частям речи:`);
  for (const { pos: p, count } of pos) {
    console.log(`   ${p}: ${count}`);
  }
}

seedSalimov()
  .then(() => process.exit(0))
  .catch((e) => { console.error("ОШИБКА:", e); process.exit(1); });
