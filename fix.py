import re

FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8") as f:
    src = f.read()

changes = []

# ============================================================
# FIX 1: handleSave — Supabase upsert زیاد بکە
# ============================================================
old1 = """  const handleSave = async () => {
    if (isFrozen) {
      setAlert(t.frozen);
      return;
    }
    if (totalPrice <= 0) return;
    const cur = form.currency || "iqd";
    const item = { ...form, id: genId(), totalPrice, deposit: depositAmt, received: receivedAmt, depositClaimed: false, isReceived: false, marked: false, currency: cur };
    setItems(prev => [item, ...prev]);
    window._karoLocal = true;
    window._karoLocal = true;
    resetForm();
    setShowForm(false);
  };"""

new1 = """  const handleSave = async () => {
    if (isFrozen) {
      setAlert(t.frozen);
      return;
    }
    if (totalPrice <= 0) return;
    const cur = form.currency || "iqd";
    const item = { ...form, id: genId(), totalPrice, deposit: depositAmt, received: receivedAmt, depositClaimed: false, isReceived: false, marked: false, currency: cur };
    setItems(prev => [item, ...prev]);
    window._karoLocal = true;
    await supabase.from("concrete").upsert([{
      id: item.id, project: pKey, date: item.date,
      currency: String(item.currency || "iqd"),
      meters: Number(item.meters || 0),
      pricepermeter: Number(item.pricePerMeter || 0),
      totalprice: Number(item.totalPrice || 0),
      deposit: Number(item.deposit || 0),
      depositpercent: Number(item.depositPercent || 0),
      received: Number(item.received || 0),
      isreceived: false, depositclaimed: false,
      note: String(item.note || ""), marked: false,
      paidamount: 0, payments: "[]"
    }]);
    window._karoLocal = false;
    resetForm();
    setShowForm(false);
  };"""

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: handleSave — Supabase upsert زیاد کرا")
else:
    changes.append("⚠️  FIX 1: handleSave نەدۆزرایەوە (دەستی گۆڕا؟)")

# ============================================================
# FIX 2: handleEditSave — updatedItem درووست بکە + upsert چاک بکە
# ============================================================
old2 = """    setItems(prev => prev.map(i => i.id === editItem.id ? {
      ...i,
      ...form,
      totalPrice: newTotalPrice,
      deposit: newDeposit,
      received: newReceived,
      currency: cur,
      isReceived: false,
      depositClaimed: false
    } : i));
    window._karoLocal = true;
    window._karoLocal = true;
    await supabase.from("concrete").upsert([{ id: updatedItem.id, project: pKey, date: updatedItem.date, currency: String(updatedItem.currency||'iqd'), meters: Number(updatedItem.meters||0), pricepermeter: Number(updatedItem.pricePerMeter||0), totalprice: Number(updatedItem.totalPrice||0), deposit: Number(updatedItem.deposit||0), depositpercent: Number(updatedItem.depositPercent||0), received: Number(updatedItem.received||0), isreceived: !!updatedItem.isReceived, depositclaimed: !!updatedItem.depositClaimed, note: String(updatedItem.note||''), marked: !!updatedItem.marked, paidamount: Number(updatedItem.paidAmount||0), payments: JSON.stringify(updatedItem.payments||[]) }]);
    await supabase.from("concrete").upsert([{ id: updatedItem.id, project: pKey, date: updatedItem.date, currency: String(updatedItem.currency||"iqd"), meters: Number(updatedItem.meters||0), pricepermeter: Number(updatedItem.pricePerMeter||0), totalprice: Number(updatedItem.totalPrice||0), deposit: Number(updatedItem.deposit||0), depositpercent: Number(updatedItem.depositPercent||0), received: Number(updatedItem.received||0), isreceived: !!updatedItem.isReceived, depositclaimed: !!updatedItem.depositClaimed, note: String(updatedItem.note||""), marked: !!updatedItem.marked, paidamount: Number(updatedItem.paidAmount||0), payments: JSON.stringify(updatedItem.payments||[]) }]);
    window._karoLocal = false;
    setEditModalOpen(false);
    resetForm();
  };"""

new2 = """    const updatedItem = {
      ...editItem,
      ...form,
      totalPrice: newTotalPrice,
      deposit: newDeposit,
      received: newReceived,
      currency: cur,
      isReceived: false,
      depositClaimed: false
    };
    setItems(prev => prev.map(i => i.id === editItem.id ? updatedItem : i));
    window._karoLocal = true;
    await supabase.from("concrete").upsert([{
      id: updatedItem.id, project: pKey, date: updatedItem.date,
      currency: String(updatedItem.currency || "iqd"),
      meters: Number(updatedItem.meters || 0),
      pricepermeter: Number(updatedItem.pricePerMeter || 0),
      totalprice: Number(updatedItem.totalPrice || 0),
      deposit: Number(updatedItem.deposit || 0),
      depositpercent: Number(updatedItem.depositPercent || 0),
      received: Number(updatedItem.received || 0),
      isreceived: !!updatedItem.isReceived,
      depositclaimed: !!updatedItem.depositClaimed,
      note: String(updatedItem.note || ""),
      marked: !!updatedItem.marked,
      paidamount: Number(updatedItem.paidAmount || 0),
      payments: JSON.stringify(updatedItem.payments || [])
    }]);
    window._karoLocal = false;
    setEditModalOpen(false);
    resetForm();
  };"""

if old2 in src:
    src = src.replace(old2, new2)
    changes.append("✅ FIX 2: handleEditSave — updatedItem چاک کرا + upsert درووست کرا")
else:
    changes.append("⚠️  FIX 2: handleEditSave نەدۆزرایەوە")

# ============================================================
# FIX 3: onConcUpdate — karoDataUpdate event زیاد بکە
# ============================================================
old3 = """    onConcUpdate={data => {
      const mapped = data.map(c => ({ id: c.id, date: c.date, currency: c.currency, meters: c.meters, pricePerMeter: c.pricepermeter, totalPrice: c.totalprice, deposit: c.deposit, depositPercent: c.depositpercent, received: c.received, isReceived: c.isreceived, depositClaimed: c.depositclaimed, note: c.note, marked: c.marked, paidAmount: c.paidamount, payments: JSON.parse(c.payments||"[]") }));
      localStorage.setItem("karo_conc_" + loggedUser.project, JSON.stringify(mapped));
    }}"""

new3 = """    onConcUpdate={data => {
      const mapped = data.map(c => ({ id: c.id, date: c.date, currency: c.currency, meters: c.meters, pricePerMeter: c.pricepermeter, totalPrice: c.totalprice, deposit: c.deposit, depositPercent: c.depositpercent, received: c.received, isReceived: c.isreceived, depositClaimed: c.depositclaimed, note: c.note, marked: c.marked, paidAmount: c.paidamount, payments: JSON.parse(c.payments||"[]") }));
      localStorage.setItem("karo_conc_" + loggedUser.project, JSON.stringify(mapped));
      window.dispatchEvent(new Event("karoDataUpdate"));
    }}"""

if old3 in src:
    src = src.replace(old3, new3)
    changes.append("✅ FIX 3: onConcUpdate — karoDataUpdate event زیاد کرا")
else:
    changes.append("⚠️  FIX 3: onConcUpdate نەدۆزرایەوە")

# ============================================================
# FIX 4: onExpUpdate — karoDataUpdate event زیاد بکە
# ============================================================
old4 = """    onExpUpdate={data => {
      const mapped = data.map(e => ({ id: e.id, date: e.date, amountIQD: e.amountiqd, amountUSD: e.amountusd, receiptNo: e.receiptno, note: e.note, marked: e.marked }));
      localStorage.setItem("karo_exp_" + loggedUser.project, JSON.stringify(mapped));
    }}"""

new4 = """    onExpUpdate={data => {
      const mapped = data.map(e => ({ id: e.id, date: e.date, amountIQD: e.amountiqd, amountUSD: e.amountusd, receiptNo: e.receiptno, note: e.note, marked: e.marked }));
      localStorage.setItem("karo_exp_" + loggedUser.project, JSON.stringify(mapped));
      window.dispatchEvent(new Event("karoDataUpdate"));
    }}"""

if old4 in src:
    src = src.replace(old4, new4)
    changes.append("✅ FIX 4: onExpUpdate — karoDataUpdate event زیاد کرا")
else:
    changes.append("⚠️  FIX 4: onExpUpdate نەدۆزرایەوە")

# ============================================================
# FIX 5: markReceived — دووبارەی setItems لاببە
# ============================================================
old5 = """      setItems(prev => prev.map(i => i.id === id ? { ...i, isReceived: true } : i));
      setItems(prev => prev.map(i => i.id === id ? { ...i, isReceived: true } : i));
      window._karoLocal = false;"""

new5 = """      setItems(prev => prev.map(i => i.id === id ? { ...i, isReceived: true } : i));
      window._karoLocal = false;"""

if old5 in src:
    src = src.replace(old5, new5)
    changes.append("✅ FIX 5: markReceived — دووبارەی setItems لابرا")
else:
    changes.append("⚠️  FIX 5: markReceived دووبارە نەدۆزرایەوە")

# ============================================================
# FIX 6: claimDeposit — دووبارەی setItems و _karoLocal لاببە
# ============================================================
old6 = """      setItems(prev => prev.map(i => i.id === id ? { ...i, depositClaimed: true } : i));
      setItems(prev => prev.map(i => i.id === id ? { ...i, depositClaimed: true } : i));
      window._karoLocal = false;
      window._karoLocal = false;"""

new6 = """      setItems(prev => prev.map(i => i.id === id ? { ...i, depositClaimed: true } : i));
      window._karoLocal = false;"""

if old6 in src:
    src = src.replace(old6, new6)
    changes.append("✅ FIX 6: claimDeposit — دووبارەکان لابران")
else:
    changes.append("⚠️  FIX 6: claimDeposit دووبارە نەدۆزرایەوە")

# ============================================================
# FIX 7: handleSave در ConcretePage — _karoLocal قبل از setItems بود، درست‌ترتیب بشه
# (این fix ممکنه با FIX1 overlap داشته باشه، skip میکنیم)
# ============================================================

# ============================================================
# ذخیره فایل
# ============================================================
with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — ConcretePage Sync Fix")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print(f"\n✅ فایل پاشەکەوت کرا:\n   {FILE}")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: ConcretePage realtime sync" && git push')
