with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[1940] = '      setItems(prev => prev.map(i => i.id === editItem.id ? { ...i, ...form } : i));\n      window._karoLocal = true;\n      setTimeout(() => { window._karoLocal = false; }, 10000);\n      await supabase.from("expenses").upsert([{ id: editItem.id, project: pKey, date: form.date, amountiqd: Number(form.amountIQD||0), amountusd: Number(form.amountUSD||0), receiptno: String(form.receiptNo||""), note: String(form.note||""), marked: !!form.marked }]);\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')