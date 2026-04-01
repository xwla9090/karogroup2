
with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# editPaymentId state زیاد دەکەین
for i, line in enumerate(lines):
    if '  const [paymentDate, setPaymentDate] = useState(today());\n' == line:
        lines[i] = '  const [paymentDate, setPaymentDate] = useState(today());\n  const [editPaymentId, setEditPaymentId] = useState(null);\n'
        print('state added!')
        break

# دوگمەی وەرگرتن دەگۆڕین بۆ ئیدیت یان زیادکردن
for i, line in enumerate(lines):
    if 'onClick={() => addPayment(paymentModal, paymentAmount, paymentDate, paymentNote)}' in line:
        lines[i] = '                      <button onClick={() => { if(editPaymentId) { editPayment(paymentModal, editPaymentId, paymentAmount, paymentDate, paymentNote); } else { addPayment(paymentModal, paymentAmount, paymentDate, paymentNote); } }} style={{ background: "#4DAF94", color: "#fff", border: "none", borderRadius: 8, padding: "10px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{editPaymentId ? "گۆڕین" : "وەرگرتن"}</button>\n'
        print('button updated!')
        break

# editPayment فەنکشن زیاد دەکەین
for i, line in enumerate(lines):
    if '  const deletePayment = (itemId, paymentId) => {\n' == line:
        edit_func = [
            '  const editPayment = (itemId, paymentId, amount, date, note) => {\n',
            '    const item = items.find(i => i.id === itemId);\n',
            '    if (!item) return;\n',
            '    const amt = Number(amount||0);\n',
            '    const oldPayment = (item.payments||[]).find(p => p.id === paymentId);\n',
            '    if (!oldPayment) return;\n',
            '    const cur = item.currency || "iqd";\n',
            '    const diff = amt - Number(oldPayment.amount||0);\n',
            '    if (cur === "usd") { setCashUSD(prev => prev + diff); }\n',
            '    else { setCashIQD(prev => prev + diff); }\n',
            '    const newPayments = (item.payments||[]).map(p => p.id === paymentId ? { ...p, amount: amt, date: date||today(), note: note||"" } : p);\n',
            '    const newPaid = newPayments.reduce((a,b) => a + Number(b.amount||0), 0);\n',
            '    setItems(prev => prev.map(i => i.id === itemId ? { ...i, payments: newPayments, paidAmount: newPaid, isReceived: newPaid >= Number(i.received||0) } : i));\n',
            '    setEditPaymentId(null);\n',
            '    setPaymentAmount("");\n',
            '    setPaymentDate(today());\n',
            '    setPaymentNote("");\n',
            '  };\n',
            '\n',
        ]
        lines[i:i] = edit_func
        print('editPayment function added!')
        break

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('saved!')
