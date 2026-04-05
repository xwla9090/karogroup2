with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# لاین 661 دوای exchangeRate، cashLog یش زیاد بکەین
lines[660] = '''            setExchangeRate(cashData[0].exchangerate || 1500);
            if (cashData[0].cashlog) {
              const remotelog = JSON.parse(cashData[0].cashlog || "[]");
              setCashLog(remotelog);
              localStorage.setItem("karo_cashLog_" + pk, JSON.stringify(remotelog));
            }
'''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')