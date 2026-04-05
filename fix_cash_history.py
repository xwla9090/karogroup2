with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# CashPage - لاین 2264
lines[2263] = '  const [cashLog, setCashLogLocal] = useState(getLS("karo_cashLog_" + pKey, []));\n  useEffect(() => {\n    const handler = () => setCashLogLocal(getLS("karo_cashLog_" + pKey, []));\n    window.addEventListener("karoDataUpdate", handler);\n    return () => window.removeEventListener("karoDataUpdate", handler);\n  }, [pKey]);\n'

# HistoryPage - لاین 4373
lines[4372] = '  const [myLog, setMyLog] = useState(getLS("karo_cashLog_" + pKey, []));\n  useEffect(() => {\n    const handler = () => setMyLog(getLS("karo_cashLog_" + pKey, []));\n    window.addEventListener("karoDataUpdate", handler);\n    return () => window.removeEventListener("karoDataUpdate", handler);\n  }, [pKey]);\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')