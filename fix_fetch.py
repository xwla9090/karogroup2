FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8-sig") as f:
    lines = f.readlines()

changes = 0

for i, line in enumerate(lines):
    # FIX: setExchangeRate لە fetchFromSupabase بەبێ cashRemoteRef
    if "setExchangeRate(cashData[0].exchangerate || 1500);" in line.strip():
        indent = line[:len(line) - len(line.lstrip())]
        lines[i] = indent + "cashRemoteRef.current = true; setExchangeRate(cashData[0].exchangerate || 1500);\n"
        changes += 1
        break

with open(FILE, "w", encoding="utf-8") as f:
    f.writelines(lines)

print(f"✅ {changes} گۆڕانکاری ئەنجامدرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: fetchFromSupabase cashRemoteRef" && git push')
