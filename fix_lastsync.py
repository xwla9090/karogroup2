with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# لاین 2893 دوای window._karoLocal = true
lines[2892] = '      window._karoLocal = true;\n      window._karoLastSync = Date.now();\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')