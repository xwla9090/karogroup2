with open('src/RealtimeSync.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[9] = '      if (window._karoLocal || (window._karoLastSync && Date.now() - window._karoLastSync < 2000)) return;\n'

with open('src/RealtimeSync.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')