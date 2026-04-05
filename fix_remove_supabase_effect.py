with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# LoansPage - لاین 2421
lines[2420] = '  useEffect(() => { setLS(KEY, items); }, [items, KEY]);\n'

# ContractorPage - بدۆزینەوە
for i, line in enumerate(lines):
    if 'function ContractorPage' in line:
        for j in range(i, i+20):
            if 'useEffect(() => { setLS(KEY' in lines[j]:
                lines[j] = '  useEffect(() => { setLS(KEY, items); }, [items, KEY]);\n'
                print(f'fixed ContractorPage at line {j+1}')
                break
        break

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')