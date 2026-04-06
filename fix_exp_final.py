with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# useEffect بگۆڕین بۆ تەنها localStorage
lines[1907] = '  useEffect(() => { setLS(KEY, items); }, [items, KEY]);\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')