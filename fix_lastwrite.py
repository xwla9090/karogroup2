with open('src/App.js', encoding='utf-8') as f:
    content = f.read()

content = content.replace('window._karoLocal = true;\n', 'window._karoLocal = true;\n      window._karoLastWrite = Date.now();\n')

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('done!')