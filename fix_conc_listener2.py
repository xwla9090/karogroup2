with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[2871] = '  const [items, setItems] = useState(getLS(KEY, []));\n  useEffect(() => {\n    const handler = () => setItems(getLS(KEY, []));\n    window.addEventListener("karoDataUpdate", handler);\n    return () => window.removeEventListener("karoDataUpdate", handler);\n  }, [KEY]);\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')