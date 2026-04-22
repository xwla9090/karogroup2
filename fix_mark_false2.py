with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[3003] = ''
lines[3004] = '      window._karoLocal = false;\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')