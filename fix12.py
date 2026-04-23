import shutil

APP_FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"
RT_FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\RealtimeSync.js"

# ============================================================
# RealtimeSync.js — تەواو دەنووسینەوە
# ============================================================
RT_CONTENT = '''import { useEffect, useRef } from "react";
import { supabase } from "./supabase";

export default function RealtimeSync({ project, onExpUpdate, onLoansUpdate, onConcUpdate, onCashUpdate }) {
  const ignoreRef = useRef({});

  useEffect(() => {
    if (!project) return;

    window._karoIgnore = (table, ms = 4000) => {
      ignoreRef.current[table] = true;
      setTimeout(() => { ignoreRef.current[table] = false; }, ms);
    };

    const fetchAndUpdate = async (table, mapper, callback) => {
      if (ignoreRef.current[table]) return;
      const { data } = await supabase.from(table).select("*").eq("project", project);
      if (data && callback) callback(data.map(mapper));
    };

    const expSub = supabase.channel("exp2_" + project)
      .on("postgres_changes", { event: "*", schema: "public", table: "expenses", filter: "project=eq." + project }, () => {
        fetchAndUpdate("expenses", e => ({ id: e.id, date: e.date, amountIQD: e.amountiqd, amountUSD: e.amountusd, receiptNo: e.receiptno, note: e.note, marked: e.marked }), onExpUpdate);
      }).subscribe();

    const loansSub = supabase.channel("loans_" + project)
      .on("postgres_changes", { event: "*", schema: "public", table: "loans", filter: "project=eq." + project }, () => {
        fetchAndUpdate("loans", l => ({ id: l.id, type: l.type, personName: l.personname, amountIQD: l.amountiqd, amountUSD: l.amountusd, note: l.note, date: l.date, returned: l.returned, marked: l.marked }), onLoansUpdate);
      }).subscribe();

    const concSub = supabase.channel("conc2_" + project)
      .on("postgres_changes", { event: "*", schema: "public", table: "concrete", filter: "project=eq." + project }, () => {
        fetchAndUpdate("concrete", c => ({ id: c.id, date: c.date, currency: c.currency, meters: c.meters, pricePerMeter: c.pricepermeter, totalPrice: c.totalprice, deposit: c.deposit, depositPercent: c.depositpercent, received: c.received, isReceived: c.isreceived, depositClaimed: c.depositclaimed, note: c.note, marked: c.marked, paidAmount: c.paidamount, payments: JSON.parse(c.payments||"[]") }), onConcUpdate);
      }).subscribe();

    const cashSub = supabase.channel("cash_rt_" + project)
      .on("postgres_changes", { event: "*", schema: "public", table: "cash", filter: "project=eq." + project }, async (payload) => {
        if (ignoreRef.current["cash"]) return;
        const newData = payload.new;
        if (!newData) return;

        const localFormatted = localStorage.getItem("karo_formatted_" + project);
        if (newData.formatted_at && newData.formatted_at !== localFormatted) {
          localStorage.setItem("karo_formatted_" + project, newData.formatted_at);
          ["exp","conc","loans","contr","inv"].forEach(k => localStorage.setItem("karo_" + k + "_" + project, "[]"));
          localStorage.setItem("karo_cashIQD_" + project, "0");
          localStorage.setItem("karo_cashUSD_" + project, "0");
          localStorage.setItem("karo_cashLog_" + project, "[]");
          window.dispatchEvent(new Event("karoDataUpdate"));
          return;
        }

        if (onCashUpdate) onCashUpdate(newData);
      }).subscribe();

    return () => {
      supabase.removeChannel(expSub);
      supabase.removeChannel(concSub);
      supabase.removeChannel(loansSub);
      supabase.removeChannel(cashSub);
    };
  }, [project]);

  return null;
}
'''

with open(RT_FILE, "w", encoding="utf-8") as f:
    f.write(RT_CONTENT)
print("✅ RealtimeSync.js نووسرایەوە")

# ============================================================
# App.js گۆڕانکاری
# ============================================================
with open(APP_FILE, "r", encoding="utf-8") as f:
    src = f.read()

changes = []

# FIX 1: onCashUpdate — UI نوێ بکەرەوە
old1 = """    onCashUpdate={cash => {
      setCashIQD(cash.cashiqd || 0);
      setCashUSD(cash.cashusd || 0);
      setExchangeRate(cash.exchangerate || 1500);
      localStorage.setItem("karo_cashIQD_" + loggedUser.project, JSON.stringify(cash.cashiqd || 0));
      localStorage.setItem("karo_cashUSD_" + loggedUser.project, JSON.stringify(cash.cashusd || 0));
    }}"""

new1 = """    onCashUpdate={cash => {
      setCashIQD(cash.cashiqd || 0);
      setCashUSD(cash.cashusd || 0);
      setExchangeRate(cash.exchangerate || 1500);
      localStorage.setItem("karo_cashIQD_" + loggedUser.project, JSON.stringify(cash.cashiqd || 0));
      localStorage.setItem("karo_cashUSD_" + loggedUser.project, JSON.stringify(cash.cashusd || 0));
      window.dispatchEvent(new Event("karoDataUpdate"));
    }}"""

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: onCashUpdate — karoDataUpdate زیاد کرا")
else:
    changes.append("⚠️  FIX 1: onCashUpdate نەدۆزرایەوە")

# FIX 2: onLoansUpdate — localStorage + event
old2 = """    onLoansUpdate={data => {
      const mapped = data.map(l => ({ id: l.id, type: l.type, personName: l.personname, amountIQD: l.amountiqd, amountUSD: l.amountusd, note: l.note, date: l.date, returned: l.returned, marked: l.marked }));
      localStorage.setItem("karo_loans_" + loggedUser.project, JSON.stringify(mapped));
      window.dispatchEvent(new Event("karoDataUpdate"));
    }}"""

new2 = """    onLoansUpdate={data => {
      const mapped = data.map(l => ({ id: l.id, type: l.type, personName: l.personname, amountIQD: l.amountiqd, amountUSD: l.amountusd, note: l.note, date: l.date, returned: l.returned, marked: l.marked }));
      localStorage.setItem("karo_loans_" + loggedUser.project, JSON.stringify(mapped));
      window.dispatchEvent(new Event("karoDataUpdate"));
    }}
"""

if old2 in src:
    changes.append("✅ FIX 2: onLoansUpdate باشە")
else:
    changes.append("⚠️  FIX 2: onLoansUpdate چێک بکە")

# FIX 3: cash useEffect — _karoLocal چێک
old3 = """  useEffect(() => {
    if (!pKey || pKey === "default") return;
    if (window._karoLocal) return;
    const cashLogData = JSON.parse(localStorage.getItem("karo_cashLog_" + pKey) || "[]");
    supabase.from("cash").upsert([{ id: pKey, project: pKey, cashiqd: cashIQD, cashusd: cashUSD, exchangerate: exchangeRate, cashlog: JSON.stringify(cashLogData), formatted_at: localStorage.getItem("karo_formatted_" + pKey) || "" }]);
  }, [cashIQD, cashUSD, exchangeRate, pKey]);"""

new3 = """  useEffect(() => {
    if (!pKey || pKey === "default") return;
    if (window._karoIgnore && window._karoIgnore["cash"]) return;
    const cashLogData = JSON.parse(localStorage.getItem("karo_cashLog_" + pKey) || "[]");
    if (window._karoIgnore) window._karoIgnore("cash", 4000);
    supabase.from("cash").upsert([{ id: pKey, project: pKey, cashiqd: cashIQD, cashusd: cashUSD, exchangerate: exchangeRate, cashlog: JSON.stringify(cashLogData), formatted_at: localStorage.getItem("karo_formatted_" + pKey) || "" }]);
  }, [cashIQD, cashUSD, exchangeRate, pKey]);"""

if old3 in src:
    src = src.replace(old3, new3)
    changes.append("✅ FIX 3: cash useEffect — _karoIgnore چێک")
else:
    changes.append("⚠️  FIX 3: cash useEffect نەدۆزرایەوە")

# FIX 4: LoansPage handleSave new — _karoIgnore بەکاربهێنە
old4 = """      window._karoLocal = true;
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

new4 = """      if (window._karoIgnore) window._karoIgnore("loans", 4000);
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

if old4 in src:
    src = src.replace(old4, new4)
    changes.append("✅ FIX 4: handleSave new — _karoIgnore")
else:
    changes.append("⚠️  FIX 4: handleSave new نەدۆزرایەوە")

# FIX 5: LoansPage handleSave edit — _karoIgnore
old5 = """      window._karoLocal = true;
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

new5 = """      if (window._karoIgnore) window._karoIgnore("loans", 4000);
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

if old5 in src:
    src = src.replace(old5, new5)
    changes.append("✅ FIX 5: handleSave edit — _karoIgnore")
else:
    changes.append("⚠️  FIX 5: handleSave edit نەدۆزرایەوە")

# FIX 6: handleReturn — _karoIgnore
old6 = """    window._karoLocal = true;
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

new6 = """    if (window._karoIgnore) window._karoIgnore("loans", 4000);
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
    setConfirmReturn(null);"""

if old6 in src:
    src = src.replace(old6, new6)
    changes.append("✅ FIX 6: handleReturn — _karoIgnore")
else:
    changes.append("⚠️  FIX 6: handleReturn نەدۆزرایەوە")

# FIX 7: doDelete — _karoIgnore
old7 = """    window._karoLocal = true;
    await supabase.from("loans").delete().eq("id", id);
    setTimeout(() => { window._karoLocal = false; }, 3000);
    setConfirmDel(null);"""

new7 = """    if (window._karoIgnore) window._karoIgnore("loans", 4000);
    await supabase.from("loans").delete().eq("id", id);
    setConfirmDel(null);"""

if old7 in src:
    src = src.replace(old7, new7)
    changes.append("✅ FIX 7: doDelete — _karoIgnore")
else:
    changes.append("⚠️  FIX 7: doDelete نەدۆزرایەوە")

with open(APP_FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — Fix 12")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("✅ App.js و RealtimeSync.js پاشەکەوت کران")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: realtime sync with ignore flag" && git push')
