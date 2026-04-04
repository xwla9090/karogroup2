with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'supabase.from("expenses").delete().eq("project", pKey);' in line:
        lines[i] = '''      supabase.from("expenses").delete().eq("project", pKey);
      supabase.from("concrete").delete().eq("project", pKey);
      supabase.from("loans").delete().eq("project", pKey);
      supabase.from("contractor").delete().eq("project", pKey);
      supabase.from("cash").delete().eq("project", pKey);
'''
        print('fixed!')
        break

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('saved!')
