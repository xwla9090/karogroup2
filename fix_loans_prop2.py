FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8-sig") as f:
    lines = f.readlines()

changes = []

for i, line in enumerate(lines):
    # بدۆزەوە خەتەکەی کە RealtimeSync دادەخات
    if "onCashUpdate={cash => {" in line:
        indent = line[:len(line) - len(line.lstrip())]
        # پێش onCashUpdate، onLoansUpdate زیاد بکە
        loans_update = (
            indent + 'onLoansUpdate={data => {\n' +
            indent + '  const mapped = data.map(l => ({ id: l.id, type: l.type, personName: l.personname, amountIQD: l.amountiqd, amountUSD: l.amountusd, note: l.note, date: l.date, returned: l.returned, marked: l.marked }));\n' +
            indent + '  localStorage.setItem("karo_loans_" + loggedUser.project, JSON.stringify(mapped));\n' +
            indent + '  window.dispatchEvent(new Event("karoDataUpdate"));\n' +
            indent + '}}\n'
        )
        lines.insert(i, loans_update)
        changes.append(f"✅ FIX 1: onLoansUpdate زیاد کرا پێش خەتی {i+1}")
        break

with open(FILE, "w", encoding="utf-8") as f:
    f.writelines(lines)

print("\n" + "="*55)
print("  کارۆ گروپ — onLoansUpdate Fix 2")
print("="*55)
if changes:
    for c in changes:
        print(c)
else:
    print("⚠️  هیچ گۆڕانکاری نەدۆزرایەوە")
print("="*55)
print("✅ فایل پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: add onLoansUpdate" && git push')
