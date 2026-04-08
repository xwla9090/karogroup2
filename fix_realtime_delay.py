with open('src/RealtimeSync.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[8] = '      if (window._karoLocal) return;\n      await new Promise(r => setTimeout(r, 500));\n      if (window._karoLocal) return;\n'

with open('src/RealtimeSync.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')