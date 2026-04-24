FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8-sig") as f:
    src = f.read()

changes = []

# چارەسەری تەواو: setItems wrapper لە ConcretePage زیاد بکە
# بدۆزەوە const KEY = `karo_conc_${pKey}` و دواتر setItemsConc زیاد بکە

old1 = "  const KEY = `karo_conc_${pKey}`;"

new1 = """  const KEY = `karo_conc_${pKey}`;
  const setItemsAndSave = (updater) => {
    setItems(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  };"""

if old1 in src:
    src = src.replace(old1, new1, 1)
    changes.append("✅ FIX 1: setItemsAndSave wrapper زیاد کرا")
else:
    changes.append("⚠️  FIX 1: KEY نەدۆزرایەوە")

# ئێستا هەموو setItems لە ConcretePage بگۆڕە بۆ setItemsAndSave
# تەنها لە ConcretePage (دوای KEY)
conc_start = src.find("  const KEY = `karo_conc_${pKey}`;")
conc_end = src.find("function ", conc_start + 100)

if conc_start > 0 and conc_end > 0:
    conc_section = src[conc_start:conc_end]
    conc_fixed = conc_section.replace("setItems(prev => [item, ...prev]);", "setItemsAndSave(prev => [item, ...prev]);")
    conc_fixed = conc_fixed.replace("setItems(prev => prev.map(i => i.id === editItem.id ? updatedItem : i));", "setItemsAndSave(prev => prev.map(i => i.id === editItem.id ? updatedItem : i));")
    
    # هەموو setItems گۆڕین
    import re
    # setItems بگۆڕە بەمەرجێک: تەنها ئەوانەی لە ConcretePage دان
    old_calls = [
        "setItems(prev => [item, ...prev]);",
        "setItems(prev => prev.filter(i=>i.id!==id));",
        "setItems(prev => prev.map(i => i.id === id ? { ...i, isReceived: true } : i));",
        "setItems(prev => prev.map(i => i.id === id ? { ...i, isReceived: false, paidAmount: 0, payments: [] } : i));",
        "setItems(prev => prev.map(i => i.id === id ? { ...i, marked: !i.marked } : i));",
    ]
    
    count = 0
    for old_call in old_calls:
        new_call = old_call.replace("setItems(", "setItemsAndSave(")
        if old_call in conc_fixed:
            conc_fixed = conc_fixed.replace(old_call, new_call)
            count += 1
    
    src = src[:conc_start] + conc_fixed + src[conc_end:]
    changes.append(f"✅ FIX 2: {count} setItems گۆڕدران بۆ setItemsAndSave")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — setItemsAndSave Fix")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("✅ فایل پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: concrete setItemsAndSave" && git push')
