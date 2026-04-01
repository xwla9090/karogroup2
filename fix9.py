with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# لاین 3097 دوای sym زیاد دەکەین (index 3097)
new_line = '                const effectivePaid = item.isReceived && !item.paidAmount ? Number(item.received||0) : Number(item.paidAmount||0);\n'
lines.insert(3097, new_line)

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')