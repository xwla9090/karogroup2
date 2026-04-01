
with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# لاین 2910 تا 2934 هەموویان دەگۆڕین
new_func = [
    '  const editPayment = (itemId, paymentId, amount, date, note) => {\n',
    '    const item = items.find(i => i.id === itemId);\n',
    '    if (!item) return;\n',
    '    const amt = Number(amount||0);\n',
    '    const otherPaid = (item.payments||[]).filter(p => p.id !== paymentId).reduce((a,b) => a + Number(b.amount||0), 0);\n',
    '    const maxAllowed = Math.max(0, Number(item.received||0) - otherPaid);\n',
    '    if (amt > maxAllowed) { setAlert("ئەم بڕە زیاترە لە ماوەی پارەکە! زیاترین بڕ: " + (item.currency==="usd"?"$":"") + Math.round(maxAllowed)); return; }\n',
    '    const oldPayment = (item.payments||[]).find(p => p.id === paymentId);\n',
    '    if (!oldPayment) return;\n',
    '    const cur = item.currency || "iqd";\n',
    '    const diff = amt - Number(oldPayment.amount||0);\n',
    '    if (cur === "usd") { setCashUSD(prev => prev + diff); }\n',
    '    else { setCashIQD(prev => prev + diff); }\n',
    '    const newPayments = (item.payments||[]).map(p => p.id === paymentId ? { ...p, amount: amt, date: date||today(), note: note||"" } : p);\n',
    '    const newPaid = newPayments.reduce((a,b) => a + Number(b.amount||0), 0);\n',
    '    setItems(prev => prev.map(i => i.id === itemId ? { ...i, payments: newPayments, paidAmount: newPaid, isReceived: newPaid >= Number(i.received||0) } : i));\n',
    '    setEditPaymentId(null);\n',
    '    setPaymentAmount("");\n',
    '    setPaymentDate(today());\n',
    '    setPaymentNote("");\n',
    '  };\n',
]

lines[2909:2934] = new_func

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')
