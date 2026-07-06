import fitz
import os

doc = fitz.open("attached_assets/Yazyki_narodov_SSSR_4_Iber_kavkaz_yazyki_1967_1783372314722.pdf")
os.makedirs(".agents/outputs/andi_pages", exist_ok=True)

# Render pages 315-340 (0-indexed: 314-339) at zoom=2
for pg_idx in range(314, 340):
    if pg_idx < doc.page_count:
        page = doc[pg_idx]
        mat = fitz.Matrix(2, 2)
        pix = page.get_pixmap(matrix=mat)
        out_path = f".agents/outputs/andi_pages/page_{pg_idx+1:03d}.png"
        pix.save(out_path)

print("Done rendering pages 315-340")
