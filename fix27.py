with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# دوگمەی "هەموو پارەکە" بسڕەوە، تەنها "وەرگرتن" بمێنێت
for i, line in enumerate(lines):
    if 'هەموو پارەکە' in line:
        lines[i] = ''
        print('removed!')
        break

# دوگمەی وەرگرتن دەستکاری بکەین
for i, line in enumerate(lines):
    if 'onClick={() => addPayment(paymentModal, paymentAmount, paymentDate, paymentNote)' in line:
        lines[i] = '                        <button onClick={() => { const item = items.find(x => x.id === paymentModal); const maxAmt = Math.max(0, Number(item?.received||0) - Number(item?.paidAmount||0)); const amt = Number(paymentAmount||0); if(amt > maxAmt) { alert("ئەم بڕە زیاترە لە ماوەی پارەکە! ماوە: " + (item?.currency==="usd"?"$":"") + Math.round(maxAmt)); return; } addPayment(paymentModal, paymentAmount, paymentDate, paymentNote); }} style={{ flex: 1, background: "#4DAF94", color: "#fff", border: "none", borderRadius: 8, padding: "10px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>وەرگرتن</button>\n'
        print('button updated!')
        break

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('saved!')
