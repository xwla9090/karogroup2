with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# ConcretePage handleSave - karoLocalChange زیاد دەکەین
lines[2822] = '    setItems(prev => [item, ...prev]);\n    window.dispatchEvent(new Event("karoLocalChange"));\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')