with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# لاین 3287 دووەم تێبینی بسڕەوە
lines[3287] = ''

# لاین 3292 داخستنی divەکان زیاد دەکەین
lines[3292] = '                    </div>\n                  )}\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')