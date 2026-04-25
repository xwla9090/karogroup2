FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8-sig") as f:
    lines = f.readlines()

changes = 0

for i, line in enumerate(lines):
    # FIX: fetchFromSupabase — setCashIQD بەبێ cashRemoteRef
    if "setCashIQD(cashData[0].cashiqd || 0);" in line.strip():
        indent = line[:len(line) - len(line.lstrip())]
        lines[i] = indent + "cashRemoteRef.current = true; setCashIQD(cashData[0].cashiqd || 0);\n"
        changes += 1
    elif "setCashUSD(cashData[0].cashusd || 0);" in line.strip():
        indent = line[:len(line) - len(line.lstrip())]
        lines[i] = indent + "cashRemoteRef.current = true; setCashUSD(cashData[0].cashusd || 0);\n"
        changes += 1

    # FIX: cash useEffect — prevCashRef زیاد بکە
    if "if (cashRemoteRef.current) { cashRemoteRef.current = false; return; }" in line.strip():
        # بزانم ئایا prevCashRef پێشتر هەیە
        context = "".join(lines[max(0,i-5):i])
        if "prevCashRef" not in context:
            indent = line[:len(line) - len(line.lstrip())]
            lines[i] = line + indent + "if (prevCashRef.current.iqd === cashIQD && prevCashRef.current.usd === cashUSD) return;\n" + indent + "prevCashRef.current = { iqd: cashIQD, usd: cashUSD };\n"
            changes += 1

# prevCashRef تەرخان بکە دوای cashRemoteRef
for i, line in enumerate(lines):
    if "const cashRemoteRef = useRef(false);" in line.strip():
        indent = line[:len(line) - len(line.lstrip())]
        lines[i] = line + indent + "const prevCashRef = useRef({ iqd: null, usd: null });\n"
        changes += 1
        break

with open(FILE, "w", encoding="utf-8") as f:
    f.writelines(lines)

print("\n" + "="*55)
print("  کارۆ گروپ — Cash Complete Fix v5")
print("="*55)
print(f"✅ {changes} گۆڕانکاری ئەنجامدرا")
print("="*55)
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: cash all refs" && git push')
