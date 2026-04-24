FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8-sig") as f:
    src = f.read()

changes = []

# FIX: useEffect setLS کۆنکرێت لاببە
old1 = "  useEffect(() => { setLS(KEY, items); }, [items, KEY]);\n"

new1 = "  // setLS useEffect لابرا — localStorage ڕاستەوخۆ لە هەر فەنکشنێکدا نوێ دەکرێتەوە\n"

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: setLS useEffect concrete لابرا")
else:
    old1b = old1.replace("\n", "\r\n")
    new1b = new1.replace("\n", "\r\n")
    if old1b in src:
        src = src.replace(old1b, new1b)
        changes.append("✅ FIX 1: setLS useEffect concrete لابرا (CRLF)")
    else:
        changes.append("⚠️  FIX 1: setLS useEffect نەدۆزرایەوە")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — setLS useEffect Fix")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("✅ فایل پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: remove setLS useEffect concrete" && git push')
