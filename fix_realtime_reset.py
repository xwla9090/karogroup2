with open('src/RealtimeSync.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[18] = '      }\n      window._karoLocal = false;\n'

with open('src/RealtimeSync.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done RealtimeSync!')

with open('src/App.js', encoding='utf-8') as f:
    content = f.read()

content = content.replace("setTimeout(() => { window._karoLocal = false; }, 5000);\n", "")
content = content.replace("setTimeout(() => { window._karoLocal = false; }, 10000);\n", "")
content = content.replace("      window._karoLocal = false;\n", "")

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('done App.js!')