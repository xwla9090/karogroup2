with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[3045] = '  const claimDeposit = async id => {\n'
lines[3055] = '      window._karoLocal = true;\n      addCashLog(`${t.claimDeposit}: ${item.deposit}`, cur === "iqd" ? item.deposit : 0, cur === "usd" ? item.deposit : 0);\n      const updItem = { ...item, depositClaimed: true };\n      await supabase.from("concrete").upsert([{ id: updItem.id, project: pKey, date: updItem.date, currency: String(updItem.currency||"iqd"), meters: Number(updItem.meters||0), pricepermeter: Number(updItem.pricePerMeter||0), totalprice: Number(updItem.totalPrice||0), deposit: Number(updItem.deposit||0), depositpercent: Number(updItem.depositPercent||0), received: Number(updItem.received||0), isreceived: !!updItem.isReceived, depositclaimed: true, note: String(updItem.note||""), marked: !!updItem.marked, paidamount: Number(updItem.paidAmount||0), payments: JSON.stringify(updItem.payments||[]) }]);\n      setItems(prev => prev.map(i => i.id === id ? { ...i, depositClaimed: true } : i));\n      window._karoLocal = false;\n'
lines[3056] = ''
lines[3057] = ''
lines[3058] = ''
lines[3059] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')