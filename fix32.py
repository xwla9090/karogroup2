with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[553] = '    fontSize: 12,\n    fontWeight: 600,\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')