import re

FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8") as f:
    src = f.read()

changes = []

# ============================================================
# FIX 1: LoansPage handleSave — async زیاد بکە
# ============================================================
old1 = """  const handleSave = () => {
    if (isFrozen) {
      setAlert(t.frozen);
      return;
    }
    
    const iqd = Number(form.amountIQD||0), usd = Number(form.amountUSD||0);"""

new1 = """  const handleSave = async () => {
    if (isFrozen) {
      setAlert(t.frozen);
      return;
    }
    
    const iqd = Number(form.amountIQD||0), usd = Number(form.amountUSD||0);"""

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: LoansPage handleSave — async زیاد کرا")
else:
    changes.append("⚠️  FIX 1: LoansPage handleSave async نەدۆزرایەوە")

# ============================================================
# FIX 2: LoansPage handleSave edit branch — Supabase upsert
# ============================================================
old2 = """      setItems(prev => prev.map(i => i.id===editItem.id ? {...i, ...form, personName: pName} : i));
      setEditModalOpen(false);
    } else {"""

new2 = """      const updItem = {...editItem, ...form, personName: pName};
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
      setEditModalOpen(false);
    } else {"""

if old2 in src:
    src = src.replace(old2, new2)
    changes.append("✅ FIX 2: LoansPage handleSave (edit) — Supabase upsert زیاد کرا")
else:
    changes.append("⚠️  FIX 2: LoansPage handleSave (edit) نەدۆزرایەوە")

# ============================================================
# FIX 3: LoansPage handleSave new item — Supabase upsert
# ============================================================
old3 = """      setItems(prev => [{...form, personName: pName, id: genId(), marked: false, returned: false}, ...prev]);
      setShowForm(false);
    }
    resetForm(); 
  };"""

new3 = """      const newItem = {...form, personName: pName, id: genId(), marked: false, returned: false};
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
      setShowForm(false);
    }
    resetForm(); 
  };"""

if old3 in src:
    src = src.replace(old3, new3)
    changes.append("✅ FIX 3: LoansPage handleSave (new) — Supabase upsert زیاد کرا")
else:
    changes.append("⚠️  FIX 3: LoansPage handleSave (new) نەدۆزرایەوە")

# ============================================================
# FIX 4: LoansPage handleReturn — async + Supabase upsert
# ============================================================
old4 = """  const handleReturn = (id) => {
    if (isFrozen) {
      setAlert(t.frozen);
      return;
    }
    
    const item = items.find(i => i.id === id);"""

new4 = """  const handleReturn = async (id) => {
    if (isFrozen) {
      setAlert(t.frozen);
      return;
    }
    
    const item = items.find(i => i.id === id);"""

if old4 in src:
    src = src.replace(old4, new4)
    changes.append("✅ FIX 4: LoansPage handleReturn — async زیاد کرا")
else:
    changes.append("⚠️  FIX 4: LoansPage handleReturn async نەدۆزرایەوە")

old4b = """    setItems(prev => prev.map(i => i.id === id ? { ...i, returned: true, amountIQD: 0, amountUSD: 0 } : i));
    window.dispatchEvent(new Event("karoLocalChange"));
    window.dispatchEvent(new Event("karoLocalChange"));
    setConfirmReturn(null);
  };"""

new4b = """    const updItem = { ...item, returned: true, amountIQD: 0, amountUSD: 0 };
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

if old4b in src:
    src = src.replace(old4b, new4b)
    changes.append("✅ FIX 5: LoansPage handleReturn — Supabase upsert زیاد کرا")
else:
    changes.append("⚠️  FIX 5: LoansPage handleReturn upsert نەدۆزرایەوە")

# ============================================================
# FIX 5: LoansPage doDelete — async + Supabase delete
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
    changes.append("✅ FIX 6: LoansPage doDelete — async + Supabase delete زیاد کرا")
else:
    changes.append("⚠️  FIX 6: LoansPage doDelete نەدۆزرایەوە")

# ============================================================
# FIX 6: RealtimeSync — onLoansUpdate زیاد بکە
# ============================================================
old6 = """    onConcUpdate={data => {
      const mapped = data.map(c => ({ id: c.id, date: c.date, currency: c.currency, meters: c.meters, pricePerMeter: c.pricepermeter, totalPrice: c.totalprice, deposit: c.deposit, depositPercent: c.depositpercent, received: c.received, isReceived: c.isreceived, depositClaimed: c.depositclaimed, note: c.note, marked: c.marked, paidAmount: c.paidamount, payments: JSON.parse(c.payments||"[]") }));
      localStorage.setItem("karo_conc_" + loggedUser.project, JSON.stringify(mapped));
      window.dispatchEvent(new Event("karoDataUpdate"));
    }}"""

new6 = """    onLoansUpdate={data => {
      const mapped = data.map(l => ({ id: l.id, type: l.type, personName: l.personname, amountIQD: l.amountiqd, amountUSD: l.amountusd, note: l.note, date: l.date, returned: l.returned, marked: l.marked }));
      localStorage.setItem("karo_loans_" + loggedUser.project, JSON.stringify(mapped));
      window.dispatchEvent(new Event("karoDataUpdate"));
    }}
    onConcUpdate={data => {
      const mapped = data.map(c => ({ id: c.id, date: c.date, currency: c.currency, meters: c.meters, pricePerMeter: c.pricepermeter, totalPrice: c.totalprice, deposit: c.deposit, depositPercent: c.depositpercent, received: c.received, isReceived: c.isreceived, depositClaimed: c.depositclaimed, note: c.note, marked: c.marked, paidAmount: c.paidamount, payments: JSON.parse(c.payments||"[]") }));
      localStorage.setItem("karo_conc_" + loggedUser.project, JSON.stringify(mapped));
      window.dispatchEvent(new Event("karoDataUpdate"));
    }}"""

if old6 in src:
    src = src.replace(old6, new6)
    changes.append("✅ FIX 7: RealtimeSync — onLoansUpdate زیاد کرا")
else:
    changes.append("⚠️  FIX 7: RealtimeSync onLoansUpdate نەدۆزرایەوە")

# ============================================================
# ذخیره فایل
# ============================================================
with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — LoansPage Sync Fix 3")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print(f"\n✅ فایل پاشەکەوت کرا:\n   {FILE}")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: loans realtime sync" && git push')
