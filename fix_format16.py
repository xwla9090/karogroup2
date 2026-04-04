with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'const doFormat = async () => {' in line:
        lines[i] = '  const doFormat = async () => {\n'
        # دوای ئەوەی پاسوۆرد چێک کرا، سەرەتا localStorage بەتاڵ بکەین
        break

for i, line in enumerate(lines):
    if 'keys.forEach(k => localStorage.removeItem(k));' in line and i > 1040 and i < 1090:
        lines[i] = '''      keys.forEach(k => localStorage.removeItem(k));
      // سەرەتا localStorage بەتاڵ بکەرەوە
      localStorage.setItem("karo_exp_" + pKey, JSON.stringify([]));
      localStorage.setItem("karo_conc_" + pKey, JSON.stringify([]));
      localStorage.setItem("karo_loans_" + pKey, JSON.stringify([]));
      localStorage.setItem("karo_contr_" + pKey, JSON.stringify([]));
      localStorage.setItem("karo_cashIQD_" + pKey, JSON.stringify(0));
      localStorage.setItem("karo_cashUSD_" + pKey, JSON.stringify(0));
      // ٣ چرکە بوەستێت تا AutoSync تەواو بێت
      await new Promise(resolve => setTimeout(resolve, 3000));
      // ئینجا Supabase رەش بکەرەوە
'''
        print('fixed!')
        break

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('saved!')