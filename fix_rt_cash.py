FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\RealtimeSync.js"

with open(FILE, "r", encoding="utf-8") as f:
    src = f.read()

# FIX 1: _karoLocal check لاببە و karoDataUpdate زیاد بکە
old1 = """        if (newData.cashiqd !== undefined) {
          localStorage.setItem("karo_cashIQD_" + project, JSON.stringify(newData.cashiqd || 0));
          localStorage.setItem("karo_cashUSD_" + project, JSON.stringify(newData.cashusd || 0));
          if (setCashIQD) setCashIQD(newData.cashiqd || 0);
          if (setCashUSD) setCashUSD(newData.cashusd || 0);
        }"""

new1 = """        if (newData.cashiqd !== undefined) {
          localStorage.setItem("karo_cashIQD_" + project, JSON.stringify(newData.cashiqd || 0));
          localStorage.setItem("karo_cashUSD_" + project, JSON.stringify(newData.cashusd || 0));
          if (setCashIQD) setCashIQD(newData.cashiqd || 0);
          if (setCashUSD) setCashUSD(newData.cashusd || 0);
          window.dispatchEvent(new Event("karoDataUpdate"));
        }"""

# FIX 2: _karoLocal check لە cash handler لاببە
old2 = """        if (!newData) return;
        if (window._karoLocal) return;

        const localFormatted"""

new2 = """        if (!newData) return;

        const localFormatted"""

changes = []

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: karoDataUpdate event زیاد کرا")
else:
    changes.append("⚠️  FIX 1: cash handler نەدۆزرایەوە")

if old2 in src:
    src = src.replace(old2, new2)
    changes.append("✅ FIX 2: _karoLocal check لابرا")
else:
    changes.append("⚠️  FIX 2: _karoLocal check نەدۆزرایەوە")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — RealtimeSync Cash Fix")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("✅ فایل پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: realtime cash event" && git push')
