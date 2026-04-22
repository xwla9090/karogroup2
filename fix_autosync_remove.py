with open('src/AutoSync.js', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(25, 33):
    lines[i] = ''

with open('src/AutoSync.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')