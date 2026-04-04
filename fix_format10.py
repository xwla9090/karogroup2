with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'alert(t.formatSuccess);' in line and i > 1040 and i < 1080:
        lines[i] = '      alert(t.formatSuccess);\n      handleLogout();\n'
        print('fixed!')
        break

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('saved!')