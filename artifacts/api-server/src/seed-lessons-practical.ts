/**
 * Практические уроки 16–22 — ориентированы на реальное использование языка,
 * а не только на грамматику. Каждый урок: объяснение + фразы + задания + мини-тест.
 * Запускать после seed-lessons.ts, seed-lessons-part2.ts и seed-phrasebank.ts
 */
import { db, lessonsTable, exercisesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const NOTE = `<p class="lesson-source"><em>Практический урок. Фразы взяты из фразника приложения — вкладка «Фразы». Часть конструкций — черновые и требуют проверки носителем языка (отмечено в фразнике).</em></p>`;

const PRACTICAL_LESSONS = [
  {
    title: "Как поздороваться",
    description: "Практический мини-курс: приветствие, прощание, вопрос «как дела».",
    level: "practical",
    orderIndex: 16,
    content: `<div>
<p class="lesson-intro">Цель урока — уметь поздороваться, спросить «как дела» и попрощаться в реальном разговоре.</p>
${NOTE}
<h2>Фразы</h2>
<ul>
<li><strong>Марщалла!</strong> — Привет!</li>
<li><strong>Рагьу рукIана?</strong> — Как дела?</li>
<li><strong>Хъвараб!</strong> — Хорошо!</li>
<li><strong>Шукру!</strong> — Спасибо!</li>
<li><strong>Хайр хилла!</strong> — До свидания!</li>
</ul>
<h2>Повторение</h2>
<p>Попробуйте вслух проговорить диалог: поздороваться → спросить как дела → ответить → поблагодарить → попрощаться.</p>
</div>`,
    exercises: [
      { type: "multiple_choice", prompt: "Как поздороваться на андийском?", options: ["Хайр хилла!", "Марщалла!", "Шукру!", "Мица?"], answer: "Марщалла!", explanation: "«Марщалла!» — общее приветствие." },
      { type: "multiple_choice", prompt: "Как спросить «как дела»?", options: ["Щиб?", "Рагьу рукIана?", "Мица?", "Вищ?"], answer: "Рагьу рукIана?", explanation: "Буквально «как (ты) есть» — стандартный вопрос о делах." },
      { type: "translation", prompt: "Переведите: «Хъвараб! Шукру!»", options: null, answer: "Хорошо! Спасибо!", explanation: "Стандартный ответ на вопрос о делах с благодарностью." },
      { type: "multiple_choice", prompt: "Как попрощаться?", options: ["Марщалла!", "Хайр хилла!", "ХIалбихьа!", "Рагьу рукIана?"], answer: "Хайр хилла!", explanation: "«До свидания!»" },
      { type: "fill_blank", prompt: "___! Рагьу рукIана? (Привет! Как дела?)", options: null, answer: "Марщалла", explanation: "Пропущено приветствие." },
    ],
  },
  {
    title: "Как спросить имя",
    description: "Практический мини-курс: представиться и спросить, как зовут собеседника.",
    level: "practical",
    orderIndex: 17,
    content: `<div>
<p class="lesson-intro">Цель урока — уметь представиться и спросить имя собеседника.</p>
${NOTE}
<h2>Фразы</h2>
<ul>
<li><strong>Дун ... рукIана.</strong> — Меня зовут ... (букв. «Я — ...»)</li>
<li><strong>Мун щиб рукIана?</strong> — Как тебя зовут?</li>
<li><strong>Дун Дагъустаналъ рукIана.</strong> — Я из Дагестана.</li>
</ul>
<h2>Диалог</h2>
<p><strong>А:</strong> Марщалла! Мун щиб рукIана?</p>
<p><strong>Б:</strong> Дун Ахмад рукIана. Мун?</p>
<p><strong>А:</strong> Дун Марьям рукIана.</p>
</div>`,
    exercises: [
      { type: "multiple_choice", prompt: "Как спросить «как тебя зовут?»", options: ["Мун щиб рукIана?", "Мица гье?", "Щиб бе?", "Вищ мун?"], answer: "Мун щиб рукIана?", explanation: "Буквально «ты что есть» — вопрос об имени." },
      { type: "translation", prompt: "Переведите: «Дун Марьям рукIана.»", options: null, answer: "Меня зовут Марьям.", explanation: "Буквально «я — Марьям (есть)»." },
      { type: "fill_blank", prompt: "Дун ... рукIана. (Меня зовут ...) — впишите слово «я» на андийском.", options: null, answer: "Дун", explanation: "«Дун» — «я»." },
      { type: "multiple_choice", prompt: "Что значит «Дун Дагъустаналъ рукIана»?", options: ["Меня зовут Дагестан", "Я из Дагестана", "Дагестан — моя семья", "Я живу в доме"], answer: "Я из Дагестана", explanation: "Аблатив «-налъ» указывает на происхождение «откуда»." },
    ],
  },
  {
    title: "Как сказать, что тебе нужно",
    description: "Практический мини-курс: базовые просьбы и выражение потребности (черновые конструкции — нужна проверка носителем).",
    level: "practical",
    orderIndex: 18,
    content: `<div>
<p class="lesson-intro">Внимание: в этом уроке конструкции просьб — черновые (составлены по грамматическим моделям, ещё не подтверждены носителем языка). Используйте с осторожностью и проверяйте у носителя перед реальным применением.</p>
${NOTE}
<h2>Черновые фразы</h2>
<ul>
<li><strong>Дица ккола ...</strong> — Мне нужно ... <em>(черновик)</em></li>
<li><strong>ХIалт бихьа.</strong> — Помоги, пожалуйста. <em>(черновик)</em></li>
<li><strong>Дица гьалъи гьекъуна.</strong> — Я хочу воды. <em>(черновик)</em></li>
</ul>
<h2>Что уже надёжно</h2>
<p>Отдельные слова из словаря надёжны (например «гьалъи» — вода, подтверждено словарём Салимова), но сборка их в грамматически верное предложение (падежи, согласование по классу, порядок слов) требует проверки носителем.</p>
</div>`,
    exercises: [
      { type: "multiple_choice", prompt: "Какое слово означает «вода» (надёжно подтверждено словарём)?", options: ["рокъо", "гьалъи", "инсу", "хьикьа"], answer: "гьалъи", explanation: "«Гьалъи» — вода, подтверждено словарём Салимова 2010." },
      { type: "multiple_choice", prompt: "Черновая фраза «Дица ккола ...» переводится как:", options: ["Спасибо тебе", "Мне нужно ...", "Где ты?", "Это мой дом"], answer: "Мне нужно ...", explanation: "Черновая конструкция, требует проверки носителем." },
      { type: "translation", prompt: "Переведите (учитывая, что это черновик): «ХIалт бихьа.»", options: null, answer: "Помоги, пожалуйста.", explanation: "Требует проверки точной глагольной формы у носителя." },
    ],
  },
  {
    title: "Как считать",
    description: "Практический мини-курс: числа от одного до трёх и вопрос о количестве.",
    level: "practical",
    orderIndex: 19,
    content: `<div>
<p class="lesson-intro">Цель урока — знать базовые числительные, подтверждённые словарём.</p>
${NOTE}
<h2>Числа (надёжно, из словаря)</h2>
<ul>
<li><strong>хьикьа</strong> — один</li>
<li><strong>кIиго</strong> — два</li>
<li><strong>лъабго</strong> — три</li>
</ul>
<h2>Черновой вопрос</h2>
<p><strong>Ссеб гьекъоищого бачIана?</strong> — Сколько это стоит? <em>(черновик, требует проверки)</em></p>
</div>`,
    exercises: [
      { type: "multiple_choice", prompt: "Как будет «два» на андийском?", options: ["хьикьа", "кIиго", "лъабго", "рокъо"], answer: "кIиго", explanation: "«КIиго» — два." },
      { type: "multiple_choice", prompt: "Как будет «один»?", options: ["хьикьа", "кIиго", "лъабго", "инсу"], answer: "хьикьа", explanation: "«Хьикьа» — один." },
      { type: "fill_blank", prompt: "Впишите андийское слово для «три»:", options: null, answer: "лъабго", explanation: "«Лъабго» — три." },
    ],
  },
  {
    title: "Как описать дом и семью",
    description: "Практический мини-курс: базовая лексика семьи и жилища.",
    level: "practical",
    orderIndex: 20,
    content: `<div>
<p class="lesson-intro">Цель урока — называть членов семьи и говорить о доме простыми фразами.</p>
${NOTE}
<h2>Слова (надёжно, из словаря)</h2>
<ul>
<li><strong>инсу</strong> — отец</li>
<li><strong>эбел</strong> — мать</li>
<li><strong>рокъо</strong> — дом</li>
</ul>
<h2>Черновые фразы</h2>
<ul>
<li><strong>Дир хIалуб рукIа.</strong> — Это моя семья. <em>(черновик)</em></li>
<li><strong>Дир рокъо мицIаб бе.</strong> — Мой дом здесь. <em>(черновик)</em></li>
</ul>
</div>`,
    exercises: [
      { type: "multiple_choice", prompt: "Как будет «мать»?", options: ["инсу", "эбел", "рокъо", "щиб"], answer: "эбел", explanation: "«Эбел» — мать." },
      { type: "multiple_choice", prompt: "Как будет «отец»?", options: ["инсу", "эбел", "рокъо", "вищ"], answer: "инсу", explanation: "«Инсу» — отец." },
      { type: "translation", prompt: "Переведите (черновик): «Дир рокъо мицIаб бе.»", options: null, answer: "Мой дом здесь.", explanation: "Черновая конструкция, требует проверки носителем." },
    ],
  },
  {
    title: "Как задать вопрос",
    description: "Практический мини-курс: вопросительные слова что, кто, где.",
    level: "practical",
    orderIndex: 21,
    content: `<div>
<p class="lesson-intro">Цель урока — уметь задавать простые вопросы с помощью вопросительных слов.</p>
${NOTE}
<h2>Вопросительные слова (надёжно, из словаря)</h2>
<ul>
<li><strong>щиб</strong> — что</li>
<li><strong>вищ</strong> — кто</li>
<li><strong>мица</strong> — где</li>
</ul>
<h2>Черновой пример</h2>
<p><strong>Мун мица гье?</strong> — Где ты? <em>(черновик, требует проверки)</em></p>
</div>`,
    exercises: [
      { type: "multiple_choice", prompt: "Как будет «что»?", options: ["щиб", "вищ", "мица", "гье"], answer: "щиб", explanation: "«Щиб» — что." },
      { type: "multiple_choice", prompt: "Как будет «где»?", options: ["щиб", "вищ", "мица", "рагьу"], answer: "мица", explanation: "«Мица» — где." },
      { type: "multiple_choice", prompt: "Как будет «кто»?", options: ["щиб", "вищ", "мица", "гье"], answer: "вищ", explanation: "«Вищ» — кто." },
    ],
  },
  {
    title: "Как сказать время",
    description: "Практический мини-курс: слово «сегодня» и вопрос о времени.",
    level: "practical",
    orderIndex: 22,
    content: `<div>
<p class="lesson-intro">Цель урока — уметь сказать «сегодня» и спросить, который час (черновая конструкция).</p>
${NOTE}
<h2>Слово (надёжно, из словаря)</h2>
<p><strong>гьалбон</strong> — сегодня</p>
<h2>Черновой вопрос</h2>
<p><strong>Гьануб заман щиб бе?</strong> — Сколько сейчас времени? <em>(черновик, требует проверки)</em></p>
</div>`,
    exercises: [
      { type: "multiple_choice", prompt: "Как будет «сегодня»?", options: ["гьалбон", "рокъо", "щиб", "хьикьа"], answer: "гьалбон", explanation: "«Гьалбон» — сегодня, подтверждено словарём." },
      { type: "translation", prompt: "Переведите (черновик): «Гьануб заман щиб бе?»", options: null, answer: "Сколько сейчас времени?", explanation: "Черновая конструкция, требует проверки носителем." },
    ],
  },
];

async function main() {
  console.log("Добавляю практические уроки 16–22...");
  let created = 0;
  let updated = 0;
  let exercisesCreated = 0;

  for (const lessonDef of PRACTICAL_LESSONS) {
    const { exercises, ...lessonFields } = lessonDef;
    const [existing] = await db.select().from(lessonsTable).where(eq(lessonsTable.title, lessonFields.title));

    let lessonId: number;
    if (existing) {
      await db.update(lessonsTable).set(lessonFields).where(eq(lessonsTable.id, existing.id));
      lessonId = existing.id;
      updated++;
    } else {
      const [created_] = await db.insert(lessonsTable).values(lessonFields).returning();
      lessonId = created_.id;
      created++;
    }

    await db.delete(exercisesTable).where(eq(exercisesTable.lessonId, lessonId));
    for (const ex of exercises) {
      await db.insert(exercisesTable).values({
        lessonId,
        type: ex.type,
        prompt: ex.prompt,
        options: ex.options ? JSON.stringify(ex.options) : null,
        answer: ex.answer,
        explanation: ex.explanation,
      });
      exercisesCreated++;
    }
    console.log(`  ✓ Урок ${lessonFields.orderIndex}: «${lessonFields.title}» (${exercises.length} заданий)`);
  }

  console.log(`\nГотово: создано ${created}, обновлено ${updated} уроков, ${exercisesCreated} заданий.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
