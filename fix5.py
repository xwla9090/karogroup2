with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

new_func = [
    '\n',
    '  const addPayment = (id, amount) => {\n',
    '    if (isFrozen) { setAlert(t.frozen); return; }\n',
    '    const item = items.find(i => i.id === id);\n',
    '    if (!item) return;\n',
    '    const amt = Number(amount||0);\n',
    '    if (amt <= 0) return;\n',
    '    const cur = item.currency || "iqd";\n',
    '    const oldPaid = Number(item.paidAmount||0);\n',
    '    const newPaid = oldPaid + amt;\n',
    '    const remaining = Math.max(0, Number(item.received||0) - newPaid);\n',
    '    if (cur === "usd") { setCashUSD(prev => prev + amt); }\n',
    '    else { setCashIQD(prev => prev + amt); }\n',
    '    addCashLog("payment: " + amt, cur === "iqd" ? amt : 0, cur === "usd" ? amt : 0);\n',
    '    setItems(prev => prev.map(i => i.id === id ? { ...i, paidAmount: newPaid, isReceived: remaining <= 0 } : i));\n',
    '    setPaymentModal(null);\n',
    '    setPaymentAmount("");\n',
    '  };\n',
    '\n',
]

lines[2852:2852] = new_func

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')