with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# لاین 1056 و 1057 زیادەکان بسڕەوە
lines[1055] = ''
lines[1056] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')