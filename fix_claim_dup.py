with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[3061] = '      setTimeout(() => { window._karoLocal = false; }, 5000);\n'
lines[3062] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')