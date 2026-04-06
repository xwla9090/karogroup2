with open('src/AutoSync.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[30] = ''

with open('src/AutoSync.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')