with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[1868] = '      setItems(prev => [{ ...form, id: genId(), marked: false }, ...prev]);\n      window.dispatchEvent(new Event("karoLocalChange"));\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')