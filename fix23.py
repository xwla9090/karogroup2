with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# unmarkReceived دەستکاری دەکەین
for i, line in enumerate(lines):
    if 'setItems(prev => prev.map(i => i.id === id ? { ...i, isReceived: false, paidAmount: 0 } : i));' in line:
        lines[i] = '    const item2 = items.find(i => i.id === id);\n    const cur2 = item2?.currency || "iqd";\n    const allPaid = (item2?.payments||[]).reduce((a,b) => a + Number(b.amount||0), 0);\n    if (cur2 === "usd") { setCashUSD(prev => prev - allPaid); }\n    else { setCashIQD(prev => prev - allPaid); }\n    setItems(prev => prev.map(i => i.id === id ? { ...i, isReceived: false, paidAmount: 0, payments: [] } : i));\n'
        print('fixed!')
        break

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('saved!')