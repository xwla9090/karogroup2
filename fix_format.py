with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[1037] = '''      keys.forEach(k => localStorage.removeItem(k));
      // Supabase یش رەش بکەرەوە
      supabase.from("expenses").delete().eq("project", pKey);
      supabase.from("concrete").delete().eq("project", pKey);
      supabase.from("cash").delete().eq("project", pKey);
'''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')