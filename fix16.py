with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[3256] = ''
lines[3257] = '                            </td>\n                          </tr>\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')