with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# لاین 3064 و 3065 و 3066 و 3067 دەگۆڕین
new_lines = '''                    <TD s={s} style={{ minWidth: 110 }}>
                      {!isFrozen && !item.isReceived && <button onClick={()=>{setPaymentModal(item.id);setPaymentAmount("");}} style={{ padding: "4px 10px", borderRadius: 4, border: "1px solid #059669", background: "#D1FAE5", color: "#059669", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>وەرگرتنی پارە</button>}
                    </TD>
                    <TD s={s} style={{ minWidth: 90 }}>
                      {item.isReceived ? <span style={{ color: s.success, fontSize: 12, fontWeight: 600 }}>✓ هەموی وەرگیرا</span> : <span style={{ color: s.textMuted, fontSize: 11 }}>{sym}{fmt(Number(item.paidAmount||0))}</span>}
                    </TD>
                    <TD s={s} style={{ minWidth: 90, color: item.isReceived ? s.success : s.danger, fontWeight: 700 }}>
                      {item.isReceived ? "✓" : sym+fmt(Math.max(0, Number(item.received||0) - Number(item.paidAmount||0)))}
                    </TD>
'''

# لاین 3064 تا 3067 (index 3063 تا 3066) دەگۆڕین
lines[3063:3067] = [new_lines]

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')