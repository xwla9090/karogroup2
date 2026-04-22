with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[3013] = '    window._karoLocal = true;\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')