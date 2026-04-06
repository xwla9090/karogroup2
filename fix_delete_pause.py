with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[1962] = '''    setItems(prev => prev.filter(i => i.id !== id));
    window._karoPause = true;
    setTimeout(() => { window._karoPause = false; }, 10000);
    supabase.from("expenses").delete().eq("id", id);
    setConfirmDel(null);
'''
lines[1963] = ''
lines[1964] = ''
lines[1965] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')