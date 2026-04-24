FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8-sig") as f:
    src = f.read()

changes = []

old1 = """    onConcUpdate={data => {
      const mapped = data.map(c => { let pays = []; try { pays = JSON.parse(c.payments||"[]"); } catch(e) { pays = []; } return { id: c.id, date: c.date, currency: c.currency, meters: c.meters, pricePerMeter: c.pricepermeter, totalPrice: c.totalprice, deposit: c.deposit, depositPercent: c.depositpercent, received: c.received, isReceived: c.isreceived, depositClaimed: c.depositclaimed, note: c.note, marked: c.marked, paidAmount: c.paidamount, payments: pays }; });
      localStorage.setItem("karo_conc_" + loggedUser.project, JSON.stringify(mapped));
      window.dispatchEvent(new Event("karoDataUpdate"));
    }}"""

new1 = """    onConcUpdate={data => {
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

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: onConcUpdate payments mapper چاک کرا")
else:
    changes.append("⚠️  FIX 1: onConcUpdate نەدۆزرایەوە")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — onConcUpdate Payments Fix")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("✅ فایل پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: onConcUpdate payments array" && git push')
