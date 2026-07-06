import fitz, os

doc = fitz.open("attached_assets/Yazyki_narodov_SSSR_4_Iber_kavkaz_yazyki_1967_1783372314722.pdf")
os.makedirs(".agents/outputs/andi_search2", exist_ok=True)

# Render pages 160-220 at low zoom
for pg_idx in range(159, 220):
    if pg_idx < doc.page_count:
        page = doc[pg_idx]
        mat = fitz.Matrix(1.2, 1.2)
        pix = page.get_pixmap(matrix=mat)
        pix.save(f".agents/outputs/andi_search2/page_{pg_idx+1:03d}.png")

print("Done")
