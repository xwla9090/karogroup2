FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8-sig") as f:
    lines = f.readlines()

changes = []

for i, line in enumerate(lines):
    stripped = line.strip()

    # FIX 1: newItem upsert — پێش upsert localStorage نوێ بکە
    if "personname: pName," in stripped and i > 2550 and i < 2600:
        # بزانم ئایا ئەم خەتە لە loans upsert دایە
        indent = line[:len(line) - len(line.lstrip())]
        # خەتی پێشیا setItems دەبینین
        context = "".join(lines[max(0,i-10):i])
        if "newItem" in context and "loans" in context:
            changes.append(f"دۆزرایەوە لە خەتی {i+1}")
            break

# ڕووی جیاوازی چارەسەر بکە — ڕاستەوخۆ لە فایل بگۆڕە
with open(FILE, "r", encoding="utf-8-sig") as f:
    src = f.read()

# FIX: setItems دوای upsert — localStorage هەمان کاتدا نوێ بکە
old1 = """      const newItem = {
        id: genId(),
        type: form.type,
        personName: pName,
        amountIQD: iqd,
        amountUSD: usd,
        note: form.note || "",
        date: form.date,
        returned: false,
        marked: false
      };
      setItems(prev => [newItem, ...prev]);
      await supabase.from("loans").upsert([{
        id: newItem.id, project: pKey,
        type: newItem.type,
        personname: pName,
        amountiqd: iqd,
        amountusd: usd,
        note: String(newItem.note || ""),
        date: newItem.date,
        returned: false,
        marked: false
      }]);
      setShowForm(false);"""

new1 = """      const newItem = {
        id: genId(),
        type: form.type,
        personName: pName,
        amountIQD: iqd,
        amountUSD: usd,
        note: form.note || "",
        date: form.date,
        returned: false,
        marked: false
      };
      const updatedLoans = [newItem, ...items];
      setItems(updatedLoans);
      localStorage.setItem("karo_loans_" + pKey, JSON.stringify(updatedLoans));
      await supabase.from("loans").upsert([{
        id: newItem.id, project: pKey,
        type: newItem.type,
        personname: pName,
        amountiqd: iqd,
        amountusd: usd,
        note: String(newItem.note || ""),
        date: newItem.date,
        returned: false,
        marked: false
      }]);
      setShowForm(false);"""

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: newItem — localStorage نوێ کرا پێش upsert")
else:
    changes.append("⚠️  FIX 1: newItem نەدۆزرایەوە")

# FIX 2: updItem edit — localStorage نوێ بکە
old2 = """      const updItem = {
        ...editItem,
        type: form.type,
        personName: pName,
        amountIQD: iqd,
        amountUSD: usd,
        note: form.note || "",
        date: form.date,
      };
      setItems(prev => prev.map(i => i.id===editItem.id ? updItem : i));
      await supabase.from("loans").upsert([{
        id: updItem.id, project: pKey,
        type: updItem.type,
        personname: String(updItem.personName || ""),
        amountiqd: Number(updItem.amountIQD || 0),
        amountusd: Number(updItem.amountUSD || 0),
        note: String(updItem.note || ""),
        date: updItem.date,
        returned: !!updItem.returned,
        marked: !!updItem.marked
      }]);
      setEditModalOpen(false);"""

new2 = """      const updItem = {
        ...editItem,
        type: form.type,
        personName: pName,
        amountIQD: iqd,
        amountUSD: usd,
        note: form.note || "",
        date: form.date,
      };
      const updatedLoans2 = items.map(i => i.id===editItem.id ? updItem : i);
      setItems(updatedLoans2);
      localStorage.setItem("karo_loans_" + pKey, JSON.stringify(updatedLoans2));
      await supabase.from("loans").upsert([{
        id: updItem.id, project: pKey,
        type: updItem.type,
        personname: pName,
        amountiqd: iqd,
        amountusd: usd,
        note: String(updItem.note || ""),
        date: updItem.date,
        returned: !!updItem.returned,
        marked: !!updItem.marked
      }]);
      setEditModalOpen(false);"""

if old2 in src:
    src = src.replace(old2, new2)
    changes.append("✅ FIX 2: updItem — localStorage نوێ کرا پێش upsert")
else:
    changes.append("⚠️  FIX 2: updItem نەدۆزرایەوە")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — Fix 19")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("✅ فایل پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: localStorage before upsert" && git push')
