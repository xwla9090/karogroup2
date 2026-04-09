
with open('src/App.js', encoding='utf-8') as f:
    content = f.read()

# _karoLocal = false لە markReceived لابەرین
content = content.replace(
    'await supabase.from("concrete").upsert([{ id: updItem.id, project: pKey, date: updItem.date, currency: String(updItem.currency||"iqd"), meters: Number(updItem.meters||0), pricepermeter: Number(updItem.pricePerMeter||0), totalprice: Number(updItem.totalPrice||0), deposit: Number(updItem.deposit||0), depositpercent: Number(updItem.depositPercent||0), received: Number(updItem.received||0), isreceived: true, depositclaimed: !!updItem.depositClaimed, note: String(updItem.note||""), marked: !!updItem.marked, paidamount: Number(updItem.paidAmount||0), payments: JSON.stringify(updItem.payments||[]) }]);\n      setItems(prev => prev.map(i => i.id === id ? { ...i, isReceived: true } : i));\n      window._karoLocal = false;',
    'await supabase.from("concrete").upsert([{ id: updItem.id, project: pKey, date: updItem.date, currency: String(updItem.currency||"iqd"), meters: Number(updItem.meters||0), pricepermeter: Number(updItem.pricePerMeter||0), totalprice: Number(updItem.totalPrice||0), deposit: Number(updItem.deposit||0), depositpercent: Number(updItem.depositPercent||0), received: Number(updItem.received||0), isreceived: true, depositclaimed: !!updItem.depositClaimed, note: String(updItem.note||""), marked: !!updItem.marked, paidamount: Number(updItem.paidAmount||0), payments: JSON.stringify(updItem.payments||[]) }]);\n      setItems(prev => prev.map(i => i.id === id ? { ...i, isReceived: true } : i));\n      setTimeout(() => { window._karoLocal = false; }, 5000);'
)

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('done!')
