FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8-sig") as f:
    src = f.read()

changes = []

# بدۆزەوە handleSave لە LoansPage کە async نییە
old1 = "  const handleSave = () => {\n    if (isFrozen) {\n      setAlert(t.frozen);\n      return;\n    }\n    \n    const iqd = Number(form.amountIQD||0), usd = Number(form.amountUSD||0);"

new1 = "  const handleSave = async () => {\n    if (isFrozen) {\n      setAlert(t.frozen);\n      return;\n    }\n    \n    const iqd = Number(form.amountIQD||0), usd = Number(form.amountUSD||0);"

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: LoansPage handleSave — async زیاد کرا")
else:
    # Try with \r\n
    old1b = old1.replace("\n", "\r\n")
    new1b = new1.replace("\n", "\r\n")
    if old1b in src:
        src = src.replace(old1b, new1b)
        changes.append("✅ FIX 1: LoansPage handleSave — async زیاد کرا (CRLF)")
    else:
        changes.append("⚠️  FIX 1: handleSave نەدۆزرایەوە")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — Async Fix")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("✅ فایل پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: loans handleSave async" && git push')
