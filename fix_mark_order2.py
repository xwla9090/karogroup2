with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[3003] = '      window._karoLocal = true;\n      await supabase.from("concrete").update({ isreceived: true }).eq("id", id);\n      setItems(prev => prev.map(i => i.id === id ? { ...i, isReceived: true } : i));\n      window._karoLocal = false;\n'
lines[3004] = ''
lines[3005] = ''
lines[3006] = ''
lines[3007] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')