with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# لاین 3238 زیادەکە بسڕەوە
lines[3237] = ''
# لاین 3240 زیادەکە بسڕەوە
lines[3239] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')