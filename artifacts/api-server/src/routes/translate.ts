import { Router } from "express";
import { db, phrasesTable, wordsTable } from "@workspace/db";
import { ilike, or, sql } from "drizzle-orm";
import { TranslateTextBody } from "@workspace/api-zod";

const router = Router();

function normalize(text: string): string {
  return text.trim().toLowerCase().replace(/[.,!?;:"'()«»]/g, "");
}

function tokenize(text: string): string[] {
  return normalize(text)
    .split(/\s+/)
    .filter(Boolean);
}

interface Segment {
  sourceText: string;
  translatedText: string | null;
  matchType: "phrase" | "word" | "unmatched";
  confidence: number;
  sourceRef?: string;
  notes?: string | null;
}

router.post("/translate", async (req, res) => {
  const body = TranslateTextBody.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "Invalid body" });
  const input = body.data.text;
  const normalizedInput = normalize(input);

  if (!normalizedInput) {
    return res.status(400).json({ error: "Пустой текст" });
  }

  const segments: Segment[] = [];

  const [exactPhrase] = await db
    .select()
    .from(phrasesTable)
    .where(ilike(phrasesTable.russian, normalizedInput))
    .limit(1);

  if (exactPhrase) {
    segments.push({
      sourceText: input,
      translatedText: exactPhrase.andi,
      matchType: "phrase",
      confidence: exactPhrase.confidence ?? 0.7,
      sourceRef: "phrasebank",
      notes: exactPhrase.breakdown ?? null,
    });
  } else {
    const tokens = tokenize(input);
    const usedIndices = new Set<number>();

    for (let size = Math.min(4, tokens.length); size >= 2; size--) {
      for (let i = 0; i + size <= tokens.length; i++) {
        if ([...Array(size).keys()].some((k) => usedIndices.has(i + k))) continue;
        const chunk = tokens.slice(i, i + size).join(" ");
        const [phraseMatch] = await db
          .select()
          .from(phrasesTable)
          .where(ilike(phrasesTable.russian, `%${chunk}%`))
          .limit(1);
        if (phraseMatch) {
          segments.push({
            sourceText: chunk,
            translatedText: phraseMatch.andi,
            matchType: "phrase",
            confidence: Math.max((phraseMatch.confidence ?? 0.7) - 0.1, 0.3),
            sourceRef: "phrasebank",
            notes: phraseMatch.breakdown ?? null,
          });
          for (let k = 0; k < size; k++) usedIndices.add(i + k);
        }
      }
    }

    for (let i = 0; i < tokens.length; i++) {
      if (usedIndices.has(i)) continue;
      const token = tokens[i];

      const [wordMatch] = await db
        .select()
        .from(wordsTable)
        .where(or(ilike(wordsTable.russian, token), ilike(wordsTable.russian, `%${token}%`)))
        .limit(1);

      if (wordMatch) {
        segments.push({
          sourceText: token,
          translatedText: wordMatch.andiWord,
          matchType: "word",
          confidence: Math.min((wordMatch.confidence ?? 0.6) - 0.15, 0.75),
          sourceRef: "dictionary",
          notes: wordMatch.partOfSpeech ? `${wordMatch.partOfSpeech}${wordMatch.nounClass ? ", " + wordMatch.nounClass : ""}` : null,
        });
      } else {
        segments.push({
          sourceText: token,
          translatedText: null,
          matchType: "unmatched",
          confidence: 0,
          notes: "Нет уверенного соответствия в словаре или фразнике",
        });
      }
    }
  }

  const draftTranslation = segments
    .filter((s) => s.translatedText)
    .map((s) => s.translatedText)
    .join(" ");

  const matchedSegments = segments.filter((s) => s.matchType !== "unmatched");
  const overallConfidence = matchedSegments.length
    ? matchedSegments.reduce((sum, s) => sum + s.confidence, 0) / segments.length
    : 0;

  const unmatchedCount = segments.filter((s) => s.matchType === "unmatched").length;

  const result = {
    input,
    isDraft: true,
    segments,
    draftTranslation: draftTranslation || null,
    overallConfidence: Math.round(overallConfidence * 100) / 100,
    disclaimer:
      unmatchedCount > 0
        ? `Это черновой перевод, не полный машинный перевод. ${unmatchedCount} из ${segments.length} фрагмент(ов) не найдено в словаре или фразнике — требуется ручная проверка носителем языка.`
        : "Это черновой перевод на основе словаря и фразника. Все фрагменты найдены, но рекомендуется проверка носителем языка перед использованием.",
  };

  return res.json(result);
});

export default router;
