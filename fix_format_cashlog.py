with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# لاین 1099 دوای cashLog زیاد بکەین
lines[1098] = '      localStorage.setItem("karo_cashUSD_" + pKey, JSON.stringify(0));\n      localStorage.setItem("karo_cashLog_" + pKey, JSON.stringify([]));\n      window.dispatchEvent(new Event("karoDataUpdate"));\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')