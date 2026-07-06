import fitz, os

doc = fitz.open("attached_assets/Yazyki_narodov_SSSR_4_Iber_kavkaz_yazyki_1967_1783372314722.pdf")
os.makedirs(".agents/outputs/andi_start", exist_ok=True)

# Pages 141-149 at high zoom to read the start of Andi chapter
for pg_idx in range(140, 149):
    if pg_idx < doc.page_count:
        page = doc[pg_idx]
        mat = fitz.Matrix(2.0, 2.0)
        pix = page.get_pixmap(matrix=mat)
        pix.save(f".agents/outputs/andi_start/page_{pg_idx+1:03d}.png")

print("Done")
