import fitz

doc = fitz.open("attached_assets/Yazyki_narodov_SSSR_4_Iber_kavkaz_yazyki_1967_1783372314722.pdf")

# Search for Andi section - try Cyrillic and Latin variations
keywords = ["Анди", "анди", "Andi", "andi", "андийс", "Андийс"]
found = {}
for i in range(doc.page_count):
    page = doc[i]
    text = page.get_text()
    for kw in keywords:
        if kw in text:
            if i not in found:
                found[i] = text[:300]

print(f"Pages with Andi-related content: {sorted(found.keys())}")
for pg, snippet in sorted(found.items())[:5]:
    print(f"\n--- Page {pg+1} ---")
    print(snippet[:400])
