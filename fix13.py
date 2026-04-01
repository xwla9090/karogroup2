with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# ١. ئیدیت زیاد دەکەین لە تەنیشت دیلیت
lines[3232] = '                            <td style={{ padding: "5px" }}>\n'
lines[3233] = '                              <button onClick={() => { setPaymentAmount(p.amount); setPaymentDate(p.date); setPaymentNote(p.note||""); setEditPaymentId(p.id); }} style={{ background: "none", border: "none", color: "#4DAF94", cursor: "pointer", fontSize: 14, marginRight: 5 }}>✏️</button>\n                              <button onClick={() => deletePayment(item.id, p.id)} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: 14 }}>🗑</button>\n'

# ٢. تەیبڵ گەورەتر
lines[3218] = '                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 15, fontSize: 13 }}>\n'

# ٣. فۆرم بە بێ شەرت پیشان دەدات
lines[3240] = '                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 15 }}>\n'
lines[3241] = '                    <div style={{ display: "flex", gap: 8 }}>\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')