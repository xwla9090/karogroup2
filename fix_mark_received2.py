with open('src/App.js', encoding='utf-8') as f:
    content = f.read()

old = '  const markReceived = async id => {'
new = '  const markReceived = async id => {'

# چێک بکە ئایا async هەیە
if 'const markReceived = async id =>' in content:
    print('already async!')
else:
    content = content.replace('const markReceived = id =>', 'const markReceived = async id =>')
    print('made async!')

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('saved!')