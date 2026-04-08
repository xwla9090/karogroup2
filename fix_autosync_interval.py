with open('src/AutoSync.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[109] = '    var interval = setInterval(doSync, 60000);\n'

with open('src/AutoSync.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')