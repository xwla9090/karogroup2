FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8-sig") as f:
    lines = f.readlines()

changes = []

for i, line in enumerate(lines):
    # تەنها لە ناوەوەی concrete فەنکشنەکان (خەتی ٣٠١٩ - ٣١٧٠)
    if i < 3015 or i > 3170:
        continue
    
    stripped = line.strip()
    
    # هەموو window._karoLocal = false بگۆڕە بۆ setTimeout
    if stripped == "window._karoLocal = false;" or stripped == "window._karoLocal = false;":
        indent = line[:len(line) - len(line.lstrip())]
        lines[i] = indent + "setTimeout(() => { window._karoLocal = false; }, 2000);\n"
        changes.append(f"✅ خەتی {i+1}: _karoLocal = false گۆڕدرا بۆ setTimeout")
    
    # دووبارەی setItems لاببە لە addPayment
    if i > 3065 and i < 3072:
        if "setItems(prev => prev.map(i => i.id === id ? { ...i, paidAmount: newPaid, isReceived: remaining <= 0, payments: newPaymentsList } : i));" in stripped:
            # بزانم ئایا خەتی پێشیا هەمانە
            prev_line = lines[i-1].strip()
            if "setItems(prev => prev.map(i => i.id === id ? { ...i, paidAmount: newPaid, isReceived: remaining <= 0, payments: newPaymentsList } : i));" in prev_line:
                lines[i] = ""
                changes.append(f"✅ خەتی {i+1}: دووبارەی setItems لابرا")

with open(FILE, "w", encoding="utf-8") as f:
    f.writelines(lines)

print("\n" + "="*55)
print("  کارۆ گروپ — Concrete Fix 3")
print("="*55)
if changes:
    for c in changes:
        print(c)
else:
    print("⚠️  هیچ گۆڕانکاری نەدۆزرایەوە")
print("="*55)
print("✅ فایل پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: concrete timeout all functions" && git push')
