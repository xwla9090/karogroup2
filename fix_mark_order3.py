with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[2998] = '      window._karoLocal = true;\n      addCashLog(`${t.received} ${t.sidebar.concrete}`, cur === "iqd" ? item.received : 0, cur === "usd" ? item.received : 0);\n'
lines[2999] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')