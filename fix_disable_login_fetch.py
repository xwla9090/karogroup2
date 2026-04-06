with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# لاین 680-704 غەیرفەعەڵ بکەین
for i in range(679, 704):
    lines[i] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')