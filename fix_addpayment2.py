FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8-sig") as f:
    src = f.read()

changes = []

old1 = '    const newPaymentsList = [...(items.find(i => i.id === id)?.payments || []), newPaymentObj];\n    setItems(prev => prev.map(i => i.id === id ? { ...i, paidAmount: newPaid, isReceived: remaining <= 0, payments: newPaymentsList } : i));\n    const updItem = { ...item, paidAmount: newPaid, isReceived: remaining <= 0, payments: newPaymentsList };\n    await supabase.from("concrete").upsert'

new1 = '    const newPaymentsList = [...(items.find(i => i.id === id)?.payments || []), newPaymentObj];\n    const updatedConc = items.map(i => i.id === id ? { ...i, paidAmount: newPaid, isReceived: remaining <= 0, payments: newPaymentsList } : i);\n    setItems(updatedConc);\n    localStorage.setItem("karo_conc_" + pKey, JSON.stringify(updatedConc));\n    const updItem = { ...item, paidAmount: newPaid, isReceived: remaining <= 0, payments: newPaymentsList };\n    await supabase.from("concrete").upsert'

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: addPayment — localStorage نوێ کرا")
else:
    # Try with \r\n
    old1b = old1.replace("\n", "\r\n")
    new1b = new1.replace("\n", "\r\n")
    if old1b in src:
        src = src.replace(old1b, new1b)
        changes.append("✅ FIX 1: addPayment — localStorage نوێ کرا (CRLF)")
    else:
        changes.append("⚠️  FIX 1: addPayment نەدۆزرایەوە")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — addPayment Fix 2")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("✅ فایل پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: addPayment localStorage update" && git push')
