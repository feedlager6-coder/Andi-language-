#!/usr/bin/env python3
"""
Парсер словаря Салимова Х.С. «Гагатлинский говор андийского языка» (2010)
ИЯЛИ ДНЦ РАН, Махачкала.

Запуск: python3 parse-salimov-dict.py /tmp/salimov_full.txt
Вывод:  salimov_words.json
"""

import re, json, sys

INPUT_FILE = sys.argv[1] if len(sys.argv) > 1 else "/tmp/salimov_full.txt"
OUTPUT_FILE = "salimov_words.json"
SOURCE = "Салимов Х.С. Гагатлинский говор андийского языка — Махачкала: ИЯЛИ ДНЦ РАН, 2010"

CLASS_MAP = {"1":"I","2":"II","3":"III","4":"IV","5":"V",
             "1,2":"I/II","2,1":"I/II","1, 2":"I/II","3,4":"III/IV"}

VERB_ENDINGS = ("ду","ну","худу","иду","аду","зиду","нну","имду","жиду","чиду","хиду")
VERB_TRANS   = ("ть","ться","чь","чься","иться","аться","еться","йти","йтись","зти")

def guess_pos(word, translation, has_class, notes):
    wl = word.lower()
    tl = translation.lower().strip()
    if any(wl.endswith(e) for e in VERB_ENDINGS): return "глагол"
    if "пон." in notes or "масдар" in notes: return "глагол"
    # -лдду -дду are clearly verbs
    if wl.endswith("лдду") or wl.endswith("дду"): return "глагол"
    first_word = tl.split(",")[0].split()[0] if tl.split(",")[0].split() else ""
    if any(first_word.endswith(e) for e in VERB_TRANS):
        non_verb = ("вечность","смерть","рожь","мощь","любовь","жизнь","власть","масть",
                    "тетрадь","грудь","ткань","связь","нить","гладь","твердь","весть",
                    "тень","лень","степь","боль","соль","роль","цель","ель","форель",
                    "плоть","высоть","честь","горесть","радость","молодость")
        if not any(tl.endswith(n) for n in non_verb):
            return "глагол"
    nums = ("один","два","три","четыре","пять","шесть","семь","восемь","девять","десять",
            "сто","тысяча","двадцать","тридцать","сорок","пятьдесят","шестьдесят",
            "семьдесят","восемьдесят","девяносто","нуль","ноль")
    if any(tl.startswith(n) for n in nums): return "числительное"
    if not has_class:
        adj_ends = ("ый","ий","ой","ая","ое","ые","ной","ный","дкий","жий","щий","вый","кий")
        words = tl.split(",")[0].split()
        if words and any(words[-1].endswith(e) for e in adj_ends) and len(words) <= 4:
            return "прилагательное"
    advs = {"здесь","там","тут","сейчас","теперь","сегодня","вчера","завтра","всегда",
            "никогда","рано","поздно","быстро","медленно","хорошо","плохо","напрасно",
            "зря","потом","уже","ещё","опять","снова","отдельно","особо","очень",
            "наверное","вечно","давно","скоро","нет","да","конечно"}
    if tl.split(",")[0].strip() in advs: return "наречие"
    return "существительное"

def clean_translation(raw):
    # Убрать диалектные пометы: Р. слово, З. слово, А. слово
    t = re.sub(r'\bР\.\s*\S+', '', raw)
    t = re.sub(r'\bЗ\.\s*\S+', '', t)
    t = re.sub(r'\bА\.\s*\S+', '', t)
    # Убрать глагольные формы: пон. ..., масдар ...
    t = re.sub(r'пон\.\s*\S+,?\s*(?:масдар\s*-?\s*\S+)?', '', t)
    t = re.sub(r'масдар\s*-?\s*\S+', '', t)
    # Убрать OCR-мусор: числа в конце, многоточия
    t = re.sub(r'\.\.\.$', '', t)
    t = re.sub(r'\s*\d+$', '', t)
    # Убрать лишние пробелы
    t = re.sub(r'\s+', ' ', t).strip(" ,-.")
    return t

def extract_class_and_rest(segment):
    # "4 перевод", "1,2 перевод", "IV перевод"
    m = re.match(r'^(\d(?:[, ]\d)?)\s+(.*)', segment)
    if m:
        raw = m.group(1).replace(' ','')
        return CLASS_MAP.get(raw, raw), m.group(2).strip()
    return None, segment

def parse_dict(lines):
    # Найти начало словаря
    start = None
    for i, line in enumerate(lines):
        if i < 14000: continue
        if "ААДУ" in line:
            start = max(0, i-3)
            break
    if start is None:
        print("Начало словаря не найдено"); return []
    print(f"Словарь начинается со строки {start+1}")

    # Основной паттерн: строка начинается с ЗАГЛАВНОГО слова
    ENTRY = re.compile(
        r'^([А-ЯЁДЖТШЧЦЩАЕЁИЙКЛМНОПРСТУФХЦЧЪЫЬЭЮЯа-яёЀ-Ӿ]{1}[А-ЯЁЀ-ӿа-яё\-\s]{1,45}?)'
        r'\s{1,4}'
        r'((?:\d,?\s?\d?\s+)?[а-яёА-ЯЁa-zA-Z].+)'
    )

    words = []
    seen = set()
    skip_until_andi_section = False

    for i in range(start, len(lines)):
        raw = lines[i].rstrip('\n')
        stripped = raw.strip()

        if not stripped: continue
        if re.match(r'^\d{1,4}$', stripped): continue  # страница
        if re.match(r'^[A-Za-z]{1,4}$', stripped): continue  # буква алфавита

        m = ENTRY.match(raw)
        if not m:
            # Попробуем нестрогий вариант
            m = re.match(
                r'^([А-ЯЁДЖ][А-ЯЁА-яёЀ-Ӿ\s\-]{2,45}?)\s+((?:\d\s+)?[а-яё].{2,})',
                raw
            )
            if not m: continue

        word_raw = m.group(1).strip()
        rest     = m.group(2).strip()

        # Проверка: слово должно быть преимущественно в верхнем регистре
        upper = sum(1 for c in word_raw if c.isupper() and '\u0400' <= c <= '\u04ff')
        total = sum(1 for c in word_raw if '\u0400' <= c <= '\u04ff')
        if total == 0 or (upper / total) < 0.50: continue

        # Убрать пробелы внутри слова (OCR-артефакты), но сохранить пробелы между компонентами
        word = re.sub(r'\s+', '', word_raw).strip()
        if len(word) < 2: continue

        # Явно плохие записи
        if re.match(r'^[A-Za-z\d]+$', word): continue

        # Извлечь класс
        noun_class, translation_raw = extract_class_and_rest(rest)

        # Убрать случайные цифры в начале перевода (артефакт класса)
        translation_raw = re.sub(r'^[\d,\s]+\s', '', translation_raw)

        # Убрать OCR-пометы типа "Р. слово", "З. слово" ДО очистки
        dialect_note = ""
        for marker, name in [("Р.", "Риквани"), ("З.", "Зило"), ("А.", "Анди")]:
            m2 = re.search(r'\b' + re.escape(marker) + r'\s*(\S+)', rest)
            if m2: dialect_note += f"{name}: {m2.group(1)}; "

        translation = clean_translation(translation_raw)

        # Фильтры качества
        if not translation or len(translation) < 3: continue
        if re.match(r'^[А-ЯЁ]{3,}', translation): continue  # перевод = ещё одно слово
        # Перевод не должен начинаться с числа (артефакт OCR)
        if re.match(r'^\d', translation): continue
        # Убрать если перевод содержит только латиницу
        if re.match(r'^[A-Za-z ]+$', translation): continue

        pos = guess_pos(word, translation, noun_class is not None, rest)

        key = word.upper()
        if key in seen: continue
        seen.add(key)

        # Уровень: глаголы и сложные слова → intermediate
        level = "beginner" if (
            len(word) <= 10 and
            pos in ("существительное", "прилагательное", "числительное") and
            "," not in translation[:20]
        ) else "intermediate"

        words.append({
            "andiWord":    word,
            "lemma":       word.lower(),
            "russian":     translation[:500],
            "english":     None,
            "partOfSpeech": pos,
            "nounClass":   noun_class,
            "phonetic":    None,
            "examples":    None,
            "dialect":     dialect_note.strip("; ") or None,
            "source":      SOURCE,
            "license":     "academic",
            "confidence":  0.85,
            "level":       level,
            "editorNotes": None,
        })

    return words

def main():
    print(f"Читаю: {INPUT_FILE}")
    with open(INPUT_FILE, encoding="utf-8") as f:
        lines = f.readlines()
    print(f"Строк: {len(lines)}")

    words = parse_dict(lines)
    print(f"Извлечено: {len(words)} записей")

    pos_stat = {}
    for w in words:
        pos_stat[w["partOfSpeech"]] = pos_stat.get(w["partOfSpeech"], 0) + 1
    print("Части речи:", pos_stat)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(words, f, ensure_ascii=False, indent=2)
    print(f"Сохранено в {OUTPUT_FILE}")

    print("\nПримеры (существительные с классом):")
    for w in [x for x in words if x["nounClass"] and x["partOfSpeech"]=="существительное"][:10]:
        print(f"  {w['andiWord']} [{w['nounClass']}] = {w['russian'][:50]}")

    print("\nПримеры (глаголы):")
    for w in [x for x in words if x["partOfSpeech"]=="глагол"][:8]:
        print(f"  {w['andiWord']} = {w['russian'][:50]}")

if __name__ == "__main__":
    main()
