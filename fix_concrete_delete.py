with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[3119] = '  const doDelete = async id => {\n'
lines[3137] = '    setItems(prev => prev.filter(i => i.id !== id));\n    window._karoLocal = true;\n    setTimeout(() => { window._karoLocal = false; }, 10000);\n    await supabase.from("concrete").delete().eq("id", id);\n'
lines[3138] = ''
lines[3139] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')