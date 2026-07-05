import { Router } from "express";
import { db, wordsTable, wordFormsTable } from "@workspace/db";
import { eq, ilike, or } from "drizzle-orm";

const router = Router();

interface MorphSegment {
  text: string;
  type: "root" | "prefix" | "suffix" | "stem" | "unknown";
  label: string;
  labelRu: string;
}

// ===================================================================
// Rule-based Andi morphological analyzer
// PRELIMINARY — based on academic descriptions of the language.
// Sources: Madieva 1980, Salimov 2010, WALS Andi entry
// ===================================================================

// Noun class agreement prefixes (appear on verbs/adjectives)
const CLASS_PREFIXES: Record<string, { class: string; labelRu: string }> = {
  "в": { class: "I", labelRu: "согласовательный префикс класса I (мужчины)" },
  "w": { class: "I", labelRu: "согласовательный префикс класса I (мужчины)" },
  "й": { class: "II", labelRu: "согласовательный префикс класса II (женщины)" },
  "y": { class: "II", labelRu: "согласовательный префикс класса II (женщины)" },
  "б": { class: "III", labelRu: "согласовательный префикс класса III" },
  "b": { class: "III", labelRu: "согласовательный префикс класса III" },
  "р": { class: "IV", labelRu: "согласовательный префикс класса IV" },
  "r": { class: "IV", labelRu: "согласовательный префикс класса IV" },
};

// Case suffixes (ordered longest-first to avoid partial matches)
const CASE_SUFFIXES: Array<{ suffix: string; case: string; caseRu: string; function: string }> = [
  { suffix: "лъул", caseRu: "Родительный-1", case: "GEN1", function: "принадлежность одушевлённым" },
  { suffix: "хъул", caseRu: "Родительный-2", case: "GEN2", function: "принадлежность неодушевлённым" },
  { suffix: "лъухъ", caseRu: "Комитатив", case: "COM", function: "совместность ('вместе с')" },
  { suffix: "лъун", caseRu: "Аблатив", case: "ABL", function: "исходная точка ('из')" },
  { suffix: "лъос", caseRu: "Суперлатив", case: "SUPER_LAT", function: "поверхность, 'на'" },
  { suffix: "лъо", caseRu: "Суперэссив", case: "SUPER_ESS", function: "нахождение на поверхности" },
  { suffix: "хъос", caseRu: "Субэлатив", case: "SUB_EL", function: "из-под" },
  { suffix: "хъо", caseRu: "Субэссив", case: "SUB_ESS", function: "под" },
  { suffix: "щиб", caseRu: "Трансформатив", case: "TRANS", function: "превращение" },
  { suffix: "дас", caseRu: "Аллатив-2", case: "ALL2", function: "направление 'к'" },
  { suffix: "да", caseRu: "Аллатив-1", case: "ALL1", function: "направление 'к'" },
  { suffix: "ди", caseRu: "Эргативный", case: "ERG", function: "субъект переходного глагола" },
  { suffix: "лъи", caseRu: "Инструментальный", case: "INS", function: "инструмент ('посредством')" },
  { suffix: "гу", caseRu: "Экватив", case: "EQU", function: "подобие ('как')" },
  { suffix: "лъ", caseRu: "Родительный", case: "GEN", function: "принадлежность" },
  { suffix: "с", caseRu: "Дательный", case: "DAT", function: "адресат, получатель" },
  { suffix: "л", caseRu: "Родительный (кр.)", case: "GEN_SHORT", function: "краткая форма родительного" },
];

// Plural markers
const PLURAL_SUFFIXES = [
  { suffix: "би", labelRu: "показатель мн. числа" },
  { suffix: "бе", labelRu: "показатель мн. числа (вариант)" },
  { suffix: "де", labelRu: "показатель мн. числа (класс IV)" },
];

// Verb infinitive suffixes
const VERB_SUFFIXES = [
  { suffix: "ине", labelRu: "инфинитивный суффикс" },
  { suffix: "ане", labelRu: "инфинитивный суффикс (вариант)" },
  { suffix: "уне", labelRu: "инфинитивный суффикс (вариант)" },
  { suffix: "ула", labelRu: "суффикс настоящего времени" },
  { suffix: "ана", labelRu: "суффикс прошедшего времени" },
];

function analyzeAndiWord(input: string): {
  segments: MorphSegment[];
  nounClass: string | null;
  caseInfo: { case: string; caseRu: string; function: string } | null;
  isPlural: boolean;
  verbForm: string | null;
  confidence: number;
  explanation: string;
  partOfSpeech: string | null;
} {
  let remaining = input.trim();
  const segments: MorphSegment[] = [];
  let nounClass: string | null = null;
  let caseInfo: { case: string; caseRu: string; function: string } | null = null;
  let isPlural = false;
  let verbForm: string | null = null;
  let confidence = 0.4;
  let partOfSpeech: string | null = null;

  // 1. Detect class agreement prefix
  for (const [prefix, info] of Object.entries(CLASS_PREFIXES)) {
    if (remaining.startsWith(prefix) && remaining.length > prefix.length + 1) {
      segments.push({ text: prefix, type: "prefix", label: `class_${info.class}_prefix`, labelRu: info.labelRu });
      remaining = remaining.slice(prefix.length);
      nounClass = `Класс ${info.class}`;
      confidence += 0.15;
      break;
    }
  }

  // 2. Detect verb infinitive (before checking case suffixes)
  for (const vs of VERB_SUFFIXES) {
    if (remaining.endsWith(vs.suffix) && remaining.length > vs.suffix.length) {
      const stem = remaining.slice(0, remaining.length - vs.suffix.length);
      segments.push({ text: stem, type: "root", label: "verbal_stem", labelRu: "глагольная основа" });
      segments.push({ text: vs.suffix, type: "suffix", label: "verb_suffix", labelRu: vs.labelRu });
      partOfSpeech = "глагол";
      confidence += 0.2;
      verbForm = vs.labelRu;
      return { segments, nounClass, caseInfo, isPlural, verbForm, confidence, partOfSpeech, explanation: buildExplanation(segments, nounClass, caseInfo, isPlural, verbForm) };
    }
  }

  // 3. Detect plural
  for (const ps of PLURAL_SUFFIXES) {
    if (remaining.endsWith(ps.suffix) && remaining.length > ps.suffix.length) {
      remaining = remaining.slice(0, remaining.length - ps.suffix.length);
      isPlural = true;
      confidence += 0.1;
      segments.push({ text: ps.suffix, type: "suffix", label: "plural_marker", labelRu: ps.labelRu });
      break;
    }
  }

  // 4. Detect case suffixes
  for (const cs of CASE_SUFFIXES) {
    const effectiveRemaining = isPlural
      ? remaining
      : remaining;
    if (effectiveRemaining.endsWith(cs.suffix) && effectiveRemaining.length > cs.suffix.length) {
      const stem = effectiveRemaining.slice(0, effectiveRemaining.length - cs.suffix.length);
      caseInfo = { case: cs.case, caseRu: cs.caseRu, function: cs.function };
      confidence += 0.2;
      partOfSpeech = "существительное";

      const pluralSegs = segments.filter(s => s.label === "plural_marker");
      const otherSegs = segments.filter(s => s.label !== "plural_marker");

      segments.length = 0;
      segments.push(...otherSegs);
      segments.push({ text: stem, type: "root", label: "nominal_stem", labelRu: "именная основа" });
      if (pluralSegs.length) segments.push(...pluralSegs);
      segments.push({ text: cs.suffix, type: "suffix", label: cs.case, labelRu: `${cs.caseRu} падеж` });
      break;
    }
  }

  // 5. If no case found, treat as nominative/base form
  if (segments.filter(s => s.type === "root").length === 0) {
    segments.push({ text: remaining, type: "root", label: "base_form", labelRu: "основная форма (именительный/абсолютный)" });
    if (!partOfSpeech) partOfSpeech = "существительное";
  }

  return {
    segments,
    nounClass,
    caseInfo,
    isPlural,
    verbForm,
    confidence: Math.min(confidence, 0.9),
    partOfSpeech,
    explanation: buildExplanation(segments, nounClass, caseInfo, isPlural, verbForm),
  };
}

function buildExplanation(
  segments: MorphSegment[],
  nounClass: string | null,
  caseInfo: { case: string; caseRu: string; function: string } | null,
  isPlural: boolean,
  verbForm: string | null,
): string {
  const parts: string[] = [];

  if (segments.length === 1 && segments[0].label === "base_form") {
    parts.push("Слово стоит в основной (именительной / абсолютной) форме.");
  }

  if (nounClass) {
    parts.push(`Содержит согласовательный префикс ${nounClass}.`);
  }

  if (verbForm) {
    parts.push(`Глагольная форма: ${verbForm}.`);
  }

  if (caseInfo) {
    parts.push(`Суффикс «${segments.find(s => s.label === caseInfo.case)?.text}» указывает на ${caseInfo.caseRu} падеж — ${caseInfo.function}.`);
  }

  if (isPlural) {
    parts.push("Форма множественного числа.");
  }

  if (parts.length === 0) {
    parts.push("Структура слова не распознана по известным правилам. Возможно, это непроизводная основа или заимствование.");
  }

  parts.push("[Предварительный анализ — rule-based система на основе академических описаний андийского языка]");

  return parts.join(" ");
}

// POST /words/analyze
router.post("/words/analyze", async (req, res) => {
  const { word } = req.body;
  if (!word || typeof word !== "string") {
    return res.status(400).json({ error: "Поле 'word' обязательно" });
  }

  // Try to find word in dictionary
  const [matchedWord] = await db
    .select()
    .from(wordsTable)
    .where(or(
      ilike(wordsTable.andiWord, word.trim()),
      ilike(wordsTable.lemma, word.trim()),
    ))
    .limit(1);

  const analysis = analyzeAndiWord(word);

  const result = {
    input: word,
    isPreliminary: true,
    matchedWord: matchedWord || null,
    segments: analysis.segments,
    explanation: analysis.explanation,
    partOfSpeech: matchedWord?.partOfSpeech || analysis.partOfSpeech,
    nounClass: matchedWord?.nounClass || analysis.nounClass,
    case: analysis.caseInfo?.caseRu || null,
    number: analysis.isPlural ? "множественное" : "единственное",
    confidence: matchedWord ? Math.min((matchedWord.confidence ?? 0.8) + 0.1, 1.0) : analysis.confidence,
  };

  return res.json(result);
});

// GET /words/:id/forms
router.get("/words/:id/forms", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Неверный id" });

  const [word] = await db.select().from(wordsTable).where(eq(wordsTable.id, id));
  if (!word) return res.status(404).json({ error: "Слово не найдено" });

  const storedForms = await db.select().from(wordFormsTable).where(eq(wordFormsTable.wordId, id));

  // If no stored forms, generate basic paradigm for nouns
  let forms = storedForms;
  if (forms.length === 0 && word.partOfSpeech === "существительное") {
    const base = word.andiWord;
    const generatedForms = [
      { wordId: id, form: base, caseName: "ABS", caseNameRu: "Именительный (абсолютный)", number: "singular", nounClass: word.nounClass, grammarNote: "Субъект непереходного глагола" },
      { wordId: id, form: base + "ди", caseName: "ERG", caseNameRu: "Эргативный", number: "singular", nounClass: word.nounClass, grammarNote: "Субъект переходного глагола" },
      { wordId: id, form: base + "с", caseName: "DAT", caseNameRu: "Дательный", number: "singular", nounClass: word.nounClass, grammarNote: "Адресат, получатель" },
      { wordId: id, form: base + "лъ", caseName: "GEN", caseNameRu: "Родительный", number: "singular", nounClass: word.nounClass, grammarNote: "Принадлежность" },
      { wordId: id, form: base + "лъун", caseName: "ABL", caseNameRu: "Аблатив", number: "singular", nounClass: word.nounClass, grammarNote: "Исходная точка" },
      { wordId: id, form: base + "лъухъ", caseName: "COM", caseNameRu: "Комитатив", number: "singular", nounClass: word.nounClass, grammarNote: "Совместность" },
      { wordId: id, form: base + "би", caseName: "ABS", caseNameRu: "Именительный", number: "plural", nounClass: word.nounClass, grammarNote: "Множественное число" },
      { wordId: id, form: base + "биди", caseName: "ERG", caseNameRu: "Эргативный", number: "plural", nounClass: word.nounClass, grammarNote: "Множественное число, субъект" },
    ];
    // Return generated forms without saving (marked as auto-generated)
    return res.json({
      word,
      forms: generatedForms.map((f, i) => ({
        id: -(i + 1),
        ...f,
      })),
    });
  }

  return res.json({ word, forms });
});

export default router;
