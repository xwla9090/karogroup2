with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[3003] = '      setItems(prev => prev.map(i => i.id === id ? { ...i, isReceived: true } : i));\n      setTimeout(() => { window.location.reload(); }, 1000);\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')