FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8-sig") as f:
    src = f.read()

changes = []

old1 = """          } else {
            // cash بەتاڵە — format کراوەتەوە — localStorage یش رەش بکەرەوە
            setCashIQD(0);
            setCashUSD(0);
            setExchangeRate(1500);"""

new1 = """          } else {
            // cash بەتاڵە — format کراوەتەوە — localStorage یش رەش بکەرەوە
            cashRemoteRef.current = true;
            setCashIQD(0);
            cashRemoteRef.current = true;
            setCashUSD(0);
            cashRemoteRef.current = true;
            setExchangeRate(1500);"""

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: else branch — cashRemoteRef زیاد کرا")
else:
    changes.append("⚠️  FIX 1: else branch نەدۆزرایەوە")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — fetchFromSupabase else Fix")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: fetchFromSupabase else cashRemoteRef" && git push')
