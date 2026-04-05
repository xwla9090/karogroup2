with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# لاین 1090 دوای contractor، invoices زیاد بکەین
lines[1089] = '      await supabase.from("contractor").delete().eq("project", pKey);\n      await supabase.from("invoices").delete().eq("project", pKey);\n      localStorage.setItem("karo_inv_" + pKey, JSON.stringify([]));\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')