with open('src/App.js', encoding='utf-8') as f:
    content = f.read()

# _karoLocal لابەرین لە useEffect concrete
content = content.replace('window._karoLocal = true;\n      const rows', 'const rows')

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('done App.js!')

with open('src/RealtimeSync.js', encoding='utf-8') as f:
    lines = f.readlines()

# _karoLocal چێک لابەرین
lines[9] = ''

with open('src/RealtimeSync.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done RealtimeSync.js!')