import fitz, os

doc = fitz.open("attached_assets/Yazyki_narodov_SSSR_4_Iber_kavkaz_yazyki_1967_1783372314722.pdf")
os.makedirs(".agents/outputs/andi_target", exist_ok=True)

# Pages 147-165 at higher zoom (Andi should be around printed pages 292-320)
for pg_idx in range(146, 167):
    if pg_idx < doc.page_count:
        page = doc[pg_idx]
        mat = fitz.Matrix(2.0, 2.0)
        pix = page.get_pixmap(matrix=mat)
        pix.save(f".agents/outputs/andi_target/page_{pg_idx+1:03d}.png")

print("Done")
