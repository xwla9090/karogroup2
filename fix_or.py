with open('src/App.js', encoding='utf-8') as f:
    content = f.read()

# جێگای هەڵەکانی بگۆڕین
content = content.replace('updItem.currency"iqd"', 'updItem.currency||"iqd"')
content = content.replace('updItem.meters0', 'updItem.meters||0')
content = content.replace('updItem.pricePerMeter0', 'updItem.pricePerMeter||0')
content = content.replace('updItem.totalPrice0', 'updItem.totalPrice||0')
content = content.replace('updItem.deposit0', 'updItem.deposit||0')
content = content.replace('updItem.depositPercent0', 'updItem.depositPercent||0')
content = content.replace('updItem.received0', 'updItem.received||0')
content = content.replace('updItem.note""', 'updItem.note||""')
content = content.replace('updItem.paidAmount0', 'updItem.paidAmount||0')
content = content.replace('updItem.payments[]', 'updItem.payments||[]')

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('done!')
