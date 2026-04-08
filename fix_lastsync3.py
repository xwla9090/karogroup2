with open('src/RealtimeSync.js', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'if (!project) return;' in line:
        lines[i] = '    if (!project) return;\n    window._karoLastSync = Date.now();\n'
        print(f'fixed at line {i+1}')
        break

with open('src/RealtimeSync.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')