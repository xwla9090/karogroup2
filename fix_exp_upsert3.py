with open('src/App.js', encoding='utf-8') as f:
    content = f.read()

old = 'supabase.from("expenses").upsert([{ id: newItem.id, project: pKey, date: newItem.date, amountiqd: Number(newItem.amountIQD0), amountusd: Number(newItem.amountUSD0), receiptno: String(newItem.receiptNo""), note: String(newItem.note""), marked: false }]);'

new = 'supabase.from("expenses").upsert([{ id: newItem.id, project: pKey, date: newItem.date, amountiqd: Number(newItem.amountIQD||0), amountusd: Number(newItem.amountUSD||0), receiptno: String(newItem.receiptNo||""), note: String(newItem.note||""), marked: false }]);'

if old in content:
    content = content.replace(old, new, 1)
    print("fixed!")
else:
    print("NOT FOUND")

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)