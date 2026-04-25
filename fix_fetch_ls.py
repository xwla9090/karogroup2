FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8-sig") as f:
    src = f.read()

changes = []

# fetchFromSupabase — cash لە Supabase نەگرێت، لە localStorage بخوێنێتەوە
old1 = """          if (cashData && cashData[0]) {
            localStorage.setItem("karo_cashIQD_" + pk, JSON.stringify(cashData[0].cashiqd || 0));
            localStorage.setItem("karo_cashUSD_" + pk, JSON.stringify(cashData[0].cashusd || 0));
            window._cashUpdatedByMe = false;
            setCashIQD(cashData[0].cashiqd || 0);
            setCashUSD(cashData[0].cashusd || 0);
            setExchangeRate(cashData[0].exchangerate || 1500);"""

new1 = """          if (cashData && cashData[0]) {
            // تەنها ئەگەر localStorage بەتاڵ بوو cash لە Supabase بگرە
            const localIQD = localStorage.getItem("karo_cashIQD_" + pk);
            const localUSD = localStorage.getItem("karo_cashUSD_" + pk);
            if (!localIQD || localIQD === "0") {
              localStorage.setItem("karo_cashIQD_" + pk, JSON.stringify(cashData[0].cashiqd || 0));
              localStorage.setItem("karo_cashUSD_" + pk, JSON.stringify(cashData[0].cashusd || 0));
              window._cashUpdatedByMe = false;
              setCashIQD(cashData[0].cashiqd || 0);
              setCashUSD(cashData[0].cashusd || 0);
            } else {
              window._cashUpdatedByMe = false;
              setCashIQD(JSON.parse(localIQD));
              setCashUSD(JSON.parse(localUSD || "0"));
            }
            setExchangeRate(cashData[0].exchangerate || 1500);"""

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: fetchFromSupabase — localStorage پێشتر چێک دەکات")
else:
    changes.append("⚠️  FIX 1: نەدۆزرایەوە")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — fetchFromSupabase Cash Fix")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: fetchFromSupabase use localStorage" && git push')
