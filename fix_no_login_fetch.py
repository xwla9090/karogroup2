with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'fetchFromSupabase();' in line and i > 650 and i < 700:
        lines[i] = '      // fetchFromSupabase disabled\n'
        print(f'disabled at line {i+1}')
        break

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')