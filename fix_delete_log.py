with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[3134] = '    window._karoLocal = true;\n'
lines[3135] = '      addCashLog(${t.delete} ${t.sidebar.concrete}, cur === "iqd" ? -(Number(item.isReceived?item.received:0) + Number(item.depositClaimed?item.deposit:0)) : 0, cur === "usd" ? -(Number(item.isReceived?item.received:0) + Number(item.depositClaimed?item.deposit:0)) : 0);\n'
lines[3136] = '    }\n'
lines[3137] = '    setItems(prev => prev.filter(i => i.id !== id));\n'
lines[3138] = '    await supabase.from("concrete").delete().eq("id", id);\n    window._karoLocal = false;\n'
lines[3139] = '    setConfirmDel(null);\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')