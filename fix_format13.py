with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'handleLogout' in line and i > 1040 and i < 1090:
        lines[i] = '      alert(t.formatSuccess);\n      setTimeout(() => { window.location.href = "/"; }, 500);\n'
        print(f'fixed line {i+1}!')
        break

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('saved!')