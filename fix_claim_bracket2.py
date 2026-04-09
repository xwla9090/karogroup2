with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[3060] = '      setItems(prev => prev.map(i => i.id === id ? { ...i, depositClaimed: true } : i));\n'
lines[3061] = '      setTimeout(() => { window._karoLocal = false; }, 5000);\n'
lines[3062] = '    }\n'
lines[3063] = '  };\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')