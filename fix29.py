with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# لاین 2913 دەگۆڕین - تەنها چێک زیاد دەکەین بەبێ دووجار amt
lines[2912] = '    if (!item) return;\n    const otherPaid = (item.payments||[]).filter(p => p.id !== paymentId).reduce((a,b) => a + Number(b.amount||0), 0);\n    const maxAllowed = Math.max(0, Number(item.received||0) - otherPaid);\n    const amt = Number(amount||0);\n    if (amt > maxAllowed) { setAlert("ئەم بڕە زیاترە لە ماوەی پارەکە! زیاترین بڕ: " + (item.currency==="usd"?"$":"") + Math.round(maxAllowed)); return; }\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')