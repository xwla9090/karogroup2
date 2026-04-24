FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8-sig") as f:
    src = f.read()

changes = []

old1 = """  const doDelete = async id => {
    if (isFrozen) {
      setAlert(t.frozen);
      return;
    }
    const item = items.find(i => i.id === id);
    if (item) {
      const cur = item.currency || "iqd";
      if (item.isReceived) {
        if (cur === "usd") setCashUSD(prev => prev - Number(item.received||0));
        else setCashIQD(prev => prev - Number(item.received||0));
      }
      if (item.depositClaimed) {
        if (cur === "usd") setCashUSD(prev => prev - Number(item.deposit||0));
        else setCashIQD(prev => prev - Number(item.deposit||0));
      }
    window._karoLocal = true;
    }
    setItems(prev => prev.filter(i => i.id !== id));
    await supabase.from("concrete").delete().eq("id", id);
    window._karoLocal = false;
    setConfirmDel(null);
  };"""

new1 = """  const doDelete = async id => {
    if (isFrozen) {
      setAlert(t.frozen);
      return;
    }
    const item = items.find(i => i.id === id);
    if (item) {
      const cur = item.currency || "iqd";
      if (item.isReceived) {
        if (cur === "usd") setCashUSD(prev => prev - Number(item.received||0));
        else setCashIQD(prev => prev - Number(item.received||0));
        addCashLog(`${t.delete} ${t.sidebar.concrete}`, cur==="iqd"?-Number(item.received||0):0, cur==="usd"?-Number(item.received||0):0);
      }
      if (item.depositClaimed) {
        if (cur === "usd") setCashUSD(prev => prev - Number(item.deposit||0));
        else setCashIQD(prev => prev - Number(item.deposit||0));
        addCashLog(`${t.delete} ${t.claimDeposit}`, cur==="iqd"?-Number(item.deposit||0):0, cur==="usd"?-Number(item.deposit||0):0);
      }
      const paidAmt = Number(item.paidAmount||0);
      if (paidAmt > 0 && !item.isReceived) {
        if (cur === "usd") setCashUSD(prev => prev - paidAmt);
        else setCashIQD(prev => prev - paidAmt);
        addCashLog(`${t.delete} payment`, cur==="iqd"?-paidAmt:0, cur==="usd"?-paidAmt:0);
      }
    }
    setItems(prev => prev.filter(i => i.id !== id));
    await supabase.from("concrete").delete().eq("id", id);
    setConfirmDel(null);
  };"""

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: doDelete — پارەی وەرگیراو دەگەڕێتەوە + Supabase delete")
else:
    changes.append("⚠️  FIX 1: doDelete نەدۆزرایەوە")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — doDelete Cash Fix")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("✅ فایل پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: doDelete return paid cash" && git push')
