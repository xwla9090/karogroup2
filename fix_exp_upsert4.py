with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

print(repr(lines[1949]))

lines[1949] = '      supabase.from("expenses").upsert([{ id: newItem.id, project: pKey, date: newItem.date, amountiqd: Number(newItem.amountIQD||0), amountusd: Number(newItem.amountUSD||0), receiptno: String(newItem.receiptNo||""), note: String(newItem.note||""), marked: false }]);\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')