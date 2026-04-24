
with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# ١. گۆڕینی پەرداخت → گۆڕینی بڕی پارە
lines[3262] = '                  <div style={{ background: "#fff9e6", border: "1px solid #F59E0B", borderRadius: 8, padding: 10, marginBottom: 10 }}>\n                    <p style={{ fontSize: 12, color: "#D97706", marginBottom: 8, textAlign: "center", fontWeight: 600 }}>گۆڕینی بڕی پارە</p>\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done1!')

# ٢. دراوی سلفە بە خۆکاری دۆلار
with open('src/App.js', encoding='utf-8') as f:
    content = f.read()

old = '  const [form, setForm] = useState({ date: today(), meters: "", pricePerMeter: "", depositPercent: "", note: "", currency: "iqd" });'
new = '  const [form, setForm] = useState({ date: today(), meters: "", pricePerMeter: "", depositPercent: "", note: "", currency: "usd" });'

if old in content:
    content = content.replace(old, new, 1)
    print('done2!')
else:
    print('NOT FOUND 2')

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('saved!')
