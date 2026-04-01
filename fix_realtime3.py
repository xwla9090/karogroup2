with open('src/App.js', encoding='utf-8') as f:
    content = f.read()

old = '''    onExpUpdate={data => {
      const mapped = data.map(e => ({ id: e.id, date: e.date, amountIQD: e.amountiqd, amountUSD: e.amountusd, receiptNo: e.receiptno, note: e.note, marked: e.marked }));
      localStorage.setItem("karo_exp_" + loggedUser.project, JSON.stringify(mapped));
    }}
    onConcUpdate={data => {
      const mapped = data.map(c => ({ id: c.id, date: c.date, currency: c.currency, meters: c.meters, pricePerMeter: c.pricepermeter, totalPrice: c.totalprice, deposit: c.deposit, depositPercent: c.depositpercent, received: c.received, isReceived: c.isreceived, depositClaimed: c.depositclaimed, note: c.note, marked: c.marked, paidAmount: c.paidamount, payments: JSON.parse(c.payments||"[]") }));
      localStorage.setItem("karo_conc_" + loggedUser.project, JSON.stringify(mapped));
    }}
    onCashUpdate={() => {}}'''

new = '''    onExpUpdate={data => {
      const mapped = data.map(e => ({ id: e.id, date: e.date, amountIQD: e.amountiqd, amountUSD: e.amountusd, receiptNo: e.receiptno, note: e.note, marked: e.marked }));
      localStorage.setItem("karo_exp_" + loggedUser.project, JSON.stringify(mapped));
      window.dispatchEvent(new Event("karoDataUpdate"));
    }}
    onConcUpdate={data => {
      const mapped = data.map(c => ({ id: c.id, date: c.date, currency: c.currency, meters: c.meters, pricePerMeter: c.pricepermeter, totalPrice: c.totalprice, deposit: c.deposit, depositPercent: c.depositpercent, received: c.received, isReceived: c.isreceived, depositClaimed: c.depositclaimed, note: c.note, marked: c.marked, paidAmount: c.paidamount, payments: JSON.parse(c.payments||"[]") }));
      localStorage.setItem("karo_conc_" + loggedUser.project, JSON.stringify(mapped));
      window.dispatchEvent(new Event("karoDataUpdate"));
    }}
    onCashUpdate={() => {}}'''

if old in content:
    content = content.replace(old, new, 1)
    print('fixed!')
else:
    print('NOT FOUND')

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('saved!')