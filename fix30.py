with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# لاین 2918 بسڕەوە (دووەم amt)
lines[2917] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')