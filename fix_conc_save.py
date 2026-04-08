with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[2924] = '    await supabase.from("concrete").upsert([{ id: item.id, project: pKey, date: item.date, currency: String(item.currency||"iqd"), meters: Number(item.meters||0), pricepermeter: Number(item.pricePerMeter||0), totalprice: Number(item.totalPrice||0), deposit: Number(item.deposit||0), depositpercent: Number(item.depositPercent||0), received: Number(item.received||0), isreceived: !!item.isReceived, depositclaimed: !!item.depositClaimed, note: String(item.note||""), marked: !!item.marked, paidamount: Number(item.paidAmount||0), payments: JSON.stringify(item.payments||[]) }]);\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')