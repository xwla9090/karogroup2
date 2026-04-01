with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[1335] = '''        @media (max-width: 768px) {
          aside { width: 260px !important; min-width: 260px !important; transform: translateX(100%); transition: transform 0.3s; }
          aside.open { transform: translateX(0) !important; }
          main { margin-left: 0 !important; width: 100vw !important; }
          .menu-toggle { display: flex !important; }
        }
'''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')