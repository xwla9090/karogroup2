with open('src/App.js', encoding='utf-8') as f:
    content = f.read()

# هەموو setTimeout _karoLocal = false لابەرین
content = content.replace("setTimeout(() => { window._karoLocal = false; }, 5000);\n", "")
content = content.replace("setTimeout(() => { window._karoLocal = false; }, 10000);\n", "")

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('done!')