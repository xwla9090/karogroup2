with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[661] = '''            setExchangeRate(cashData[0].exchangerate || 1500);
          } else {
            // cash بەتاڵە — format کراوەتەوە — localStorage یش رەش بکەرەوە
            setCashIQD(0);
            setCashUSD(0);
            setExchangeRate(1500);
            localStorage.setItem("karo_exp_" + pk, JSON.stringify([]));
            localStorage.setItem("karo_conc_" + pk, JSON.stringify([]));
            localStorage.setItem("karo_loans_" + pk, JSON.stringify([]));
            localStorage.setItem("karo_contr_" + pk, JSON.stringify([]));
            localStorage.setItem("karo_cashIQD_" + pk, JSON.stringify(0));
            localStorage.setItem("karo_cashUSD_" + pk, JSON.stringify(0));
            window.dispatchEvent(new Event("karoDataUpdate"));
'''
lines[662] = ''
lines[663] = ''
lines[664] = ''
lines[665] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')
