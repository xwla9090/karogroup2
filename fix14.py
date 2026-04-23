FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8") as f:
    src = f.read()

changes = []

# ============================================================
# FIX 1: cash useEffect — تەنها کاتێک براوزەری خۆی گۆڕی نوێ بکاتەوە
# ============================================================
old1 = """  useEffect(() => {
    if (!pKey || pKey === "default") return;
    if (window._karoLocal) return;
    const cashLogData = JSON.parse(localStorage.getItem("karo_cashLog_" + pKey) || "[]");
    supabase.from("cash").upsert([{ id: pKey, project: pKey, cashiqd: cashIQD, cashusd: cashUSD, exchangerate: exchangeRate, cashlog: JSON.stringify(cashLogData), formatted_at: localStorage.getItem("karo_formatted_" + pKey) || "" }]);
  }, [cashIQD, cashUSD, exchangeRate, pKey]);"""

new1 = """  const cashSaveRef = useRef(false);
  useEffect(() => {
    if (!pKey || pKey === "default") return;
    if (cashSaveRef.current) { cashSaveRef.current = false; return; }
    const cashLogData = JSON.parse(localStorage.getItem("karo_cashLog_" + pKey) || "[]");
    supabase.from("cash").upsert([{ id: pKey, project: pKey, cashiqd: cashIQD, cashusd: cashUSD, exchangerate: exchangeRate, cashlog: JSON.stringify(cashLogData), formatted_at: localStorage.getItem("karo_formatted_" + pKey) || "" }]);
  }, [cashIQD, cashUSD, exchangeRate, pKey]);"""

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: cash useEffect — cashSaveRef زیاد کرا")
else:
    changes.append("⚠️  FIX 1: cash useEffect نەدۆزرایەوە")

# ============================================================
# FIX 2: onCashUpdate — cashSaveRef.current = true زیاد بکە
# ============================================================
old2 = """    onCashUpdate={cash => {
      if (window._karoIgnore) window._karoIgnore("cash", 4000);
      setCashIQD(cash.cashiqd || 0);
      setCashUSD(cash.cashusd || 0);
      setExchangeRate(cash.exchangerate || 1500);
      localStorage.setItem("karo_cashIQD_" + loggedUser.project, JSON.stringify(cash.cashiqd || 0));
      localStorage.setItem("karo_cashUSD_" + loggedUser.project, JSON.stringify(cash.cashusd || 0));
      window.dispatchEvent(new Event("karoDataUpdate"));
    }}"""

new2 = """    onCashUpdate={cash => {
      cashSaveRef.current = true;
      setCashIQD(cash.cashiqd || 0);
      setCashUSD(cash.cashusd || 0);
      setExchangeRate(cash.exchangerate || 1500);
      localStorage.setItem("karo_cashIQD_" + loggedUser.project, JSON.stringify(cash.cashiqd || 0));
      localStorage.setItem("karo_cashUSD_" + loggedUser.project, JSON.stringify(cash.cashusd || 0));
      window.dispatchEvent(new Event("karoDataUpdate"));
    }}"""

if old2 in src:
    src = src.replace(old2, new2)
    changes.append("✅ FIX 2: onCashUpdate — cashSaveRef.current = true")
else:
    changes.append("⚠️  FIX 2: onCashUpdate نەدۆزرایەوە")

# ============================================================
# FIX 3: loans handleSave — cash ignore لاببە (loans و cash جیان)
# ============================================================
old3 = """      if (window._karoIgnore) window._karoIgnore("loans", 4000);
      await supabase.from("loans").upsert([{
        id: newItem.id, project: pKey,
        type: newItem.type,
        personname: String(newItem.personName || ""),
        amountiqd: Number(newItem.amountIQD || 0),
        amountusd: Number(newItem.amountUSD || 0),
        note: String(newItem.note || ""),
        date: newItem.date,
        returned: false,
        marked: false
      }]);
      setShowForm(false);"""

new3 = """      await supabase.from("loans").upsert([{
        id: newItem.id, project: pKey,
        type: newItem.type,
        personname: String(newItem.personName || ""),
        amountiqd: Number(newItem.amountIQD || 0),
        amountusd: Number(newItem.amountUSD || 0),
        note: String(newItem.note || ""),
        date: newItem.date,
        returned: false,
        marked: false
      }]);
      setShowForm(false);"""

if old3 in src:
    src = src.replace(old3, new3)
    changes.append("✅ FIX 3: handleSave new — loans ignore لابرا")
else:
    changes.append("⚠️  FIX 3: handleSave new نەدۆزرایەوە")

# ============================================================
# FIX 4: loans handleSave edit — cash ignore لاببە
# ============================================================
old4 = """      if (window._karoIgnore) window._karoIgnore("loans", 4000);
      await supabase.from("loans").upsert([{
        id: updItem.id, project: pKey,
        type: updItem.type,
        personname: String(updItem.personName || ""),
        amountiqd: Number(updItem.amountIQD || 0),
        amountusd: Number(updItem.amountUSD || 0),
        note: String(updItem.note || ""),
        date: updItem.date,
        returned: !!updItem.returned,
        marked: !!updItem.marked
      }]);
      setEditModalOpen(false);"""

new4 = """      await supabase.from("loans").upsert([{
        id: updItem.id, project: pKey,
        type: updItem.type,
        personname: String(updItem.personName || ""),
        amountiqd: Number(updItem.amountIQD || 0),
        amountusd: Number(updItem.amountUSD || 0),
        note: String(updItem.note || ""),
        date: updItem.date,
        returned: !!updItem.returned,
        marked: !!updItem.marked
      }]);
      setEditModalOpen(false);"""

if old4 in src:
    src = src.replace(old4, new4)
    changes.append("✅ FIX 4: handleSave edit — loans ignore لابرا")
else:
    changes.append("⚠️  FIX 4: handleSave edit نەدۆزرایەوە")

# ============================================================
# FIX 5: handleReturn — ignore لاببە
# ============================================================
old5 = """    if (window._karoIgnore) window._karoIgnore("loans", 4000);
    await supabase.from("loans").upsert([{
      id: updItem.id, project: pKey,
      type: updItem.type,
      personname: String(updItem.personName || ""),
      amountiqd: 0,
      amountusd: 0,
      note: String(updItem.note || ""),
      date: updItem.date,
      returned: true,
      marked: !!updItem.marked
    }]);
    setConfirmReturn(null);"""

new5 = """    await supabase.from("loans").upsert([{
      id: updItem.id, project: pKey,
      type: updItem.type,
      personname: String(updItem.personName || ""),
      amountiqd: 0,
      amountusd: 0,
      note: String(updItem.note || ""),
      date: updItem.date,
      returned: true,
      marked: !!updItem.marked
    }]);
    setConfirmReturn(null);"""

if old5 in src:
    src = src.replace(old5, new5)
    changes.append("✅ FIX 5: handleReturn — ignore لابرا")
else:
    changes.append("⚠️  FIX 5: handleReturn نەدۆزرایەوە")

# ============================================================
# FIX 6: doDelete — ignore لاببە
# ============================================================
old6 = """    if (window._karoIgnore) window._karoIgnore("loans", 4000);
    await supabase.from("loans").delete().eq("id", id);
    setConfirmDel(null);"""

new6 = """    await supabase.from("loans").delete().eq("id", id);
    setConfirmDel(null);"""

if old6 in src:
    src = src.replace(old6, new6)
    changes.append("✅ FIX 6: doDelete — ignore لابرا")
else:
    changes.append("⚠️  FIX 6: doDelete نەدۆزرایەوە")

# ============================================================
# ذخیره فایل
# ============================================================
with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — Fix 14")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("✅ فایل پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: cash ref and loans sync" && git push')
