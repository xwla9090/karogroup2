with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[3036] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')