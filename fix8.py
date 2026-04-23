FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8") as f:
    src = f.read()

changes = []

# ============================================================
# FIX 1: listener loop چاک بکە — تەنها کاتێک _karoLocal نەبوو نوێ بکەرەوە
# ============================================================
old1 = """  useEffect(() => {
    const handler = () => { setItems(getLS(KEY, [])); };
    window.addEventListener("karoDataUpdate", handler);
    return () => window.removeEventListener("karoDataUpdate", handler);
  }, [KEY]);"""

new1 = """  useEffect(() => {
    const handler = () => {
      if (!window._karoLocal) {
        setItems(getLS(KEY, []));
      }
    };
    window.addEventListener("karoDataUpdate", handler);
    return () => window.removeEventListener("karoDataUpdate", handler);
  }, [KEY]);"""

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: listener loop چاک کرا")
else:
    changes.append("⚠️  FIX 1: listener نەدۆزرایەوە")

# ============================================================
# FIX 2: handleReturn — دووبارەی window.dispatchEvent لابە
# ============================================================
old2 = """    setItems(prev => prev.map(i => i.id === id ? { ...i, returned: true, amountIQD: 0, amountUSD: 0 } : i));
    window.dispatchEvent(new Event("karoLocalChange"));
    window.dispatchEvent(new Event("karoLocalChange"));
    setConfirmReturn(null);
  };"""

new2 = """    const updItem = { ...item, returned: true, amountIQD: 0, amountUSD: 0 };
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
    setConfirmReturn(null);
  };"""

if old2 in src:
    src = src.replace(old2, new2)
    changes.append("✅ FIX 2: handleReturn — دووبارە لابرا + upsert")
else:
    changes.append("⚠️  FIX 2: handleReturn نەدۆزرایەوە")

# ============================================================
# FIX 3: handleReturn — async زیاد بکە
# ============================================================
old3 = """  const handleReturn = (id) => {
    if (isFrozen) {
      setAlert(t.frozen);
      return;
    }
    
    const item = items.find(i => i.id === id);"""

new3 = """  const handleReturn = async (id) => {
    if (isFrozen) {
      setAlert(t.frozen);
      return;
    }
    
    const item = items.find(i => i.id === id);"""

if old3 in src:
    src = src.replace(old3, new3)
    changes.append("✅ FIX 3: handleReturn — async زیاد کرا")
else:
    changes.append("⚠️  FIX 3: handleReturn async نەدۆزرایەوە")

# ============================================================
# FIX 4: doDelete — دووبارەی toggleMark dispatchEvent لابە
# ============================================================
old4 = """  const toggleMark = id => setItems(prev => prev.map(i => i.id===id?{...i,marked:!i.marked}:i));
    window.dispatchEvent(new Event("karoLocalChange"));
    window.dispatchEvent(new Event("karoLocalChange"));"""

new4 = """  const toggleMark = id => setItems(prev => prev.map(i => i.id===id?{...i,marked:!i.marked}:i));"""

if old4 in src:
    src = src.replace(old4, new4)
    changes.append("✅ FIX 4: toggleMark — دووبارەی dispatchEvent لابرا")
else:
    changes.append("⚠️  FIX 4: toggleMark نەدۆزرایەوە")

# ============================================================
# FIX 5: doDelete — async + supabase delete
# ============================================================
old5 = """  const doDelete = id => {
    if (isFrozen) {
      setAlert(t.frozen);
      return;
    }
    
    const item = items.find(i=>i.id===id);
    if (item && !item.returned) {
      if (item.type==="take") { 
        setCashIQD(p=>p-Number(item.amountIQD||0)); 
        setCashUSD(p=>p-Number(item.amountUSD||0)); 
        addCashLog(`${t.delete} ${t.loanTake}`, -Number(item.amountIQD||0), -Number(item.amountUSD||0)); 
      } else { 
        setCashIQD(p=>p+Number(item.amountIQD||0)); 
        setCashUSD(p=>p+Number(item.amountUSD||0)); 
        addCashLog(`${t.delete} ${t.loanGive}`, Number(item.amountIQD||0), Number(item.amountUSD||0)); 
      }
    }
    setItems(prev => prev.filter(i=>i.id!==id));
    setConfirmDel(null);
  };"""

new5 = """  const doDelete = async id => {
    if (isFrozen) {
      setAlert(t.frozen);
      return;
    }
    
    const item = items.find(i=>i.id===id);
    if (item && !item.returned) {
      if (item.type==="take") { 
        setCashIQD(p=>p-Number(item.amountIQD||0)); 
        setCashUSD(p=>p-Number(item.amountUSD||0)); 
        addCashLog(`${t.delete} ${t.loanTake}`, -Number(item.amountIQD||0), -Number(item.amountUSD||0)); 
      } else { 
        setCashIQD(p=>p+Number(item.amountIQD||0)); 
        setCashUSD(p=>p+Number(item.amountUSD||0)); 
        addCashLog(`${t.delete} ${t.loanGive}`, Number(item.amountIQD||0), Number(item.amountUSD||0)); 
      }
    }
    setItems(prev => prev.filter(i=>i.id!==id));
    window._karoLocal = true;
    await supabase.from("loans").delete().eq("id", id);
    window._karoLocal = false;
    setConfirmDel(null);
  };"""

if old5 in src:
    src = src.replace(old5, new5)
    changes.append("✅ FIX 5: doDelete — async + supabase delete")
else:
    changes.append("⚠️  FIX 5: doDelete نەدۆزرایەوە")

# ============================================================
# ذخیره فایل
# ============================================================
with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — Fix 8")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print(f"\n✅ فایل پاشەکەوت کرا:\n   {FILE}")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: loans listener loop and duplicate cash" && git push')
