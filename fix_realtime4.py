with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# لاین 2775 بسڕەوە
lines[2774] = ''
lines[2775] = ''
lines[2776] = ''
lines[2777] = ''
lines[2778] = ''
lines[2779] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')