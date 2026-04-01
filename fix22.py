
with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# دوگمەی هەموو پارەکە زیاد دەکەین
lines[3282] = '                      <input placeholder="تێبینی" value={paymentNote} onChange={e => setPaymentNote(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1px solid #e5e5e5", fontSize: 13, textAlign: "center" }} />\n                      <div style={{ display: "flex", gap: 8 }}>\n                        <button onClick={() => addPayment(paymentModal, paymentAmount, paymentDate, paymentNote)} style={{ flex: 1, background: "#4DAF94", color: "#fff", border: "none", borderRadius: 8, padding: "10px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>وەرگرتن</button>\n                        <button onClick={() => { const item = items.find(i => i.id === paymentModal); if(item) addPayment(paymentModal, item.received, paymentDate, paymentNote); }} style={{ flex: 1, background: "#059669", color: "#fff", border: "none", borderRadius: 8, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>هەموو پارەکە</button>\n                      </div>\n'

# لاین 3283 بسڕەوە
lines[3283] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')
