with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[3001] = '      setItems(prev => prev.map(i => i.id === id ? { ...i, isReceived: true } : i));\n'
lines[3002] = '      window._karoLocal = false;\n'
lines[3003] = '    }\n'
lines[3004] = '  };\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')