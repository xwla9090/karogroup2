with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[3003] = '      const {error} = await supabase.from("concrete").upsert([{ id: updItem.id, project: pKey, date: updItem.date, currency: String(updItem.currency||"iqd"), meters: Number(updItem.meters||0), pricepermeter: Number(updItem.pricePerMeter||0), totalprice: Number(updItem.totalPrice||0), deposit: Number(updItem.deposit||0), depositpercent: Number(updItem.depositPercent||0), received: Number(updItem.received||0), isreceived: true, depositclaimed: !!updItem.depositClaimed, note: String(updItem.note||""), marked: !!updItem.marked, paidamount: Number(updItem.paidAmount||0), payments: JSON.stringify(updItem.payments||[]) }]); console.log("upsert error:", error); window._karoLocal = false;\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')