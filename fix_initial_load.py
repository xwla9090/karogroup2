FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\RealtimeSync.js"

with open(FILE, "r", encoding="utf-8") as f:
    src = f.read()

changes = []

old1 = """    const fetchAndUpdate = async (table, localKey, mapper) => {
      if (window._karoLocal) return;
      await new Promise(r => setTimeout(r, 3000));
      if (window._karoLocal) return;
      const { data } = await supabase.from(table).select("*").eq("project", project);
      if (data) {
        const local = JSON.parse(localStorage.getItem(localKey + project) || "[]");
        if (JSON.stringify(data.sort((a,b)=>a.id>b.id?1:-1)) !== JSON.stringify(local.sort((a,b)=>a.id>b.id?1:-1))) {
          localStorage.setItem(localKey + project, JSON.stringify(data.map(mapper)));
          window.dispatchEvent(new Event("karoDataUpdate"));
        }
      }
      window._karoLocal = false;
    };"""

new1 = """    const fetchAndUpdate = async (table, localKey, mapper) => {
      if (window._karoLocal) return;
      await new Promise(r => setTimeout(r, 3000));
      if (window._karoLocal) return;
      const { data } = await supabase.from(table).select("*").eq("project", project);
      if (data) {
        const local = JSON.parse(localStorage.getItem(localKey + project) || "[]");
        if (JSON.stringify(data.sort((a,b)=>a.id>b.id?1:-1)) !== JSON.stringify(local.sort((a,b)=>a.id>b.id?1:-1))) {
          localStorage.setItem(localKey + project, JSON.stringify(data.map(mapper)));
          window.dispatchEvent(new Event("karoDataUpdate"));
        }
      }
      window._karoLocal = false;
    };

    // کاتی کرایەوەی براوزەر — هەموو داتا لە Supabase بخوێنەوە
    const initialLoad = async () => {
      const expMapper = e => ({ id: e.id, date: e.date, amountIQD: e.amountiqd, amountUSD: e.amountusd, receiptNo: e.receiptno, note: e.note, marked: e.marked });
      const concMapper = c => ({ id: c.id, date: c.date, currency: c.currency, meters: c.meters, pricePerMeter: c.pricepermeter, totalPrice: c.totalprice, deposit: c.deposit, depositPercent: c.depositpercent, received: c.received, isReceived: c.isreceived, depositClaimed: c.depositclaimed, note: c.note, marked: c.marked, paidAmount: c.paidamount, payments: (() => { try { return Array.isArray(c.payments) ? c.payments : JSON.parse(c.payments||"[]"); } catch(e) { return []; } })() });
      const loansMapper = l => ({ id: l.id, type: l.type, personName: l.personname, amountIQD: l.amountiqd, amountUSD: l.amountusd, note: l.note, date: l.date, returned: l.returned, marked: l.marked });

      const [expRes, concRes, loansRes, cashRes] = await Promise.all([
        supabase.from("expenses").select("*").eq("project", project),
        supabase.from("concrete").select("*").eq("project", project),
        supabase.from("loans").select("*").eq("project", project),
        supabase.from("cash").select("*").eq("project", project).single()
      ]);

      let changed = false;
      if (expRes.data) { localStorage.setItem("karo_exp_" + project, JSON.stringify(expRes.data.map(expMapper))); changed = true; }
      if (concRes.data) { localStorage.setItem("karo_conc_" + project, JSON.stringify(concRes.data.map(concMapper))); changed = true; }
      if (loansRes.data) { localStorage.setItem("karo_loans_" + project, JSON.stringify(loansRes.data.map(loansMapper))); changed = true; }
      if (cashRes.data) {
        localStorage.setItem("karo_cashIQD_" + project, JSON.stringify(cashRes.data.cashiqd || 0));
        localStorage.setItem("karo_cashUSD_" + project, JSON.stringify(cashRes.data.cashusd || 0));
        if (setCashIQD) setCashIQD(cashRes.data.cashiqd || 0);
        if (setCashUSD) setCashUSD(cashRes.data.cashusd || 0);
        changed = true;
      }
      if (changed) window.dispatchEvent(new Event("karoDataUpdate"));
    };
    initialLoad();"""

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: initialLoad زیاد کرا")
else:
    changes.append("⚠️  FIX 1: fetchAndUpdate نەدۆزرایەوە")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — Initial Load Fix")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("✅ فایل پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: initial load from Supabase" && git push')
