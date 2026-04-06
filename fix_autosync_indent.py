with open('src/AutoSync.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[31] = '          await supabase.from("expenses").upsert(rows);\n'

with open('src/AutoSync.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')