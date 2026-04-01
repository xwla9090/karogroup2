with open('src/App.js', encoding='utf-8') as f:
    content = f.read()

# هەموی وەرگیرا - پاشگەزبوونەوە زیاد دەکەین
old1 = '                      {item.isReceived ? <span style={{ color: s.success, fontSize: 12, fontWeight: 600 }}>✓ هەموی وەرگیرا</span> : <span style={{ color: s.textMuted, fontSize: 11 }}>{sym}{fmt(Number(item.paidAmount||0))}</span>}'
new1 = '                      {item.isReceived ? <span style={{ color: s.success, fontSize: 12, fontWeight: 600, cursor: "pointer" }} onClick={()=>unmarkReceived(item.id)} title="پاشگەزبوونەوە">✓ هەموی وەرگیرا ↩</span> : <span style={{ color: s.textMuted, fontSize: 11 }}>{sym}{fmt(Number(item.paidAmount||0))}</span>}'

# وەرگرتنی تەئمین - پاشگەزبوونەوە زیاد دەکەین
old2 = '                      {item.depositClaimed ? <span style={{ color: s.success, fontSize: 12, fontWeight: 600 }}>✓ {t.claimDeposit}</span>'
new2 = '                      {item.depositClaimed ? <span style={{ color: s.success, fontSize: 12, fontWeight: 600, cursor: "pointer" }} onClick={()=>unclaimDeposit(item.id)} title="پاشگەزبوونەوە">✓ {t.claimDeposit} ↩</span>'

if old1 in content:
    content = content.replace(old1, new1, 1)
    print('found1!')
else:
    print('NOT FOUND 1')

if old2 in content:
    content = content.replace(old2, new2, 1)
    print('found2!')
else:
    print('NOT FOUND 2')

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('saved!')