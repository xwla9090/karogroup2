with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(2897, 2907):
    lines[i] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')