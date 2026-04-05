with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[2420] = '  useEffect(() => { setLS(KEY, items); if(items.length>0){const rows=items.map(l=>({id:l.id,project:pKey,date:String(l.date||""),type:String(l.type||""),personname:String(l.personName||""),amountiqd:Number(l.amountIQD||0),amountusd:Number(l.amountUSD||0),note:String(l.note||""),returned:!!l.returned,marked:!!l.marked}));supabase.from("loans").upsert(rows);} }, [items, KEY, pKey]);\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')