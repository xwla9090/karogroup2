FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\RealtimeSync.js"

with open(FILE, "r", encoding="utf-8") as f:
    src = f.read()

changes = []

old1 = """    // کاتی کرایەوەی براوزەر — هەموو داتا لە Supabase بخوێنەوە
    const initialLoad = async () => {
      const concMapper = c => ({ id: c.id, date: c.date, currency: c.currency, meters: c.meters, pricePerMeter: c.pricepermeter, totalPrice: c.totalprice, deposit: c.deposit, depositPercent: c.depositpercent, received: c.received, isReceived: c.isreceived, depositClaimed: c.depositclaimed, note: c.note, marked: c.marked, paidAmount: c.paidamount, payments: (() => { try { return Array.isArray(c.payments) ? c.payments : JSON.parse(c.payments||"[]"); } catch(e) { return []; } })() });
      const expMapper = e => ({ id: e.id, date: e.date, amountIQD: e.amountiqd, amountUSD: e.amountusd, receiptNo: e.receiptno, note: e.note, marked: e.marked });

      const [expRes, concRes, cashRes] = await Promise.all([
        supabase.from("expenses").select("*").eq("project", project),
        supabase.from("concrete").select("*").eq("project", project),
        supabase.from("cash").select("*").eq("project", project).single()
      ]);

      let changed = false;
      if (expRes.data) { localStorage.setItem("karo_exp_" + project, JSON.stringify(expRes.data.map(expMapper))); changed = true; }
      if (concRes.data) { localStorage.setItem("karo_conc_" + project, JSON.stringify(concRes.data.map(concMapper))); changed = true; }
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

new1 = """    // کاتی کرایەوەی براوزەر — تەنها ئەگەر localStorage بەتاڵە داتا بخوێنەوە
    const initialLoad = async () => {
      const localConc = localStorage.getItem("karo_conc_" + project);
      const localCash = localStorage.getItem("karo_cashIQD_" + project);
      
      // ئەگەر داتا هەیە، تەنها cash نوێ بکەرەوە نەک conc
      if (localCash && localConc) return;

      const concMapper = c => ({ id: c.id, date: c.date, currency: c.currency, meters: c.meters, pricePerMeter: c.pricepermeter, totalPrice: c.totalprice, deposit: c.deposit, depositPercent: c.depositpercent, received: c.received, isReceived: c.isreceived, depositClaimed: c.depositclaimed, note: c.note, marked: c.marked, paidAmount: c.paidamount, payments: (() => { try { return Array.isArray(c.payments) ? c.payments : JSON.parse(c.payments||"[]"); } catch(e) { return []; } })() });
      const expMapper = e => ({ id: e.id, date: e.date, amountIQD: e.amountiqd, amountUSD: e.amountusd, receiptNo: e.receiptno, note: e.note, marked: e.marked });

      const [expRes, concRes, cashRes] = await Promise.all([
        supabase.from("expenses").select("*").eq("project", project),
        supabase.from("concrete").select("*").eq("project", project),
        supabase.from("cash").select("*").eq("project", project).single()
      ]);

      let changed = false;
      if (expRes.data && !localStorage.getItem("karo_exp_" + project)) { localStorage.setItem("karo_exp_" + project, JSON.stringify(expRes.data.map(expMapper))); changed = true; }
      if (concRes.data && !localConc) { localStorage.setItem("karo_conc_" + project, JSON.stringify(concRes.data.map(concMapper))); changed = true; }
      if (cashRes.data && !localCash) {
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
    changes.append("✅ FIX 1: initialLoad — تەنها کاتی بەتاڵی localStorage")
else:
    changes.append("⚠️  FIX 1: initialLoad نەدۆزرایەوە")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — InitialLoad Fix")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("✅ RealtimeSync.js پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: initialLoad only if empty" && git push')
