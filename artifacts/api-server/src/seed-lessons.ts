import { db, lessonsTable, exercisesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const LESSONS: Array<{
  title: string;
  description: string;
  level: string;
  orderIndex: number;
  content: string;
  exercises: Array<{
    type: string;
    prompt: string;
    options: string[] | null;
    answer: string;
    explanation?: string;
  }>;
}> = [
  {
    title: "Алфавит и фонетика",
    description: "Буквы андийского языка, их звуки и произношение. Начните здесь — это основа всего.",
    level: "beginner",
    orderIndex: 1,
    content: `<div>
<p class="lesson-intro">Андийский язык — нахско-дагестанский язык Ботлихского района Дагестана. Современное письмо основано на <strong>кирилллице</strong> с дополнительными буквами для особых звуков.</p>
<p class="lesson-source"><em>Источник: Мадиева Г.И. Грамматика андийского языка. — Махачкала, 1980.</em></p>

<h2>Буквы и их звуки</h2>
<table>
<thead><tr><th>Буква</th><th>IPA</th><th>Описание</th><th>Пример</th></tr></thead>
<tbody>
<tr><td><strong>А а</strong></td><td>/a/</td><td>Как в русском «а»</td><td>анкIо — пять</td></tr>
<tr><td><strong>Б б</strong></td><td>/b/</td><td>Как в русском «б»</td><td>батIи — луна</td></tr>
<tr><td><strong>В в</strong></td><td>/w/</td><td>Губно-губной</td><td>вас — сын</td></tr>
<tr><td><strong>Г г</strong></td><td>/ɡ/</td><td>Как в русском «г»</td><td>гьалъи — вода</td></tr>
<tr class="special-row"><td><strong>ГI гI</strong></td><td>/ʕ/</td><td>Фарингальный (горловой)</td><td>гIан — мне</td></tr>
<tr><td><strong>Д д</strong></td><td>/d/</td><td>Как в русском «д»</td><td>дун — я</td></tr>
<tr><td><strong>И и</strong></td><td>/i/</td><td>Как в русском «и»</td><td>инсу — отец</td></tr>
<tr><td><strong>К к</strong></td><td>/k/</td><td>Как в русском «к»</td><td>—</td></tr>
<tr class="special-row"><td><strong>КI кI</strong></td><td>/kʼ/</td><td>Абруптивный «к»</td><td>кIиго — два</td></tr>
<tr><td><strong>Л л</strong></td><td>/l/</td><td>Как в русском «л»</td><td>—</td></tr>
<tr class="special-row"><td><strong>ЛЪ лъ</strong></td><td>/ɬ/</td><td>Латеральный фрикативный</td><td>гьалъи — вода</td></tr>
<tr><td><strong>М м</strong></td><td>/m/</td><td>Как в русском «м»</td><td>мун — ты</td></tr>
<tr><td><strong>Н н</strong></td><td>/n/</td><td>Как в русском «н»</td><td>—</td></tr>
<tr><td><strong>О о</strong></td><td>/o/</td><td>Как в русском «о»</td><td>рокъо — дом</td></tr>
<tr><td><strong>Р р</strong></td><td>/r/</td><td>Как в русском «р»</td><td>рокъо — дом</td></tr>
<tr><td><strong>Т т</strong></td><td>/t/</td><td>Как в русском «т»</td><td>—</td></tr>
<tr class="special-row"><td><strong>ТI тI</strong></td><td>/tʼ/</td><td>Абруптивный «т»</td><td>батIи — луна</td></tr>
<tr><td><strong>У у</strong></td><td>/u/</td><td>Как в русском «у»</td><td>инсу — отец</td></tr>
<tr><td><strong>Х х</strong></td><td>/x/</td><td>Как в русском «х»</td><td>—</td></tr>
<tr class="special-row"><td><strong>ХI хI</strong></td><td>/ħ/</td><td>Фарингальный «х»</td><td>хIалтIи — работа</td></tr>
<tr class="special-row"><td><strong>ХЬ хь</strong></td><td>/χ/</td><td>Увулярный фрикативный</td><td>хьарал — солнце</td></tr>
<tr><td><strong>Э э</strong></td><td>/e/</td><td>Как в русском «э»</td><td>эбел — мать</td></tr>
<tr><td><strong>Я я</strong></td><td>/ja/</td><td>Как в русском «я»</td><td>яс — дочь</td></tr>
</tbody>
</table>

<h2>Особые звуки андийского</h2>
<p><strong>Абруптивные (смычно-гортанные):</strong> кI, тI, пI, цI, чI — произносятся с резким гортанным смычком. Буквы пишутся с «I».</p>
<p><strong>Фарингальные:</strong> хI /ħ/, гI /ʕ/ — образуются глубоко в горле, как арабские звуки.</p>
<p><strong>Латеральный фрикативный лъ:</strong> /ɬ/ — особый звук, похожий на «лл» в валлийском языке.</p>
<p><strong>Увулярный хь:</strong> /χ/ — как немецкое «ch» в «Bach».</p>

<h2>Первые слова — читаем вслух</h2>
<ul>
<li><strong>дун</strong> /dun/ — я</li>
<li><strong>мун</strong> /mun/ — ты</li>
<li><strong>рокъо</strong> /roqo/ — дом</li>
<li><strong>гьалъи</strong> /ɣaɬi/ — вода</li>
<li><strong>эбел</strong> /ebel/ — мать</li>
<li><strong>хьарал</strong> /χaral/ — солнце</li>
</ul>
</div>`,
    exercises: [
      {
        type: "multiple_choice",
        prompt: "Какой звук передаёт буква «лъ» в андийском языке?",
        options: ["Обычный звук /l/", "Латеральный фрикативный /ɬ/", "Сочетание «л» + «ъ»", "Гортанный смычок"],
        answer: "Латеральный фрикативный /ɬ/",
        explanation: "«ЛЪ» — это латеральный фрикативный /ɬ/. Такого звука нет в русском, но он есть в валлийском (как «ll»)."
      },
      {
        type: "multiple_choice",
        prompt: "Что такое абруптивные согласные? Найдите верный пример.",
        options: ["А, И, У, Э", "Б, Д, Г, З", "КI, ТI, ЦI, ЧI", "Х, ХЬ, ХI, ГI"],
        answer: "КI, ТI, ЦI, ЧI",
        explanation: "Абруптивные (смычно-гортанные) — кI, тI, пI, цI, чI. Они пишутся с «I» и произносятся с гортанным смычком."
      },
      {
        type: "multiple_choice",
        prompt: "Как читается транскрипция слова «гьалъи»?",
        options: ["/gali/", "/ɣaɬi/", "/hali/", "/gʔali/"],
        answer: "/ɣaɬi/",
        explanation: "«Гь» = /ɣ/ (звонкий увулярный), «лъ» = /ɬ/ (латеральный фрикативный). Слово означает «вода»."
      },
      {
        type: "multiple_choice",
        prompt: "Слово «дун» означает...",
        options: ["ты", "он", "я", "мы"],
        answer: "я",
        explanation: "«Дун» /dun/ — местоимение 1-го лица единственного числа, именительный падеж. Значит «я»."
      },
      {
        type: "multiple_choice",
        prompt: "Буква «ХI» передаёт звук...",
        options: ["Обычное «х» /x/", "Фарингальное /ħ/ (как арабское ح)", "Гортанный смычок", "Увулярное /χ/"],
        answer: "Фарингальное /ħ/ (как арабское ح)",
        explanation: "«ХI» = /ħ/ — фарингальный звук, похожий на арабское ح. Встречается в слове «хIалтIи» (работа)."
      },
      {
        type: "multiple_choice",
        prompt: "Что означает слово «эбел»?",
        options: ["отец", "брат", "мать", "сестра"],
        answer: "мать",
        explanation: "«Эбел» /ebel/ — мать. Это базовое слово, относящееся к классу II."
      },
      {
        type: "multiple_choice",
        prompt: "Как произносится «хьарал»?",
        options: ["/haral/", "/χaral/", "/xaral/", "/ħaral/"],
        answer: "/χaral/",
        explanation: "«Хь» = /χ/ — увулярный фрикативный. «Хьарал» значит «солнце»."
      },
      {
        type: "translation",
        prompt: "Переведите с андийского на русский: «мун»",
        options: null,
        answer: "ты",
        explanation: "«Мун» /mun/ — местоимение 2-го лица, именительный падеж. Значит «ты»."
      },
    ]
  },
  {
    title: "Приветствия и первые фразы",
    description: "Как поздороваться, попрощаться и сказать несколько базовых фраз на андийском.",
    level: "beginner",
    orderIndex: 2,
    content: `<div>
<p class="lesson-intro">В этом уроке вы научитесь приветствовать людей на андийском языке и произносить первые простые фразы.</p>

<h2>Приветствия</h2>
<table>
<thead><tr><th>Андийский</th><th>Транскрипция</th><th>Русский</th><th>Когда используется</th></tr></thead>
<tbody>
<tr><td><strong>Марщалла!</strong></td><td>/marʃalla/</td><td>Привет! / Здравствуй!</td><td>Общее приветствие</td></tr>
<tr><td><strong>Хайр хилла!</strong></td><td>/χajr χilla/</td><td>До свидания!</td><td>Прощание</td></tr>
<tr><td><strong>Хьар хилла!</strong></td><td>/χar χilla/</td><td>Пока!</td><td>Неформальное прощание</td></tr>
<tr><td><strong>Рагьу рукIана?</strong></td><td>/raɣu rukʼana/</td><td>Как дела?</td><td>Вопрос о делах</td></tr>
<tr><td><strong>Хъвараб!</strong></td><td>/qʼwarab/</td><td>Хорошо!</td><td>Ответ — всё хорошо</td></tr>
<tr><td><strong>Шукру!</strong></td><td>/ʃukru/</td><td>Спасибо!</td><td>Благодарность</td></tr>
<tr><td><strong>ХIалбихьа!</strong></td><td>/ħalbiħa/</td><td>Пожалуйста!</td><td>Ответ на спасибо</td></tr>
</tbody>
</table>

<h2>Представление</h2>
<table>
<thead><tr><th>Андийский</th><th>Русский</th></tr></thead>
<tbody>
<tr><td><strong>Дун … рукIана.</strong></td><td>Меня зовут … (букв.: Я — …)</td></tr>
<tr><td><strong>Мун щиб рукIана?</strong></td><td>Как тебя зовут?</td></tr>
<tr><td><strong>Дун Дагъустаналъ рукIана.</strong></td><td>Я из Дагестана.</td></tr>
</tbody>
</table>

<h2>Диалог — первое знакомство</h2>
<p><strong>А:</strong> Марщалла!</p>
<p><strong>Б:</strong> Марщалла! Мун щиб рукIана?</p>
<p><strong>А:</strong> Дун Марьям рукIана. Мун?</p>
<p><strong>Б:</strong> Дун Ахмад рукIана. Рагьу рукIана?</p>
<p><strong>А:</strong> Хъвараб! Шукру!</p>
<p><strong>Б:</strong> Хайр хилла!</p>

<h2>Полезные слова</h2>
<ul>
<li><strong>щиб</strong> /ʃib/ — что, какой (вопрос)</li>
<li><strong>рукIана</strong> /rukʼana/ — есть, являюсь (глагол «быть»)</li>
<li><strong>рагьу</strong> /raɣu/ — дела, состояние</li>
</ul>
</div>`,
    exercises: [
      {
        type: "multiple_choice",
        prompt: "Как по-андийски сказать «Привет!»?",
        options: ["Шукру!", "Хайр хилла!", "Марщалла!", "Хъвараб!"],
        answer: "Марщалла!",
        explanation: "«Марщалла!» — основное приветствие на андийском языке."
      },
      {
        type: "multiple_choice",
        prompt: "Что означает «Шукру»?",
        options: ["Привет", "До свидания", "Спасибо", "Пожалуйста"],
        answer: "Спасибо",
        explanation: "«Шукру» — это «спасибо» на андийском."
      },
      {
        type: "multiple_choice",
        prompt: "«Рагьу рукIана?» переводится как...",
        options: ["Как тебя зовут?", "Как дела?", "Откуда ты?", "Сколько тебе лет?"],
        answer: "Как дела?",
        explanation: "«Рагьу рукIана?» — вопрос о самочувствии, буквально «Как (ты) есть?»"
      },
      {
        type: "multiple_choice",
        prompt: "Как ответить на «Рагьу рукIана?» если всё хорошо?",
        options: ["Шукру!", "Марщалла!", "Хъвараб!", "Хайр хилла!"],
        answer: "Хъвараб!",
        explanation: "«Хъвараб!» — «Хорошо!» — стандартный ответ на вопрос о делах."
      },
      {
        type: "multiple_choice",
        prompt: "Как попрощаться по-андийски?",
        options: ["Марщалла!", "Рагьу рукIана?", "Хайр хилла!", "Шукру!"],
        answer: "Хайр хилла!",
        explanation: "«Хайр хилла!» — «До свидания!» на андийском языке."
      },
      {
        type: "translation",
        prompt: "Переведите на русский: «Дун Марьям рукIана.»",
        options: null,
        answer: "Меня зовут Марьям.",
        explanation: "Буквально: «Я — Марьям (есть/являюсь)». Так представляются на андийском."
      },
      {
        type: "multiple_choice",
        prompt: "Какое слово используется для вопроса «как» / «какой» в андийском?",
        options: ["рукIана", "щиб", "рагьу", "хайр"],
        answer: "щиб",
        explanation: "«Щиб» /ʃib/ — вопросительное слово «что», «какой». Используется в вопросах."
      },
    ]
  },
  {
    title: "Местоимения",
    description: "Личные местоимения андийского языка: я, ты, он, она, мы, вы, они.",
    level: "beginner",
    orderIndex: 3,
    content: `<div>
<p class="lesson-intro">В андийском языке местоимения изменяются по падежам. В этом уроке изучим именительный падеж (кто делает действие) и эргативный (кто совершает переходное действие).</p>

<h2>Личные местоимения — именительный падеж</h2>
<table>
<thead><tr><th>Лицо</th><th>Андийский</th><th>IPA</th><th>Русский</th></tr></thead>
<tbody>
<tr><td>1 л. ед.ч.</td><td><strong>дун</strong></td><td>/dun/</td><td>я</td></tr>
<tr><td>2 л. ед.ч.</td><td><strong>мун</strong></td><td>/mun/</td><td>ты</td></tr>
<tr><td>3 л. ед.ч.</td><td><strong>гьел</strong></td><td>/hel/</td><td>он / она / оно</td></tr>
<tr><td>1 л. мн.ч.</td><td><strong>нилъ</strong></td><td>/niɬ/</td><td>мы</td></tr>
<tr><td>2 л. мн.ч.</td><td><strong>жилъ</strong></td><td>/ʒiɬ/</td><td>вы</td></tr>
<tr><td>3 л. мн.ч.</td><td><strong>гьел</strong></td><td>/hel/</td><td>они</td></tr>
</tbody>
</table>

<h2>Эргативный падеж (для переходных глаголов)</h2>
<p>В андийском, как во многих дагестанских языках, есть <strong>эргативный падеж</strong>. Он используется у подлежащего переходных глаголов (кто что-то делает с объектом).</p>
<table>
<thead><tr><th>Именительный</th><th>Эргативный</th><th>Суффикс</th></tr></thead>
<tbody>
<tr><td><strong>дун</strong> (я)</td><td><strong>дида</strong></td><td>-ида</td></tr>
<tr><td><strong>мун</strong> (ты)</td><td><strong>мида</strong></td><td>-ида</td></tr>
<tr><td><strong>гьел</strong> (он/она)</td><td><strong>гьелди</strong></td><td>-ди</td></tr>
</tbody>
</table>

<h2>Примеры</h2>
<ul>
<li><strong>Дун рукIана.</strong> — Я есть (нахожусь). <em>(именительный)</em></li>
<li><strong>Мун рукIана.</strong> — Ты есть. <em>(именительный)</em></li>
<li><strong>Дида хьарал б-ахъана.</strong> — Я увидел солнце. <em>(эргативный — переходный глагол)</em></li>
<li><strong>Дида гьикIана.</strong> — Я знаю. <em>(эргативный)</em></li>
</ul>

<h2>Запомни!</h2>
<p>В андийском нет отдельных форм для «он» и «она» — используется одно слово <strong>гьел</strong>. Род существительных определяется не окончанием, а именным классом.</p>
</div>`,
    exercises: [
      {
        type: "multiple_choice",
        prompt: "Как будет «я» в андийском языке?",
        options: ["мун", "гьел", "дун", "нилъ"],
        answer: "дун",
        explanation: "«Дун» /dun/ — местоимение 1-го лица единственного числа, именительный падеж."
      },
      {
        type: "multiple_choice",
        prompt: "Слово «мун» означает...",
        options: ["я", "ты", "он", "мы"],
        answer: "ты",
        explanation: "«Мун» /mun/ — местоимение 2-го лица единственного числа."
      },
      {
        type: "multiple_choice",
        prompt: "Как сказать «мы» по-андийски?",
        options: ["жилъ", "гьел", "нилъ", "дида"],
        answer: "нилъ",
        explanation: "«Нилъ» /niɬ/ — местоимение 1-го лица множественного числа — «мы»."
      },
      {
        type: "multiple_choice",
        prompt: "Что такое эргативный падеж?",
        options: [
          "Падеж, обозначающий место действия",
          "Падеж подлежащего переходного глагола",
          "Падеж принадлежности (как родительный)",
          "Падеж косвенного объекта"
        ],
        answer: "Падеж подлежащего переходного глагола",
        explanation: "Эргативный падеж в андийском используется у того, кто совершает переходное действие (делает что-то с объектом)."
      },
      {
        type: "multiple_choice",
        prompt: "Как будет «я» в эргативном падеже?",
        options: ["дун", "дида", "дуни", "мида"],
        answer: "дида",
        explanation: "Эргативная форма «дун» → «дида». Суффикс -ида добавляется к основе «д-»."
      },
      {
        type: "multiple_choice",
        prompt: "Переведите: «Мун рукIана»",
        options: ["Я есть.", "Ты есть.", "Он есть.", "Мы есть."],
        answer: "Ты есть.",
        explanation: "«Мун» — ты, «рукIана» — форма глагола «быть». Буквально: «Ты есть / ты находишься»."
      },
      {
        type: "multiple_choice",
        prompt: "В предложении «Дида хьарал б-ахъана» (Я увидел солнце) — почему «я» стоит в форме «дида»?",
        options: [
          "Это именительный падеж",
          "Глагол «видеть» — переходный, поэтому «я» — в эргативе",
          "Это ошибка",
          "Это вежливая форма"
        ],
        answer: "Глагол «видеть» — переходный, поэтому «я» — в эргативе",
        explanation: "В андийском при переходных глаголах подлежащее стоит в эргативном падеже. «Видеть» — переходный глагол."
      },
    ]
  },
  {
    title: "Семья",
    description: "Слова для обозначения членов семьи. Узнайте, как называются родственники на андийском.",
    level: "beginner",
    orderIndex: 4,
    content: `<div>
<p class="lesson-intro">Семья — основа словарного запаса любого языка. В этом уроке изучим слова для всех главных членов семьи.</p>

<h2>Члены семьи</h2>
<table>
<thead><tr><th>Андийский</th><th>IPA</th><th>Русский</th><th>Класс</th></tr></thead>
<tbody>
<tr><td><strong>инсу</strong></td><td>/insu/</td><td>отец</td><td>I (муж.)</td></tr>
<tr><td><strong>эбел</strong></td><td>/ebel/</td><td>мать</td><td>II (жен.)</td></tr>
<tr><td><strong>вас</strong></td><td>/was/</td><td>сын</td><td>I (муж.)</td></tr>
<tr><td><strong>яс</strong></td><td>/jas/</td><td>дочь</td><td>II (жен.)</td></tr>
<tr><td><strong>вачи</strong></td><td>/watʃi/</td><td>брат</td><td>I (муж.)</td></tr>
<tr><td><strong>йеши</strong></td><td>/jeʃi/</td><td>сестра</td><td>II (жен.)</td></tr>
<tr><td><strong>дада</strong></td><td>/dada/</td><td>дедушка</td><td>I (муж.)</td></tr>
<tr><td><strong>баба</strong></td><td>/baba/</td><td>бабушка</td><td>II (жен.)</td></tr>
<tr><td><strong>вас-вас</strong></td><td>/was-was/</td><td>внук</td><td>I (муж.)</td></tr>
<tr><td><strong>яс-яс</strong></td><td>/jas-jas/</td><td>внучка</td><td>II (жен.)</td></tr>
</tbody>
</table>

<h2>Именные классы в семейных словах</h2>
<p>Обратите внимание: слова для мужчин относятся к <strong>классу I</strong>, а слова для женщин — к <strong>классу II</strong>. Это важно для согласования глаголов.</p>
<table>
<thead><tr><th>Класс</th><th>Кто</th><th>Префикс глагола</th><th>Пример</th></tr></thead>
<tbody>
<tr><td>I (муж.)</td><td>вас, инсу, вачи</td><td>в-</td><td>вас в-ихьана — сын пришёл</td></tr>
<tr><td>II (жен.)</td><td>яс, эбел, йеши</td><td>й-</td><td>яс й-ихьана — дочь пришла</td></tr>
</tbody>
</table>

<h2>Примеры предложений</h2>
<ul>
<li><strong>Инсуди й-ишана.</strong> — Отец сказал.</li>
<li><strong>Эбелди й-ихьана.</strong> — Мать пришла.</li>
<li><strong>Вачиди в-ихьана.</strong> — Брат пришёл.</li>
<li><strong>Йешиди й-ихьана.</strong> — Сестра пришла.</li>
<li><strong>Дун вачи рукIана.</strong> — У меня есть брат. (букв.: Я — с братом)</li>
</ul>
</div>`,
    exercises: [
      {
        type: "multiple_choice",
        prompt: "Как по-андийски «мать»?",
        options: ["инсу", "яс", "эбел", "йеши"],
        answer: "эбел",
        explanation: "«Эбел» /ebel/ — мать. Это слово относится к именному классу II (женский)."
      },
      {
        type: "multiple_choice",
        prompt: "Что означает «вачи»?",
        options: ["сестра", "дочь", "мать", "брат"],
        answer: "брат",
        explanation: "«Вачи» /watʃi/ — брат. Слово класса I (мужской)."
      },
      {
        type: "multiple_choice",
        prompt: "Как по-андийски «дочь»?",
        options: ["вас", "яс", "йеши", "эбел"],
        answer: "яс",
        explanation: "«Яс» /jas/ — дочь. Слово женского класса II."
      },
      {
        type: "multiple_choice",
        prompt: "Какой глагольный префикс используется для мужского класса I?",
        options: ["й-", "б-", "р-", "в-"],
        answer: "в-",
        explanation: "Для класса I (мужской) используется префикс «в-». Пример: «вас в-ихьана» — сын пришёл."
      },
      {
        type: "multiple_choice",
        prompt: "Переведите: «Йешиди й-ихьана»",
        options: ["Брат пришёл.", "Сестра пришла.", "Мать ушла.", "Дочь сказала."],
        answer: "Сестра пришла.",
        explanation: "«Йеши» — сестра, «й-ихьана» — пришла (класс II, глагол прихода)."
      },
      {
        type: "multiple_choice",
        prompt: "Как по-андийски «отец»?",
        options: ["дада", "вачи", "вас", "инсу"],
        answer: "инсу",
        explanation: "«Инсу» /insu/ — отец. Слово мужского класса I."
      },
      {
        type: "translation",
        prompt: "Переведите с андийского: «вас»",
        options: null,
        answer: "сын",
        explanation: "«Вас» /was/ — сын. Мужской класс I."
      },
    ]
  },
  {
    title: "Числа от 1 до 10",
    description: "Изучите числа на андийском языке и научитесь считать.",
    level: "beginner",
    orderIndex: 5,
    content: `<div>
<p class="lesson-intro">Числа в андийском языке имеют особую морфологию. Большинство чисел от 2 до 10 имеют суффикс <strong>-го</strong>.</p>
<p class="lesson-source"><em>Источник: Салимов Х.А. Андийско-русский словарь. — Махачкала, 2010.</em></p>

<h2>Числа 1–10</h2>
<table>
<thead><tr><th>Число</th><th>Андийский</th><th>IPA</th><th>Морфология</th></tr></thead>
<tbody>
<tr><td>1</td><td><strong>хьикьа</strong></td><td>/χiqˀa/</td><td>хьикь-а</td></tr>
<tr><td>2</td><td><strong>кIиго</strong></td><td>/kˀigo/</td><td>кIи-го</td></tr>
<tr><td>3</td><td><strong>лъабго</strong></td><td>/ɬabgo/</td><td>лъаб-го</td></tr>
<tr><td>4</td><td><strong>ункIого</strong></td><td>/unkˀogo/</td><td>ункIо-го</td></tr>
<tr><td>5</td><td><strong>анкIого</strong></td><td>/ankˀogo/</td><td>анкIо-го</td></tr>
<tr><td>6</td><td><strong>илъого</strong></td><td>/iɬogo/</td><td>илъо-го</td></tr>
<tr><td>7</td><td><strong>абкIого</strong></td><td>/abkˀogo/</td><td>абкIо-го</td></tr>
<tr><td>8</td><td><strong>бекIого</strong></td><td>/bekˀogo/</td><td>бекIо-го</td></tr>
<tr><td>9</td><td><strong>учIого</strong></td><td>/utʃˀogo/</td><td>учIо-го</td></tr>
<tr><td>10</td><td><strong>анцIиго</strong></td><td>/antsˀigo/</td><td>анцIи-го</td></tr>
</tbody>
</table>

<h2>Суффикс -го</h2>
<p>Числа со 2 по 10 имеют суффикс <strong>-го</strong>. Это характерная черта андийского счёта.</p>
<p>Исключение: <strong>хьикьа</strong> (один) — без суффикса, особая форма.</p>

<h2>Числа с существительными</h2>
<p>В андийском числительное обычно стоит перед существительным:</p>
<ul>
<li><strong>хьикьа рокъо</strong> — один дом</li>
<li><strong>кIиго вас</strong> — двое сыновей</li>
<li><strong>лъабго эбел</strong> — три матери</li>
<li><strong>анкIого рокъо</strong> — пять домов</li>
</ul>

<h2>Полезные фразы</h2>
<ul>
<li><strong>АнцIиго анкIого — пятнадцать</strong> (10+5)</li>
<li><strong>Щиб анцI?</strong> — Сколько? (вопрос о количестве)</li>
</ul>
</div>`,
    exercises: [
      {
        type: "multiple_choice",
        prompt: "Как по-андийски «три»?",
        options: ["кIиго", "анкIого", "лъабго", "хьикьа"],
        answer: "лъабго",
        explanation: "«Лъабго» /ɬabgo/ — три. Морфологически: лъаб-го (суффикс -го характерен для чисел 2–10)."
      },
      {
        type: "multiple_choice",
        prompt: "Что означает «хьикьа»?",
        options: ["два", "один", "пять", "десять"],
        answer: "один",
        explanation: "«Хьикьа» /χiqˀa/ — один. Это число без суффикса -го, особая форма."
      },
      {
        type: "multiple_choice",
        prompt: "Какой суффикс характерен для чисел 2–10 в андийском?",
        options: ["-а", "-и", "-го", "-ди"],
        answer: "-го",
        explanation: "Суффикс -го присоединяется к основе числа. Например: кIи-го (два), лъаб-го (три), анкIо-го (пять)."
      },
      {
        type: "multiple_choice",
        prompt: "Как сказать «пять домов» по-андийски?",
        options: ["рокъо анкIого", "анкIого рокъо", "хьикьа рокъо", "кIиго рокъо"],
        answer: "анкIого рокъо",
        explanation: "В андийском числительное стоит перед существительным: «анкIого рокъо» — пять домов."
      },
      {
        type: "translation",
        prompt: "Переведите: «кIиго вас»",
        options: null,
        answer: "двое сыновей",
        explanation: "«КIиго» = два, «вас» = сын. Числительное стоит перед существительным."
      },
      {
        type: "multiple_choice",
        prompt: "Как по-андийски «десять»?",
        options: ["анкIого", "бекIого", "анцIиго", "учIого"],
        answer: "анцIиго",
        explanation: "«АнцIиго» /antsˀigo/ — десять. Суффикс -го, основа анцIи-."
      },
      {
        type: "multiple_choice",
        prompt: "«КIиго» — это...",
        options: ["один", "два", "три", "пять"],
        answer: "два",
        explanation: "«КIиго» /kˀigo/ — два. Кл. абруптивный «кI» + суффикс -го."
      },
    ]
  },
  {
    title: "Природа и окружающий мир",
    description: "Слова для описания природы: небо, солнце, горы, вода, деревья и другие.",
    level: "beginner",
    orderIndex: 6,
    content: `<div>
<p class="lesson-intro">Андийский народ живёт в горном Дагестане. Слова для описания природы — важная часть его языка.</p>
<p class="lesson-source"><em>Источник: Салимов Х.А. Андийско-русский словарь. — Махачкала, 2010.</em></p>

<h2>Природные явления и объекты</h2>
<table>
<thead><tr><th>Андийский</th><th>IPA</th><th>Русский</th><th>Класс</th></tr></thead>
<tbody>
<tr><td><strong>хьарал</strong></td><td>/χaral/</td><td>солнце</td><td>III (б-)</td></tr>
<tr><td><strong>батIи</strong></td><td>/batˀi/</td><td>луна</td><td>III (б-)</td></tr>
<tr><td><strong>гьекъо</strong></td><td>/heqo/</td><td>небо</td><td>IV (р-)</td></tr>
<tr><td><strong>гьалъи</strong></td><td>/ɣaɬi/</td><td>вода</td><td>III (б-)</td></tr>
<tr><td><strong>босу</strong></td><td>/bosu/</td><td>гора</td><td>IV (р-)</td></tr>
<tr><td><strong>нахъу</strong></td><td>/naqˀu/</td><td>лес</td><td>IV (р-)</td></tr>
<tr><td><strong>кьери</strong></td><td>/qˀeri/</td><td>дерево</td><td>IV (р-)</td></tr>
<tr><td><strong>чIего</strong></td><td>/tʃˀego/</td><td>камень</td><td>IV (р-)</td></tr>
<tr><td><strong>цIцIо</strong></td><td>/tsˀtsˀo/</td><td>огонь</td><td>IV (р-)</td></tr>
<tr><td><strong>лъаIи</strong></td><td>/ɬaʔi/</td><td>земля</td><td>IV (р-)</td></tr>
</tbody>
</table>

<h2>Именной класс IV — неживые предметы</h2>
<p>Большинство слов для природных объектов относятся к <strong>классу IV</strong> с глагольным префиксом <strong>р-</strong>.</p>
<ul>
<li><strong>гьекъо р-ихьа</strong> — небо большое (класс IV)</li>
<li><strong>босу р-ихьа</strong> — высокая гора (класс IV)</li>
<li><strong>хьарал б-итIана</strong> — солнце взошло (класс III)</li>
</ul>

<h2>Примеры предложений</h2>
<ul>
<li><strong>Хьарал б-итIана.</strong> — Солнце взошло.</li>
<li><strong>БатIи б-ихьана.</strong> — Луна взошла.</li>
<li><strong>Гьалъи б-ухьана.</strong> — Вода закончилась.</li>
<li><strong>Босу р-ихьа.</strong> — Гора высокая (большая).</li>
<li><strong>ГьекIо р-ихьа.</strong> — Небо большое.</li>
</ul>
</div>`,
    exercises: [
      {
        type: "multiple_choice",
        prompt: "Что означает «хьарал»?",
        options: ["луна", "небо", "солнце", "вода"],
        answer: "солнце",
        explanation: "«Хьарал» /χaral/ — солнце. Слово именного класса III."
      },
      {
        type: "multiple_choice",
        prompt: "Как по-андийски «вода»?",
        options: ["гьекъо", "гьалъи", "босу", "батIи"],
        answer: "гьалъи",
        explanation: "«Гьалъи» /ɣaɬi/ — вода. Класс III."
      },
      {
        type: "multiple_choice",
        prompt: "Какой глагольный префикс характерен для класса IV (неживые предметы)?",
        options: ["в-", "й-", "б-", "р-"],
        answer: "р-",
        explanation: "Класс IV использует префикс «р-». Например: «гьекъо р-ихьа» — небо большое."
      },
      {
        type: "multiple_choice",
        prompt: "Что означает «батIи»?",
        options: ["солнце", "звезда", "луна", "небо"],
        answer: "луна",
        explanation: "«БатIи» /batˀi/ — луна. Слово класса III с абруптивным «тI»."
      },
      {
        type: "multiple_choice",
        prompt: "Переведите: «Гьалъи б-ухьана»",
        options: ["Вода взошла.", "Вода закончилась.", "Вода большая.", "Вода холодная."],
        answer: "Вода закончилась.",
        explanation: "«Гьалъи» — вода, «б-ухьана» — закончилась (глагол с префиксом класса III «б-»)."
      },
      {
        type: "multiple_choice",
        prompt: "Как по-андийски «гора»?",
        options: ["нахъу", "гьекъо", "чIего", "босу"],
        answer: "босу",
        explanation: "«Босу» /bosu/ — гора. Слово класса IV."
      },
      {
        type: "translation",
        prompt: "Переведите: «гьекъо»",
        options: null,
        answer: "небо",
        explanation: "«Гьекъо» /heqo/ — небо. Слово класса IV."
      },
    ]
  },
  {
    title: "Именные классы",
    description: "Одна из ключевых особенностей андийского — 4 именных класса. Научитесь определять класс слова.",
    level: "intermediate",
    orderIndex: 7,
    content: `<div>
<p class="lesson-intro">Именные классы — это уникальная черта нахско-дагестанских языков. В андийском их четыре. Класс определяет, какой префикс добавляется к глаголу при согласовании.</p>
<p class="lesson-source"><em>Источник: Мадиева Г.И. Грамматика андийского языка. — Махачкала, 1980. С. 34–52.</em></p>

<h2>Система именных классов</h2>
<table>
<thead><tr><th>Класс</th><th>Кто/что</th><th>Глагольный префикс</th><th>Примеры слов</th></tr></thead>
<tbody>
<tr><td><strong>I</strong></td><td>Мужчины, мальчики</td><td><strong>в-</strong></td><td>инсу (отец), вас (сын), вачи (брат)</td></tr>
<tr><td><strong>II</strong></td><td>Женщины, девочки</td><td><strong>й-</strong></td><td>эбел (мать), яс (дочь), йеши (сестра)</td></tr>
<tr><td><strong>III</strong></td><td>Животные, часть предметов</td><td><strong>б-</strong></td><td>гьалъи (вода), хьарал (солнце), батIи (луна)</td></tr>
<tr><td><strong>IV</strong></td><td>Большинство неживых предметов</td><td><strong>р-</strong></td><td>рокъо (дом), гьекъо (небо), босу (гора)</td></tr>
</tbody>
</table>

<h2>Согласование глагола с именным классом</h2>
<p>Глаголы в андийском согласуются с именным классом подлежащего. Это называется <strong>классное согласование</strong>.</p>
<table>
<thead><tr><th>Предложение</th><th>Перевод</th><th>Класс</th></tr></thead>
<tbody>
<tr><td>Вас <strong>в-</strong>ихьана</td><td>Сын пришёл</td><td>I (в-)</td></tr>
<tr><td>Яс <strong>й-</strong>ихьана</td><td>Дочь пришла</td><td>II (й-)</td></tr>
<tr><td>ГIарзу <strong>б-</strong>ихьана</td><td>Кошка пришла</td><td>III (б-)</td></tr>
<tr><td>Рокъо <strong>р-</strong>ихьа</td><td>Дом большой</td><td>IV (р-)</td></tr>
</tbody>
</table>

<h2>Как определить класс?</h2>
<ul>
<li>Слова для <strong>мужчин</strong> → всегда класс I</li>
<li>Слова для <strong>женщин</strong> → всегда класс II</li>
<li>Животные, вода, небесные тела → обычно класс III</li>
<li>Предметы, места, природа → обычно класс IV</li>
</ul>
<p>Для неодушевлённых предметов классовую принадлежность лучше запоминать вместе со словом.</p>

<h2>Важно!</h2>
<p>Классовый префикс меняется в зависимости от формы глагола. Но в базовых формах прошедшего времени префикс четко отражает класс подлежащего.</p>
</div>`,
    exercises: [
      {
        type: "multiple_choice",
        prompt: "К какому именному классу относится слово «вас» (сын)?",
        options: ["Класс I", "Класс II", "Класс III", "Класс IV"],
        answer: "Класс I",
        explanation: "Слова для мужчин всегда класс I. Префикс глагола — «в-»."
      },
      {
        type: "multiple_choice",
        prompt: "Какой глагольный префикс используется для класса II (женщины)?",
        options: ["в-", "й-", "б-", "р-"],
        answer: "й-",
        explanation: "Класс II (женщины) — префикс «й-». Пример: «яс й-ихьана» — дочь пришла."
      },
      {
        type: "multiple_choice",
        prompt: "К какому классу относится «рокъо» (дом)?",
        options: ["I", "II", "III", "IV"],
        answer: "IV",
        explanation: "«Рокъо» — дом, неодушевлённый предмет. Класс IV, префикс «р-»."
      },
      {
        type: "multiple_choice",
        prompt: "Почему «хьарал» (солнце) относится к классу III, а не IV?",
        options: [
          "Потому что солнце живое",
          "Небесные тела традиционно относятся к классу III в андийском",
          "Это ошибка классификации",
          "Класс IV только для домашних предметов"
        ],
        answer: "Небесные тела традиционно относятся к классу III в андийском",
        explanation: "В андийском небесные тела, вода и некоторые природные явления исторически относятся к классу III."
      },
      {
        type: "multiple_choice",
        prompt: "Выберите правильную форму: «Эбел ___-ихьана» (Мать пришла)",
        options: ["в-ихьана", "й-ихьана", "б-ихьана", "р-ихьана"],
        answer: "й-ихьана",
        explanation: "«Эбел» — мать, класс II. Префикс класса II — «й-»."
      },
      {
        type: "multiple_choice",
        prompt: "«Вас в-ихьана» — что здесь показывает префикс «в-»?",
        options: [
          "Прошедшее время",
          "Классовое согласование: вас — класс I",
          "Множественное число",
          "Эргативный падеж"
        ],
        answer: "Классовое согласование: вас — класс I",
        explanation: "Префикс «в-» показывает классовое согласование с именем «вас» (сын) класса I."
      },
      {
        type: "multiple_choice",
        prompt: "Сколько именных классов в андийском языке?",
        options: ["2", "3", "4", "6"],
        answer: "4",
        explanation: "В андийском 4 именных класса: I (муж.), II (жен.), III (часть неодуш.), IV (большинство неодуш.)."
      },
    ]
  },
  {
    title: "Базовые глаголы и действия",
    description: "Самые важные глаголы андийского языка: быть, идти, говорить, знать, видеть и другие.",
    level: "intermediate",
    orderIndex: 8,
    content: `<div>
<p class="lesson-intro">Глаголы в андийском имеют богатую систему форм. В этом уроке изучим основные глаголы и их базовые формы.</p>
<p class="lesson-source"><em>Источник: Мадиева Г.И. Грамматика андийского языка. — Махачкала, 1980. С. 78–112.</em></p>

<h2>Основные глаголы</h2>
<table>
<thead><tr><th>Инфинитив</th><th>IPA</th><th>Русский</th><th>Прошедшее время</th></tr></thead>
<tbody>
<tr><td><strong>рукIине</strong></td><td>/rukˀine/</td><td>быть, существовать</td><td>рукIана</td></tr>
<tr><td><strong>бахъине</strong></td><td>/baqˀine/</td><td>идти, уходить</td><td>бахъана</td></tr>
<tr><td><strong>хьалъине</strong></td><td>/χaɬine/</td><td>говорить, сказать</td><td>хьалъана</td></tr>
<tr><td><strong>гьикIине</strong></td><td>/hikˀine/</td><td>знать</td><td>гьикIана</td></tr>
<tr><td><strong>ихьине</strong></td><td>/iħine/</td><td>прийти</td><td>в/й/б/р-ихьана</td></tr>
<tr><td><strong>ахъине</strong></td><td>/aqˀine/</td><td>видеть</td><td>в/й/б/р-ахъана</td></tr>
<tr><td><strong>ишине</strong></td><td>/iʃine/</td><td>сказать</td><td>й-ишана</td></tr>
</tbody>
</table>

<h2>Особенности глаголов андийского</h2>
<p><strong>1. Классное согласование:</strong> глаголы прихода/ухода согласуются с классом подлежащего.</p>
<table>
<thead><tr><th>Подлежащее</th><th>Класс</th><th>Глагол «прийти»</th></tr></thead>
<tbody>
<tr><td>вас (сын)</td><td>I</td><td>вас <strong>в-ихьана</strong></td></tr>
<tr><td>яс (дочь)</td><td>II</td><td>яс <strong>й-ихьана</strong></td></tr>
<tr><td>хьарал (солнце)</td><td>III</td><td>хьарал <strong>б-итIана</strong></td></tr>
<tr><td>рокъо (дом)</td><td>IV</td><td>рокъо <strong>р-ихьа</strong></td></tr>
</tbody>
</table>

<p><strong>2. Эргативная конструкция:</strong> при переходных глаголах (ахъине — видеть, гьикIине — знать) подлежащее стоит в эргативном падеже.</p>
<ul>
<li><strong>Дида хьарал б-ахъана.</strong> — Я (эрг.) увидел солнце. ✓</li>
<li><strong>Дун бахъана.</strong> — Я ушёл. ✓ (непереходный — именительный)</li>
</ul>

<h2>Примеры с разными лицами</h2>
<ul>
<li><strong>Дун рукIана.</strong> — Я есть/нахожусь.</li>
<li><strong>Мун бахъана.</strong> — Ты ушёл/ушла.</li>
<li><strong>Гьел в-ихьана.</strong> — Он пришёл.</li>
<li><strong>Дида гьикIана.</strong> — Я знаю.</li>
<li><strong>Инсуди й-ишана.</strong> — Отец сказал.</li>
</ul>
</div>`,
    exercises: [
      {
        type: "multiple_choice",
        prompt: "Что означает глагол «рукIине»?",
        options: ["идти", "говорить", "знать", "быть, существовать"],
        answer: "быть, существовать",
        explanation: "«РукIине» /rukˀine/ — инфинитив глагола «быть». Форма прошедшего времени — «рукIана»."
      },
      {
        type: "multiple_choice",
        prompt: "Какая форма глагола «ихьана» правильна в предложении «яс ___ ихьана» (дочь пришла)?",
        options: ["в-ихьана", "й-ихьана", "б-ихьана", "р-ихьана"],
        answer: "й-ихьана",
        explanation: "«Яс» (дочь) — класс II. Префикс для класса II — «й-». Правильная форма: «яс й-ихьана»."
      },
      {
        type: "multiple_choice",
        prompt: "Почему в «Дида гьикIана» (Я знаю) «я» стоит в форме «дида», а не «дун»?",
        options: [
          "Это вежливая форма",
          "Глагол «гьикIине» (знать) — переходный, требует эргатива",
          "Так говорят в прошедшем времени",
          "Это ошибка в предложении"
        ],
        answer: "Глагол «гьикIине» (знать) — переходный, требует эргатива",
        explanation: "Переходные глаголы в андийском требуют эргативного падежа у подлежащего. «Дида» = эргативная форма «я»."
      },
      {
        type: "multiple_choice",
        prompt: "«Дун бахъана» означает...",
        options: ["Я пришёл.", "Я ушёл.", "Я сказал.", "Я знаю."],
        answer: "Я ушёл.",
        explanation: "«Бахъине» — глагол «идти, уходить». «Дун бахъана» — я ушёл."
      },
      {
        type: "multiple_choice",
        prompt: "Какой суффикс образует инфинитив в андийском?",
        options: ["-ана", "-ине", "-го", "-ди"],
        answer: "-ине",
        explanation: "Инфинитив в андийском образуется с суффиксом «-ине»: рукIине, бахъине, хьалъине, гьикIине."
      },
      {
        type: "translation",
        prompt: "Переведите: «Инсуди й-ишана»",
        options: null,
        answer: "Отец сказал.",
        explanation: "«Инсу» — отец (инсуди — в эргативе), «й-ишана» — сказал (глагол класса II согласуется с классом I по традиции речи)."
      },
      {
        type: "multiple_choice",
        prompt: "В чём особенность глаголов «ихьана» (пришёл/пришла/пришло)?",
        options: [
          "Они не изменяются никогда",
          "Они получают классный префикс в/й/б/р- в зависимости от подлежащего",
          "Они всегда используют форму с «б-»",
          "Они требуют эргативного падежа"
        ],
        answer: "Они получают классный префикс в/й/б/р- в зависимости от подлежащего",
        explanation: "Глаголы движения в андийском согласуются с именным классом подлежащего через префикс: в-, й-, б-, р-."
      },
    ]
  },
];

async function seedLessons() {
  console.log("Сеем уроки и упражнения...");

  let created = 0;
  let updated = 0;
  let exercisesCreated = 0;

  for (const lessonData of LESSONS) {
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

      await db
        .delete(exercisesTable)
        .where(eq(exercisesTable.lessonId, lessonId));

      updated++;
    } else {
      const [inserted] = await db
        .insert(lessonsTable)
        .values(lessonFields)
        .returning();
      lessonId = inserted.id;
      created++;
    }

    for (let i = 0; i < exercises.length; i++) {
      const ex = exercises[i];
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

seedLessons()
  .then(() => process.exit(0))
  .catch((e) => { console.error(e); process.exit(1); });
