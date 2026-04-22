with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[3017] = '    window._karoLocal = true;\n'
lines[3018] = '    const updItem = { ...item, isReceived: false, paidAmount: 0, payments: [] };\n'
lines[3019] = '    const {error: uErr} = await supabase.from("concrete").upsert([{ id: updItem.id, project: pKey, date: updItem.date, currency: String(updItem.currency||"iqd"), meters: Number(updItem.meters||0), pricepermeter: Number(updItem.pricePerMeter||0), totalprice: Number(updItem.totalPrice||0), deposit: Number(updItem.deposit||0), depositpercent: Number(updItem.depositPercent||0), received: Number(updItem.received||0), isreceived: false, depositclaimed: !!updItem.depositClaimed, note: String(updItem.note||""), marked: !!updItem.marked, paidamount: 0, payments: "[]" }]); console.log("unmark error:", uErr);\n'
lines[3020] = '    setItems(prev => prev.map(i => i.id === id ? { ...i, isReceived: false, paidAmount: 0, payments: [] } : i));\n'
lines[3021] = '    setTimeout(() => { window._karoLocal = false; }, 5000);\n'
lines[3022] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')