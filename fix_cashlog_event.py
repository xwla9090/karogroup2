with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[731] = '    setCashLog(prev => { const newBalIQD = cashIQD + (Number(iqd) ? Number(iqd) : 0); const newBalUSD = cashUSD + (Number(usd) ? Number(usd) : 0); const n=[...prev, { id: genId(), date: today(), desc, iqd: Number(iqd) ? Number(iqd) : 0, usd: Number(usd) ? Number(usd) : 0, balIQD: newBalIQD, balUSD: newBalUSD, time: new Date().toLocaleTimeString() }]; if(loggedUser) setLS("karo_cashLog_" + loggedUser.project, n); window.dispatchEvent(new Event("karoDataUpdate")); return n; });\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')