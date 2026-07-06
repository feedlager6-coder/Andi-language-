import fitz

doc = fitz.open("attached_assets/Yazyki_narodov_SSSR_4_Iber_kavkaz_yazyki_1967_1783372314722.pdf")
os.makedirs = __import__('os').makedirs

# Render pages 1-8 (table of contents) and 340-358 at low zoom to scan
import os
os.makedirs(".agents/outputs/toc", exist_ok=True)
os.makedirs(".agents/outputs/andi_late", exist_ok=True)

# TOC pages
for pg_idx in range(0, 8):
    page = doc[pg_idx]
    mat = fitz.Matrix(1.5, 1.5)
    pix = page.get_pixmap(matrix=mat)
    pix.save(f".agents/outputs/toc/page_{pg_idx+1:03d}.png")

# Later pages that might have Andi
for pg_idx in range(338, 358):
    if pg_idx < doc.page_count:
        page = doc[pg_idx]
        mat = fitz.Matrix(1.5, 1.5)
        pix = page.get_pixmap(matrix=mat)
        pix.save(f".agents/outputs/andi_late/page_{pg_idx+1:03d}.png")

print(f"Done. Total pages: {doc.page_count}")
