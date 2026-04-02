with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# لاین 2921 بسڕەوە
lines[2920] = ''

# لاین 2930 دوای event زیاد بکەین
lines[2929] = '    } : i));\n    window.dispatchEvent(new Event("karoLocalChange"));\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')