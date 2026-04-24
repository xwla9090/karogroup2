FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\RealtimeSync.js"

with open(FILE, "r", encoding="utf-8") as f:
    src = f.read()

changes = []

old1 = """    // کاتی کرایەوەی براوزەر — conc و exp بخوێنەوە، cash هیچکاتێک سفر ناکرێت
    const initialLoad = async () => {
      const concMapper = c => ({ id: c.id, date: c.date, currency: c.currency, meters: c.meters, pricePerMeter: c.pricepermeter, totalPrice: c.totalprice, deposit: c.deposit, depositPercent: c.depositpercent, received: c.received, isReceived: c.isreceived, depositClaimed: c.depositclaimed, note: c.note, marked: c.marked, paidAmount: c.paidamount, payments: (() => { try { return Array.isArray(c.payments) ? c.payments : JSON.parse(c.payments||"[]"); } catch(e) { return []; } })() });
      const expMapper = e => ({ id: e.id, date: e.date, amountIQD: e.amountiqd, amountUSD: e.amountusd, receiptNo: e.receiptno, note: e.note, marked: e.marked });

      const [expRes, concRes] = await Promise.all([
        supabase.from("expenses").select("*").eq("project", project),
        supabase.from("concrete").select("*").eq("project", project),
      ]);

      let changed = false;
      if (expRes.data) { localStorage.setItem("karo_exp_" + project, JSON.stringify(expRes.data.map(expMapper))); changed = true; }
      if (concRes.data) { localStorage.setItem("karo_conc_" + project, JSON.stringify(concRes.data.map(concMapper))); changed = true; }
      if (changed) window.dispatchEvent(new Event("karoDataUpdate"));
    };
    initialLoad();"""

new1 = """    // کاتی کرایەوەی براوزەر — هەموو داتا بخوێنەوە
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
      if (cashRes && cashRes.data) {
        // localStorage نوێ بکەرەوە بەلام setCash ناکەین تا loop نەدروست بێت
        localStorage.setItem("karo_cashIQD_" + project, JSON.stringify(cashRes.data.cashiqd || 0));
        localStorage.setItem("karo_cashUSD_" + project, JSON.stringify(cashRes.data.cashusd || 0));
        if (onCashUpdate) onCashUpdate(cashRes.data);
        else {
          if (setCashIQD) setCashIQD(cashRes.data.cashiqd || 0);
          if (setCashUSD) setCashUSD(cashRes.data.cashusd || 0);
        }
        changed = true;
      }
      if (changed) window.dispatchEvent(new Event("karoDataUpdate"));
    };
    initialLoad();"""

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: initialLoad — cash زیاد کرا")
else:
    changes.append("⚠️  FIX 1: initialLoad نەدۆزرایەوە")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — InitialLoad Cash Fix")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("✅ RealtimeSync.js پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: initialLoad fetch cash" && git push')
