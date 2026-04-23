FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8") as f:
    src = f.read()

changes = []

# FIX 1: newItem
old1 = "      const newItem = {...form, personName: pName, id: genId(), marked: false, returned: false};\r\n      setItems(prev => [newItem, ...prev]);\r\n      await supabase.from(\"loans\").upsert([{\r\n        id: newItem.id, project: pKey,\r\n        type: newItem.type,\r\n        personname: String(newItem.personName || \"\"),\r\n        amountiqd: Number(newItem.amountIQD || 0),\r\n        amountusd: Number(newItem.amountUSD || 0),\r\n        note: String(newItem.note || \"\"),\r\n        date: newItem.date,\r\n        returned: false,\r\n        marked: false\r\n      }]);\r\n      setShowForm(false);"

new1 = "      const newItem = { id: genId(), type: form.type, personName: pName, amountIQD: iqd, amountUSD: usd, note: form.note || \"\", date: form.date, returned: false, marked: false };\r\n      setItems(prev => [newItem, ...prev]);\r\n      await supabase.from(\"loans\").upsert([{\r\n        id: newItem.id, project: pKey,\r\n        type: form.type,\r\n        personname: pName,\r\n        amountiqd: iqd,\r\n        amountusd: usd,\r\n        note: form.note || \"\",\r\n        date: form.date,\r\n        returned: false,\r\n        marked: false\r\n      }]);\r\n      setShowForm(false);"

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: newItem — iqd/usd بەکاربرا")
else:
    # Try without \r
    old1b = old1.replace("\r\n", "\n")
    new1b = new1.replace("\r\n", "\n")
    if old1b in src:
        src = src.replace(old1b, new1b)
        changes.append("✅ FIX 1: newItem — iqd/usd بەکاربرا (LF)")
    else:
        changes.append("⚠️  FIX 1: newItem نەدۆزرایەوە")

# FIX 2: updItem
old2 = "      const updItem = {...editItem, ...form, personName: pName};\r\n      setItems(prev => prev.map(i => i.id===editItem.id ? updItem : i));\r\n      await supabase.from(\"loans\").upsert([{\r\n        id: updItem.id, project: pKey,\r\n        type: updItem.type,\r\n        personname: String(updItem.personName || \"\"),\r\n        amountiqd: Number(updItem.amountIQD || 0),\r\n        amountusd: Number(updItem.amountUSD || 0),\r\n        note: String(updItem.note || \"\"),\r\n        date: updItem.date,\r\n        returned: !!updItem.returned,\r\n        marked: !!updItem.marked\r\n      }]);\r\n      setEditModalOpen(false);"

new2 = "      const updItem = { ...editItem, type: form.type, personName: pName, amountIQD: iqd, amountUSD: usd, note: form.note || \"\", date: form.date };\r\n      setItems(prev => prev.map(i => i.id===editItem.id ? updItem : i));\r\n      await supabase.from(\"loans\").upsert([{\r\n        id: updItem.id, project: pKey,\r\n        type: form.type,\r\n        personname: pName,\r\n        amountiqd: iqd,\r\n        amountusd: usd,\r\n        note: form.note || \"\",\r\n        date: form.date,\r\n        returned: !!updItem.returned,\r\n        marked: !!updItem.marked\r\n      }]);\r\n      setEditModalOpen(false);"

if old2 in src:
    src = src.replace(old2, new2)
    changes.append("✅ FIX 2: updItem — iqd/usd بەکاربرا")
else:
    old2b = old2.replace("\r\n", "\n")
    new2b = new2.replace("\r\n", "\n")
    if old2b in src:
        src = src.replace(old2b, new2b)
        changes.append("✅ FIX 2: updItem — iqd/usd بەکاربرا (LF)")
    else:
        changes.append("⚠️  FIX 2: updItem نەدۆزرایەوە")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — Fix 17b")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("✅ فایل پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: loans correct amount" && git push')
