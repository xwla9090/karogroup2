with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[1201] = '      onClick={() => { setDashPage(p.id); setTimeout(() => window.dispatchEvent(new Event("karoDataUpdate")), 100); }}\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')