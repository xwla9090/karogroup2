with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

MAPPER = '{ id: x.id, project: pKey, date: x.date, currency: String(x.currency||"iqd"), meters: Number(x.meters||0), pricepermeter: Number(x.pricePerMeter||0), totalprice: Number(x.totalPrice||0), deposit: Number(x.deposit||0), depositpercent: Number(x.depositPercent||0), received: Number(x.received||0), isreceived: !!x.isReceived, depositclaimed: !!x.depositClaimed, note: String(x.note||""), marked: !!x.marked, paidamount: Number(x.paidAmount||0), payments: JSON.stringify(x.payments||[]) }'

# handleSave - لابەرینی setTimeout
lines[2927] = '    window._karoLocal = true;\n'
lines[2928] = ''

# handleEditSave - لابەرینی setTimeout و دووجار upsert
lines[2982] = '    window._karoLocal = true;\n'
lines[2983] = ''
lines[2985] = '    await supabase.from("concrete").upsert([' + MAPPER.replace('x.', 'updatedItem.') + ']);\n'
lines[2986] = '    window._karoLocal = false;\n'

# markReceived - لابەرینی دووجار setItems و reload
lines[3003] = '      setItems(prev => prev.map(i => i.id === id ? { ...i, isReceived: true } : i));\n'
lines[3004] = '      window._karoLocal = false;\n'
lines[3005] = ''

# unmarkReceived - async + Supabase
lines[3007] = '  const unmarkReceived = async id => {\n'
lines[3017] = '    window._karoLocal = true;\n'
lines[3018] = '    const updItem2 = { ...item, isReceived: false, paidAmount: 0, payments: [] };\n    await supabase.from("concrete").upsert([' + MAPPER.replace('x.', 'updItem2.') + ']);\n    setItems(prev => prev.map(i => i.id === id ? { ...i, isReceived: false, paidAmount: 0, payments: [] } : i));\n    window._karoLocal = false;\n'
lines[3019] = ''
lines[3020] = '  };\n'

# addPayment - Supabase زیاد بکەین
lines[3040] = '    setItems(prev => prev.map(i => i.id === id ? { ...i, paidAmount: newPaid, isReceived: remaining <= 0, payments: newPaymentsList } : i));\n'
lines[3041] = '    const updItem = { ...item, paidAmount: newPaid, isReceived: remaining <= 0, payments: newPaymentsList };\n    await supabase.from("concrete").upsert([' + MAPPER.replace('x.', 'updItem.') + ']);\n    window._karoLocal = false;\n'
lines[3042] = ''

# claimDeposit - لابەرینی دووجار setItems
lines[3062] = '      setItems(prev => prev.map(i => i.id === id ? { ...i, depositClaimed: true } : i));\n'
lines[3063] = '      window._karoLocal = false;\n'
lines[3064] = ''

# doDelete - _karoLocal پێش addCashLog
lines[3134] = '    window._karoLocal = true;\n'
lines[3135] = '      addCashLog(${t.delete} ${t.sidebar.concrete}, cur === "iqd" ? -(Number(item.isReceived?item.received:0) + Number(item.depositClaimed?item.deposit:0)) : 0, cur === "usd" ? -(Number(item.isReceived?item.received:0) + Number(item.depositClaimed?item.deposit:0)) : 0);\n'
lines[3137] = '    setItems(prev => prev.filter(i => i.id !== id));\n'
lines[3138] = ''
lines[3139] = '    await supabase.from("concrete").delete().eq("id", id);\n    window._karoLocal = false;\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')