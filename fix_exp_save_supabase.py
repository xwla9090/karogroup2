with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[1940] = '''      const newItem = { ...form, id: genId(), marked: false };
      setItems(prev => [newItem, ...prev]);
      window._karoPause = true;
      setTimeout(() => { window._karoPause = false; }, 10000);
      supabase.from("expenses").upsert([{ id: newItem.id, project: pKey, date: newItem.date, amountiqd: Number(newItem.amountIQD||0), amountusd: Number(newItem.amountUSD||0), receiptno: String(newItem.receiptNo||""), note: String(newItem.note||""), marked: false }]);
'''
lines[1941] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')