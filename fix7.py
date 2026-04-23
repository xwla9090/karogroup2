FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8") as f:
    src = f.read()

changes = []

# ============================================================
# FIX 1: LoansPage — karoDataUpdate listener زیاد بکە
# ============================================================
old1 = """  useEffect(() => { setLS(KEY, items); }, [items, KEY]);
  useEffect(() => { setLS(PERSONS_KEY, personsList); }, [personsList, PERSONS_KEY]);

  useEffect(() => {
    const namesFromItems = [...new Set(items.map(i => i.personName).filter(name => name && name.trim() !== ""))];
    const merged = [...new Set([...personsList, ...namesFromItems])];
    if (merged.length !== personsList.length) setPersonsList(merged);
  }, [items]);"""

new1 = """  useEffect(() => { setLS(KEY, items); }, [items, KEY]);
  useEffect(() => { setLS(PERSONS_KEY, personsList); }, [personsList, PERSONS_KEY]);

  useEffect(() => {
    const handler = () => { setItems(getLS(KEY, [])); };
    window.addEventListener("karoDataUpdate", handler);
    return () => window.removeEventListener("karoDataUpdate", handler);
  }, [KEY]);

  useEffect(() => {
    const namesFromItems = [...new Set(items.map(i => i.personName).filter(name => name && name.trim() !== ""))];
    const merged = [...new Set([...personsList, ...namesFromItems])];
    if (merged.length !== personsList.length) setPersonsList(merged);
  }, [items]);"""

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: LoansPage — karoDataUpdate listener زیاد کرا")
else:
    changes.append("⚠️  FIX 1: LoansPage listener نەدۆزرایەوە")

# ============================================================
# ذخیره فایل
# ============================================================
with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — LoansPage Listener Fix 7")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print(f"\n✅ فایل پاشەکەوت کرا:\n   {FILE}")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: loans realtime listener" && git push')
