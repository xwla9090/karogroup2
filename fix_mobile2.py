
with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# State زیاد دەکەین
lines[951] = '  const [formatModal, setFormatModal] = useState(false);\n  const [sidebarOpen, setSidebarOpen] = useState(false);\n'

# aside دەگۆڕین
for i, line in enumerate(lines):
    if '<aside style={{ width: 280, minWidth: 280,' in line:
        lines[i] = line.replace(
            '<aside style={{ width: 280, minWidth: 280,',
            '<aside className={sidebarOpen ? "open" : ""} style={{ width: 280, minWidth: 280,'
        )
        print('aside updated!')
        break

# دوگمەی مێنیو زیاد دەکەین لە main
for i, line in enumerate(lines):
    if '<main style={{' in line and 'flex: 1' in line and 'marginLeft' in line:
        lines[i] = line.replace(
            '<main style={{',
            '<main style={{ position: "relative", '
        )
        # دوگمەی مێنیو زیاد دەکەین
        lines.insert(i+1, '        <button className="menu-toggle" onClick={()=>setSidebarOpen(!sidebarOpen)} style={{ display: "none", position: "fixed", top: 10, left: 10, zIndex: 200, background: "#4EA88E", color: "#fff", border: "none", borderRadius: 8, padding: "8px 12px", fontSize: 20, cursor: "pointer" }}>{sidebarOpen ? "✕" : "☰"}</button>\n')
        print("menu button added!")
        break

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')
