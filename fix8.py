
with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

unclaim_func = [
    '\n',
    '  const unclaimDeposit = id => {\n',
    '    if (isFrozen) { setAlert(t.frozen); return; }\n',
    '    const item = items.find(i => i.id === id);\n',
    '    if (!item || !item.depositClaimed) return;\n',
    '    const cur = item.currency || "iqd";\n',
    '    if (cur === "usd") { setCashUSD(prev => prev - Number(item.deposit||0)); }\n',
    '    else { setCashIQD(prev => prev - Number(item.deposit||0)); }\n',
    '    setItems(prev => prev.map(i => i.id === id ? { ...i, depositClaimed: false } : i));\n',
    '  };\n',
    '\n',
]

target = '  const claimDeposit = id => {\n'
insert_pos = -1
for i, line in enumerate(lines):
    if line == target:
        for j in range(i, len(lines)):
            if lines[j].strip() == '};' and j > i:
                insert_pos = j + 1
                break
        break

if insert_pos > 0:
    lines[insert_pos:insert_pos] = unclaim_func
    print('done!')
else:
    print('not found')

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('saved!')
