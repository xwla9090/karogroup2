with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[2509] = '      const rows = allItems.map(l=>({id:l.id,project:pKey,date:String(l.date||""),type:String(l.type||""),personname:String(l.personName||""),amountiqd:Number(l.amountIQD||0),amountusd:Number(l.amountUSD||0),note:String(l.note||""),returned:!!l.returned,marked:!!l.marked}));\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')