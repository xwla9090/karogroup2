with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[3133] = '    window._karoLocal = true;\n'
lines[3134] = ''
lines[3135] = '    }\n'
lines[3136] = '    setItems(prev => prev.filter(i => i.id !== id));\n'
lines[3137] = '    await supabase.from("concrete").delete().eq("id", id);\n'
lines[3138] = '    window._karoLocal = false;\n'
lines[3139] = '    setConfirmDel(null);\n'
lines[3140] = '  };\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')