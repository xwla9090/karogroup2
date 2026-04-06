with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'setTimeout(fetchFromSupabase, 5000);' in line and i > 650 and i < 700:
        lines[i] = '      fetchFromSupabase();\n'
        print(f'fixed at line {i+1}')
        break

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')