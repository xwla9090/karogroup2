import re

FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8") as f:
    src = f.read()

changes = []

# ============================================================
# FIX 1: unclaimDeposit — Supabase upsert زیاد بکە
# ============================================================
old1 = """  const unclaimDeposit = id => {
    if (isFrozen) { setAlert(t.frozen); return; }
    const item = items.find(i => i.id === id);
    if (!item || !item.depositClaimed) return;
    const cur = item.currency || "iqd";
    if (cur === "usd") { setCashUSD(prev => prev - Number(item.deposit||0)); }
    else { setCashIQD(prev => prev - Number(item.deposit||0)); }
    setItems(prev => prev.map(i => i.id === id ? { ...i, depositClaimed: false } : i));
    window.dispatchEvent(new Event("karoLocalChange"));
    window.dispatchEvent(new Event("karoLocalChange"));
  };"""

new1 = """  const unclaimDeposit = async id => {
    if (isFrozen) { setAlert(t.frozen); return; }
    const item = items.find(i => i.id === id);
    if (!item || !item.depositClaimed) return;
    const cur = item.currency || "iqd";
    if (cur === "usd") { setCashUSD(prev => prev - Number(item.deposit||0)); }
    else { setCashIQD(prev => prev - Number(item.deposit||0)); }
    const updItem = { ...item, depositClaimed: false };
    setItems(prev => prev.map(i => i.id === id ? updItem : i));
    window._karoLocal = true;
    await supabase.from("concrete").upsert([{
      id: updItem.id, project: pKey, date: updItem.date,
      currency: String(updItem.currency || "iqd"),
      meters: Number(updItem.meters || 0),
      pricepermeter: Number(updItem.pricePerMeter || 0),
      totalprice: Number(updItem.totalPrice || 0),
      deposit: Number(updItem.deposit || 0),
      depositpercent: Number(updItem.depositPercent || 0),
      received: Number(updItem.received || 0),
      isreceived: !!updItem.isReceived,
      depositclaimed: false,
      note: String(updItem.note || ""),
      marked: !!updItem.marked,
      paidamount: Number(updItem.paidAmount || 0),
      payments: JSON.stringify(updItem.payments || [])
    }]);
    window._karoLocal = false;
  };"""

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: unclaimDeposit — Supabase upsert زیاد کرا")
else:
    changes.append("⚠️  FIX 1: unclaimDeposit نەدۆزرایەوە")

# ============================================================
# FIX 2: editPayment — Supabase upsert زیاد بکە
# ============================================================
old2 = """  const editPayment = (itemId, paymentId, amount, date, note) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    const amt = Number(amount||0);
    const otherPaid = (item.payments||[]).filter(p => p.id !== paymentId).reduce((a,b) => a + Number(b.amount||0), 0);
    const maxAllowed = Math.max(0, Number(item.received||0) - otherPaid);
    if (amt > maxAllowed) { setAlert("ئەم بڕە زیاترە لە ماوەی پارەکە! زیاترین بڕ: " + (item.currency==="usd"?"$":"") + Math.round(maxAllowed)); return; }
    const oldPayment = (item.payments||[]).find(p => p.id === paymentId);
    if (!oldPayment) return;
    const cur = item.currency || "iqd";
    const diff = amt - Number(oldPayment.amount||0);
    if (cur === "usd") { setCashUSD(prev => prev + diff); }
    else { setCashIQD(prev => prev + diff); }
    const newPayments = (item.payments||[]).map(p => p.id === paymentId ? { ...p, amount: amt, date: date||today(), note: note||"" } : p);
    const newPaid = newPayments.reduce((a,b) => a + Number(b.amount||0), 0);
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, payments: newPayments, paidAmount: newPaid, isReceived: newPaid >= Number(i.received||0) } : i));
    window.dispatchEvent(new Event("karoLocalChange"));
    setEditPaymentId(null);
    setPaymentAmount("");
    setPaymentDate(today());
    setPaymentNote("");
  };"""

new2 = """  const editPayment = async (itemId, paymentId, amount, date, note) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    const amt = Number(amount||0);
    const otherPaid = (item.payments||[]).filter(p => p.id !== paymentId).reduce((a,b) => a + Number(b.amount||0), 0);
    const maxAllowed = Math.max(0, Number(item.received||0) - otherPaid);
    if (amt > maxAllowed) { setAlert("ئەم بڕە زیاترە لە ماوەی پارەکە! زیاترین بڕ: " + (item.currency==="usd"?"$":"") + Math.round(maxAllowed)); return; }
    const oldPayment = (item.payments||[]).find(p => p.id === paymentId);
    if (!oldPayment) return;
    const cur = item.currency || "iqd";
    const diff = amt - Number(oldPayment.amount||0);
    if (cur === "usd") { setCashUSD(prev => prev + diff); }
    else { setCashIQD(prev => prev + diff); }
    const newPayments = (item.payments||[]).map(p => p.id === paymentId ? { ...p, amount: amt, date: date||today(), note: note||"" } : p);
    const newPaid = newPayments.reduce((a,b) => a + Number(b.amount||0), 0);
    const updItem = { ...item, payments: newPayments, paidAmount: newPaid, isReceived: newPaid >= Number(item.received||0) };
    setItems(prev => prev.map(i => i.id === itemId ? updItem : i));
    window._karoLocal = true;
    await supabase.from("concrete").upsert([{
      id: updItem.id, project: pKey, date: updItem.date,
      currency: String(updItem.currency || "iqd"),
      meters: Number(updItem.meters || 0),
      pricepermeter: Number(updItem.pricePerMeter || 0),
      totalprice: Number(updItem.totalPrice || 0),
      deposit: Number(updItem.deposit || 0),
      depositpercent: Number(updItem.depositPercent || 0),
      received: Number(updItem.received || 0),
      isreceived: !!updItem.isReceived,
      depositclaimed: !!updItem.depositClaimed,
      note: String(updItem.note || ""),
      marked: !!updItem.marked,
      paidamount: Number(updItem.paidAmount || 0),
      payments: JSON.stringify(updItem.payments || [])
    }]);
    window._karoLocal = false;
    setEditPaymentId(null);
    setPaymentAmount("");
    setPaymentDate(today());
    setPaymentNote("");
  };"""

if old2 in src:
    src = src.replace(old2, new2)
    changes.append("✅ FIX 2: editPayment — Supabase upsert زیاد کرا")
else:
    changes.append("⚠️  FIX 2: editPayment نەدۆزرایەوە")

# ============================================================
# FIX 3: deletePayment — Supabase upsert زیاد بکە
# ============================================================
old3 = """  const deletePayment = (itemId, paymentId) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    const payment = (item.payments||[]).find(p => p.id === paymentId);
    if (!payment) return;
    const cur = item.currency || "iqd";
    const amt = Number(payment.amount||0);
    if (cur === "usd") { setCashUSD(prev => prev - amt); }
    else { setCashIQD(prev => prev - amt); }
    const newPayments = (item.payments||[]).filter(p => p.id !== paymentId);
    const newPaid = newPayments.reduce((a,b) => a + Number(b.amount||0), 0);
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, payments: newPayments, paidAmount: newPaid, isReceived: false } : i));
    window.dispatchEvent(new Event("karoLocalChange"));
  };"""

new3 = """  const deletePayment = async (itemId, paymentId) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    const payment = (item.payments||[]).find(p => p.id === paymentId);
    if (!payment) return;
    const cur = item.currency || "iqd";
    const amt = Number(payment.amount||0);
    if (cur === "usd") { setCashUSD(prev => prev - amt); }
    else { setCashIQD(prev => prev - amt); }
    const newPayments = (item.payments||[]).filter(p => p.id !== paymentId);
    const newPaid = newPayments.reduce((a,b) => a + Number(b.amount||0), 0);
    const updItem = { ...item, payments: newPayments, paidAmount: newPaid, isReceived: false };
    setItems(prev => prev.map(i => i.id === itemId ? updItem : i));
    window._karoLocal = true;
    await supabase.from("concrete").upsert([{
      id: updItem.id, project: pKey, date: updItem.date,
      currency: String(updItem.currency || "iqd"),
      meters: Number(updItem.meters || 0),
      pricepermeter: Number(updItem.pricePerMeter || 0),
      totalprice: Number(updItem.totalPrice || 0),
      deposit: Number(updItem.deposit || 0),
      depositpercent: Number(updItem.depositPercent || 0),
      received: Number(updItem.received || 0),
      isreceived: false,
      depositclaimed: !!updItem.depositClaimed,
      note: String(updItem.note || ""),
      marked: !!updItem.marked,
      paidamount: Number(updItem.paidAmount || 0),
      payments: JSON.stringify(updItem.payments || [])
    }]);
    window._karoLocal = false;
  };"""

if old3 in src:
    src = src.replace(old3, new3)
    changes.append("✅ FIX 3: deletePayment — Supabase upsert زیاد کرا")
else:
    changes.append("⚠️  FIX 3: deletePayment نەدۆزرایەوە")

# ============================================================
# ذخیره فایل
# ============================================================
with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — ConcretePage Sync Fix 2")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print(f"\n✅ فایل پاشەکەوت کرا:\n   {FILE}")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: unclaim deposit and payment sync" && git push')
