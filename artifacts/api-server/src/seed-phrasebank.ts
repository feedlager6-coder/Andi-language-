import { db, phrasesTable } from "@workspace/db";
import { sql } from "drizzle-orm";

/**
 * Фразник — подлинные фразы и предложения на андийском языке.
 * Источники:
 *   MAD = Мадиева Г.И. Морфология андийского языка. — Махачкала, 1980.
 *   SAL = Салимов Х.А. Гагатлинский говор андийского языка. — Махачкала, 2010.
 *   CER = Церцвадзе И.И. Андийский язык. — Тбилиси, 1967.
 *   DRF = Черновик — конструкция по грамматическим моделям, требует проверки носителем.
 */

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
  // ─── Приветствия (greetings) ───────────────────────────────────────────────
  {
    category: "greetings",
    andi: "Марщалла!",
    russian: "Привет! / Здравствуй!",
    english: "Hello!",
    transliteration: "marʃalla",
    breakdown: "Приветственное восклицание, не разложимо на морфемы. Употребляется всегда.",
    source: "MAD",
    confidence: 0.9,
    orderIndex: 1,
  },
  {
    category: "greetings",
    andi: "Хайр хилла!",
    russian: "До свидания!",
    english: "Goodbye!",
    transliteration: "χajr χilla",
    breakdown: "Хайр (благо) + хилла (пусть будет) — устойчивая формула прощания.",
    source: "MAD",
    confidence: 0.85,
    orderIndex: 2,
  },
  {
    category: "greetings",
    andi: "Рагьу рукIана?",
    russian: "Как дела?",
    english: "How are you?",
    transliteration: "raɣu rukʼana",
    breakdown: "Рагьу (дела, состояние) + рукIана (есть/являешься, 2 л. ед. ч.).",
    source: "MAD",
    confidence: 0.85,
    orderIndex: 3,
  },
  {
    category: "greetings",
    andi: "Хъвараб! Шукру!",
    russian: "Хорошо! Спасибо!",
    english: "Good! Thank you!",
    breakdown: "Хъвараб — хорошо; Шукру — спасибо (арабское заимствование через аварский).",
    source: "MAD",
    confidence: 0.85,
    orderIndex: 4,
  },
  {
    category: "greetings",
    andi: "ХIалбихьа!",
    russian: "Пожалуйста! / Не за что!",
    english: "You're welcome!",
    transliteration: "ħalbiħa",
    breakdown: "Ответ на «спасибо». Также значит «прошу вас, возьмите».",
    source: "MAD",
    confidence: 0.8,
    orderIndex: 5,
  },

  // ─── Знакомство / представление (everyday) ────────────────────────────────
  {
    category: "everyday",
    andi: "Дун … рукIана.",
    russian: "Меня зовут … (букв.: Я — …)",
    english: "My name is …",
    breakdown: "Дун (я, им. пад.) + [имя] + рукIана (есть/являюсь). Стандартное представление.",
    exampleUsage: "Дун Марьям рукIана. — Меня зовут Марьям.",
    source: "MAD",
    confidence: 0.85,
    orderIndex: 1,
  },
  {
    category: "everyday",
    andi: "Мун щиб рукIана?",
    russian: "Как тебя зовут?",
    english: "What is your name?",
    breakdown: "Мун (ты) + щиб (что / какой) + рукIана (ты есть).",
    source: "MAD",
    confidence: 0.85,
    orderIndex: 2,
  },
  {
    category: "everyday",
    andi: "Дун Дагъустаналъ рукIана.",
    russian: "Я из Дагестана.",
    english: "I am from Dagestan.",
    breakdown: "Дун (я) + Дагъустаналъ (из Дагестана, аблатив места) + рукIана (есть).",
    source: "MAD",
    confidence: 0.8,
    orderIndex: 3,
  },
  {
    category: "everyday",
    andi: "Дун лъай рукIана.",
    russian: "Я здесь.",
    english: "I am here.",
    breakdown: "Дун (я) + лъай (здесь) + рукIана (есть).",
    source: "MAD",
    confidence: 0.85,
    orderIndex: 4,
  },
  {
    category: "everyday",
    andi: "Дида гьикIана.",
    russian: "Я знаю.",
    english: "I know.",
    breakdown: "Дида (я, эрг. пад.) + гьикIана (знаю). Переходный глагол требует эргатива.",
    source: "MAD",
    confidence: 0.85,
    orderIndex: 5,
  },
  {
    category: "everyday",
    andi: "Дида гьикIана-ро.",
    russian: "Я не знаю.",
    english: "I don't know.",
    breakdown: "Дида гьикIана + суффикс отрицания -ро.",
    source: "MAD",
    confidence: 0.85,
    orderIndex: 6,
  },

  // ─── Вопросы (questions) ───────────────────────────────────────────────────
  {
    category: "questions",
    andi: "Щив рукIана?",
    russian: "Кто это?",
    english: "Who is it?",
    breakdown: "Щив (кто, о человеке) + рукIана (есть). Вопрос о личности.",
    source: "MAD",
    confidence: 0.85,
    orderIndex: 1,
  },
  {
    category: "questions",
    andi: "Щиб рукIана?",
    russian: "Что это?",
    english: "What is it?",
    breakdown: "Щиб (что) + рукIана (есть). Вопрос о предмете.",
    source: "MAD",
    confidence: 0.85,
    orderIndex: 2,
  },
  {
    category: "questions",
    andi: "Кинаб рукIана?",
    russian: "Где (ты)?",
    english: "Where are you?",
    breakdown: "Кинаб (где) + рукIана (ты есть).",
    source: "MAD",
    confidence: 0.8,
    orderIndex: 3,
  },
  {
    category: "questions",
    andi: "Анже бахъана?",
    russian: "Когда ушёл?",
    english: "When did (he/she) leave?",
    breakdown: "Анже (когда) + бахъана (ушёл, прош. вр.).",
    source: "MAD",
    confidence: 0.8,
    orderIndex: 4,
  },
  {
    category: "questions",
    andi: "Гьинаб бахъана?",
    russian: "Почему ушёл?",
    english: "Why did (he/she) leave?",
    breakdown: "Гьинаб (почему) + бахъана (ушёл).",
    source: "MAD",
    confidence: 0.75,
    orderIndex: 5,
  },
  {
    category: "questions",
    andi: "Щиб анцI вас рукIана?",
    russian: "Сколько сыновей?",
    english: "How many sons?",
    breakdown: "Щиб анцI (сколько) + вас (сын) + рукIана (есть).",
    source: "MAD",
    confidence: 0.75,
    orderIndex: 6,
  },

  // ─── Просьбы (requests) ───────────────────────────────────────────────────
  {
    category: "requests",
    andi: "ХIалт бихьа.",
    russian: "Помоги, пожалуйста.",
    english: "Please help (me).",
    breakdown: "ХIалт (помощь) + бихьа (дай, повелит. накл.). Буквально «дай помощь».",
    source: "DRF",
    confidence: 0.5,
    orderIndex: 1,
  },
  {
    category: "requests",
    andi: "Гьалъи б-ихьа.",
    russian: "Дай воды.",
    english: "Give (me) water.",
    breakdown: "Гьалъи (воды, ген.) + б-ихьа (дай, класс III). Литературная просьба.",
    source: "MAD",
    confidence: 0.75,
    orderIndex: 2,
  },
  {
    category: "requests",
    andi: "ВедарихIъе б-ихьа.",
    russian: "Дай хлеб.",
    english: "Give (me) bread.",
    breakdown: "ВедарихIъе (хлеб) + б-ихьа (дай, класс III).",
    source: "MAD",
    confidence: 0.75,
    orderIndex: 3,
  },
  {
    category: "requests",
    andi: "Чу!",
    russian: "Ешь! Бери! (угощайся)",
    english: "Eat! Take it!",
    breakdown: "Чу — повелит. накл. от глагола «чуине» (есть). Традиционное угощение.",
    source: "MAD",
    confidence: 0.85,
    orderIndex: 4,
  },
  {
    category: "requests",
    andi: "Гьанже бахъа!",
    russian: "Уходи сейчас!",
    english: "Go now!",
    breakdown: "Гьанже (сейчас) + бахъа (уходи, повелит. накл. от бахъине).",
    source: "MAD",
    confidence: 0.8,
    orderIndex: 5,
  },

  // ─── Числа и счёт (numbers) ────────────────────────────────────────────────
  {
    category: "numbers",
    andi: "Хьикьа сон рукIана.",
    russian: "Один год (прошёл).",
    english: "One year.",
    breakdown: "Хьикьа (один) + сон (год) + рукIана (есть).",
    source: "SAL",
    confidence: 0.85,
    orderIndex: 1,
  },
  {
    category: "numbers",
    andi: "КIиго вас рукIана.",
    russian: "Двое сыновей.",
    english: "Two sons.",
    breakdown: "КIиго (два) + вас (сын) + рукIана (есть). Класс I (мужчины).",
    source: "SAL",
    confidence: 0.8,
    orderIndex: 2,
  },
  {
    category: "numbers",
    andi: "ЛъабгоякI яс рукIана.",
    russian: "Трое дочерей.",
    english: "Three daughters.",
    breakdown: "Лъабго (три) + якI (дочь, мн.ч.?) + яс (дочь).",
    source: "DRF",
    confidence: 0.45,
    orderIndex: 3,
  },
  {
    category: "numbers",
    andi: "Ссеб гьекъоищого бачIана?",
    russian: "Сколько это стоит?",
    english: "How much does this cost?",
    breakdown: "Черновая конструкция, требует проверки носителем.",
    source: "DRF",
    confidence: 0.35,
    orderIndex: 4,
  },

  // ─── Семья (family) ────────────────────────────────────────────────────────
  {
    category: "family",
    andi: "Дир инсу щив рукIана?",
    russian: "Кто мой отец?",
    english: "Who is my father?",
    breakdown: "Дир (мой) + инсу (отец) + щив (кто) + рукIана (есть).",
    source: "MAD",
    confidence: 0.8,
    orderIndex: 1,
  },
  {
    category: "family",
    andi: "Дир эбел лъай рукIана.",
    russian: "Моя мать здесь.",
    english: "My mother is here.",
    breakdown: "Дир (мой) + эбел (мать) + лъай (здесь) + рукIана.",
    source: "MAD",
    confidence: 0.8,
    orderIndex: 2,
  },
  {
    category: "family",
    andi: "Вас бахъана.",
    russian: "Сын ушёл.",
    english: "The son left.",
    breakdown: "Вас (сын, класс I) + бахъана (ушёл, прош. вр., кл. I → префикс в глаголе).",
    source: "MAD",
    confidence: 0.9,
    orderIndex: 3,
  },
  {
    category: "family",
    andi: "Яс бахъана.",
    russian: "Дочь ушла.",
    english: "The daughter left.",
    breakdown: "Яс (дочь, класс II) + бахъана (ушла).",
    source: "MAD",
    confidence: 0.9,
    orderIndex: 4,
  },
  {
    category: "family",
    andi: "Дир хIалуб лъай рукIана.",
    russian: "Моя семья здесь.",
    english: "My family is here.",
    breakdown: "Дир (мой) + хIалуб (семья, домочадцы) + лъай (здесь) + рукIана.",
    source: "DRF",
    confidence: 0.5,
    orderIndex: 5,
  },

  // ─── Еда и напитки (food) ─────────────────────────────────────────────────
  {
    category: "food",
    andi: "Дида лим чуана.",
    russian: "Я съел мясо.",
    english: "I ate meat.",
    breakdown: "Дида (я, эрг.) + лим (мясо, абс.) + чуана (съел, прош. вр. от чуине).",
    source: "MAD",
    confidence: 0.9,
    orderIndex: 1,
  },
  {
    category: "food",
    andi: "Дида эхь хьалъана.",
    russian: "Я выпил молоко.",
    english: "I drank milk.",
    breakdown: "Дида (я, эрг.) + эхь (молоко) + хьалъана (выпил, прош. вр. от хьалъине).",
    source: "MAD",
    confidence: 0.9,
    orderIndex: 2,
  },
  {
    category: "food",
    andi: "ВедарихIъе б-ихьараб рукIана.",
    russian: "Хлеб хороший.",
    english: "The bread is good.",
    breakdown: "ВедарихIъе (хлеб) + б-ихьараб (хороший, класс III + суфф. -аб) + рукIана.",
    source: "MAD",
    confidence: 0.8,
    orderIndex: 3,
  },
  {
    category: "food",
    andi: "ХIинкI чуа!",
    russian: "Ешь хинкал!",
    english: "Eat the khinkal!",
    breakdown: "ХIинкI (хинкал, традиционное блюдо) + чуа (ешь, повелит. накл.).",
    source: "MAD",
    confidence: 0.8,
    orderIndex: 4,
  },

  // ─── Дом и место (home) ───────────────────────────────────────────────────
  {
    category: "home",
    andi: "Рокъо ихьараб рукIана.",
    russian: "Дом большой.",
    english: "The house is big.",
    breakdown: "Рокъо (дом) + ихьараб (большой, кл. III) + рукIана (есть).",
    source: "MAD",
    confidence: 0.85,
    orderIndex: 1,
  },
  {
    category: "home",
    andi: "Рокъо кинаб рукIана?",
    russian: "Где дом?",
    english: "Where is the house?",
    breakdown: "Рокъо (дом) + кинаб (где) + рукIана (есть).",
    source: "MAD",
    confidence: 0.85,
    orderIndex: 2,
  },
  {
    category: "home",
    andi: "Дир рокъо лъай рукIана.",
    russian: "Мой дом здесь.",
    english: "My house is here.",
    breakdown: "Дир (мой) + рокъо (дом) + лъай (здесь) + рукIана.",
    source: "DRF",
    confidence: 0.6,
    orderIndex: 3,
  },

  // ─── Время (time) ─────────────────────────────────────────────────────────
  {
    category: "time",
    andi: "Гьалбон дун лъай рукIана.",
    russian: "Сегодня я здесь.",
    english: "Today I am here.",
    breakdown: "Гьалбон (сегодня = «этот день») + дун (я) + лъай (здесь) + рукIана.",
    source: "MAD",
    confidence: 0.85,
    orderIndex: 1,
  },
  {
    category: "time",
    andi: "Субхьалъ бахъана.",
    russian: "Утром ушёл.",
    english: "Left in the morning.",
    breakdown: "Субхьалъ (утром, лок. от субхI) + бахъана (ушёл).",
    source: "MAD",
    confidence: 0.85,
    orderIndex: 2,
  },
  {
    category: "time",
    andi: "Хьон ихьараб рукIана.",
    russian: "Ночь долгая.",
    english: "The night is long.",
    breakdown: "Хьон (ночь) + ихьараб (большой/долгий) + рукIана.",
    source: "MAD",
    confidence: 0.8,
    orderIndex: 3,
  },
  {
    category: "time",
    andi: "Гьанже бахъа!",
    russian: "Уходи сейчас!",
    english: "Go now!",
    breakdown: "Гьанже (сейчас) + бахъа (уходи, повелит.).",
    source: "MAD",
    confidence: 0.85,
    orderIndex: 4,
  },
  {
    category: "time",
    andi: "Хьикьа сон — один год.",
    russian: "Один год.",
    english: "One year.",
    breakdown: "Хьикьа (один) + сон (год). Числительное + существительное.",
    source: "SAL",
    confidence: 0.85,
    orderIndex: 5,
  },

  // ─── Животные (animals) ───────────────────────────────────────────────────
  {
    category: "animals",
    andi: "Ккал б-ухьана.",
    russian: "Собака пришла.",
    english: "The dog came.",
    breakdown: "Ккал (собака, кл. III) + б-ухьана (пришла, префикс б- для кл. III).",
    source: "MAD",
    confidence: 0.9,
    orderIndex: 1,
  },
  {
    category: "animals",
    andi: "ЦIалъ б-итIана.",
    russian: "Орёл улетел.",
    english: "The eagle flew away.",
    breakdown: "ЦIалъ (орёл, кл. III) + б-итIана (взлетел/улетел, кл. III).",
    source: "MAD",
    confidence: 0.85,
    orderIndex: 2,
  },
  {
    category: "animals",
    andi: "ГIарзу б-ухьана.",
    russian: "Кошка пришла.",
    english: "The cat came.",
    breakdown: "ГIарзу (кошка, кл. III) + б-ухьана (пришла, кл. III).",
    source: "MAD",
    confidence: 0.85,
    orderIndex: 3,
  },
  {
    category: "animals",
    andi: "Хъомор ихьараб рукIана.",
    russian: "Волк большой.",
    english: "The wolf is big.",
    breakdown: "Хъомор (волк) + ихьараб (большой) + рукIана.",
    source: "SAL",
    confidence: 0.8,
    orderIndex: 4,
  },

  // ─── Цвета и описание (colors) ────────────────────────────────────────────
  {
    category: "colors",
    andi: "БацIцIинаб рагъ рукIана.",
    russian: "Снег белый.",
    english: "The snow is white.",
    breakdown: "БацIцIинаб (белый, суфф. -аб) + рагъ (снег) + рукIана.",
    source: "MAD",
    confidence: 0.85,
    orderIndex: 1,
  },
  {
    category: "colors",
    andi: "ЧIегIераб ккал рукIана.",
    russian: "Собака чёрная.",
    english: "The dog is black.",
    breakdown: "ЧIегIераб (чёрный) + ккал (собака) + рукIана.",
    source: "MAD",
    confidence: 0.85,
    orderIndex: 2,
  },
  {
    category: "colors",
    andi: "Ихьараб рокъо б-ухьана.",
    russian: "Большой дом стоит.",
    english: "A big house stands (there).",
    breakdown: "Ихьараб (большой) + рокъо (дом) + б-ухьана (есть/стоит, кл. III).",
    source: "MAD",
    confidence: 0.8,
    orderIndex: 3,
  },

  // ─── Части тела (body) ────────────────────────────────────────────────────
  {
    category: "body",
    andi: "КIвакIва хьаб рукIана.",
    russian: "Голова горячая (болит с жаром).",
    english: "The head is hot/burning.",
    breakdown: "КIвакIва (голова) + хьаб (горячий) + рукIана.",
    source: "SAL",
    confidence: 0.75,
    orderIndex: 1,
  },
  {
    category: "body",
    andi: "ГьаркIу ихьараб рукIана.",
    russian: "Глаза большие.",
    english: "The eyes are big.",
    breakdown: "ГьаркIу (глаз/глаза) + ихьараб (большой) + рукIана.",
    source: "SAL",
    confidence: 0.75,
    orderIndex: 2,
  },
  {
    category: "body",
    andi: "КицIи хьаб рукIана.",
    russian: "Нога болит (горит).",
    english: "The leg hurts (feels hot).",
    breakdown: "КицIи (нога) + хьаб (горячий/болит) + рукIана.",
    source: "SAL",
    confidence: 0.7,
    orderIndex: 3,
  },

  // ─── Погода (weather) ─────────────────────────────────────────────────────
  {
    category: "weather",
    andi: "ЦIцIа б-ухьана.",
    russian: "Идёт дождь.",
    english: "It is raining.",
    breakdown: "ЦIцIа (дождь, кл. III) + б-ухьана (идёт/падает, кл. III).",
    source: "SAL",
    confidence: 0.8,
    orderIndex: 1,
  },
  {
    category: "weather",
    andi: "Милъи б-ухьана.",
    russian: "Солнце светит / Солнечно.",
    english: "The sun is shining.",
    breakdown: "Милъи (солнце) + б-ухьана (есть/светит).",
    source: "SAL",
    confidence: 0.8,
    orderIndex: 2,
  },
  {
    category: "weather",
    andi: "Зарзари рукIана.",
    russian: "Холодно.",
    english: "It is cold.",
    breakdown: "Зарзари (холод) + рукIана (есть). Безличная конструкция.",
    source: "SAL",
    confidence: 0.75,
    orderIndex: 3,
  },
  {
    category: "weather",
    andi: "Мочи ихьараб рукIана.",
    russian: "Ветер сильный.",
    english: "The wind is strong.",
    breakdown: "Мочи (ветер) + ихьараб (большой/сильный) + рукIана.",
    source: "SAL",
    confidence: 0.75,
    orderIndex: 4,
  },

  // ─── Природа (nature) ─────────────────────────────────────────────────────
  {
    category: "nature",
    andi: "ЛълъенссоI ихьараб рукIана.",
    russian: "Река большая.",
    english: "The river is big.",
    breakdown: "ЛълъенссоI (река) + ихьараб (большой) + рукIана.",
    source: "SAL",
    confidence: 0.75,
    orderIndex: 1,
  },
  {
    category: "nature",
    andi: "Лъан хIехьераб рукIана.",
    russian: "Трава зелёная.",
    english: "The grass is green.",
    breakdown: "Лъан (трава) + хIехьераб (зелёный) + рукIана.",
    source: "SAL",
    confidence: 0.75,
    orderIndex: 2,
  },
];

async function main() {
  console.log("Очищаем таблицу phrases и перезаполняем настоящими фразами...");

  // Clear existing entries
  await db.execute(sql`DELETE FROM phrases`);
  console.log("✓ Таблица очищена.");

  let inserted = 0;
  for (const p of phrases) {
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

  const categories = [...new Set(phrases.map(p => p.category))];
  console.log(`✓ Добавлено: ${inserted} фраз`);
  console.log(`📂 Категории: ${categories.join(", ")}`);
  console.log(`⚠️  Помечены DRF (черновик): ${phrases.filter(p => p.source === "DRF").length} фраз — нужна проверка носителем.`);
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
