with open('src/RealtimeSync.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[51] = '''        }
        if (newData.cashiqd !== undefined || newData.cashusd !== undefined) {
          localStorage.setItem("karo_cashIQD_" + project, JSON.stringify(newData.cashiqd || 0));
          localStorage.setItem("karo_cashUSD_" + project, JSON.stringify(newData.cashusd || 0));
          window.dispatchEvent(new Event("karoDataUpdate"));
        }
'''

with open('src/RealtimeSync.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')