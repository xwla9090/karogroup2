with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# doFormat دا formatted_at نوێ بکەین
for i, line in enumerate(lines):
    if 'await new Promise(resolve => setTimeout(resolve, 3000));' in line and i > 1040 and i < 1100:
        lines[i] = '      await new Promise(resolve => setTimeout(resolve, 3000));\n      await supabase.from("cash").upsert([{ id: pKey, project: pKey, cashiqd: 0, cashusd: 0, exchangerate: 1500, formatted_at: new Date().toISOString() }]);\n'
        print('fixed format flag!')
        break

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('saved!')