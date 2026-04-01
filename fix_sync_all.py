with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# هەموو ٤ لاینەکە دەگۆڕین
for lineNum in [1830, 2336, 2799, 3391]:
    i = lineNum - 1
    lines[i] = '  const [items, setItems] = useState(getLS(KEY, []));\n  useEffect(() => {\n    const handler = () => setItems(getLS(KEY, []));\n    window.addEventListener("karoDataUpdate", handler);\n    return () => window.removeEventListener("karoDataUpdate", handler);\n  }, [KEY]);\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')