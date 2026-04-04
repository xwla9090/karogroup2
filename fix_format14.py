with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[1075] = '      alert(t.formatSuccess);\n'
lines[1076] = '      setTimeout(() => { window.location.href = "/"; }, 500);\n'
lines[1077] = ''
lines[1078] = ''
lines[1079] = ''
lines[1080] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')