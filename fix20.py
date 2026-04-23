FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8-sig") as f:
    lines = f.readlines()

changes = []

for i, line in enumerate(lines):
    # خەتی ٢٥٤١ — setItems(prev => prev.map(i => i.id===editItem.id ? updItem : i));
    if "setItems(prev => prev.map(i => i.id===editItem.id ? updItem : i));" in line.strip():
        indent = line[:len(line) - len(line.lstrip())]
        # جێگای setItems گۆڕین
        lines[i] = (
            indent + "const updatedLoans2 = items.map(i => i.id===editItem.id ? updItem : i);\n" +
            indent + "setItems(updatedLoans2);\n" +
            indent + "localStorage.setItem('karo_loans_' + pKey, JSON.stringify(updatedLoans2));\n"
        )
        changes.append(f"✅ FIX 1: updItem — localStorage نوێ کرا لە خەتی {i+1}")
        break

with open(FILE, "w", encoding="utf-8") as f:
    f.writelines(lines)

print("\n" + "="*55)
print("  کارۆ گروپ — Fix 20")
print("="*55)
for c in changes:
    print(c)
if not changes:
    print("⚠️  هیچ گۆڕانکاری نەدۆزرایەوە")
print("="*55)
print("✅ فایل پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: loans edit localStorage" && git push')
