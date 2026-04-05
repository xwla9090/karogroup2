with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# LoansPage - لاین 2399
lines[2398] = '  const [items, setItems] = useState(getLS(KEY, []));\n  useEffect(() => {\n    const handler = () => setItems(getLS(KEY, []));\n    window.addEventListener("karoDataUpdate", handler);\n    return () => window.removeEventListener("karoDataUpdate", handler);\n  }, [KEY]);\n'

# ContractorPage - لاین 3471
lines[3470] = '  const [items, setItems] = useState(getLS(KEY, []));\n  useEffect(() => {\n    const handler = () => setItems(getLS(KEY, []));\n    window.addEventListener("karoDataUpdate", handler);\n    return () => window.removeEventListener("karoDataUpdate", handler);\n  }, [KEY]);\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')