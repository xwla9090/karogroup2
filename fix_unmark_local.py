with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[3015] = '    if (cur2 === "usd") { setCashUSD(prev => prev - allPaid); }\n'
lines[3016] = '    else { setCashIQD(prev => prev - allPaid); }\n'

# _karoLocal پێش setCash بنێرین
lines[3013] = '    const cur = item.currency || "iqd";\n    window._karoLocal = true;\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')