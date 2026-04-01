with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

bt = chr(96)
lines[547] = f"    borderBottom: {bt}2px solid ${{s.border}}{bt}, \n"

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')