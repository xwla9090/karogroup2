with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[1055] = '''      keys.forEach(k => localStorage.removeItem(k));
      // localStorage بەتاڵ بکەرەوە پێش هەموو شتێک
      localStorage.setItem("karo_exp_" + pKey, JSON.stringify([]));
      localStorage.setItem("karo_conc_" + pKey, JSON.stringify([]));
      localStorage.setItem("karo_loans_" + pKey, JSON.stringify([]));
      localStorage.setItem("karo_contr_" + pKey, JSON.stringify([]));
      localStorage.setItem("karo_cashIQD_" + pKey, JSON.stringify(0));
      localStorage.setItem("karo_cashUSD_" + pKey, JSON.stringify(0));
      // ئینجا Supabase رەش بکەرەوە
'''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')