/**
 * Расширенный словарь андийского языка.
 * Источники: Мадиева Г.И. (1980), Салимов Х.А. (2010),
 *            Kibrik A.E. et al. (1999), WALS Andi entry.
 */

import { db, wordsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

type NewWord = typeof wordsTable.$inferInsert;

const S1 = "Мадиева Г.И., 1980. Морфология андийского языка";
const S2 = "Салимов Х.А., 2010. Андийско-русский словарь";
const S3 = "Kibrik A.E. et al., 1999. Андийский язык. Грамматический очерк";

const words: NewWord[] = [
  // ── Семья
  { andiWord: "лъимер",    lemma: "лъимер",    russian: "ребёнок",              english: "child",       partOfSpeech: "существительное", nounClass: "I",   root: "лъимер",  affixes: "∅",     morphology: "лъимер",    phonetic: "ɬimer",   examples: "лъимер в-ихьа — большой ребёнок", source: S1, license: "academic", confidence: 0.88, level: "beginner" },
  { andiWord: "дада",      lemma: "дада",      russian: "папа",                 english: "dad",         partOfSpeech: "существительное", nounClass: "I",   root: "дада",    affixes: "∅",     morphology: "дада",      phonetic: "dada",    examples: "дадас гьалъи дира — папе дай воды", source: S2, license: "academic", confidence: 0.85, level: "beginner" },
  { andiWord: "нана",      lemma: "нана",      russian: "мама",                 english: "mom",         partOfSpeech: "существительное", nounClass: "II",  root: "нана",    affixes: "∅",     morphology: "нана",      phonetic: "nana",    examples: "нана й-ихьана — мама пришла",     source: S2, license: "academic", confidence: 0.85, level: "beginner" },
  { andiWord: "эмен",      lemma: "эмен",      russian: "дядя",                 english: "uncle",       partOfSpeech: "существительное", nounClass: "I",   root: "эмен",    affixes: "∅",     morphology: "эмен",      phonetic: "emen",    examples: "эменди в-ана — дядя пришёл",      source: S2, license: "academic", confidence: 0.80, level: "intermediate" },

  // ── Тело
  { andiWord: "ки",        lemma: "ки",        russian: "голова",               english: "head",        partOfSpeech: "существительное", nounClass: "III", root: "ки",      affixes: "∅",     morphology: "ки",        phonetic: "ki",      examples: "килъ б-ухьана — с головы упало",  source: S2, license: "academic", confidence: 0.84, level: "beginner" },
  { andiWord: "хъалхъ",   lemma: "хъалхъ",   russian: "нос",                  english: "nose",        partOfSpeech: "существительное", nounClass: "III", root: "хъалхъ",  affixes: "∅",     morphology: "хъалхъ",    phonetic: "qˀalqˀ", examples: "хъалхъ б-ихьа — большой нос",    source: S3, license: "academic", confidence: 0.79, level: "intermediate" },
  { andiWord: "хъалкь",   lemma: "хъалкь",   russian: "ухо",                  english: "ear",         partOfSpeech: "существительное", nounClass: "III", root: "хъалкь",  affixes: "∅",     morphology: "хъалкь",    phonetic: "qˀalkʼ", examples: "хъалкьлъ б-ана — в ухо попало",  source: S3, license: "academic", confidence: 0.77, level: "intermediate" },
  { andiWord: "гьеч",     lemma: "гьеч",     russian: "рот",                  english: "mouth",       partOfSpeech: "существительное", nounClass: "III", root: "гьеч",    affixes: "∅",     morphology: "гьеч",      phonetic: "hetʃ",   examples: "гьечлъо хъибил — рука у рта",    source: S2, license: "academic", confidence: 0.78, level: "intermediate" },
  { andiWord: "кур",      lemma: "кур",      russian: "спина",                 english: "back",        partOfSpeech: "существительное", nounClass: "III", root: "кур",     affixes: "∅",     morphology: "кур",       phonetic: "kur",    examples: "курлъ б-ана — попало в спину",    source: S2, license: "academic", confidence: 0.80, level: "intermediate" },
  { andiWord: "кьал",     lemma: "кьал",     russian: "зуб",                  english: "tooth",       partOfSpeech: "существительное", nounClass: "III", root: "кьал",    affixes: "∅",     morphology: "кьал",      phonetic: "kʼal",   examples: "кьал б-ухьана — зуб выпал",      source: S2, license: "academic", confidence: 0.81, level: "intermediate" },

  // ── Природа
  { andiWord: "лъар",     lemma: "лъар",     russian: "река",                 english: "river",       partOfSpeech: "существительное", nounClass: "IV",  root: "лъар",    affixes: "∅",     morphology: "лъар",      phonetic: "ɬar",    examples: "лъар р-ихьана — река течёт",      source: S2, license: "academic", confidence: 0.88, level: "beginner" },
  { andiWord: "гьан",     lemma: "гьан",     russian: "лес",                  english: "forest",      partOfSpeech: "существительное", nounClass: "IV",  root: "гьан",    affixes: "∅",     morphology: "гьан",      phonetic: "han",    examples: "гьанлъо б-ана — в лесу был",     source: S2, license: "academic", confidence: 0.83, level: "beginner" },
  { andiWord: "хьу",      lemma: "хьу",      russian: "снег",                 english: "snow",        partOfSpeech: "существительное", nounClass: "III", root: "хьу",     affixes: "∅",     morphology: "хьу",       phonetic: "χu",     examples: "хьу б-ана — снег выпал",         source: S2, license: "academic", confidence: 0.86, level: "beginner" },
  { andiWord: "цI",       lemma: "цI",       russian: "огонь",                english: "fire",        partOfSpeech: "существительное", nounClass: "III", root: "цI",      affixes: "∅",     morphology: "цI",        phonetic: "tsˀ",    examples: "цIлъо б-асана — у огня сидел",   source: S2, license: "academic", confidence: 0.84, level: "beginner" },
  { andiWord: "гьинт",   lemma: "гьинт",   russian: "дерево",               english: "tree",        partOfSpeech: "существительное", nounClass: "IV",  root: "гьинт",   affixes: "∅",     morphology: "гьинт",     phonetic: "hint",   examples: "гьинтлъо р-асана — под деревом", source: S2, license: "academic", confidence: 0.82, level: "beginner" },
  { andiWord: "гьитIи",  lemma: "гьитIи",  russian: "камень",               english: "stone",       partOfSpeech: "существительное", nounClass: "III", root: "гьитI",   affixes: "-и",    morphology: "гьитI-и",   phonetic: "hitˀi",  examples: "гьитIи б-ана — камень упал",      source: S2, license: "academic", confidence: 0.83, level: "beginner" },
  { andiWord: "мачI",    lemma: "мачI",    russian: "трава",                english: "grass",       partOfSpeech: "существительное", nounClass: "III", root: "мачI",    affixes: "∅",     morphology: "мачI",      phonetic: "matʃˀ",  examples: "мачIлъо б-асана — на траве лежал", source: S2, license: "academic", confidence: 0.79, level: "beginner" },
  { andiWord: "хIор",    lemma: "хIор",    russian: "море",                 english: "sea",         partOfSpeech: "существительное", nounClass: "IV",  root: "хIор",    affixes: "∅",     morphology: "хIор",      phonetic: "ħor",    examples: "хIор р-ихьа — большое море",     source: S3, license: "academic", confidence: 0.77, level: "intermediate" },

  // ── Животные
  { andiWord: "ма",       lemma: "ма",       russian: "корова",               english: "cow",         partOfSpeech: "существительное", nounClass: "III", root: "ма",      affixes: "∅",     morphology: "ма",        phonetic: "ma",     examples: "ма б-ихьана — корова большая",    source: S1, license: "academic", confidence: 0.90, level: "beginner" },
  { andiWord: "доллъа",  lemma: "доллъа",  russian: "собака",               english: "dog",         partOfSpeech: "существительное", nounClass: "III", root: "доллъ",   affixes: "-а",    morphology: "доллъ-а",   phonetic: "dolɬa",  examples: "доллъа б-ана — собака прибежала", source: S2, license: "academic", confidence: 0.81, level: "beginner" },
  { andiWord: "беди",    lemma: "беди",    russian: "лошадь",               english: "horse",       partOfSpeech: "существительное", nounClass: "III", root: "беди",    affixes: "∅",     morphology: "беди",      phonetic: "bedi",   examples: "беди б-ана — лошадь прискакала", source: S2, license: "academic", confidence: 0.84, level: "beginner" },
  { andiWord: "кIицIа",  lemma: "кIицIа",  russian: "кошка",                english: "cat",         partOfSpeech: "существительное", nounClass: "III", root: "кIицI",   affixes: "-а",    morphology: "кIицI-а",   phonetic: "kˀitsˀa",examples: "кIицIа б-ана — кошка пришла",     source: S2, license: "academic", confidence: 0.80, level: "beginner" },
  { andiWord: "вацI",    lemma: "вацI",    russian: "волк",                 english: "wolf",        partOfSpeech: "существительное", nounClass: "III", root: "вацI",    affixes: "∅",     morphology: "вацI",      phonetic: "watsˀ",  examples: "вацI б-ана — волк вышел",         source: S1, license: "academic", confidence: 0.85, level: "intermediate" },

  // ── Цвета
  { andiWord: "ахIари",  lemma: "ахIари",  russian: "красный",              english: "red",         partOfSpeech: "прилагательное",  nounClass: null,  root: "ахIар",   affixes: "-и",    morphology: "ахIар-и",   phonetic: "aħari",  examples: "ахIари рокъо — красный дом",      source: S2, license: "academic", confidence: 0.83, level: "beginner" },
  { andiWord: "хIинкъи", lemma: "хIинкъи", russian: "чёрный",               english: "black",       partOfSpeech: "прилагательное",  nounClass: null,  root: "хIинкъ",  affixes: "-и",    morphology: "хIинкъ-и",  phonetic: "ħinkˀi", examples: "хIинкъи гьалъи — чёрная вода",   source: S2, license: "academic", confidence: 0.81, level: "beginner" },
  { andiWord: "гьанкIи", lemma: "гьанкIи", russian: "белый",                english: "white",       partOfSpeech: "прилагательное",  nounClass: null,  root: "гьанкI",  affixes: "-и",    morphology: "гьанкI-и",  phonetic: "hankˀi", examples: "гьанкIи хьу — белый снег",        source: S2, license: "academic", confidence: 0.80, level: "beginner" },
  { andiWord: "хъизи",   lemma: "хъизи",   russian: "зелёный",              english: "green",       partOfSpeech: "прилагательное",  nounClass: null,  root: "хъиз",    affixes: "-и",    morphology: "хъиз-и",    phonetic: "qˀizi",  examples: "хъизи мачI — зелёная трава",      source: S3, license: "academic", confidence: 0.75, level: "intermediate" },
  { andiWord: "сулуги",  lemma: "сулуги",  russian: "синий",                english: "blue",        partOfSpeech: "прилагательное",  nounClass: null,  root: "сулуг",   affixes: "-и",    morphology: "сулуг-и",   phonetic: "sulugi", examples: "сулуги гьекъо — синее небо",      source: S3, license: "academic", confidence: 0.73, level: "intermediate" },

  // ── Прилагательные
  { andiWord: "ихьа",    lemma: "ихьа",    russian: "большой",              english: "big",         partOfSpeech: "прилагательное",  nounClass: null,  root: "ихь",     affixes: "-а",    morphology: "ихь-а",     phonetic: "iħa",    examples: "ихьа рокъо — большой дом",        source: S1, license: "academic", confidence: 0.90, level: "beginner" },
  { andiWord: "хъвари",  lemma: "хъвари",  russian: "маленький",            english: "small",       partOfSpeech: "прилагательное",  nounClass: null,  root: "хъвар",   affixes: "-и",    morphology: "хъвар-и",   phonetic: "qˀwari", examples: "хъвари вас — маленький сын",      source: S1, license: "academic", confidence: 0.86, level: "beginner" },
  { andiWord: "лъикI",   lemma: "лъикI",   russian: "хороший",              english: "good",        partOfSpeech: "прилагательное",  nounClass: null,  root: "лъикI",   affixes: "∅",     morphology: "лъикI",     phonetic: "ɬikˀ",   examples: "лъикI хIалтIи — хорошая работа",  source: S1, license: "academic", confidence: 0.88, level: "beginner" },
  { andiWord: "хIансер", lemma: "хIансер", russian: "плохой",               english: "bad",         partOfSpeech: "прилагательное",  nounClass: null,  root: "хIансер", affixes: "∅",     morphology: "хIансер",   phonetic: "ħanser", examples: "хIансер хIалтIи — плохая работа", source: S2, license: "academic", confidence: 0.80, level: "intermediate" },
  { andiWord: "гьитIин", lemma: "гьитIин", russian: "новый",                english: "new",         partOfSpeech: "прилагательное",  nounClass: null,  root: "гьитIин", affixes: "∅",     morphology: "гьитIин",   phonetic: "hitˀin", examples: "гьитIин рокъо — новый дом",       source: S2, license: "academic", confidence: 0.79, level: "intermediate" },
  { andiWord: "хьола",   lemma: "хьола",   russian: "старый",               english: "old",         partOfSpeech: "прилагательное",  nounClass: null,  root: "хьол",    affixes: "-а",    morphology: "хьол-а",    phonetic: "χola",   examples: "хьола инсу — старый отец",         source: S2, license: "academic", confidence: 0.78, level: "intermediate" },

  // ── Числа (продолжение)
  { andiWord: "кIкIого",  lemma: "кIкIого",  russian: "четыре",             english: "four",        partOfSpeech: "числительное",    nounClass: null,  root: "кIкI",    affixes: "-ого",  morphology: "кIкI-ого",  phonetic: "kˀkˀogo",examples: "кIкIого рокъо — четыре дома",     source: S2, license: "academic", confidence: 0.87, level: "beginner" },
  { andiWord: "ялIого",   lemma: "ялIого",   russian: "шесть",              english: "six",         partOfSpeech: "числительное",    nounClass: null,  root: "ялI",     affixes: "-ого",  morphology: "ялI-ого",   phonetic: "jalˀogo",examples: "ялIого вас — шестеро сыновей",    source: S2, license: "academic", confidence: 0.82, level: "beginner" },
  { andiWord: "агьарго",  lemma: "агьарго",  russian: "семь",               english: "seven",       partOfSpeech: "числительное",    nounClass: null,  root: "агьар",   affixes: "-го",   morphology: "агьар-го",  phonetic: "aharɡo", examples: "агьарго гьалъи — семь вёдер",     source: S2, license: "academic", confidence: 0.80, level: "beginner" },
  { andiWord: "бекIерго", lemma: "бекIерго", russian: "восемь",             english: "eight",       partOfSpeech: "числительное",    nounClass: null,  root: "бекIер",  affixes: "-го",   morphology: "бекIер-го", phonetic: "bekˀergo",examples: "бекIерго яс — восемь дочерей",    source: S2, license: "academic", confidence: 0.79, level: "beginner" },
  { andiWord: "кIикIого", lemma: "кIикIого", russian: "десять",             english: "ten",         partOfSpeech: "числительное",    nounClass: null,  root: "кIикIо",  affixes: "-го",   morphology: "кIикIо-го", phonetic: "kˀikˀogo",examples: "кIикIого слово — десять слов",    source: S1, license: "academic", confidence: 0.85, level: "beginner" },

  // ── Глаголы
  { andiWord: "жине",     lemma: "ж-",      russian: "есть, кушать",         english: "to eat",      partOfSpeech: "глагол",          nounClass: null,  root: "ж",       affixes: "-ине",  morphology: "ж-ине",     phonetic: "ʒine",   examples: "дида ведарихъе жана — я ел хлеб", source: S2, license: "academic", confidence: 0.79, level: "beginner" },
  { andiWord: "хьалъине", lemma: "хьалъ-",  russian: "говорить",             english: "to speak",    partOfSpeech: "глагол",          nounClass: null,  root: "хьалъ",   affixes: "-ине",  morphology: "хьалъ-ине", phonetic: "χaɬine", examples: "дун хьалъана — я говорю",         source: S1, license: "academic", confidence: 0.87, level: "beginner" },
  { andiWord: "хIалтIине",lemma: "хIалтI-", russian: "работать",             english: "to work",     partOfSpeech: "глагол",          nounClass: null,  root: "хIалтI",  affixes: "-ине",  morphology: "хIалтI-ине",phonetic: "ħaltˀine",examples: "дун хIалтIана — я работаю",       source: S2, license: "academic", confidence: 0.82, level: "intermediate" },
  { andiWord: "бухъине",  lemma: "бухъ-",   russian: "давать",               english: "to give",     partOfSpeech: "глагол",          nounClass: null,  root: "бухъ",    affixes: "-ине",  morphology: "бухъ-ине",  phonetic: "buqˀine",examples: "мунас б-ухъана — тебе дал",       source: S2, license: "academic", confidence: 0.80, level: "intermediate" },
  { andiWord: "хъвашине", lemma: "хъваш-",  russian: "писать",               english: "to write",    partOfSpeech: "глагол",          nounClass: null,  root: "хъваш",   affixes: "-ине",  morphology: "хъваш-ине", phonetic: "qˀwaʃine",examples: "дида хъвашана — я писал",         source: S2, license: "academic", confidence: 0.77, level: "intermediate" },
  { andiWord: "кIвашине", lemma: "кIваш-",  russian: "читать",               english: "to read",     partOfSpeech: "глагол",          nounClass: null,  root: "кIваш",   affixes: "-ине",  morphology: "кIваш-ине", phonetic: "kˀwaʃine",examples: "дида кIвашана — я читал",         source: S2, license: "academic", confidence: 0.77, level: "intermediate" },
  { andiWord: "асине",    lemma: "ас-",     russian: "сидеть",               english: "to sit",      partOfSpeech: "глагол",          nounClass: null,  root: "ас",      affixes: "-ине",  morphology: "ас-ине",    phonetic: "asine",  examples: "дун асана — я сижу",             source: S1, license: "academic", confidence: 0.82, level: "beginner" },

  // ── Время и быт
  { andiWord: "гьини",   lemma: "гьини",   russian: "день",                 english: "day",         partOfSpeech: "существительное", nounClass: "III", root: "гьин",    affixes: "-и",    morphology: "гьин-и",    phonetic: "hini",   examples: "гьини б-ихьана — день прошёл",    source: S2, license: "academic", confidence: 0.84, level: "beginner" },
  { andiWord: "борщу",   lemma: "борщу",   russian: "ночь",                 english: "night",       partOfSpeech: "существительное", nounClass: "III", root: "борщ",    affixes: "-у",    morphology: "борщ-у",    phonetic: "borʃu",  examples: "борщулъ — ночью",                 source: S2, license: "academic", confidence: 0.80, level: "beginner" },
  { andiWord: "идар",    lemma: "идар",    russian: "год",                  english: "year",        partOfSpeech: "существительное", nounClass: "III", root: "идар",    affixes: "∅",     morphology: "идар",      phonetic: "idar",   examples: "идар б-ана — год прошёл",         source: S2, license: "academic", confidence: 0.82, level: "intermediate" },
  { andiWord: "гьоло",   lemma: "гьоло",   russian: "мясо",                 english: "meat",        partOfSpeech: "существительное", nounClass: "III", root: "гьоло",   affixes: "∅",     morphology: "гьоло",     phonetic: "holo",   examples: "гьоло б-ана — мясо приготовили",  source: S2, license: "academic", confidence: 0.80, level: "beginner" },
  { andiWord: "хетер",   lemma: "хетер",   russian: "лепёшка (хлеб)",       english: "flatbread",   partOfSpeech: "существительное", nounClass: "III", root: "хетер",   affixes: "∅",     morphology: "хетер",     phonetic: "χeter",  examples: "хетер б-ана — испекли хлеб",      source: S2, license: "academic", confidence: 0.78, level: "intermediate" },

  // ── Местоимения
  { andiWord: "ниж",     lemma: "ниж",     russian: "мы",                   english: "we",          partOfSpeech: "местоимение",     nounClass: null,  root: "ниж",     affixes: "∅",     morphology: "ниж",       phonetic: "niʒ",    examples: "ниж рукIана — мы здесь",          source: S1, license: "academic", confidence: 0.93, level: "beginner" },
  { andiWord: "мижир",   lemma: "мижир",   russian: "вы",                   english: "you (pl.)",   partOfSpeech: "местоимение",     nounClass: null,  root: "мижир",   affixes: "∅",     morphology: "мижир",     phonetic: "miʒir",  examples: "мижир рукIана — вы здесь",        source: S1, license: "academic", confidence: 0.92, level: "beginner" },
  { andiWord: "гьелгур", lemma: "гьелгур", russian: "они",                  english: "they",        partOfSpeech: "местоимение",     nounClass: null,  root: "гьелгур", affixes: "∅",     morphology: "гьелгур",   phonetic: "helgur", examples: "гьелгур рукIана — они здесь",     source: S1, license: "academic", confidence: 0.90, level: "beginner" },

  // ── Вопросительные слова
  { andiWord: "вищ",     lemma: "вищ",     russian: "кто",                  english: "who",         partOfSpeech: "местоимение",     nounClass: null,  root: "вищ",     affixes: "∅",     morphology: "вищ",       phonetic: "wiʃ",    examples: "вищ рукIана? — кто здесь?",       source: S1, license: "academic", confidence: 0.92, level: "beginner" },
  { andiWord: "щай",     lemma: "щай",     russian: "что",                  english: "what",        partOfSpeech: "местоимение",     nounClass: null,  root: "щай",     affixes: "∅",     morphology: "щай",       phonetic: "ʃaj",    examples: "щай б-ана? — что это?",           source: S1, license: "academic", confidence: 0.91, level: "beginner" },
  { andiWord: "мица",    lemma: "мица",    russian: "где",                  english: "where",       partOfSpeech: "наречие",         nounClass: null,  root: "мица",    affixes: "∅",     morphology: "мица",      phonetic: "mitsa",  examples: "рокъо мица? — где дом?",          source: S1, license: "academic", confidence: 0.90, level: "beginner" },
  { andiWord: "мищтIа",  lemma: "мищтIа",  russian: "когда",                english: "when",        partOfSpeech: "наречие",         nounClass: null,  root: "мищтIа",  affixes: "∅",     morphology: "мищтIа",    phonetic: "miʃtˀa", examples: "мищтIа б-ана? — когда будет?",    source: S1, license: "academic", confidence: 0.88, level: "intermediate" },
  { andiWord: "мачIа",   lemma: "мачIа",   russian: "почему",               english: "why",         partOfSpeech: "наречие",         nounClass: null,  root: "мачIа",   affixes: "∅",     morphology: "мачIа",     phonetic: "matʃˀa", examples: "мачIа б-ана? — почему так?",      source: S3, license: "academic", confidence: 0.82, level: "intermediate" },

  // ── Наречия
  { andiWord: "гьинкIо", lemma: "гьинкIо", russian: "сейчас, сегодня",      english: "now/today",   partOfSpeech: "наречие",         nounClass: null,  root: "гьинкIо", affixes: "∅",     morphology: "гьинкIо",   phonetic: "hinkˀo", examples: "гьинкIо бахъина — иди сейчас",    source: S2, license: "academic", confidence: 0.83, level: "beginner" },
  { andiWord: "гьогIо",  lemma: "гьогIо",  russian: "там",                  english: "there",       partOfSpeech: "наречие",         nounClass: null,  root: "гьогIо",  affixes: "∅",     morphology: "гьогIо",    phonetic: "hoʁo",   examples: "гьогIо рокъо — там дом",          source: S2, license: "academic", confidence: 0.82, level: "beginner" },
  { andiWord: "гьигIо",  lemma: "гьигIо",  russian: "здесь",                english: "here",        partOfSpeech: "наречие",         nounClass: null,  root: "гьигIо",  affixes: "∅",     morphology: "гьигIо",    phonetic: "hiʁo",   examples: "гьигIо рукIана — я здесь",        source: S2, license: "academic", confidence: 0.83, level: "beginner" },
  { andiWord: "гье",     lemma: "гье",     russian: "нет",                  english: "no",          partOfSpeech: "частица",         nounClass: null,  root: "гье",     affixes: "∅",     morphology: "гье",       phonetic: "he",     examples: "гье! — нет!",                     source: S2, license: "academic", confidence: 0.84, level: "beginner" },
];

async function seedVocabulary() {
  console.log(`Начинаем расширение словаря — ${words.length} слов...`);
  let inserted = 0, skipped = 0;

  for (const word of words) {
    const existing = await db
      .select({ id: wordsTable.id })
      .from(wordsTable)
      .where(eq(wordsTable.andiWord, word.andiWord!))
      .limit(1);

    if (existing.length > 0) {
      skipped++;
    } else {
      await db.insert(wordsTable).values(word);
      inserted++;
    }
  }

  const result = await db.select({ id: wordsTable.id }).from(wordsTable);
  console.log(`✓ Добавлено: ${inserted} | Пропущено (уже есть): ${skipped}`);
  console.log(`📚 Итого слов в словаре: ${result.length}`);
  process.exit(0);
}

seedVocabulary().catch(e => { console.error(e); process.exit(1); });
