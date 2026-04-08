
with open('src/App.js', encoding='utf-8') as f:
    content = f.read()

# mapper درست بکەین
old = 'currency: String(c.currency"iqd"), meters: Number(c.meters0), pricepermeter: Number(c.pricePerMeter0), totalprice: Number(c.totalPrice0), deposit: Number(c.deposit0), depositpercent: Number(c.depositPercent0), received: Number(c.received0)'
new = 'currency: String(c.currency||"iqd"), meters: Number(c.meters||0), pricepermeter: Number(c.pricePerMeter||0), totalprice: Number(c.totalPrice||0), deposit: Number(c.deposit||0), depositpercent: Number(c.depositPercent||0), received: Number(c.received||0)'

if old in content:
    content = content.replace(old, new)
    print('fixed mapper!')
else:
    print('NOT FOUND')

# note و payments
old2 = 'note: String(c.note""), marked: !!c.marked, paidamount: Number(c.paidAmount0), payments: JSON.stringify(c.payments[])'
new2 = 'note: String(c.note||""), marked: !!c.marked, paidamount: Number(c.paidAmount||0), payments: JSON.stringify(c.payments||[])'

if old2 in content:
    content = content.replace(old2, new2)
    print('fixed note!')
else:
    print('NOT FOUND 2')

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('saved!')
