with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# لاین 662 زیادەکە بسڕەوە
lines[661] = ''

# لاین 674 دوای } زیاد بکەین
lines[673] = '            window.dispatchEvent(new Event("karoDataUpdate"));\n          }\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')