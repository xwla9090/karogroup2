
with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# لاین 631-637 بگۆڕین — _karoLocal لابەرین
lines[630] = '  useEffect(() => {\n'
lines[631] = '    if (!pKey || pKey === "default") return;\n'
lines[632] = '    const cashLogData = JSON.parse(localStorage.getItem("karo_cashLog_" + pKey) || "[]");\n'
lines[633] = '    supabase.from("cash").upsert([{ id: pKey, project: pKey, cashiqd: cashIQD, cashusd: cashUSD, exchangerate: exchangeRate, cashlog: JSON.stringify(cashLogData), formatted_at: localStorage.getItem("karo_formatted_" + pKey) || "" }]);\n'
lines[634] = '  }, [cashIQD, cashUSD, exchangeRate, pKey]);\n'
lines[635] = ''
lines[636] = ''
lines[637] = ''
# لاین 639-643 زیادەکە لابەرین
lines[638] = ''
lines[639] = ''
lines[640] = ''
lines[641] = ''
lines[642] = ''
lines[643] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')
