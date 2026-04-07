with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[2893] = '      const rows = items.map(c => ({ id: c.id, project: pKey, date: c.date, currency: String(c.currency||"iqd"), meters: Number(c.meters||0), pricepermeter: Number(c.pricePerMeter||0), totalprice: Number(c.totalPrice||0), deposit: Number(c.deposit||0), depositpercent: Number(c.depositPercent||0), received: Number(c.received||0), isreceived: !!c.isReceived, depositclaimed: !!c.depositClaimed, note: String(c.note||""), marked: !!c.marked, paidamount: Number(c.paidAmount||0), payments: JSON.stringify(c.payments||[]) }));\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')