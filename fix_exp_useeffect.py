with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[1907] = '  useEffect(() => { setLS(KEY, items); supabase.from("expenses").delete().eq("project",pKey).then(()=>{ if(items.length>=0){ const rows=items.map(e=>({id:e.id,project:pKey,date:e.date,amountiqd:Number(e.amountIQD||0),amountusd:Number(e.amountUSD||0),receiptno:String(e.receiptNo||""),note:String(e.note||""),marked:!!e.marked})); if(rows.length>0) supabase.from("expenses").upsert(rows); } }); }, [items, KEY, pKey]);\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')