FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8-sig") as f:
    src = f.read()

changes = []

# FIX 1: ConcretePage handler — تەنها کاتێک براوزەری دووەم ئاگادار بکاتەوە
old1 = """  useEffect(() => {
    const handler = () => setItems(getLS(KEY, []));
    window.addEventListener("karoDataUpdate", handler);
    return () => window.removeEventListener("karoDataUpdate", handler);
  }, [KEY]);"""

new1 = """  useEffect(() => {
    const handler = () => {
      if (window._concLocalUpdate) return;
      setItems(getLS(KEY, []));
    };
    window.addEventListener("karoDataUpdate", handler);
    return () => window.removeEventListener("karoDataUpdate", handler);
  }, [KEY]);"""

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: ConcretePage handler — _concLocalUpdate چێک زیاد کرا")
else:
    changes.append("⚠️  FIX 1: handler نەدۆزرایەوە")

# FIX 2: addPayment — _concLocalUpdate = true زیاد بکە
old2 = """    const updatedConc = items.map(i => i.id === id ? { ...i, paidAmount: newPaid, isReceived: remaining <= 0, payments: newPaymentsList } : i);
    setItems(updatedConc);
    localStorage.setItem("karo_conc_" + pKey, JSON.stringify(updatedConc));
    const updItem = { ...item, paidAmount: newPaid, isReceived: remaining <= 0, payments: newPaymentsList };
    await supabase.from("concrete").upsert"""

new2 = """    const updatedConc = items.map(i => i.id === id ? { ...i, paidAmount: newPaid, isReceived: remaining <= 0, payments: newPaymentsList } : i);
    window._concLocalUpdate = true;
    setItems(updatedConc);
    localStorage.setItem("karo_conc_" + pKey, JSON.stringify(updatedConc));
    const updItem = { ...item, paidAmount: newPaid, isReceived: remaining <= 0, payments: newPaymentsList };
    await supabase.from("concrete").upsert"""

if old2 in src:
    src = src.replace(old2, new2)
    changes.append("✅ FIX 2: addPayment — _concLocalUpdate زیاد کرا")
else:
    changes.append("⚠️  FIX 2: addPayment نەدۆزرایەوە")

# FIX 3: onConcUpdate — _concLocalUpdate = false زیاد بکە
old3 = """    onConcUpdate={data => {
      const mapped = data.map(c => {
        let pays = [];
        try {
          if (Array.isArray(c.payments)) { pays = c.payments; }
          else if (typeof c.payments === "string" && c.payments) { pays = JSON.parse(c.payments); }
        } catch(e) { pays = []; }
        return { id: c.id, date: c.date, currency: c.currency, meters: c.meters, pricePerMeter: c.pricepermeter, totalPrice: c.totalprice, deposit: c.deposit, depositPercent: c.depositpercent, received: c.received, isReceived: c.isreceived, depositClaimed: c.depositclaimed, note: c.note, marked: c.marked, paidAmount: c.paidamount, payments: pays };
      });
      localStorage.setItem("karo_conc_" + loggedUser.project, JSON.stringify(mapped));
      window.dispatchEvent(new Event("karoDataUpdate"));
    }}"""

new3 = """    onConcUpdate={data => {
      const mapped = data.map(c => {
        let pays = [];
        try {
          if (Array.isArray(c.payments)) { pays = c.payments; }
          else if (typeof c.payments === "string" && c.payments) { pays = JSON.parse(c.payments); }
        } catch(e) { pays = []; }
        return { id: c.id, date: c.date, currency: c.currency, meters: c.meters, pricePerMeter: c.pricepermeter, totalPrice: c.totalprice, deposit: c.deposit, depositPercent: c.depositpercent, received: c.received, isReceived: c.isreceived, depositClaimed: c.depositclaimed, note: c.note, marked: c.marked, paidAmount: c.paidamount, payments: pays };
      });
      window._concLocalUpdate = false;
      localStorage.setItem("karo_conc_" + loggedUser.project, JSON.stringify(mapped));
      window.dispatchEvent(new Event("karoDataUpdate"));
    }}"""

if old3 in src:
    src = src.replace(old3, new3)
    changes.append("✅ FIX 3: onConcUpdate — _concLocalUpdate = false زیاد کرا")
else:
    changes.append("⚠️  FIX 3: onConcUpdate نەدۆزرایەوە")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — ConcretePage Local Update Fix")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("✅ فایل پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: concrete local update flag" && git push')
