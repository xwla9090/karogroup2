FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\AutoSync.js"

with open(FILE, "r", encoding="utf-8") as f:
    src = f.read()

changes = []

old1 = """        var hash = exp.length + "" + conc.length + "" + loans.length + "" + contr.length + "" + inv.length + "" + cashIQD + "" + cashUSD + "" + uLen + "_" + Math.floor(Date.now()/5000);"""

new1 = """        var hash = exp.length + "" + conc.length + "" + loans.length + "" + contr.length + "" + inv.length + "" + cashIQD + "" + cashUSD + "" + uLen;"""

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: hash — Date.now() لابرا")
else:
    changes.append("⚠️  FIX 1: hash نەدۆزرایەوە")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — AutoSync Hash Fix")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("✅ فایل پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: AutoSync hash no time" && git push')
