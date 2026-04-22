with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[3007] = '  const unmarkReceived = async id => {\n'
lines[3017] = '    setItems(prev => prev.map(i => i.id === id ? { ...i, isReceived: false, paidAmount: 0, payments: [] } : i));\n    window._karoLocal = true;\n    const updItem = { ...item, isReceived: false, paidAmount: 0, payments: [] };\n    await supabase.from("concrete").upsert([{ id: updItem.id, project: pKey, date: updItem.date, currency: String(updItem.currency||"iqd"), meters: Number(updItem.meters||0), pricepermeter: Number(updItem.pricePerMeter||0), totalprice: Number(updItem.totalPrice||0), deposit: Number(updItem.deposit||0), depositpercent: Number(updItem.depositPercent||0), received: Number(updItem.received||0), isreceived: false, depositclaimed: !!updItem.depositClaimed, note: String(updItem.note||""), marked: !!updItem.marked, paidamount: 0, payments: "[]" }]);\n    setTimeout(() => { window._karoLocal = false; }, 5000);\n'
lines[3018] = ''
lines[3019] = ''
lines[3020] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')