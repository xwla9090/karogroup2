with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# ئیدیت دوگمە دەگۆڕین - پەنجەرەی جیاواز دەکاتەوە
lines[3252] = '                              <button onClick={() => { setEditPaymentId(p.id); setPaymentAmount(p.amount); setPaymentDate(p.date); setPaymentNote(p.note||""); }} style={{ background: "none", border: "none", color: "#4DAF94", cursor: "pointer", fontSize: 14, marginRight: 5 }}>✏️</button>\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')