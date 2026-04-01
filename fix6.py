with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

undo_func = [
    '\n',
    '  const unmarkReceived = id => {\n',
    '    if (isFrozen) { setAlert(t.frozen); return; }\n',
    '    const item = items.find(i => i.id === id);\n',
    '    if (!item || !item.isReceived) return;\n',
    '    const cur = item.currency || "iqd";\n',
    '    const paid = Number(item.paidAmount||0);\n',
    '    if (cur === "usd") { setCashUSD(prev => prev - paid); }\n',
    '    else { setCashIQD(prev => prev - paid); }\n',
    '    setItems(prev => prev.map(i => i.id === id ? { ...i, isReceived: false, paidAmount: 0 } : i));\n',
    '  };\n',
    '\n',
]

lines[2853:2853] = undo_func

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')