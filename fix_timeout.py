FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8-sig") as f:
    src = f.read()

changes = []

# هەموو 10000 بگۆڕە بۆ 2000
count = src.count("setTimeout(() => { window._karoLocal = false; }, 10000);")
if count > 0:
    src = src.replace(
        "setTimeout(() => { window._karoLocal = false; }, 10000);",
        "setTimeout(() => { window._karoLocal = false; }, 2000);"
    )
    changes.append(f"✅ FIX 1: {count} جار timeout 10000 گۆڕدرا بۆ 2000")
else:
    changes.append("⚠️  FIX 1: timeout 10000 نەدۆزرایەوە")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — Timeout Fix")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("✅ فایل پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: reduce karoLocal timeout" && git push')
