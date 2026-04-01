with open('src/AutoSync.js', encoding='utf-8') as f:
    content = f.read()

old = 'var interval = setInterval(doSync, 5000);'
new = 'var interval = setInterval(doSync, 15000);'

if old in content:
    content = content.replace(old, new, 1)
    print('fixed!')
else:
    print('NOT FOUND')

with open('src/AutoSync.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('saved!')