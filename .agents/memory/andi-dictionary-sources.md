---
name: Andi dictionary data sources
description: Which sources are authoritative for the Andi language dictionary, and how to pull structured data from CLLD/IDS.
---

The original dictionary (Salimov 2010 "Gagatlinsky govor" + Мадиева 1980) was disputed by a native speaker as not reliably representing Andi. It was replaced with the CLLD/IDS "Andi Dictionary" (https://ids.clld.org/contributions/32, contribution id 32, ~1544 entries), cross-checked against the academic grammar chapter by И.И. Церцвадзе, "Андийский язык", in "Языки народов СССР, т. IV" (1967), printed pages 276–292.

**Why:** the CLLD/IDS dataset is structured (Cyrillic + phonemic transcription per IDS semantic concept), sourced from an academic dictionary project, and directly exportable — a much stronger foundation than the disputed Salimov source.

**How to apply:** any future work touching the `words` table should treat CLLD contribution 32 + Церцвадзе 1967 as the canonical source. `dialect` field defaults to "верхнеандийский (стандарт)" — per minlang.iling-ran.ru, upper-Andi (aul Andi/Gagatli/Zilo/Rikvani/etc.) is the larger, standard dialect group; lower-Andi (Munib/Kwanhidatli) is sometimes classified as a separate language in current research.

**CLLD data export trick:** CLLD contribution pages don't expose obvious REST/CSV endpoints, but every contribution has a hidden tab-separated download at `https://ids.clld.org/contributions/{id}.tab` (found by grepping the page HTML for the `contribution_alt` JS route). This returns clean TSV with columns like `chapter_id, entry_id, meaning, {Lang}_CyrillTrans, {Lang}_Phonemic, comment`.

**Free-tier translation trick:** when the Anthropic/OpenAI AI integration requires an account upgrade the user has declined, batch-translate short strings via the free `https://translate.googleapis.com/translate_a/t?client=gtx&sl=en&tl=ru&dt=t&q=...` endpoint (supports multiple `q=` params per request, no key needed) instead of retrying the AI integration or asking for an API key.
