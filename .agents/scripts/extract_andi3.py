import fitz

doc = fitz.open("attached_assets/Yazyki_narodov_SSSR_4_Iber_kavkaz_yazyki_1967_1783372314722.pdf")

# Render page 317 as image to see what's there
# Pages are 0-indexed
# Let's check pages 315-325 for Andi language content (Магомедбекова section)
for pg_idx in range(314, 325):
    if pg_idx < doc.page_count:
        page = doc[pg_idx]
        text = page.get_text()
        if text.strip():
            print(f"=== Page {pg_idx+1} (has text) ===")
            print(text[:500])
        else:
            print(f"=== Page {pg_idx+1} (IMAGE/SCAN - no text) ===")
