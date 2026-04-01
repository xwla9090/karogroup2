with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# لاین 2863-2865 بسڕەوە (دووەم گەڕانەوە)
lines[2862] = ''
lines[2863] = ''
lines[2864] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')