with open('src/App.js', encoding='utf-8') as f:
    content = f.read()

old = 'if (expData.length > local.length) {'
new = 'if (true) {'

if old in content:
    content = content.replace(old, new, 1)
    print('fixed!')
else:
    print('NOT FOUND')

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('saved!')