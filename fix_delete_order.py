with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[1962] = '    setItems(prev => prev.filter(i => i.id !== id));\n    window.dispatchEvent(new Event("karoLocalChange"));\n    setTimeout(() => supabase.from("expenses").delete().eq("id", id), 100);\n'
lines[1963] = ''
lines[1964] = ''
lines[1965] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')