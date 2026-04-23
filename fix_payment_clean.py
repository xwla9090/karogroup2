with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[3036] = '    else { setCashIQD(prev => prev + amt); }\n'
lines[3037] = '    window._karoLocal = true;\n'
lines[3038] = '    addCashLog("payment: " + amt, cur === "iqd" ? amt : 0, cur === "usd" ? amt : 0);\n'
lines[3041] = '    setItems(prev => prev.map(i => i.id === id ? { ...i, paidAmount: newPaid, isReceived: remaining <= 0, payments: newPaymentsList } : i));\n'
lines[3042] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')