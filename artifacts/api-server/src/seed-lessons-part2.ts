/**
 * Уроки 9–15 — расширение учебного курса андийского языка
 * Запускать после seed-lessons.ts (уроки 1–8)
 */
import { db, lessonsTable, exercisesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const SAL = "Салимов Х.А. Андийско-русский словарь, 2010";
const MAD = "Мадиева Г.И. Морфология андийского языка, 1980";

const LESSONS_PART2 = [
  {
    title: "Еда и напитки",
    description: "Слова про еду, напитки и традиционные андийские блюда.",
    level: "beginner",
    orderIndex: 9,
    content: `<div>
<p class="lesson-intro">Андийская кухня — часть богатой горской традиции. В этом уроке изучим слова для основных продуктов питания и напитков.</p>
<p class="lesson-source"><em>Источник: Салимов Х.А. Андийско-русский словарь. — Махачкала, 2010.</em></p>

<h2>Продукты питания</h2>
<table>
<thead><tr><th>Андийский</th><th>IPA</th><th>Русский</th><th>Примечание</th></tr></thead>
<tbody>
<tr><td><strong>ведарихъе</strong></td><td>/wedariqˀe/</td><td>хлеб</td><td>класс III</td></tr>
<tr><td><strong>лим</strong></td><td>/lim/</td><td>мясо</td><td>класс IV</td></tr>
<tr><td><strong>эхь</strong></td><td>/eħ/</td><td>молоко</td><td>класс III</td></tr>
<tr><td><strong>зозо</strong></td><td>/zozo/</td><td>соль</td><td>класс III</td></tr>
<tr><td><strong>нехь</strong></td><td>/neħ/</td><td>масло (сливочное)</td><td>класс III</td></tr>
<tr><td><strong>куркI</strong></td><td>/kurkˀ/</td><td>яйцо</td><td>класс IV</td></tr>
<tr><td><strong>мачI</strong></td><td>/matʃˀ/</td><td>мёд</td><td>класс IV</td></tr>
<tr><td><strong>шун</strong></td><td>/ʃun/</td><td>лук репчатый</td><td>класс IV</td></tr>
<tr><td><strong>тIахь</strong></td><td>/tˀaħ/</td><td>яблоко</td><td>класс IV</td></tr>
<tr><td><strong>хIинкI</strong></td><td>/ħinkˀ/</td><td>хинкал</td><td>традиционное блюдо</td></tr>
</tbody>
</table>

<h2>Напитки</h2>
<table>
<thead><tr><th>Андийский</th><th>IPA</th><th>Русский</th></tr></thead>
<tbody>
<tr><td><strong>гьалъи</strong></td><td>/ɣaɬi/</td><td>вода</td></tr>
<tr><td><strong>чей</strong></td><td>/tʃej/</td><td>чай</td></tr>
<tr><td><strong>эхь</strong></td><td>/eħ/</td><td>молоко</td></tr>
</tbody>
</table>

<h2>Глаголы еды</h2>
<ul>
<li><strong>чуине</strong> /tʃuine/ — есть, кушать</li>
<li><strong>хьалъине</strong> /χaɬine/ — пить</li>
</ul>

<h2>Примеры предложений</h2>
<ul>
<li><strong>Дида лим чуана.</strong> — Я съел мясо.</li>
<li><strong>Дида эхь хьалъана.</strong> — Я выпил молоко.</li>
<li><strong>ВедарихIъе б-ихьа.</strong> — Хлеб хороший.</li>
<li><strong>Зозо б-ухьана.</strong> — Соль закончилась.</li>
</ul>

<h2>Традиционное угощение</h2>
<p>Главное блюдо андийской кухни — <strong>хIинкI</strong> (хинкал). Это варёные кусочки теста с мясом и соусом. При угощении говорят:</p>
<p><strong>— Чу! (Бери! Кушай!)</strong></p>
</div>`,
    exercises: [
      {
        type: "multiple_choice",
        prompt: "Как по-андийски «молоко»?",
        options: ["гьалъи", "нехь", "эхь", "чей"],
        answer: "эхь",
        explanation: "«Эхь» /eħ/ — молоко. Фарингальный звук «хь» — важная черта андийского."
      },
      {
        type: "multiple_choice",
        prompt: "Что означает «лим»?",
        options: ["молоко", "мясо", "хлеб", "соль"],
        answer: "мясо",
        explanation: "«Лим» /lim/ — мясо. Простое слово, класс IV."
      },
      {
        type: "multiple_choice",
        prompt: "Как сказать «Я съел мясо» по-андийски?",
        options: ["Дун лим чуина.", "Дида лим чуана.", "Мун лим чуана.", "Дида эхь хьалъана."],
        answer: "Дида лим чуана.",
        explanation: "«Чуине» — переходный глагол «есть». Подлежащее в эргативе: «дида» (я). Объект: «лим» (мясо)."
      },
      {
        type: "multiple_choice",
        prompt: "Что такое «хIинкI»?",
        options: ["Напиток", "Приправа", "Традиционное блюдо (хинкал)", "Вид хлеба"],
        answer: "Традиционное блюдо (хинкал)",
        explanation: "«ХIинкI» — хинкал, главное традиционное блюдо андийской кухни."
      },
      {
        type: "multiple_choice",
        prompt: "Как по-андийски «мёд»?",
        options: ["зозо", "мачI", "тIахь", "нехь"],
        answer: "мачI",
        explanation: "«МачI» /matʃˀ/ — мёд. Абруптивный «чI»."
      },
      {
        type: "translation",
        prompt: "Переведите: «Дида эхь хьалъана»",
        options: null,
        answer: "Я выпил молоко.",
        explanation: "«Дида» — я (эрг.), «эхь» — молоко, «хьалъана» — выпил (прош. вр. глагола «пить»)."
      },
      {
        type: "multiple_choice",
        prompt: "Какой глагол означает «пить» в андийском?",
        options: ["чуине", "бахъине", "хьалъине", "рукIине"],
        answer: "хьалъине",
        explanation: "«Хьалъине» /χaɬine/ — пить. Примечательно: он же омоним «говорить», контекст различает."
      },
    ]
  },
  {
    title: "Части тела",
    description: "Как называются части тела на андийском языке.",
    level: "beginner",
    orderIndex: 10,
    content: `<div>
<p class="lesson-intro">Знание частей тела поможет вам описать себя, поговорить о здоровье и понять тексты про человека.</p>
<p class="lesson-source"><em>Источник: Салимов Х.А. Андийско-русский словарь, 2010.</em></p>

<h2>Части тела</h2>
<table>
<thead><tr><th>Андийский</th><th>IPA</th><th>Русский</th><th>Класс</th></tr></thead>
<tbody>
<tr><td><strong>чIин</strong></td><td>/tʃˀin/</td><td>голова</td><td>IV (р-)</td></tr>
<tr><td><strong>мугъ</strong></td><td>/muʁ/</td><td>глаз</td><td>III (б-)</td></tr>
<tr><td><strong>гъат</strong></td><td>/ʁat/</td><td>ухо</td><td>IV (р-)</td></tr>
<tr><td><strong>гьат</strong></td><td>/hat/</td><td>рот</td><td>IV (р-)</td></tr>
<tr><td><strong>мачIа</strong></td><td>/matʃˀa/</td><td>нос</td><td>IV (р-)</td></tr>
<tr><td><strong>бетI</strong></td><td>/betˀ/</td><td>лицо</td><td>III (б-)</td></tr>
<tr><td><strong>бекьер</strong></td><td>/beqˀer/</td><td>волосы</td><td>IV (р-)</td></tr>
<tr><td><strong>риша</strong></td><td>/riʃa/</td><td>шея</td><td>IV (р-)</td></tr>
<tr><td><strong>хъибил</strong></td><td>/qˀibil/</td><td>рука</td><td>III (б-)</td></tr>
<tr><td><strong>кьур</strong></td><td>/qˀur/</td><td>нога</td><td>IV (р-)</td></tr>
<tr><td><strong>рекIел</strong></td><td>/rekˀel/</td><td>сердце</td><td>IV (р-)</td></tr>
<tr><td><strong>кIут</strong></td><td>/kˀut/</td><td>живот</td><td>IV (р-)</td></tr>
</tbody>
</table>

<h2>Обратите внимание на классы</h2>
<p>Части тела имеют разные именные классы. Это важно для согласования глаголов и прилагательных:</p>
<ul>
<li><strong>мугъ б-ихьа</strong> — большой глаз (класс III)</li>
<li><strong>чIин р-ихьа</strong> — большая голова (класс IV)</li>
<li><strong>хъибил б-ихьа</strong> — большая рука (класс III)</li>
</ul>

<h2>Примеры</h2>
<ul>
<li><strong>Чиналъ рукIана.</strong> — На голове (что-то есть).</li>
<li><strong>МугълъгIан гьалъи б-ана.</strong> — Из глаза потекла слеза.</li>
<li><strong>ХъибилгIан лим чуана.</strong> — Рукой взял мясо.</li>
</ul>
</div>`,
    exercises: [
      {
        type: "multiple_choice",
        prompt: "Как по-андийски «голова»?",
        options: ["мугъ", "гьат", "чIин", "риша"],
        answer: "чIин",
        explanation: "«ЧIин» /tʃˀin/ — голова. Класс IV (р-)."
      },
      {
        type: "multiple_choice",
        prompt: "Что означает «мугъ»?",
        options: ["ухо", "рот", "нос", "глаз"],
        answer: "глаз",
        explanation: "«Мугъ» /muʁ/ — глаз. Класс III. Звук «гъ» = /ʁ/ — увулярный фрикативный."
      },
      {
        type: "multiple_choice",
        prompt: "Что означает «кьур»?",
        options: ["рука", "нога", "шея", "живот"],
        answer: "нога",
        explanation: "«Кьур» /qˀur/ — нога. Класс IV (р-)."
      },
      {
        type: "multiple_choice",
        prompt: "Как по-андийски «рука»?",
        options: ["хъибил", "кьур", "чIин", "рекIел"],
        answer: "хъибил",
        explanation: "«Хъибил» /qˀibil/ — рука. Класс III (б-)."
      },
      {
        type: "multiple_choice",
        prompt: "Как согласуется прилагательное «большой» с «мугъ» (глаз, класс III)?",
        options: ["мугъ в-ихьа", "мугъ б-ихьа", "мугъ р-ихьа", "мугъ й-ихьа"],
        answer: "мугъ б-ихьа",
        explanation: "«Мугъ» — класс III, префикс «б-». Поэтому «большой глаз» = «мугъ б-ихьа»."
      },
      {
        type: "translation",
        prompt: "Переведите: «рекIел»",
        options: null,
        answer: "сердце",
        explanation: "«РекIел» /rekˀel/ — сердце. Абруптивный «кI»."
      },
      {
        type: "multiple_choice",
        prompt: "Что означает «бетI»?",
        options: ["голова", "лицо", "шея", "рот"],
        answer: "лицо",
        explanation: "«БетI» /betˀ/ — лицо. Класс III (б-). Абруптивный «тI»."
      },
    ]
  },
  {
    title: "Дом и быт",
    description: "Части дома, предметы быта и слова для описания жилища.",
    level: "beginner",
    orderIndex: 11,
    content: `<div>
<p class="lesson-intro">В горах Дагестана традиционный дом — это каменное строение с плоской крышей. Изучим слова, связанные с домом и бытом.</p>
<p class="lesson-source"><em>Источник: Салимов Х.А. Андийско-русский словарь, 2010.</em></p>

<h2>Части дома</h2>
<table>
<thead><tr><th>Андийский</th><th>IPA</th><th>Русский</th><th>Класс</th></tr></thead>
<tbody>
<tr><td><strong>рокъо</strong></td><td>/roqo/</td><td>дом</td><td>IV (р-)</td></tr>
<tr><td><strong>цIа</strong></td><td>/tsˀa/</td><td>дверь</td><td>IV (р-)</td></tr>
<tr><td><strong>чIетI</strong></td><td>/tʃˀetˀ/</td><td>окно</td><td>IV (р-)</td></tr>
<tr><td><strong>гьаба</strong></td><td>/haba/</td><td>стена</td><td>IV (р-)</td></tr>
<tr><td><strong>кIатI</strong></td><td>/kˀatˀ/</td><td>крыша</td><td>IV (р-)</td></tr>
<tr><td><strong>лъел</strong></td><td>/ɬel/</td><td>постель, кровать</td><td>IV (р-)</td></tr>
<tr><td><strong>лъим</strong></td><td>/ɬim/</td><td>котёл</td><td>IV (р-)</td></tr>
<tr><td><strong>хIура</strong></td><td>/ħura/</td><td>кувшин, сосуд</td><td>IV (р-)</td></tr>
</tbody>
</table>

<h2>Предлоги места в андийском</h2>
<p>В андийском нет предлогов — вместо них используются <strong>послелоги</strong> и падежные суффиксы:</p>
<table>
<thead><tr><th>Суффикс</th><th>Значение</th><th>Пример</th></tr></thead>
<tbody>
<tr><td><strong>-лъ (-алъ)</strong></td><td>в, внутри</td><td>рокъолъ — в доме</td></tr>
<tr><td><strong>-да</strong></td><td>на</td><td>кIатIда — на крыше</td></tr>
<tr><td><strong>-гIан</strong></td><td>из, от</td><td>рокъогIан — из дома</td></tr>
</tbody>
</table>

<h2>Примеры предложений</h2>
<ul>
<li><strong>Дун рокъолъ рукIана.</strong> — Я нахожусь в доме.</li>
<li><strong>ЦIа р-ихьана.</strong> — Дверь открылась.</li>
<li><strong>Дун рокъогIан бахъана.</strong> — Я вышел из дома.</li>
<li><strong>КIатIда рагъ р-ихьана.</strong> — На крыше снег.</li>
</ul>
</div>`,
    exercises: [
      {
        type: "multiple_choice",
        prompt: "Как по-андийски «дверь»?",
        options: ["рокъо", "цIа", "чIетI", "гьаба"],
        answer: "цIа",
        explanation: "«ЦIа» /tsˀa/ — дверь. Абруптивный «цI»."
      },
      {
        type: "multiple_choice",
        prompt: "Как сказать «в доме» по-андийски?",
        options: ["рокъогIан", "рокъода", "рокъолъ", "рокъо"],
        answer: "рокъолъ",
        explanation: "Суффикс «-лъ» обозначает нахождение внутри. «Рокъо-лъ» = «в доме»."
      },
      {
        type: "multiple_choice",
        prompt: "Что означает «кIатI»?",
        options: ["дверь", "окно", "стена", "крыша"],
        answer: "крыша",
        explanation: "«КIатI» /kˀatˀ/ — крыша. Оба согласных абруптивные (кI, тI)."
      },
      {
        type: "multiple_choice",
        prompt: "Как перевести «Дун рокъогIан бахъана»?",
        options: ["Я вошёл в дом.", "Я нахожусь в доме.", "Я вышел из дома.", "Дом хороший."],
        answer: "Я вышел из дома.",
        explanation: "«-гIан» — суффикс исходного падежа (из, откуда). «рокъо-гIан» = из дома. «Бахъана» — ушёл."
      },
      {
        type: "multiple_choice",
        prompt: "Что такое послелог в андийском?",
        options: [
          "Приставка, стоящая перед словом",
          "Элемент, стоящий после слова (как предлог в русском, но после существительного)",
          "Частица отрицания",
          "Суффикс прилагательного"
        ],
        answer: "Элемент, стоящий после слова (как предлог в русском, но после существительного)",
        explanation: "В андийском нет предлогов. Вместо них — послелоги и падежные суффиксы, стоящие после имени."
      },
      {
        type: "multiple_choice",
        prompt: "Как по-андийски «окно»?",
        options: ["гьаба", "лъел", "чIетI", "цIа"],
        answer: "чIетI",
        explanation: "«ЧIетI» /tʃˀetˀ/ — окно. Оба согласных абруптивные."
      },
      {
        type: "translation",
        prompt: "Переведите: «Дун рокъолъ рукIана»",
        options: null,
        answer: "Я нахожусь в доме.",
        explanation: "«рокъо-лъ» = в доме, «рукIана» = нахожусь/есть."
      },
    ]
  },
  {
    title: "Животные",
    description: "Домашние и дикие животные андийского горного края.",
    level: "beginner",
    orderIndex: 12,
    content: `<div>
<p class="lesson-intro">В горах Дагестана важную роль играло скотоводство. Андийцы разводили овец, коз, коров. Изучим названия животных.</p>
<p class="lesson-source"><em>Источник: Салимов Х.А. Андийско-русский словарь, 2010.</em></p>

<h2>Домашние животные</h2>
<table>
<thead><tr><th>Андийский</th><th>IPA</th><th>Русский</th><th>Класс</th></tr></thead>
<tbody>
<tr><td><strong>ккал</strong></td><td>/kkal/</td><td>собака</td><td>III (б-)</td></tr>
<tr><td><strong>гIарзу</strong></td><td>/ʕarzu/</td><td>кошка</td><td>III (б-)</td></tr>
<tr><td><strong>чу</strong></td><td>/tʃu/</td><td>лошадь</td><td>III (б-)</td></tr>
<tr><td><strong>отIу</strong></td><td>/otˀu/</td><td>овца</td><td>III (б-)</td></tr>
<tr><td><strong>зи</strong></td><td>/zi/</td><td>коза</td><td>III (б-)</td></tr>
<tr><td><strong>бечI</strong></td><td>/betʃˀ/</td><td>бык, вол</td><td>III (б-)</td></tr>
<tr><td><strong>хIа</strong></td><td>/ħa/</td><td>курица</td><td>III (б-)</td></tr>
</tbody>
</table>

<h2>Дикие животные</h2>
<table>
<thead><tr><th>Андийский</th><th>IPA</th><th>Русский</th><th>Класс</th></tr></thead>
<tbody>
<tr><td><strong>бере</strong></td><td>/bere/</td><td>волк</td><td>III (б-)</td></tr>
<tr><td><strong>ццин</strong></td><td>/tsin/</td><td>медведь</td><td>III (б-)</td></tr>
<tr><td><strong>цIалъ</strong></td><td>/tsˀaɬ/</td><td>орёл</td><td>III (б-)</td></tr>
<tr><td><strong>чIочI</strong></td><td>/tʃˀotʃˀ/</td><td>рыба</td><td>III (б-)</td></tr>
<tr><td><strong>гIала</strong></td><td>/ʕala/</td><td>змея</td><td>III (б-)</td></tr>
<tr><td><strong>хъур</strong></td><td>/qˀur/</td><td>птица</td><td>III (б-)</td></tr>
</tbody>
</table>

<h2>Важно!</h2>
<p>Все животные в андийском относятся к <strong>классу III</strong> с глагольным префиксом <strong>б-</strong>. Это отличает их от людей (классы I и II).</p>

<h2>Примеры</h2>
<ul>
<li><strong>Ккал б-ихьана.</strong> — Собака пришла.</li>
<li><strong>Бере б-ихьана.</strong> — Волк пришёл.</li>
<li><strong>ЦIалъ б-итIана.</strong> — Орёл улетел.</li>
<li><strong>ОтIу б-ухьана.</strong> — Овца пропала.</li>
</ul>
</div>`,
    exercises: [
      {
        type: "multiple_choice",
        prompt: "Как по-андийски «собака»?",
        options: ["гIарзу", "ккал", "бере", "чу"],
        answer: "ккал",
        explanation: "«Ккал» /kkal/ — собака. Необычное двойное «к» в начале слова."
      },
      {
        type: "multiple_choice",
        prompt: "Что означает «бере»?",
        options: ["медведь", "собака", "кошка", "волк"],
        answer: "волк",
        explanation: "«Бере» /bere/ — волк. Важное слово для горной местности."
      },
      {
        type: "multiple_choice",
        prompt: "К какому классу относятся животные в андийском?",
        options: ["Класс I", "Класс II", "Класс III", "Класс IV"],
        answer: "Класс III",
        explanation: "Все животные в андийском — класс III. Глагольный префикс «б-». Например: «ккал б-ихьана» — собака пришла."
      },
      {
        type: "multiple_choice",
        prompt: "Как по-андийски «лошадь»?",
        options: ["зи", "отIу", "бечI", "чу"],
        answer: "чу",
        explanation: "«Чу» /tʃu/ — лошадь. Короткое слово."
      },
      {
        type: "multiple_choice",
        prompt: "Переведите: «ЦIалъ б-итIана»",
        options: ["Орёл сел.", "Орёл улетел.", "Орёл упал.", "Орёл пришёл."],
        answer: "Орёл улетел.",
        explanation: "«ЦIалъ» — орёл, «б-итIана» — взлетел/улетел. Класс III, префикс «б-»."
      },
      {
        type: "multiple_choice",
        prompt: "Как по-андийски «рыба»?",
        options: ["хъур", "гIала", "чIочI", "цIалъ"],
        answer: "чIочI",
        explanation: "«ЧIочI» /tʃˀotʃˀ/ — рыба. Оба согласных абруптивные «чI»."
      },
      {
        type: "translation",
        prompt: "Переведите: «гIарзу»",
        options: null,
        answer: "кошка",
        explanation: "«ГIарзу» /ʕarzu/ — кошка. Начинается с фарингального «гI» /ʕ/."
      },
    ]
  },
  {
    title: "Цвета и описание",
    description: "Цвета и базовые прилагательные андийского языка.",
    level: "beginner",
    orderIndex: 13,
    content: `<div>
<p class="lesson-intro">Прилагательные в андийском языке имеют согласовательный суффикс <strong>-аб</strong>. Это не падежный показатель — это форма прилагательного при существительном.</p>
<p class="lesson-source"><em>Источник: Мадиева Г.И. Морфология андийского языка, 1980. С. 58–72.</em></p>

<h2>Цвета</h2>
<table>
<thead><tr><th>Андийский</th><th>IPA</th><th>Русский</th></tr></thead>
<tbody>
<tr><td><strong>бацIцIинаб</strong></td><td>/batsˀtsˀinab/</td><td>белый</td></tr>
<tr><td><strong>чIегIераб</strong></td><td>/tʃˀeʕerab/</td><td>чёрный</td></tr>
<tr><td><strong>цIцIинаб</strong></td><td>/tsˀtsˀinab/</td><td>красный</td></tr>
<tr><td><strong>ккIодераб</strong></td><td>/kkˀoderab/</td><td>синий, голубой</td></tr>
<tr><td><strong>хIехьераб</strong></td><td>/ħeħerab/</td><td>зелёный</td></tr>
</tbody>
</table>

<h2>Базовые прилагательные</h2>
<table>
<thead><tr><th>Андийский</th><th>IPA</th><th>Русский</th></tr></thead>
<tbody>
<tr><td><strong>ихьараб</strong></td><td>/iħarab/</td><td>большой</td></tr>
<tr><td><strong>гIинцIинаб</strong></td><td>/ʕintsˀinab/</td><td>маленький</td></tr>
<tr><td><strong>хъвараб</strong></td><td>/qˀwarab/</td><td>хороший</td></tr>
<tr><td><strong>хьаб</strong></td><td>/χab/</td><td>горячий</td></tr>
<tr><td><strong>лъивараб</strong></td><td>/ɬiwarab/</td><td>холодный</td></tr>
<tr><td><strong>хIинхIинаб</strong></td><td>/ħinħinab/</td><td>новый</td></tr>
<tr><td><strong>кIудияб</strong></td><td>/kˀudijab/</td><td>старый (предмет)</td></tr>
</tbody>
</table>

<h2>Суффикс -аб</h2>
<p>Прилагательные в андийском стоят перед существительным и имеют суффикс <strong>-аб</strong>:</p>
<ul>
<li><strong>бацIцIинаб рагъ</strong> — белый снег</li>
<li><strong>чIегIераб ккал</strong> — чёрная собака</li>
<li><strong>ихьараб рокъо</strong> — большой дом</li>
<li><strong>хъвараб чей</strong> — хороший чай</li>
</ul>
</div>`,
    exercises: [
      {
        type: "multiple_choice",
        prompt: "Как по-андийски «белый»?",
        options: ["чIегIераб", "цIцIинаб", "бацIцIинаб", "ккIодераб"],
        answer: "бацIцIинаб",
        explanation: "«БацIцIинаб» /batsˀtsˀinab/ — белый. Суффикс «-аб» — согласовательный суффикс прилагательного."
      },
      {
        type: "multiple_choice",
        prompt: "Что означает «чIегIераб»?",
        options: ["красный", "синий", "чёрный", "зелёный"],
        answer: "чёрный",
        explanation: "«ЧIегIераб» /tʃˀeʕerab/ — чёрный. Содержит и абруптивный «чI», и фарингальный «гI»."
      },
      {
        type: "multiple_choice",
        prompt: "Какой суффикс характерен для прилагательных в андийском?",
        options: ["-го", "-аб", "-ди", "-ине"],
        answer: "-аб",
        explanation: "Суффикс «-аб» — согласовательный суффикс прилагательных. Например: ихьар-аб (большой), хъвар-аб (хороший)."
      },
      {
        type: "multiple_choice",
        prompt: "Как сказать «большой дом» по-андийски?",
        options: ["рокъо ихьараб", "ихьараб рокъо", "рокъо-ихьар", "ихьар рокъо"],
        answer: "ихьараб рокъо",
        explanation: "В андийском прилагательное стоит перед существительным: «ихьараб рокъо» — большой дом."
      },
      {
        type: "multiple_choice",
        prompt: "Что означает «хьаб»?",
        options: ["холодный", "хороший", "горячий", "новый"],
        answer: "горячий",
        explanation: "«Хьаб» /χab/ — горячий. Краткая форма без суффикса -аб."
      },
      {
        type: "translation",
        prompt: "Переведите: «чIегIераб ккал»",
        options: null,
        answer: "чёрная собака",
        explanation: "«ЧIегIераб» — чёрный, «ккал» — собака. Прилагательное стоит перед существительным."
      },
      {
        type: "multiple_choice",
        prompt: "Как по-андийски «маленький»?",
        options: ["ихьараб", "хъвараб", "гIинцIинаб", "кIудияб"],
        answer: "гIинцIинаб",
        explanation: "«ГIинцIинаб» /ʕintsˀinab/ — маленький. Начинается с фарингального «гI»."
      },
    ]
  },
  {
    title: "Время и дни",
    description: "День, ночь, утро, вечер. Когда и как — основы андийского расписания.",
    level: "beginner",
    orderIndex: 14,
    content: `<div>
<p class="lesson-intro">Слова о времени — основа любого разговора. В этом уроке изучим названия частей дня, наречия времени и простые фразы.</p>
<p class="lesson-source"><em>Источник: Салимов Х.А. Андийско-русский словарь, 2010.</em></p>

<h2>Части суток</h2>
<table>
<thead><tr><th>Андийский</th><th>IPA</th><th>Русский</th></tr></thead>
<tbody>
<tr><td><strong>субхI</strong></td><td>/subħ/</td><td>утро</td></tr>
<tr><td><strong>бон</strong></td><td>/bon/</td><td>день</td></tr>
<tr><td><strong>гIагарубон</strong></td><td>/ʕagarubon/</td><td>вечер</td></tr>
<tr><td><strong>хьон</strong></td><td>/χon/</td><td>ночь</td></tr>
</tbody>
</table>

<h2>Единицы времени</h2>
<table>
<thead><tr><th>Андийский</th><th>IPA</th><th>Русский</th></tr></thead>
<tbody>
<tr><td><strong>бон</strong></td><td>/bon/</td><td>день (также «сутки»)</td></tr>
<tr><td><strong>базар</strong></td><td>/bazar/</td><td>неделя</td></tr>
<tr><td><strong>моцI</strong></td><td>/motsˀ/</td><td>месяц</td></tr>
<tr><td><strong>сон</strong></td><td>/son/</td><td>год</td></tr>
</tbody>
</table>

<h2>Наречия времени</h2>
<table>
<thead><tr><th>Андийский</th><th>Русский</th></tr></thead>
<tbody>
<tr><td><strong>гьалбон</strong></td><td>сегодня</td></tr>
<tr><td><strong>гьалбонлъи</strong></td><td>вчера</td></tr>
<tr><td><strong>гьанже</strong></td><td>сейчас, теперь</td></tr>
</tbody>
</table>

<h2>Примеры фраз</h2>
<ul>
<li><strong>Субхьалъ бахъана.</strong> — Утром ушёл.</li>
<li><strong>Гьалбон дун лъай рукIана.</strong> — Сегодня я здесь.</li>
<li><strong>Хьон ихьараб рукIана.</strong> — Ночь долгая (большая).</li>
<li><strong>Хьикьа сон — один год.</strong></li>
<li><strong>Гьанже бахъа! — Уходи сейчас!</strong></li>
</ul>

<h2>Вопрос о времени</h2>
<p>Чтобы спросить «когда», используется слово <strong>анже</strong>:</p>
<p><strong>Анже бахъана? — Когда ушёл?</strong></p>
</div>`,
    exercises: [
      {
        type: "multiple_choice",
        prompt: "Как по-андийски «ночь»?",
        options: ["бон", "субхI", "хьон", "гIагарубон"],
        answer: "хьон",
        explanation: "«Хьон» /χon/ — ночь. Увулярный звук «хь» = /χ/."
      },
      {
        type: "multiple_choice",
        prompt: "Что означает «бон»?",
        options: ["ночь", "утро", "вечер", "день"],
        answer: "день",
        explanation: "«Бон» /bon/ — день. Также входит в состав слова «гьалбон» (сегодня = «этот день»)."
      },
      {
        type: "multiple_choice",
        prompt: "Как по-андийски «сегодня»?",
        options: ["гьанже", "гьалбонлъи", "гьалбон", "анже"],
        answer: "гьалбон",
        explanation: "«Гьалбон» — сегодня. Буквально: «этот день» (гьал + бон)."
      },
      {
        type: "multiple_choice",
        prompt: "Как будет «год» по-андийски?",
        options: ["моцI", "бон", "базар", "сон"],
        answer: "сон",
        explanation: "«Сон» /son/ — год. «Хьикьа сон» = один год."
      },
      {
        type: "multiple_choice",
        prompt: "Что означает «анже»?",
        options: ["сейчас", "сегодня", "когда?", "вчера"],
        answer: "когда?",
        explanation: "«Анже» /anze/ — вопросительное наречие «когда?». Используется для вопроса о времени."
      },
      {
        type: "translation",
        prompt: "Переведите: «Гьалбон дун лъай рукIана»",
        options: null,
        answer: "Сегодня я здесь.",
        explanation: "«Гьалбон» — сегодня, «дун» — я, «лъай» — здесь, «рукIана» — нахожусь/есть."
      },
      {
        type: "multiple_choice",
        prompt: "Как по-андийски «месяц»?",
        options: ["сон", "бон", "моцI", "базар"],
        answer: "моцI",
        explanation: "«МоцI» /motsˀ/ — месяц (также значит «луна»). Абруптивный «цI»."
      },
    ]
  },
  {
    title: "Вопросы и отрицание",
    description: "Как задавать вопросы и строить отрицательные предложения на андийском.",
    level: "intermediate",
    orderIndex: 15,
    content: `<div>
<p class="lesson-intro">Умение задавать вопросы и выражать отрицание — ключ к живому общению. В этом уроке разберём вопросительные слова и отрицательные конструкции.</p>
<p class="lesson-source"><em>Источник: Мадиева Г.И. Морфология андийского языка, 1980. С. 112–130.</em></p>

<h2>Вопросительные слова</h2>
<table>
<thead><tr><th>Андийский</th><th>IPA</th><th>Русский</th><th>Пример</th></tr></thead>
<tbody>
<tr><td><strong>щив</strong></td><td>/ʃiw/</td><td>кто?</td><td>Щив рукIана? — Кто это?</td></tr>
<tr><td><strong>щиб</strong></td><td>/ʃib/</td><td>что?</td><td>Щиб рукIана? — Что это?</td></tr>
<tr><td><strong>кинаб</strong></td><td>/kinab/</td><td>где?</td><td>Кинаб рукIана? — Где (ты)?</td></tr>
<tr><td><strong>анже</strong></td><td>/anze/</td><td>когда?</td><td>Анже бахъана? — Когда ушёл?</td></tr>
<tr><td><strong>гьинаб</strong></td><td>/hinab/</td><td>почему?</td><td>Гьинаб бахъана? — Почему ушёл?</td></tr>
<tr><td><strong>щиб анцI</strong></td><td>/ʃib antsˀ/</td><td>сколько?</td><td>Щиб анцI вас? — Сколько сыновей?</td></tr>
</tbody>
</table>

<h2>Отрицание</h2>
<p>Отрицание в андийском выражается суффиксом <strong>-ро</strong>, добавляемым к глаголу:</p>
<table>
<thead><tr><th>Утверждение</th><th>Отрицание</th><th>Перевод</th></tr></thead>
<tbody>
<tr><td>Дун рукIана</td><td>Дун рукIана<strong>-ро</strong></td><td>Я не (есть, нахожусь)</td></tr>
<tr><td>Дун бахъана</td><td>Дун бахъана<strong>-ро</strong></td><td>Я не ушёл</td></tr>
<tr><td>Дида гьикIана</td><td>Дида гьикIана<strong>-ро</strong></td><td>Я не знаю</td></tr>
</tbody>
</table>

<h2>Частицы «да» и «нет»</h2>
<ul>
<li><strong>Хьвадая</strong> /χwadaja/ — Да</li>
<li><strong>ХIанна</strong> /ħanna/ — Нет</li>
<li><strong>ХIалбухI</strong> /ħalbuħ/ — Хорошо (ладно)</li>
</ul>

<h2>Диалог — вопросы и ответы</h2>
<p><strong>А:</strong> Кинаб рукIана?</p>
<p><strong>Б:</strong> Дун рокъолъ рукIана.</p>
<p><strong>А:</strong> Анже бахъана?</p>
<p><strong>Б:</strong> Гьанже бахъана.</p>
<p><strong>А:</strong> Гьинаб?</p>
<p><strong>Б:</strong> Дида гьикIана-ро. — Я не знаю.</p>
</div>`,
    exercises: [
      {
        type: "multiple_choice",
        prompt: "Как по-андийски «кто?»",
        options: ["щиб", "кинаб", "щив", "анже"],
        answer: "щив",
        explanation: "«Щив» /ʃiw/ — «кто?». Используется для вопроса о личности."
      },
      {
        type: "multiple_choice",
        prompt: "Что означает «кинаб»?",
        options: ["когда?", "почему?", "что?", "где?"],
        answer: "где?",
        explanation: "«Кинаб» /kinab/ — «где?». Вопрос о месте."
      },
      {
        type: "multiple_choice",
        prompt: "Как выражается отрицание в андийском?",
        options: ["Слово «нет» перед глаголом", "Суффикс «-ро» к глаголу", "Слово «хIанна» перед глаголом", "Префикс «не-»"],
        answer: "Суффикс «-ро» к глаголу",
        explanation: "Отрицание в андийском строится суффиксом «-ро». Пример: «дун бахъана-ро» — я не ушёл."
      },
      {
        type: "multiple_choice",
        prompt: "Переведите: «Дида гьикIана-ро»",
        options: ["Я знаю.", "Я не знаю.", "Ты не знаешь.", "Он не знает."],
        answer: "Я не знаю.",
        explanation: "«Дида» — я (эрг.), «гьикIана» — знаю, «-ро» — отрицание. «Дида гьикIана-ро» = Я не знаю."
      },
      {
        type: "multiple_choice",
        prompt: "Как сказать «нет» по-андийски?",
        options: ["хьвадая", "хIалбухI", "гьинаб", "хIанна"],
        answer: "хIанна",
        explanation: "«ХIанна» /ħanna/ — нет. Фарингальный «хI»."
      },
      {
        type: "translation",
        prompt: "Переведите: «Анже бахъана?»",
        options: null,
        answer: "Когда ушёл?",
        explanation: "«Анже» — когда?, «бахъана» — ушёл (прош. вр. глагола «идти, уходить»)."
      },
      {
        type: "multiple_choice",
        prompt: "Какой вопрос задаёт «гьинаб»?",
        options: ["Где?", "Когда?", "Кто?", "Почему?"],
        answer: "Почему?",
        explanation: "«Гьинаб» /hinab/ — почему? Вопрос о причине."
      },
    ]
  },
];

async function seedLessonsPart2() {
  console.log("Добавляю уроки 9–15...");

  let created = 0;
  let updated = 0;
  let exercisesCreated = 0;

  for (const lessonData of LESSONS_PART2) {
    const { exercises, ...lessonFields } = lessonData;

    const existing = await db
      .select()
      .from(lessonsTable)
      .where(eq(lessonsTable.orderIndex, lessonFields.orderIndex))
      .limit(1);

    let lessonId: number;

    if (existing.length > 0) {
      await db
        .update(lessonsTable)
        .set(lessonFields)
        .where(eq(lessonsTable.id, existing[0].id));
      lessonId = existing[0].id;
      await db.delete(exercisesTable).where(eq(exercisesTable.lessonId, lessonId));
      updated++;
    } else {
      const [inserted] = await db
        .insert(lessonsTable)
        .values(lessonFields)
        .returning();
      lessonId = inserted.id;
      created++;
    }

    for (const ex of exercises) {
      await db.insert(exercisesTable).values({
        lessonId,
        type: ex.type,
        prompt: ex.prompt,
        options: ex.options ? JSON.stringify(ex.options) : null,
        answer: ex.answer,
        explanation: ex.explanation ?? null,
      });
      exercisesCreated++;
    }

    console.log(`  ✓ Урок ${lessonFields.orderIndex}: «${lessonFields.title}» (${exercises.length} заданий)`);
  }

  console.log(`\nГотово: создано ${created}, обновлено ${updated} уроков, ${exercisesCreated} заданий.`);
}

seedLessonsPart2()
  .then(() => process.exit(0))
  .catch((e) => { console.error(e); process.exit(1); });
