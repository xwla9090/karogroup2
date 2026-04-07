with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# doDelete async بکەین
for i, line in enumerate(lines):
    if 'const doDelete = (id) => {' in line and i > 1880 and i < 1980:
        lines[i] = '  const doDelete = async (id) => {\n'
        print(f'made async at line {i+1}')
        break

# await زیاد بکەین
lines[1974] = '    await supabase.from("expenses").delete().eq("id", id);\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')