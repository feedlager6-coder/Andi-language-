import { db, phrasesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

interface PhraseEntry {
  category: string;
  andi: string;
  russian: string;
  english?: string;
  transliteration?: string;
  breakdown?: string;
  exampleUsage?: string;
  source: string;
  confidence: number;
  orderIndex: number;
}

const phrases: PhraseEntry[] = [
  // Greetings — verified against seed-lessons.ts (lesson 2), academic sources
  { category: "greetings", andi: "Марщалла!", russian: "Привет! / Здравствуй!", english: "Hello!", transliteration: "marʃalla", breakdown: "приветственное восклицание, не разложимо на морфемы", exampleUsage: "Марщалла! Рагьу рукIана? — Привет! Как дела?", source: "Мадиева Г.И., 1980; проверено в уроке «Приветствия»", confidence: 0.85, orderIndex: 1 },
  { category: "greetings", andi: "Хайр хилла!", russian: "До свидания!", english: "Goodbye!", transliteration: "χajr χilla", breakdown: "хайр (благо) + хилла (пусть будет) — формула прощания", source: "Мадиева Г.И., 1980", confidence: 0.8, orderIndex: 2 },
  { category: "greetings", andi: "Хьар хилла!", russian: "Пока!", english: "Bye!", transliteration: "χar χilla", breakdown: "неформальный вариант прощания", source: "Мадиева Г.И., 1980", confidence: 0.7, orderIndex: 3 },
  { category: "greetings", andi: "Рагьу рукIана?", russian: "Как дела?", english: "How are you?", transliteration: "raɣu rukʼana", breakdown: "рагьу (дела/состояние) + рукIана (есть, глагол-связка)", source: "Мадиева Г.И., 1980", confidence: 0.8, orderIndex: 4 },
  { category: "greetings", andi: "Хъвараб!", russian: "Хорошо!", english: "Good!", transliteration: "qʼwarab", breakdown: "стандартный ответ на вопрос о делах", source: "Мадиева Г.И., 1980", confidence: 0.75, orderIndex: 5 },
  { category: "greetings", andi: "Шукру!", russian: "Спасибо!", english: "Thank you!", transliteration: "ʃukru", breakdown: "заимствование из арабского через аварский", source: "Мадиева Г.И., 1980", confidence: 0.8, orderIndex: 6 },
  { category: "greetings", andi: "ХIалбихьа!", russian: "Пожалуйста!", english: "Please! / You're welcome!", transliteration: "ħalbiħa", breakdown: "ответ на «спасибо»", source: "Мадиева Г.И., 1980", confidence: 0.7, orderIndex: 7 },

  // Names / introducing yourself
  { category: "everyday", andi: "Дун ... рукIана.", russian: "Меня зовут ... (букв. Я — ...)", english: "My name is ...", breakdown: "дун (я) + [имя] + рукIана (есть/являюсь)", exampleUsage: "Дун Марьям рукIана. — Меня зовут Марьям.", source: "Мадиева Г.И., 1980", confidence: 0.75, orderIndex: 1 },
  { category: "everyday", andi: "Мун щиб рукIана?", russian: "Как тебя зовут?", english: "What is your name?", breakdown: "мун (ты) + щиб (что/какой) + рукIана (есть)", source: "Мадиева Г.И., 1980", confidence: 0.7, orderIndex: 2 },
  { category: "everyday", andi: "Дун Дагъустаналъ рукIана.", russian: "Я из Дагестана.", english: "I am from Dagestan.", breakdown: "дун (я) + Дагъустаналъ (из Дагестана, аблатив) + рукIана", source: "Мадиева Г.И., 1980", confidence: 0.65, orderIndex: 3 },

  // Numbers — from words table, high confidence
  { category: "numbers", andi: "хьикьа", russian: "один", english: "one", source: "Словарь Салимова, 2010", confidence: 0.9, orderIndex: 1 },
  { category: "numbers", andi: "кIиго", russian: "два", english: "two", source: "Словарь Салимова, 2010", confidence: 0.9, orderIndex: 2 },
  { category: "numbers", andi: "лъабго", russian: "три", english: "three", source: "Словарь Салимова, 2010", confidence: 0.9, orderIndex: 3 },
  { category: "numbers", andi: "Ссеб гьекъоищого бачIана?", russian: "Сколько это стоит?", english: "How much does this cost?", breakdown: "требует проверки носителем — конструкция составлена по аналогии, не подтверждена", source: "черновик, требует проверки", confidence: 0.35, orderIndex: 4 },

  // Family
  { category: "family", andi: "инсу", russian: "отец", english: "father", source: "Словарь Салимова, 2010", confidence: 0.9, orderIndex: 1 },
  { category: "family", andi: "эбел", russian: "мать", english: "mother", source: "Словарь Салимова, 2010", confidence: 0.9, orderIndex: 2 },
  { category: "family", andi: "Дир хIалуб рукIа.", russian: "Это моя семья.", english: "This is my family.", breakdown: "черновая конструкция, требует проверки носителем", source: "черновик, требует проверки", confidence: 0.3, orderIndex: 3 },

  // Food
  { category: "food", andi: "гьалъи", russian: "вода", english: "water", source: "Словарь Салимова, 2010", confidence: 0.9, orderIndex: 1 },
  { category: "food", andi: "ведарихъе", russian: "хлеб", english: "bread", source: "Словарь Салимова, 2010", confidence: 0.85, orderIndex: 2 },
  { category: "food", andi: "Дица гьалъи гьекъуна.", russian: "Я хочу воды. (букв.: я воду пью/выпил)", english: "I want water.", breakdown: "черновая конструкция по образцу эргативной модели — требует проверки", source: "черновик, требует проверки", confidence: 0.35, orderIndex: 3 },

  // House
  { category: "home", andi: "рокъо", russian: "дом", english: "house", source: "Словарь Салимова, 2010", confidence: 0.9, orderIndex: 1 },
  { category: "home", andi: "Дир рокъо мицIаб бе.", russian: "Мой дом здесь.", english: "My house is here.", breakdown: "черновая конструкция — требует проверки носителем", source: "черновик, требует проверки", confidence: 0.3, orderIndex: 2 },

  // Basic actions / requests
  { category: "requests", andi: "ХIалт бихьа.", russian: "Помоги, пожалуйста.", english: "Please help.", breakdown: "черновая просьба — точная форма глагола требует проверки", source: "черновик, требует проверки", confidence: 0.3, orderIndex: 1 },
  { category: "requests", andi: "Дица ккола ...", russian: "Мне нужно ...", english: "I need ...", breakdown: "черновая конструкция (дица — эргатив «я»)", source: "черновик, требует проверки", confidence: 0.3, orderIndex: 2 },

  // Questions
  { category: "questions", andi: "щиб", russian: "что", english: "what", source: "Словарь Салимова, 2010", confidence: 0.85, orderIndex: 1 },
  { category: "questions", andi: "вищ", russian: "кто", english: "who", source: "Словарь Салимова, 2010", confidence: 0.8, orderIndex: 2 },
  { category: "questions", andi: "мица", russian: "где", english: "where", source: "Словарь Салимова, 2010", confidence: 0.8, orderIndex: 3 },
  { category: "questions", andi: "Мун мица гье?", russian: "Где ты?", english: "Where are you?", breakdown: "черновая конструкция — требует проверки", source: "черновик, требует проверки", confidence: 0.35, orderIndex: 4 },

  // Time
  { category: "time", andi: "гьалбон", russian: "сегодня", english: "today", source: "Словарь Салимова, 2010", confidence: 0.85, orderIndex: 1 },
  { category: "time", andi: "Гьануб заман щиб бе?", russian: "Сколько сейчас времени?", english: "What time is it?", breakdown: "черновая конструкция — требует проверки носителем", source: "черновик, требует проверки", confidence: 0.3, orderIndex: 2 },

  // Actions — basic verbs, from dictionary
  { category: "actions", andi: "рукIана", russian: "быть, являться", english: "to be", breakdown: "глагол-связка, употребляется очень часто", source: "Мадиева Г.И., 1980", confidence: 0.8, orderIndex: 1 },
  { category: "actions", andi: "ИНУ", russian: "идти, находиться (где)", english: "to go / to be located", source: "Словарь Салимова, 2010", confidence: 0.6, orderIndex: 2 },
  { category: "actions", andi: "ИЛА", russian: "говорить, сказать", english: "to say", source: "Словарь Салимова, 2010", confidence: 0.6, orderIndex: 3 },
];

async function main() {
  console.log(`Сеем фразник — ${phrases.length} фраз в 10 категориях...`);
  let inserted = 0;
  let skipped = 0;

  for (const p of phrases) {
    const [existing] = await db
      .select()
      .from(phrasesTable)
      .where(eq(phrasesTable.andi, p.andi));
    if (existing) {
      skipped++;
      continue;
    }
    await db.insert(phrasesTable).values({
      category: p.category,
      andi: p.andi,
      russian: p.russian,
      english: p.english,
      transliteration: p.transliteration,
      breakdown: p.breakdown,
      exampleUsage: p.exampleUsage,
      source: p.source,
      confidence: p.confidence,
      audioStatus: "missing",
      orderIndex: p.orderIndex,
    });
    inserted++;
  }

  console.log(`✓ Добавлено: ${inserted} | Пропущено (уже есть): ${skipped}`);
  const categories = [...new Set(phrases.map((p) => p.category))];
  console.log(`📂 Категории: ${categories.join(", ")}`);
  console.log(`⚠️  Фразы с пометкой «черновик, требует проверки» — это составленные по грамматическим моделям конструкции, ещё не подтверждённые носителем языка.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
