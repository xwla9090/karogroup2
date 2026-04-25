FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\RealtimeSync.js"

with open(FILE, "r", encoding="utf-8") as f:
    src = f.read()

changes = []

old1 = """      if (cashRes && cashRes.data) {
        localStorage.setItem("karo_cashIQD_" + project, JSON.stringify(cashRes.data.cashiqd || 0));
        localStorage.setItem("karo_cashUSD_" + project, JSON.stringify(cashRes.data.cashusd || 0));
        // _karoInitLoad flag — cash useEffect ignore بکات
        window._karoInitLoad = true;
        if (onCashUpdate) onCashUpdate(cashRes.data);
        else {
          if (setCashIQD) setCashIQD(cashRes.data.cashiqd || 0);
          if (setCashUSD) setCashUSD(cashRes.data.cashusd || 0);
        }
        setTimeout(() => { window._karoInitLoad = false; }, 2000);
        changed = true;
      }"""

new1 = """      if (cashRes && cashRes.data) {
        // تەنها localStorage نوێ بکەرەوە — setCash ناکەین تا cash useEffect نەکرێتەوە
        localStorage.setItem("karo_cashIQD_" + project, JSON.stringify(cashRes.data.cashiqd || 0));
        localStorage.setItem("karo_cashUSD_" + project, JSON.stringify(cashRes.data.cashusd || 0));
        changed = true;
      }"""

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: initialLoad — setCash لابرا، تەنها localStorage")
else:
    changes.append("⚠️  FIX 1: initialLoad نەدۆزرایەوە")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — InitialLoad Final Fix")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("✅ RealtimeSync.js پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: initialLoad no setCash" && git push')
