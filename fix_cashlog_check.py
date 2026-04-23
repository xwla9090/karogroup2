with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[725] = '    setTimeout(() => { if (!window._karoLocal) window.dispatchEvent(new Event("karoDataUpdate")); }, 0);\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')