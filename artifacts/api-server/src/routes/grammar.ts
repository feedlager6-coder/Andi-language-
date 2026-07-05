import { Router } from "express";

const router = Router();

// GET /grammar/cases — полная система падежей андийского языка
router.get("/grammar/cases", async (req, res) => {
  return res.json({
    description: "Андийский язык обладает развитой падежной системой с эргативным строем. Включает около 20–30 падежей: грамматические и серии локативных падежей (эссив, латив, элатив для каждой пространственной основы).",
    cases: [
      { name: "ABS", nameRu: "Именительный (абсолютный)", suffix: "∅ (нулевой)", function: "Субъект непереходного глагола, предикатив", example: "гьалъи", exampleTranslation: "вода (как субъект — 'вода течёт')" },
      { name: "ERG", nameRu: "Эргативный", suffix: "-ди / -й", function: "Субъект переходного глагола", example: "дида", exampleTranslation: "я (как субъект — 'я вижу')" },
      { name: "DAT", nameRu: "Дательный", suffix: "-с", function: "Адресат, получатель, объект ряда глаголов", example: "гьалъис", exampleTranslation: "воде (дать воды)" },
      { name: "GEN", nameRu: "Родительный", suffix: "-лъ / -л", function: "Принадлежность, атрибутивность", example: "гьалъилъ", exampleTranslation: "воды (стакан воды)" },
      { name: "INS", nameRu: "Инструментальный", suffix: "-лъи", function: "Инструмент, средство действия", example: "гьалъилъи", exampleTranslation: "водой (умыться водой)" },
      { name: "COM", nameRu: "Комитатив", suffix: "-лъухъ", function: "Совместность ('вместе с')", example: "гьалъилъухъ", exampleTranslation: "с водой" },
      { name: "ABL", nameRu: "Аблатив", suffix: "-лъун", function: "Исходная точка, отделение", example: "гьалъилъун", exampleTranslation: "из воды" },
      { name: "EQU", nameRu: "Экватив", suffix: "-гу", function: "Подобие, сравнение ('как')", example: "гьалъигу", exampleTranslation: "как вода" },
      { name: "SUPER_ESS", nameRu: "Суперэссив", suffix: "-лъо", function: "Нахождение на поверхности чего-либо", example: "рокъолъо", exampleTranslation: "на доме" },
      { name: "SUPER_LAT", nameRu: "Суперлатив", suffix: "-лъос", function: "Направление на поверхность", example: "рокъолъос", exampleTranslation: "на дом (движение)" },
      { name: "SUB_ESS", nameRu: "Субэссив", suffix: "-хъо", function: "Нахождение под чем-либо", example: "рокъохъо", exampleTranslation: "под домом" },
      { name: "SUB_EL", nameRu: "Субэлатив", suffix: "-хъос", function: "Движение из-под чего-либо", example: "рокъохъос", exampleTranslation: "из-под дома" },
      { name: "ALL1", nameRu: "Аллатив-1", suffix: "-да", function: "Направление 'к' (без контакта)", example: "рокъода", exampleTranslation: "к дому" },
      { name: "ALL2", nameRu: "Аллатив-2", suffix: "-дас", function: "Направление 'к' (с контактом)", example: "рокъодас", exampleTranslation: "до дома" },
    ],
  });
});

// GET /grammar/classes — система именных классов
router.get("/grammar/classes", async (req, res) => {
  return res.json({
    description: "Андийский язык имеет систему именных классов (грамматических родов), которые выражаются согласовательными префиксами на глаголах и прилагательных. Всего 4 класса. Класс определяется семантикой существительного и проявляется в согласовании.",
    classes: [
      {
        classNumber: "I",
        nameRu: "Мужской",
        marker: "в- / w-",
        markerPosition: "префикс согласуемого слова",
        semantics: "Лица мужского пола. Мужчины, мальчики, мужские персонажи.",
        examples: ["инсу (отец)", "вас (сын)", "вачи (брат)"],
      },
      {
        classNumber: "II",
        nameRu: "Женский",
        marker: "й- / y-",
        markerPosition: "префикс согласуемого слова",
        semantics: "Лица женского пола. Женщины, девочки, женские персонажи.",
        examples: ["эбел (мать)", "яс (дочь)", "йеши (сестра)"],
      },
      {
        classNumber: "III",
        nameRu: "Вещный-1",
        marker: "б- / b-",
        markerPosition: "префикс согласуемого слова",
        semantics: "Большинство неодушевлённых предметов. Небольшие предметы, вещи.",
        examples: ["гьалъи (вода)", "ведарихъе (хлеб)", "батIи (луна)"],
      },
      {
        classNumber: "IV",
        nameRu: "Вещный-2",
        marker: "р- / r-",
        markerPosition: "префикс согласуемого слова",
        semantics: "Пространственные понятия, крупные природные объекты, абстракции.",
        examples: ["рокъо (дом)", "босу (гора)", "гьекъо (небо)"],
      },
    ],
  });
});

// GET /grammar/drills — грамматические упражнения
router.get("/grammar/drills", async (req, res) => {
  const { topic } = req.query;

  const allDrills = [
    // Именные классы
    {
      id: "cls-1", topic: "noun_classes", topicRu: "Именные классы",
      question: "Какой класс у слова 'инсу' (отец)?",
      answer: "Класс I",
      options: ["Класс I", "Класс II", "Класс III", "Класс IV"],
      explanation: "Слово 'инсу' (отец) относится к классу I — мужской класс, включающий лица мужского пола.",
    },
    {
      id: "cls-2", topic: "noun_classes", topicRu: "Именные классы",
      question: "Какой класс у слова 'эбел' (мать)?",
      answer: "Класс II",
      options: ["Класс I", "Класс II", "Класс III", "Класс IV"],
      explanation: "Слово 'эбел' (мать) относится к классу II — женский класс.",
    },
    {
      id: "cls-3", topic: "noun_classes", topicRu: "Именные классы",
      question: "Какой согласовательный префикс используется для класса I (мужского)?",
      answer: "в- / w-",
      options: ["в- / w-", "й- / y-", "б- / b-", "р- / r-"],
      explanation: "Класс I (мужской) согласуется с помощью префикса в- (или w- в части форм).",
    },
    {
      id: "cls-4", topic: "noun_classes", topicRu: "Именные классы",
      question: "К какому классу относятся слова 'рокъо' (дом) и 'босу' (гора)?",
      answer: "Класс IV",
      options: ["Класс I", "Класс II", "Класс III", "Класс IV"],
      explanation: "Пространственные понятия и крупные природные объекты обычно принадлежат классу IV с префиксом р-.",
    },
    // Падежи
    {
      id: "case-1", topic: "cases", topicRu: "Падежи",
      question: "Какой падеж используется для субъекта ПЕРЕХОДНОГО глагола?",
      answer: "Эргативный",
      options: ["Именительный", "Эргативный", "Дательный", "Родительный"],
      explanation: "Андийский — эргативный язык. Субъект переходного глагола (деятель) стоит в эргативном падеже с суффиксом -ди.",
    },
    {
      id: "case-2", topic: "cases", topicRu: "Падежи",
      question: "Местоимение 'я' в именительном падеже — это...",
      answer: "дун",
      options: ["дида", "дун", "мун", "гьел"],
      explanation: "Дун — именительный (абсолютный) падеж местоимения 1 лица. Дида — эргативный падеж того же местоимения.",
    },
    {
      id: "case-3", topic: "cases", topicRu: "Падежи",
      question: "Суффикс -лъухъ образует...",
      answer: "Комитатив",
      options: ["Дательный", "Аблатив", "Комитатив", "Инструментальный"],
      explanation: "Суффикс -лъухъ — комитативный падеж, означает 'вместе с кем/чем-либо'.",
    },
    {
      id: "case-4", topic: "cases", topicRu: "Падежи",
      question: "Как будет 'дать воды' — в каком падеже стоит получатель?",
      answer: "Дательный",
      options: ["Эргативный", "Именительный", "Дательный", "Родительный"],
      explanation: "Получатель действия стоит в дательном падеже с суффиксом -с.",
    },
    // Числительные
    {
      id: "num-1", topic: "numerals", topicRu: "Числительные",
      question: "Как будет 'два' на андийском?",
      answer: "кIиго",
      options: ["хьикьа", "кIиго", "лъабго", "анкIого"],
      explanation: "кIиго — 'два'. Счёт: хьикьа (1), кIиго (2), лъабго (3).",
    },
    {
      id: "num-2", topic: "numerals", topicRu: "Числительные",
      question: "Что значит 'хьикьа'?",
      answer: "один",
      options: ["один", "два", "три", "пять"],
      explanation: "Хьикьа — количественное числительное 'один'.",
    },
    // Базовая лексика
    {
      id: "vocab-1", topic: "vocabulary", topicRu: "Лексика",
      question: "Как будет 'вода' на андийском?",
      answer: "гьалъи",
      options: ["гьалъи", "рокъо", "босу", "хьарал"],
      explanation: "гьалъи (ɣaɬi) — вода. Характерен глухой латеральный фрикативный звук лъ (ɬ).",
    },
    {
      id: "vocab-2", topic: "vocabulary", topicRu: "Лексика",
      question: "Что означает 'хьарал'?",
      answer: "солнце",
      options: ["луна", "вода", "солнце", "небо"],
      explanation: "хьарал — солнце. Начинается с увулярного согласного хь (χ).",
    },
    {
      id: "vocab-3", topic: "vocabulary", topicRu: "Лексика",
      question: "Как будет 'дом' на андийском?",
      answer: "рокъо",
      options: ["рокъо", "гьекъо", "хъибил", "хьуl"],
      explanation: "рокъо — дом. Слово класса IV (пространственный класс).",
    },
  ];

  const filtered = topic && typeof topic === "string"
    ? allDrills.filter(d => d.topic === topic)
    : allDrills;

  return res.json(filtered);
});

export default router;
