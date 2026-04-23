with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[3038] = '    const newPaymentObj = { id: genId(), amount: amt, date: date || today(), note: note || "" };\n'
lines[3039] = '    const newPaymentsList = [...(items.find(i => i.id === id)?.payments || []), newPaymentObj];\n'
lines[3040] = '    setItems(prev => prev.map(i => i.id === id ? { ...i, paidAmount: newPaid, isReceived: remaining <= 0, payments: newPaymentsList } : i));\n'
lines[3041] = '    const updItem = { ...item, paidAmount: newPaid, isReceived: remaining <= 0, payments: newPaymentsList };\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')