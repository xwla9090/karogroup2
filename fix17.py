FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8") as f:
    src = f.read()

changes = []

# FIX 1: newItem — local vars بەکاربهێنە
old1 = """      const newItem = {...form, personName: pName, id: genId(), marked: false, returned: false};
      setItems(prev => [newItem, ...prev]);
      await supabase.from("loans").upsert([{
        id: newItem.id, project: pKey,
        type: newItem.type,
        personname: String(newItem.personName || ""),
        amountiqd: Number(newItem.amountIQD || 0),
        amountusd: Number(newItem.amountUSD || 0),
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
      setItems(prev => [newItem, ...prev]);
      await supabase.from("loans").upsert([{
        id: newItem.id, project: pKey,
        type: newItem.type,
        personname: pName,
        amountiqd: iqd,
        amountusd: usd,
        note: newItem.note,
        date: newItem.date,
        returned: false,
        marked: false
      }]);
      setShowForm(false);"""

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: newItem — iqd/usd/pName بەکاربرا")
else:
    changes.append("⚠️  FIX 1: newItem نەدۆزرایەوە")

# FIX 2: updItem — local vars بەکاربهێنە
old2 = """      const updItem = {...editItem, ...form, personName: pName};
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
      setItems(prev => prev.map(i => i.id===editItem.id ? updItem : i));
      await supabase.from("loans").upsert([{
        id: updItem.id, project: pKey,
        type: updItem.type,
        personname: pName,
        amountiqd: iqd,
        amountusd: usd,
        note: updItem.note,
        date: updItem.date,
        returned: !!updItem.returned,
        marked: !!updItem.marked
      }]);
      setEditModalOpen(false);"""

if old2 in src:
    src = src.replace(old2, new2)
    changes.append("✅ FIX 2: updItem — iqd/usd/pName بەکاربرا")
else:
    changes.append("⚠️  FIX 2: updItem نەدۆزرایەوە")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — Fix 17")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("✅ فایل پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: loans correct amount saved" && git push')
