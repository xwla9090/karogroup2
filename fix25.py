with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# لاین 3267 زیادەکە بسڕەوە
lines[3267] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')