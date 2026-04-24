FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8-sig") as f:
    src = f.read()

changes = []

# FIX 1: cashRemoteRef لە cash useEffect لاببە
old1 = """  const cashRemoteRef = useRef(false);
  useEffect(() => {
    if (!pKey || pKey === "default") return;
    if (cashRemoteRef.current) { cashRemoteRef.current = false; return; }
    const cashLogData = JSON.parse(localStorage.getItem("karo_cashLog_" + pKey) || "[]");
    supabase.from("cash").upsert([{ id: pKey, project: pKey, cashiqd: cashIQD, cashusd: cashUSD, exchangerate: exchangeRate, cashlog: JSON.stringify(cashLogData), formatted_at: localStorage.getItem("karo_formatted_" + pKey) || "" }]);
  }, [cashIQD, cashUSD, exchangeRate, pKey]);"""

new1 = """  const cashRemoteRef = useRef(false);
  useEffect(() => {
    if (!pKey || pKey === "default") return;
    if (cashRemoteRef.current) { cashRemoteRef.current = false; return; }
    const cashLogData = JSON.parse(localStorage.getItem("karo_cashLog_" + pKey) || "[]");
    supabase.from("cash").upsert([{ id: pKey, project: pKey, cashiqd: cashIQD, cashusd: cashUSD, exchangerate: exchangeRate, cashlog: JSON.stringify(cashLogData), formatted_at: localStorage.getItem("karo_formatted_" + pKey) || "" }]);
    // cashRemoteRef براوزەری خۆی ignore دەکات نەک براوزەری دووەم
  }, [cashIQD, cashUSD, exchangeRate, pKey]);"""

# FIX 2: onCashUpdate — cashRemoteRef لاببە، ڕاستەوخۆ set بکە
old2 = """    onCashUpdate={cash => {
      cashRemoteRef.current = true;
      setCashIQD(cash.cashiqd || 0);
      cashRemoteRef.current = true;
      setCashUSD(cash.cashusd || 0);
      cashRemoteRef.current = true;
      setExchangeRate(cash.exchangerate || 1500);
      localStorage.setItem("karo_cashIQD_" + loggedUser.project, JSON.stringify(cash.cashiqd || 0));
      localStorage.setItem("karo_cashUSD_" + loggedUser.project, JSON.stringify(cash.cashusd || 0));
      window.dispatchEvent(new Event("karoDataUpdate"));
    }}"""

new2 = """    onCashUpdate={cash => {
      const newIQD = cash.cashiqd || 0;
      const newUSD = cash.cashusd || 0;
      localStorage.setItem("karo_cashIQD_" + loggedUser.project, JSON.stringify(newIQD));
      localStorage.setItem("karo_cashUSD_" + loggedUser.project, JSON.stringify(newUSD));
      cashRemoteRef.current = true;
      setCashIQD(newIQD);
      cashRemoteRef.current = true;
      setCashUSD(newUSD);
      cashRemoteRef.current = true;
      setExchangeRate(cash.exchangerate || 1500);
      window.dispatchEvent(new Event("karoDataUpdate"));
    }}"""

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: cash useEffect باشە")
else:
    changes.append("⚠️  FIX 1: cash useEffect نەدۆزرایەوە")

if old2 in src:
    src = src.replace(old2, new2)
    changes.append("✅ FIX 2: onCashUpdate — localStorage پێشتر نوێ کرا")
else:
    changes.append("⚠️  FIX 2: onCashUpdate نەدۆزرایەوە")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — Cash Sync Fix 2")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("✅ فایل پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: cash update browser 2" && git push')
