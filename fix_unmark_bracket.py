with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[3022] = '    setTimeout(() => { window._karoLocal = false; }, 5000);\n  };\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')