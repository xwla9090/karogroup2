with open('src/App.js', encoding='utf-8') as f:
    content = f.read()

content = content.replace('window._karoPause = true;', 'window._karoLocal = true;')
content = content.replace('window._karoPause = false;', 'window._karoLocal = false;')

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('done!')