with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# ExpensesPage - لاین 1892
for i, line in enumerate(lines):
    if 'function ExpensesPage' in line:
        # دوای useState items
        for j in range(i, i+15):
            if 'useEffect(() => { setLS(KEY' in lines[j]:
                lines[j] = '  useEffect(() => { setLS(KEY, items); supabase.from("expenses").delete().eq("project",pKey).then(()=>{ if(items.length>0){ const rows=items.map(e=>({id:e.id,project:pKey,date:e.date,amountiqd:Number(e.amountIQD||0),amountusd:Number(e.amountUSD||0),receiptno:String(e.receiptNo||""),note:String(e.note||""),marked:!!e.marked})); supabase.from("expenses").upsert(rows); } }); }, [items, KEY, pKey]);\n'
                print(f"fixed ExpensesPage at line {j+1}")
                break
        break

# LoansPage
for i, line in enumerate(lines):
    if 'function LoansPage' in line:
        for j in range(i, i+15):
            if 'useEffect(() => { setLS(KEY' in lines[j]:
                lines[j] = '  useEffect(() => { setLS(KEY, items); supabase.from("loans").delete().eq("project",pKey).then(()=>{ if(items.length>0){ const rows=items.map(l=>({id:l.id,project:pKey,date:String(l.date||""),type:String(l.type||""),personname:String(l.personName||""),amountiqd:Number(l.amountIQD||0),amountusd:Number(l.amountUSD||0),note:String(l.note||""),returned:!!l.returned,marked:!!l.marked})); supabase.from("loans").upsert(rows); } }); }, [items, KEY, pKey]);\n'
                print(f"fixed LoansPage at line {j+1}")
                break
        break

# ConcretePage
for i, line in enumerate(lines):
    if 'function ConcretePage' in line:
        for j in range(i, i+15):
            if 'useEffect(() => { setLS(KEY' in lines[j]:
                lines[j] = '  useEffect(() => { setLS(KEY, items); supabase.from("concrete").delete().eq("project",pKey).then(()=>{ if(items.length>0){ const rows=items.map(c=>({id:c.id,project:pKey,date:c.date,currency:String(c.currency||"iqd"),meters:Number(c.meters||0),pricepermeter:Number(c.pricePerMeter||0),totalprice:Number(c.totalPrice||0),deposit:Number(c.deposit||0),depositpercent:Number(c.depositPercent||0),received:Number(c.received||0),isreceived:!!c.isReceived,depositclaimed:!!c.depositClaimed,note:String(c.note||""),marked:!!c.marked,paidamount:Number(c.paidAmount||0),payments:JSON.stringify(c.payments||[])})); supabase.from("concrete").upsert(rows); } }); }, [items, KEY, pKey]);\n'
                print(f"fixed ConcretePage at line {j+1}")
                break
        break

# ContractorPage
for i, line in enumerate(lines):
    if 'function ContractorPage' in line:
        for j in range(i, i+15):
            if 'useEffect(() => { setLS(KEY' in lines[j]:
                lines[j] = '  useEffect(() => { setLS(KEY, items); supabase.from("contractor").delete().eq("project",pKey).then(()=>{ if(items.length>0){ const rows=items.map(c=>({id:c.id,project:pKey,date:String(c.date||""),type:String(c.type||""),personname:String(c.personName||""),amountiqd:Number(c.amountIQD||0),amountusd:Number(c.amountUSD||0),note:String(c.note||""),marked:!!c.marked})); supabase.from("contractor").upsert(rows); } }); }, [items, KEY, pKey]);\n'
                print(f"fixed ContractorPage at line {j+1}")
                break
        break

# InvoicePage
for i, line in enumerate(lines):
    if 'function InvoicePage' in line:
        for j in range(i, i+15):
            if 'useEffect(() => { setLS(KEY' in lines[j]:
                lines[j] = '  useEffect(() => { setLS(KEY, invoices); supabase.from("invoices").delete().eq("project",pKey).then(()=>{ if(invoices.length>0){ const rows=invoices.map(i=>({id:i.id,project:pKey,date:String(i.date||""),invoiceno:String(i.invoiceNo||""),currency:String(i.currency||"iqd"),billto:String(i.billTo||""),billphone:String(i.billPhone||""),items:JSON.stringify(i.items||[]),total:Number(i.total||0),marked:!!i.marked})); supabase.from("invoices").upsert(rows); } }); }, [invoices, KEY, pKey]);\n'
                print(f"fixed InvoicePage at line {j+1}")
                break
        break

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('saved!')