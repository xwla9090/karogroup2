with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# handleSave بدۆزینەوە و async بکەین
for i, line in enumerate(lines):
    if 'const handleSave = () => {' in line and i > 1892 and i < 1960:
        lines[i] = '  const handleSave = async () => {\n'
        print(f'made async at line {i+1}')
        break

# upsert await زیاد بکەین
lines[1950] = '      await supabase.from("expenses").upsert([{ id: newItem.id, project: pKey, date: newItem.date, amountiqd: Number(newItem.amountIQD||0), amountusd: Number(newItem.amountUSD||0), receiptno: String(newItem.receiptNo||""), note: String(newItem.note||""), marked: false }]);\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')