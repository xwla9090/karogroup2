with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[2986] = '    await supabase.from("concrete").upsert([{ id: updatedItem.id, project: pKey, date: updatedItem.date, currency: String(updatedItem.currency||"iqd"), meters: Number(updatedItem.meters||0), pricepermeter: Number(updatedItem.pricePerMeter||0), totalprice: Number(updatedItem.totalPrice||0), deposit: Number(updatedItem.deposit||0), depositpercent: Number(updatedItem.depositPercent||0), received: Number(updatedItem.received||0), isreceived: !!updatedItem.isReceived, depositclaimed: !!updatedItem.depositClaimed, note: String(updatedItem.note||""), marked: !!updatedItem.marked, paidamount: Number(updatedItem.paidAmount||0), payments: JSON.stringify(updatedItem.payments||[]) }]);\n    window._karoLocal = false;\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')