
with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# لاین 3254 زیادەکە بسڕەوە
lines[3253] = ''  # لاین 3254 index 3253

# لاین 3257 داخستنی td زیاد دەکەین
lines[3257] = '                              <button onClick={() => deletePayment(item.id, p.id)} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: 14 }}>🗑</button>\n                            </td>\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')
