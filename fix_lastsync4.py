with open('src/RealtimeSync.js', encoding='utf-8') as f:
    lines = f.readlines()

# mount دا _karoLastSync لابەرین
for i, line in enumerate(lines):
    if 'if (!project) return;' in line and 'window._karoLastSync' in lines[i+1]:
        lines[i+1] = ''
        print(f'removed at line {i+2}')
        break

# لاین 10 بگۆڕین - تەنها _karoLocal چێک بکەین
lines[9] = '      if (window._karoLocal) return;\n'

with open('src/RealtimeSync.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')