FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8-sig") as f:
    src = f.read()

changes = []

old1 = """    if (editItem.isReceived) {
      if (editItem.currency === "usd") setCashUSD(prev => prev - Number(editItem.received||0));
      else setCashIQD(prev => prev - Number(editItem.received||0));
    }
    if (editItem.depositClaimed) {
      if (editItem.currency === "usd") setCashUSD(prev => prev - Number(editItem.deposit||0));
      else setCashIQD(prev => prev - Number(editItem.deposit||0));
    }

    const updatedItem = {
      ...editItem,
      ...form,
      totalPrice: newTotalPrice,
      deposit: newDeposit,
      received: newReceived,
      currency: cur,
      isReceived: false,
      depositClaimed: false
    };"""

new1 = """    // کۆنەکەی لادەبە لە قاسە
    if (editItem.isReceived) {
      if (editItem.currency === "usd") setCashUSD(prev => prev - Number(editItem.received||0));
      else setCashIQD(prev => prev - Number(editItem.received||0));
    }
    if (editItem.depositClaimed) {
      if (editItem.currency === "usd") setCashUSD(prev => prev - Number(editItem.deposit||0));
      else setCashIQD(prev => prev - Number(editItem.deposit||0));
    }
    // پارەی وەرگیراوی کۆن لادەبە
    const oldPaid = Number(editItem.paidAmount||0);
    if (oldPaid > 0) {
      if (editItem.currency === "usd") setCashUSD(prev => prev - oldPaid);
      else setCashIQD(prev => prev - oldPaid);
    }

    const updatedItem = {
      ...editItem,
      ...form,
      totalPrice: newTotalPrice,
      deposit: newDeposit,
      received: newReceived,
      currency: cur,
      isReceived: false,
      depositClaimed: false,
      paidAmount: 0,
      payments: []
    };"""

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: handleEditSave — پارەی وەرگیراوی کۆن لادەبرا")
else:
    changes.append("⚠️  FIX 1: handleEditSave نەدۆزرایەوە")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — handleEditSave Cash Fix")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("✅ فایل پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: handleEditSave cash calc" && git push')
