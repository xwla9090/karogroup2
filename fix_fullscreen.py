with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# لاین 1343 زیادەکە بسڕەوە
lines[1342] = ''
# لاین 1347 زیادەکە بسڕەوە
lines[1346] = ''
# لاین 1348 زیادەکە بسڕەوە
lines[1347] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')