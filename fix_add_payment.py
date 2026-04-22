with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# addPayment async بکەین
for i, line in enumerate(lines):
    if 'const addPayment = (id, amount, date, note) => {' in line:
        lines[i] = '  const addPayment = async (id, amount, date, note) => {\n'
        print(f'made async at line {i+1}')
        break

# دوای setItems Supabase نوێ بکەین
lines[3038] = '    setItems(prev => prev.map(i => i.id === id ? { ...i, paidAmount: newPaid, isReceived: remaining <= 0, payments: newPaymentsList } : i));\n    window._karoLocal = true;\n    const updItem = { ...item, paidAmount: newPaid, isReceived: remaining <= 0, payments: newPaymentsList };\n    await supabase.from("concrete").upsert([{ id: updItem.id, project: pKey, date: updItem.date, currency: String(updItem.currency||"iqd"), meters: Number(updItem.meters||0), pricepermeter: Number(updItem.pricePerMeter||0), totalprice: Number(updItem.totalPrice||0), deposit: Number(updItem.deposit||0), depositpercent: Number(updItem.depositPercent||0), received: Number(updItem.received||0), isreceived: remaining <= 0, depositclaimed: !!updItem.depositClaimed, note: String(updItem.note||""), marked: !!updItem.marked, paidamount: newPaid, payments: JSON.stringify(newPaymentsList) }]);\n    window._karoLocal = false;\n'
lines[3039] = ''
lines[3040] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')