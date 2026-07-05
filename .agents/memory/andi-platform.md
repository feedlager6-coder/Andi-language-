---
name: Andi Language Platform Architecture
description: Key decisions, data model, and conventions for the Andi language learning/research platform.
---

# Andi Language Platform

## Stack
- Frontend: React+Vite+Wouter (`artifacts/andi-language`, preview `/`)
- Backend: Express 5 + Drizzle ORM (`artifacts/api-server`, preview `/api`, port 8080)
- DB: PostgreSQL via `@workspace/db`
- API contract: OpenAPI spec at `lib/api-spec/openapi.yaml` → codegen via Orval → hooks in `@workspace/api-client-react`
- All UI text: Russian only

## Route registration order matters
`morphologyRouter` must be registered BEFORE `wordsRouter` in `routes/index.ts` because `/words/analyze` (POST) must not be caught by the `/words/:id` (GET) handler.

## Data model highlights
- `words` table: andiWord, lemma, russian, english, partOfSpeech, nounClass (I/II/III/IV), root, affixes, morphology, phonetic, examples, dialect, source, license, confidence (real 0–1), editorNotes, level
- `word_forms` table: wordId, form, caseName, caseNameRu, number, nounClass, grammarNote
- Flashcards use SM-2 spaced repetition

## Morphological analyzer
- Rule-based, explicitly marked "preliminary" in all API responses (`isPreliminary: true`)
- Sources: Madieva 1980, Salimov 2010
- Handles: class agreement prefixes (в/й/б/р), case suffixes (~14 cases), plural markers, verb infinitive suffixes
- POST /words/analyze — returns segments with type+labelRu, explanation in Russian
- GET /words/:id/forms — returns stored forms or auto-generates basic paradigm for nouns

## Grammar reference
- GET /grammar/classes — 4 noun classes with markers, semantics, examples
- GET /grammar/cases — ~14 cases with suffix, function, example
- GET /grammar/drills — 13 interactive grammar drills (noun_classes, cases, numerals, vocabulary)

**Why linguistics-first:** The platform's value is the quality of linguistic data. Rule-based analyzer is clearly labeled preliminary to avoid misleading learners.
