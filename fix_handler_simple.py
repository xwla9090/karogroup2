with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[2873] = '    const handler = () => { if (!window._karoLocal) setItems(getLS(KEY, [])); };\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')