with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[1974] = '    setItems(prev => prev.filter(i => i.id !== id));\n    supabase.from("expenses").delete().eq("id", id);\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')