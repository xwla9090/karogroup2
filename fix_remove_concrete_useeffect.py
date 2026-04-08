with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# useEffect concrete بدۆزینەوە و بگۆڕین بۆ تەنها localStorage
for i, line in enumerate(lines):
    if '[items, KEY, pKey]' in line and i > 2889 and i < 2910:
        # هەموو useEffect بسڕینەوە
        start = i
        while start > 2889 and 'useEffect' not in lines[start]:
            start -= 1
        for j in range(start, i+1):
            lines[j] = ''
        # useEffect سادە زیاد بکەین
        lines[start] = '  useEffect(() => { setLS(KEY, items); }, [items, KEY]);\n'
        print(f'fixed at line {start+1}')
        break

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')