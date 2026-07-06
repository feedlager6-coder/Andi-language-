import fitz
import os

doc = fitz.open("attached_assets/Yazyki_narodov_SSSR_4_Iber_kavkaz_yazyki_1967_1783372314722.pdf")
os.makedirs(".agents/outputs/andi_search", exist_ok=True)

# Render pages 115-160 at low zoom to scan for Andi chapter
for pg_idx in range(114, 165):
    if pg_idx < doc.page_count:
        page = doc[pg_idx]
        mat = fitz.Matrix(1.2, 1.2)
        pix = page.get_pixmap(matrix=mat)
        pix.save(f".agents/outputs/andi_search/page_{pg_idx+1:03d}.png")

print(f"Done. Total pages: {doc.page_count}")
