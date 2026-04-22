with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[3036] = '    else { setCashIQD(prev => prev + amt); }\n    window._karoLocal = true;\n'
lines[3037] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')