with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[3065] = '      window._karoLocal = false;\n    }\n  };\n'
lines[3066] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')