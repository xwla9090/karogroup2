
with open('src/App.js', encoding='utf-8') as f:
    content = f.read()

old = '''    onCashUpdate={cash => {
      const localIQD = Number(localStorage.getItem("karo_cashIQD_" + loggedUser.project) || 0);
      const localUSD = Number(localStorage.getItem("karo_cashUSD_" + loggedUser.project) || 0);
      if (Math.abs((cash.cashiqd||0) - localIQD) > 1 || Math.abs((cash.cashusd||0) - localUSD) > 0.01) {
        setCashIQD(cash.cashiqd || 0);
        setCashUSD(cash.cashusd || 0);
        setExchangeRate(cash.exchangerate || 1500);
        localStorage.setItem("karo_cashIQD_" + loggedUser.project, JSON.stringify(cash.cashiqd || 0));
        localStorage.setItem("karo_cashUSD_" + loggedUser.project, JSON.stringify(cash.cashusd || 0));
      }
    }}'''

new = '    onCashUpdate={() => {}}'

if old in content:
    content = content.replace(old, new, 1)
    print('fixed!')
else:
    print('NOT FOUND')

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('saved!')
