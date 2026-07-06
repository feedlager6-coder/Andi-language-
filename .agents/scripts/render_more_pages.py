import fitz
import os

doc = fitz.open("attached_assets/Yazyki_narodov_SSSR_4_Iber_kavkaz_yazyki_1967_1783372314722.pdf")
os.makedirs(".agents/outputs/toc", exist_ok=True)
os.makedirs(".agents/outputs/andi_late", exist_ok=True)

# Render TOC pages 1-8
for pg_idx in range(0, 8):
    page = doc[pg_idx]
    mat = fitz.Matrix(1.5, 1.5)
    pix = page.get_pixmap(matrix=mat)
    pix.save(f".agents/outputs/toc/page_{pg_idx+1:03d}.png")

# Later pages 338-358
for pg_idx in range(337, min(358, doc.page_count)):
    page = doc[pg_idx]
    mat = fitz.Matrix(1.5, 1.5)
    pix = page.get_pixmap(matrix=mat)
    pix.save(f".agents/outputs/andi_late/page_{pg_idx+1:03d}.png")

print("Done")
