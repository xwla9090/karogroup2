FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\RealtimeSync.js"

with open(FILE, "r", encoding="utf-8-sig") as f:
    lines = f.readlines()

changes = 0
for i, line in enumerate(lines):
    if "if (setCashIQD) setCashIQD(cashRes.data.cashiqd || 0);" in line:
        indent = line[:len(line) - len(line.lstrip())]
        lines[i] = indent + "if (onCashUpdate) onCashUpdate(cashRes.data); else { if (setCashIQD) setCashIQD(cashRes.data.cashiqd || 0);\n"
        changes += 1
    elif "if (setCashUSD) setCashUSD(cashRes.data.cashusd || 0);" in line and changes > 0:
        indent = line[:len(line) - len(line.lstrip())]
        lines[i] = indent + "if (setCashUSD) setCashUSD(cashRes.data.cashusd || 0); }\n"
        changes += 1
        break

with open(FILE, "w", encoding="utf-8") as f:
    f.writelines(lines)

print("\n" + "="*55)
print("  کارۆ گروپ — initialLoad Cash Fix")
print("="*55)
if changes >= 2:
    print("✅ FIX 1: initialLoad — onCashUpdate بەکاربرا")
else:
    print(f"⚠️  تەنها {changes} خەت گۆڕدرا")
print("="*55)
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: cash initialLoad onCashUpdate" && git push')
