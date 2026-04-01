
with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# State نوێ زیاد دەکەین
for i, line in enumerate(lines):
    if '  const [paymentAmount, setPaymentAmount] = useState("");\n' == line:
        lines[i] = '  const [paymentAmount, setPaymentAmount] = useState("");\n  const [paymentNote, setPaymentNote] = useState("");\n  const [paymentDate, setPaymentDate] = useState(today());\n'
        break

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('state done!')

with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# deletePayment فەنکشن زیاد دەکەین
delete_func = [
    '\n',
    '  const deletePayment = (itemId, paymentId) => {\n',
    '    const item = items.find(i => i.id === itemId);\n',
    '    if (!item) return;\n',
    '    const payment = (item.payments||[]).find(p => p.id === paymentId);\n',
    '    if (!payment) return;\n',
    '    const cur = item.currency || "iqd";\n',
    '    const amt = Number(payment.amount||0);\n',
    '    if (cur === "usd") { setCashUSD(prev => prev - amt); }\n',
    '    else { setCashIQD(prev => prev - amt); }\n',
    '    const newPayments = (item.payments||[]).filter(p => p.id !== paymentId);\n',
    '    const newPaid = newPayments.reduce((a,b) => a + Number(b.amount||0), 0);\n',
    '    setItems(prev => prev.map(i => i.id === itemId ? { ...i, payments: newPayments, paidAmount: newPaid, isReceived: false } : i));\n',
    '  };\n',
    '\n',
]

for i, line in enumerate(lines):
    if '  const addPayment = (id, amount) => {\n' == line:
        lines[i] = '  const addPayment = (id, amount, date, note) => {\n'
    if '    setItems(prev => prev.map(i => i.id === id ? { ...i, paidAmount: newPaid, isReceived: remaining <= 0 } : i));\n' == line:
        lines[i] = '    const newPaymentObj = { id: genId(), amount: amt, date: date⠵⠟⠺⠞⠵⠵⠵⠟⠵⠵⠞⠞⠺⠺⠺⠟⠵⠺⠞⠺⠟⠞⠟"" };\n    const newPaymentsList = [...(items.find(i => i.id === id)?.payments || []), newPaymentObj];\n    setItems(prev => prev.map(i => i.id === id ? { ...i, paidAmount: newPaid, isReceived: remaining <= 0, payments: newPaymentsList } : i));\n'
    if '  const unclaimDeposit = id => {\n' == line:
        lines[i:i] = delete_func
        break

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('functions done!')
