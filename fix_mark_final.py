with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[2986] = '  const markReceived = async id => {\n    if (isFrozen) { setAlert(t.frozen); return; }\n'
lines[2987] = ''
lines[2988] = ''
lines[2989] = ''
lines[3000] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')