import fitz
import json

doc = fitz.open("attached_assets/Yazyki_narodov_SSSR_4_Iber_kavkaz_yazyki_1967_1783372314722.pdf")
print(f"Total pages: {doc.page_count}")

# Find Andi section - search for "андийский" or "Андийский"
results = []
for i in range(doc.page_count):
    page = doc[i]
    text = page.get_text()
    if "андийск" in text.lower() or "andi" in text.lower():
        results.append((i+1, text[:200]))

print(f"\nPages mentioning Andi: {[r[0] for r in results[:30]]}")
