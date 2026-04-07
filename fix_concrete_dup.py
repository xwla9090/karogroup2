with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(2900, 2906):
    lines[i] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')