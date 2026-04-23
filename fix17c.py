FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8-sig") as f:
    lines = f.readlines()

changes = []

# دووین ڕووی فایلەکە بکە تا newItem بدۆزینەوە لە LoansPage
for i, line in enumerate(lines):
    stripped = line.strip()
    
    # FIX 1: newItem لە LoansPage
    if 'const newItem = {...form, personName: pName, id: genId(), marked: false, returned: false};' in stripped:
        indent = line[:len(line) - len(line.lstrip())]
        lines[i] = indent + 'const newItem = { id: genId(), type: form.type, personName: pName, amountIQD: iqd, amountUSD: usd, note: form.note || "", date: form.date, returned: false, marked: false };\n'
        changes.append(f"✅ FIX 1: newItem گۆڕدرا لە خەتی {i+1}")
    
    # FIX 2: amountiqd: Number(newItem.amountIQD || 0)
    if 'amountiqd: Number(newItem.amountIQD || 0),' in stripped:
        indent = line[:len(line) - len(line.lstrip())]
        lines[i] = indent + 'amountiqd: iqd,\n'
        changes.append(f"✅ FIX 2: amountiqd newItem گۆڕدرا لە خەتی {i+1}")
    
    if 'amountusd: Number(newItem.amountUSD || 0),' in stripped:
        indent = line[:len(line) - len(line.lstrip())]
        lines[i] = indent + 'amountusd: usd,\n'
        changes.append(f"✅ FIX 3: amountusd newItem گۆڕدرا لە خەتی {i+1}")
    
    if 'personname: String(newItem.personName || ""),' in stripped:
        indent = line[:len(line) - len(line.lstrip())]
        lines[i] = indent + 'personname: pName,\n'
        changes.append(f"✅ FIX 4: personname newItem گۆڕدرا لە خەتی {i+1}")

    # FIX 3: updItem لە LoansPage
    if 'const updItem = {...editItem, ...form, personName: pName};' in stripped:
        indent = line[:len(line) - len(line.lstrip())]
        lines[i] = indent + 'const updItem = { ...editItem, type: form.type, personName: pName, amountIQD: iqd, amountUSD: usd, note: form.note || "", date: form.date };\n'
        changes.append(f"✅ FIX 5: updItem گۆڕدرا لە خەتی {i+1}")

    if 'amountiqd: Number(updItem.amountIQD || 0),' in stripped:
        indent = line[:len(line) - len(line.lstrip())]
        lines[i] = indent + 'amountiqd: iqd,\n'
        changes.append(f"✅ FIX 6: amountiqd updItem گۆڕدرا لە خەتی {i+1}")

    if 'amountusd: Number(updItem.amountUSD || 0),' in stripped:
        indent = line[:len(line) - len(line.lstrip())]
        lines[i] = indent + 'amountusd: usd,\n'
        changes.append(f"✅ FIX 7: amountusd updItem گۆڕدرا لە خەتی {i+1}")

    if 'personname: String(updItem.personName || ""),' in stripped:
        indent = line[:len(line) - len(line.lstrip())]
        lines[i] = indent + 'personname: pName,\n'
        changes.append(f"✅ FIX 8: personname updItem گۆڕدرا لە خەتی {i+1}")

with open(FILE, "w", encoding="utf-8") as f:
    f.writelines(lines)

print("\n" + "="*55)
print("  کارۆ گروپ — Fix 17c")
print("="*55)
if changes:
    for c in changes:
        print(c)
else:
    print("⚠️  هیچ گۆڕانکاری نەدۆزرایەوە")
print("="*55)
print("✅ فایل پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: loans correct amount" && git push')
