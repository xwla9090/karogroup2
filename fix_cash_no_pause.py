with open('src/RealtimeSync.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[30] = ''

with open('src/RealtimeSync.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')