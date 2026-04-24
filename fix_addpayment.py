FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8-sig") as f:
    lines = f.readlines()

changes = []

for i, line in enumerate(lines):
    if i < 3044 or i > 3065:
        continue
    
    stripped = line.strip()
    
    # خەتی setItems لە addPayment
    if "setItems(prev => prev.map(i => i.id === id ? { ...i, paidAmount: newPaid, isReceived: remaining <= 0, payments: newPaymentsList } : i));" in stripped:
        indent = line[:len(line) - len(line.lstrip())]
        lines[i] = (
            indent + "const updatedConc = items.map(i => i.id === id ? { ...i, paidAmount: newPaid, isReceived: remaining <= 0, payments: newPaymentsList } : i);\n" +
            indent + "setItems(updatedConc);\n" +
            indent + "localStorage.setItem('karo_conc_' + pKey, JSON.stringify(updatedConc));\n"
        )
        changes.append(f"✅ FIX 1: addPayment — localStorage نوێ کرا لە خەتی {i+1}")
        break

with open(FILE, "w", encoding="utf-8") as f:
    f.writelines(lines)

print("\n" + "="*55)
print("  کارۆ گروپ — addPayment localStorage Fix")
print("="*55)
if changes:
    for c in changes:
        print(c)
else:
    print("⚠️  هیچ گۆڕانکاری نەدۆزرایەوە")
print("="*55)
print("✅ فایل پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: addPayment localStorage" && git push')
