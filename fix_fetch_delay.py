with open('src/RealtimeSync.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[9] = '      await new Promise(r => setTimeout(r, 3000));\n'

with open('src/RealtimeSync.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')