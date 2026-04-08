with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[3007] = ''
lines[3008] = '    }\n'
lines[3009] = '  };\n'
lines[3010] = '\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')