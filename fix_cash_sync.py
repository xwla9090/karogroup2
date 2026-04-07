with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[629] = '''
  useEffect(() => {
    if (!pKey || pKey === "default") return;
    const cashLogData = JSON.parse(localStorage.getItem("karo_cashLog_" + pKey) || "[]");
    supabase.from("cash").upsert([{ id: pKey, project: pKey, cashiqd: cashIQD, cashusd: cashUSD, exchangerate: exchangeRate, cashlog: JSON.stringify(cashLogData), formatted_at: localStorage.getItem("karo_formatted_" + pKey) || "" }]);
  }, [cashIQD, cashUSD, exchangeRate, pKey]);

'''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')