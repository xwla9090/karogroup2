with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[1887] = ''
lines[1888] = ''
lines[1889] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')