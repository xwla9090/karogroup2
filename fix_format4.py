with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'setCashIQD(0);' in line and i > 1040 and i < 1070:
        lines[i] = '''      setCashIQD(0); 
      setCashUSD(0); 
      setCashLog([]); 
      setExchangeRate(1500);
      // پاشەکەوت بکە بۆ localStorage
      localStorage.setItem("karo_exp_" + pKey, JSON.stringify([]));
      localStorage.setItem("karo_conc_" + pKey, JSON.stringify([]));
      localStorage.setItem("karo_loans_" + pKey, JSON.stringify([]));
      localStorage.setItem("karo_contr_" + pKey, JSON.stringify([]));
      localStorage.setItem("karo_cashIQD_" + pKey, JSON.stringify(0));
      localStorage.setItem("karo_cashUSD_" + pKey, JSON.stringify(0));
'''
        print('fixed!')
        break

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('saved!')