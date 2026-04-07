with open('src/AutoSync.js', encoding='utf-8') as f:
    lines = f.readlines()

# لاین 25-32 لابەرین (expenses بەش)
for i in range(24, 32):
    lines[i] = ''

with open('src/AutoSync.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')