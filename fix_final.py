import re

# ============================================================
# FIX 1: RealtimeSync.js — تەواو نووسینەوە
# ============================================================
RT_FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\RealtimeSync.js"

RT_CONTENT = '''import { useEffect } from "react";
import { supabase } from "./supabase";

export default function RealtimeSync({ project, onExpUpdate, onLoansUpdate, onConcUpdate, onCashUpdate }) {
  useEffect(() => {
    if (!project) return;

    const fetchAndUpdate = async (table, mapper, callback) => {
      const { data } = await supabase.from(table).select("*").eq("project", project);
      if (data && callback) callback(data.map(mapper));
    };

    const parsePayments = (p) => {
      try {
        if (Array.isArray(p)) return p;
        if (typeof p === "string" && p) return JSON.parse(p);
      } catch(e) {}
      return [];
    };

    const expSub = supabase.channel("exp4_" + project)
      .on("postgres_changes", { event: "*", schema: "public", table: "expenses", filter: "project=eq." + project }, () => {
        fetchAndUpdate("expenses", e => ({ id: e.id, date: e.date, amountIQD: e.amountiqd, amountUSD: e.amountusd, receiptNo: e.receiptno, note: e.note, marked: e.marked }), onExpUpdate);
      }).subscribe();

    const loansSub = supabase.channel("loans4_" + project)
      .on("postgres_changes", { event: "*", schema: "public", table: "loans", filter: "project=eq." + project }, () => {
        fetchAndUpdate("loans", l => ({ id: l.id, type: l.type, personName: l.personname, amountIQD: l.amountiqd, amountUSD: l.amountusd, note: l.note, date: l.date, returned: l.returned, marked: l.marked }), onLoansUpdate);
      }).subscribe();

    const concSub = supabase.channel("conc4_" + project)
      .on("postgres_changes", { event: "*", schema: "public", table: "concrete", filter: "project=eq." + project }, () => {
        fetchAndUpdate("concrete", c => ({ id: c.id, date: c.date, currency: c.currency, meters: c.meters, pricePerMeter: c.pricepermeter, totalPrice: c.totalprice, deposit: c.deposit, depositPercent: c.depositpercent, received: c.received, isReceived: c.isreceived, depositClaimed: c.depositclaimed, note: c.note, marked: c.marked, paidAmount: c.paidamount, payments: parsePayments(c.payments) }), onConcUpdate);
      }).subscribe();

    const cashSub = supabase.channel("cash4_" + project)
      .on("postgres_changes", { event: "*", schema: "public", table: "cash", filter: "project=eq." + project }, async (payload) => {
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
# FIX 2: AutoSync.js — conc لاببە
# ============================================================
AUTO_FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\AutoSync.js"

with open(AUTO_FILE, "r", encoding="utf-8") as f:
    auto_src = f.read()

old_conc = """        if (conc.length > 0) {
          var rows2 = [];
          for (var c = 0; c < conc.length; c++) {
            var cn = conc[c];
            rows2.push({ id: cn.id, project: project, date: S(cn.date), currency: S(cn.currency), meters: N(cn.meters), pricepermeter: N(cn.pricePerMeter), totalprice: N(cn.totalPrice), deposit: N(cn.deposit), depositpercent: N(cn.depositPercent), received: N(cn.received), isreceived: B(cn.isReceived), depositclaimed: B(cn.depositClaimed), note: S(cn.note), marked: B(cn.marked), paidamount: N(cn.paidAmount), payments: JSON.stringify(cn.payments||[]) });
          }
          await supabase.from("concrete").upsert(rows2);
        }

        """

if old_conc in auto_src:
    auto_src = auto_src.replace(old_conc, "        // concrete AutoSync لابرا — RealtimeSync ئەمەی دەکات\n        ")
    print("✅ AutoSync.js — conc لابرا")
else:
    print("⚠️  AutoSync.js — conc نەدۆزرایەوە")

with open(AUTO_FILE, "w", encoding="utf-8") as f:
    f.write(auto_src)

# ============================================================
# FIX 3: App.js — هەموو گۆڕانکارییەکان
# ============================================================
APP_FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(APP_FILE, "r", encoding="utf-8-sig") as f:
    src = f.read()

changes = []

# FIX 3a: RealtimeSync props — onLoansUpdate و onConcUpdate و onCashUpdate زیاد بکە
old_rt = """    onConcUpdate={data => {
      const mapped = data.map(c => ({ id: c.id, date: c.date, currency: c.currency, meters: c.meters, pricePerMeter: c.pricepermeter, totalPrice: c.totalprice, deposit: c.deposit, depositPercent: c.depositpercent, received: c.received, isReceived: c.isreceived, depositClaimed: c.depositclaimed, note: c.note, marked: c.marked, paidAmount: c.paidamount, payments: JSON.parse(c.payments||"[]") }));
      localStorage.setItem("karo_conc_" + loggedUser.project, JSON.stringify(mapped));
      window.dispatchEvent(new Event("karoDataUpdate"));
    }}
    onCashUpdate={cash => {
      setCashIQD(cash.cashiqd || 0);
      setCashUSD(cash.cashusd || 0);
      setExchangeRate(cash.exchangerate || 1500);
      localStorage.setItem("karo_cashIQD_" + loggedUser.project, JSON.stringify(cash.cashiqd || 0));
      localStorage.setItem("karo_cashUSD_" + loggedUser.project, JSON.stringify(cash.cashusd || 0));
    }}"""

new_rt = """    onLoansUpdate={data => {
      const mapped = data.map(l => ({ id: l.id, type: l.type, personName: l.personname, amountIQD: l.amountiqd, amountUSD: l.amountusd, note: l.note, date: l.date, returned: l.returned, marked: l.marked }));
      localStorage.setItem("karo_loans_" + loggedUser.project, JSON.stringify(mapped));
      window.dispatchEvent(new Event("karoDataUpdate"));
    }}
    onConcUpdate={data => {
      const mapped = data.map(c => {
        let pays = [];
        try { pays = Array.isArray(c.payments) ? c.payments : JSON.parse(c.payments||"[]"); } catch(e) { pays = []; }
        return { id: c.id, date: c.date, currency: c.currency, meters: c.meters, pricePerMeter: c.pricepermeter, totalPrice: c.totalprice, deposit: c.deposit, depositPercent: c.depositpercent, received: c.received, isReceived: c.isreceived, depositClaimed: c.depositclaimed, note: c.note, marked: c.marked, paidAmount: c.paidamount, payments: pays };
      });
      localStorage.setItem("karo_conc_" + loggedUser.project, JSON.stringify(mapped));
      window.dispatchEvent(new Event("karoDataUpdate"));
    }}
    onCashUpdate={cash => {
      cashRemoteRef.current = true;
      setCashIQD(cash.cashiqd || 0);
      cashRemoteRef.current = true;
      setCashUSD(cash.cashusd || 0);
      cashRemoteRef.current = true;
      setExchangeRate(cash.exchangerate || 1500);
      localStorage.setItem("karo_cashIQD_" + loggedUser.project, JSON.stringify(cash.cashiqd || 0));
      localStorage.setItem("karo_cashUSD_" + loggedUser.project, JSON.stringify(cash.cashusd || 0));
      window.dispatchEvent(new Event("karoDataUpdate"));
    }}"""

if old_rt in src:
    src = src.replace(old_rt, new_rt)
    changes.append("✅ FIX 3a: onLoansUpdate + onConcUpdate + onCashUpdate چاک کران")
else:
    changes.append("⚠️  FIX 3a: RealtimeSync props نەدۆزرایەوە")

# FIX 3b: cash useEffect — cashRemoteRef زیاد بکە
old_cash_ef = """  useEffect(() => {
    if (!pKey || pKey === "default") return;
    const cashLogData = JSON.parse(localStorage.getItem("karo_cashLog_" + pKey) || "[]");
    supabase.from("cash").upsert([{ id: pKey, project: pKey, cashiqd: cashIQD, cashusd: cashUSD, exchangerate: exchangeRate, cashlog: JSON.stringify(cashLogData), formatted_at: localStorage.getItem("karo_formatted_" + pKey) || "" }]);
  }, [cashIQD, cashUSD, exchangeRate, pKey]);"""

new_cash_ef = """  const cashRemoteRef = useRef(false);
  useEffect(() => {
    if (!pKey || pKey === "default") return;
    if (cashRemoteRef.current) { cashRemoteRef.current = false; return; }
    const cashLogData = JSON.parse(localStorage.getItem("karo_cashLog_" + pKey) || "[]");
    supabase.from("cash").upsert([{ id: pKey, project: pKey, cashiqd: cashIQD, cashusd: cashUSD, exchangerate: exchangeRate, cashlog: JSON.stringify(cashLogData), formatted_at: localStorage.getItem("karo_formatted_" + pKey) || "" }]);
  }, [cashIQD, cashUSD, exchangeRate, pKey]);"""

if old_cash_ef in src:
    src = src.replace(old_cash_ef, new_cash_ef)
    changes.append("✅ FIX 3b: cashRemoteRef زیاد کرا")
else:
    changes.append("⚠️  FIX 3b: cash useEffect نەدۆزرایەوە")

# FIX 3c: ConcretePage handleSave — Supabase upsert زیاد بکە
old_hs = """    const item = { ...form, id: genId(), totalPrice, deposit: depositAmt, received: receivedAmt, depositClaimed: false, isReceived: false, marked: false, currency: cur };
    setItems(prev => [item, ...prev]);
    window._karoLocal = true;
    window._karoLocal = true;
    resetForm();
    setShowForm(false);
  };"""

new_hs = """    const item = { ...form, id: genId(), totalPrice, deposit: depositAmt, received: receivedAmt, depositClaimed: false, isReceived: false, marked: false, currency: cur };
    setItems(prev => [item, ...prev]);
    await supabase.from("concrete").upsert([{
      id: item.id, project: pKey, date: item.date,
      currency: String(item.currency||"iqd"), meters: Number(item.meters||0),
      pricepermeter: Number(item.pricePerMeter||0), totalprice: Number(item.totalPrice||0),
      deposit: Number(item.deposit||0), depositpercent: Number(item.depositPercent||0),
      received: Number(item.received||0), isreceived: false, depositclaimed: false,
      note: String(item.note||""), marked: false, paidamount: 0, payments: "[]"
    }]);
    resetForm();
    setShowForm(false);
  };"""

if old_hs in src:
    src = src.replace(old_hs, new_hs)
    changes.append("✅ FIX 3c: handleSave concrete — upsert زیاد کرا")
else:
    changes.append("⚠️  FIX 3c: handleSave concrete نەدۆزرایەوە")

# FIX 3d: LoansPage — handleSave new item localStorage + upsert
old_ln = """      setItems(prev => [{...form, personName: pName, id: genId(), marked: false, returned: false}, ...prev]);
      setShowForm(false);
    }
    resetForm(); 
  };"""

new_ln = """      const newLoan = {...form, personName: pName, id: genId(), marked: false, returned: false};
      const updLoans = [newLoan, ...items];
      setItems(updLoans);
      localStorage.setItem("karo_loans_" + pKey, JSON.stringify(updLoans));
      await supabase.from("loans").upsert([{
        id: newLoan.id, project: pKey, type: newLoan.type,
        personname: pName, amountiqd: iqd, amountusd: usd,
        note: String(newLoan.note||""), date: newLoan.date,
        returned: false, marked: false
      }]);
      setShowForm(false);
    }
    resetForm(); 
  };"""

if old_ln in src:
    src = src.replace(old_ln, new_ln)
    changes.append("✅ FIX 3d: LoansPage handleSave new — upsert + localStorage")
else:
    changes.append("⚠️  FIX 3d: LoansPage handleSave نەدۆزرایەوە")

# FIX 3e: LoansPage karoDataUpdate listener زیاد بکە
old_ls_ef = """  useEffect(() => { setLS(KEY, items); }, [items, KEY]);
  useEffect(() => { setLS(PERSONS_KEY, personsList); }, [personsList, PERSONS_KEY]);

  useEffect(() => {
    const namesFromItems = [...new Set(items.map(i => i.personName).filter(name => name && name.trim() !== ""))];"""

new_ls_ef = """  useEffect(() => { setLS(KEY, items); }, [items, KEY]);
  useEffect(() => { setLS(PERSONS_KEY, personsList); }, [personsList, PERSONS_KEY]);

  useEffect(() => {
    const handler = () => { setItems(getLS(KEY, [])); };
    window.addEventListener("karoDataUpdate", handler);
    return () => window.removeEventListener("karoDataUpdate", handler);
  }, [KEY]);

  useEffect(() => {
    const namesFromItems = [...new Set(items.map(i => i.personName).filter(name => name && name.trim() !== ""))];"""

if old_ls_ef in src:
    src = src.replace(old_ls_ef, new_ls_ef)
    changes.append("✅ FIX 3e: LoansPage karoDataUpdate listener زیاد کرا")
else:
    changes.append("⚠️  FIX 3e: LoansPage listener نەدۆزرایەوە")

with open(APP_FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — Final Complete Fix")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("✅ هەموو فایلەکان پاشەکەوت کران")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: complete sync rewrite" && git push')
