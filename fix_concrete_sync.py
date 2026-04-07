
with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# concrete mapper helper
CONC_ROW = "{ id: item.id, project: pKey, date: item.date, currency: String(item.currency||'iqd'), meters: Number(item.meters||0), pricepermeter: Number(item.pricePerMeter||0), totalprice: Number(item.totalPrice||0), deposit: Number(item.deposit||0), depositpercent: Number(item.depositPercent||0), received: Number(item.received||0), isreceived: !!item.isReceived, depositclaimed: !!item.depositClaimed, note: String(item.note||''), marked: !!item.marked, paidamount: Number(item.paidAmount||0), payments: JSON.stringify(item.payments||[]) }"

# handleSave async + upsert
lines[2913] = '  const handleSave = async () => {\n'
lines[2921] = '    const item = { ...form, id: genId(), totalPrice, deposit: depositAmt, received: receivedAmt, depositClaimed: false, isReceived: false, marked: false, currency: cur };\n    setItems(prev => [item, ...prev]);\n    window._karoLocal = true;\n    setTimeout(() => { window._karoLocal = false; }, 10000);\n    await supabase.from("concrete").upsert([' + CONC_ROW.replace('item.', 'item.') + ']);\n'
lines[2922] = ''

# handleEditSave async + upsert
lines[2944] = '  const handleEditSave = async () => {\n'
lines[2975] = '    } : i));\n    window._karoLocal = true;\n    setTimeout(() => { window._karoLocal = false; }, 10000);\n    const updatedItem = { ...editItem, ...form, totalPrice: newTotalPrice, deposit: newDeposit, received: newReceived, currency: cur, isReceived: false, depositClaimed: false };\n    await supabase.from("concrete").upsert([' + CONC_ROW.replace('item.', 'updatedItem.') + ']);\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')
