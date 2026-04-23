FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8") as f:
    src = f.read()

changes = []

# ============================================================
# FIX 1: listener — براوزەری خۆی دەبێت ignore بکات
# ============================================================
old1 = """  useEffect(() => {
    const handler = () => {
      if (!window._karoLocal) {
        setItems(getLS(KEY, []));
      }
    };
    window.addEventListener("karoDataUpdate", handler);
    return () => window.removeEventListener("karoDataUpdate", handler);
  }, [KEY]);"""

new1 = """  useEffect(() => {
    const handler = () => {
      if (window._karoLocal) return;
      const fresh = getLS(KEY, []);
      setItems(fresh);
    };
    window.addEventListener("karoDataUpdate", handler);
    return () => window.removeEventListener("karoDataUpdate", handler);
  }, [KEY]);"""

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: listener چاک کرا")
else:
    changes.append("⚠️  FIX 1: listener نەدۆزرایەوە")

# ============================================================
# FIX 2: handleSave new — _karoLocal بە setTimeout چاک بکە
# ============================================================
old2 = """      const newItem = {...form, personName: pName, id: genId(), marked: false, returned: false};
      setItems(prev => [newItem, ...prev]);
      window._karoLocal = true;
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
      window._karoLocal = false;
      setShowForm(false);"""

new2 = """      const newItem = {...form, personName: pName, id: genId(), marked: false, returned: false};
      setItems(prev => [newItem, ...prev]);
      window._karoLocal = true;
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
      setTimeout(() => { window._karoLocal = false; }, 3000);
      setShowForm(false);"""

if old2 in src:
    src = src.replace(old2, new2)
    changes.append("✅ FIX 2: handleSave new — setTimeout 3s زیاد کرا")
else:
    changes.append("⚠️  FIX 2: handleSave new نەدۆزرایەوە")

# ============================================================
# FIX 3: handleSave edit — _karoLocal بە setTimeout چاک بکە
# ============================================================
old3 = """      const updItem = {...editItem, ...form, personName: pName};
      setItems(prev => prev.map(i => i.id===editItem.id ? updItem : i));
      window._karoLocal = true;
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
      window._karoLocal = false;
      setEditModalOpen(false);"""

new3 = """      const updItem = {...editItem, ...form, personName: pName};
      setItems(prev => prev.map(i => i.id===editItem.id ? updItem : i));
      window._karoLocal = true;
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
      setTimeout(() => { window._karoLocal = false; }, 3000);
      setEditModalOpen(false);"""

if old3 in src:
    src = src.replace(old3, new3)
    changes.append("✅ FIX 3: handleSave edit — setTimeout 3s زیاد کرا")
else:
    changes.append("⚠️  FIX 3: handleSave edit نەدۆزرایەوە")

# ============================================================
# FIX 4: handleReturn — setTimeout چاک بکە
# ============================================================
old4 = """    const updItem = { ...item, returned: true, amountIQD: 0, amountUSD: 0 };
    setItems(prev => prev.map(i => i.id === id ? updItem : i));
    window._karoLocal = true;
    await supabase.from("loans").upsert([{
      id: updItem.id, project: pKey,
      type: updItem.type,
      personname: String(updItem.personName || ""),
      amountiqd: 0,
      amountusd: 0,
      note: String(updItem.note || ""),
      date: updItem.date,
      returned: true,
      marked: !!updItem.marked
    }]);
    window._karoLocal = false;
    setConfirmReturn(null);"""

new4 = """    const updItem = { ...item, returned: true, amountIQD: 0, amountUSD: 0 };
    setItems(prev => prev.map(i => i.id === id ? updItem : i));
    window._karoLocal = true;
    await supabase.from("loans").upsert([{
      id: updItem.id, project: pKey,
      type: updItem.type,
      personname: String(updItem.personName || ""),
      amountiqd: 0,
      amountusd: 0,
      note: String(updItem.note || ""),
      date: updItem.date,
      returned: true,
      marked: !!updItem.marked
    }]);
    setTimeout(() => { window._karoLocal = false; }, 3000);
    setConfirmReturn(null);"""

if old4 in src:
    src = src.replace(old4, new4)
    changes.append("✅ FIX 4: handleReturn — setTimeout 3s زیاد کرا")
else:
    changes.append("⚠️  FIX 4: handleReturn نەدۆزرایەوە")

# ============================================================
# FIX 5: doDelete — setTimeout چاک بکە
# ============================================================
old5 = """    setItems(prev => prev.filter(i=>i.id!==id));
    window._karoLocal = true;
    await supabase.from("loans").delete().eq("id", id);
    window._karoLocal = false;
    setConfirmDel(null);"""

new5 = """    setItems(prev => prev.filter(i=>i.id!==id));
    window._karoLocal = true;
    await supabase.from("loans").delete().eq("id", id);
    setTimeout(() => { window._karoLocal = false; }, 3000);
    setConfirmDel(null);"""

if old5 in src:
    src = src.replace(old5, new5)
    changes.append("✅ FIX 5: doDelete — setTimeout 3s زیاد کرا")
else:
    changes.append("⚠️  FIX 5: doDelete نەدۆزرایەوە")

# ============================================================
# ذخیره فایل
# ============================================================
with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — Fix 9")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print(f"\n✅ فایل پاشەکەوت کرا:\n   {FILE}")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: loans data reset and sync" && git push')
