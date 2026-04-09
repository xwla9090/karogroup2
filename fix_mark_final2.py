with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[2994] = '      window._karoLocal = true;\n'
lines[2995] = '      const updItem = { ...item, isReceived: true };\n'
lines[2996] = '      await supabase.from("concrete").upsert([{ id: updItem.id, project: pKey, date: updItem.date, currency: String(updItem.currency||"iqd"), meters: Number(updItem.meters||0), pricepermeter: Number(updItem.pricePerMeter||0), totalprice: Number(updItem.totalPrice||0), deposit: Number(updItem.deposit||0), depositpercent: Number(updItem.depositPercent||0), received: Number(updItem.received||0), isreceived: true, depositclaimed: !!updItem.depositClaimed, note: String(updItem.note||""), marked: !!updItem.marked, paidamount: Number(updItem.paidAmount||0), payments: JSON.stringify(updItem.payments||[]) }]);\n'
lines[2997] = '      setItems(prev => prev.map(i => i.id === id ? { ...i, isReceived: true } : i));\n'
lines[2998] = '      window._karoLocal = false;\n'
lines[2999] = '    }\n'
lines[3000] = '  };\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')