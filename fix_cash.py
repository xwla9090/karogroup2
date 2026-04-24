FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8-sig") as f:
    src = f.read()

changes = []

# ============================================================
# FIX 1: onCashUpdate — karoDataUpdate event زیاد بکە
# ============================================================
old1 = """    onCashUpdate={cash => {
      setCashIQD(cash.cashiqd || 0);
      setCashUSD(cash.cashusd || 0);
      setExchangeRate(cash.exchangerate || 1500);
      localStorage.setItem("karo_cashIQD_" + loggedUser.project, JSON.stringify(cash.cashiqd || 0));
      localStorage.setItem("karo_cashUSD_" + loggedUser.project, JSON.stringify(cash.cashusd || 0));
    }}"""

new1 = """    onCashUpdate={cash => {
      setCashIQD(cash.cashiqd || 0);
      setCashUSD(cash.cashusd || 0);
      setExchangeRate(cash.exchangerate || 1500);
      localStorage.setItem("karo_cashIQD_" + loggedUser.project, JSON.stringify(cash.cashiqd || 0));
      localStorage.setItem("karo_cashUSD_" + loggedUser.project, JSON.stringify(cash.cashusd || 0));
      window.dispatchEvent(new Event("karoDataUpdate"));
    }}"""

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: onCashUpdate — karoDataUpdate زیاد کرا")
else:
    changes.append("⚠️  FIX 1: onCashUpdate نەدۆزرایەوە")

# ============================================================
# FIX 2: cash useEffect — loop چاک بکە بە cashSaveRef
# ============================================================
old2 = """  useEffect(() => {
    if (!pKey || pKey === "default") return;
    const cashLogData = JSON.parse(localStorage.getItem("karo_cashLog_" + pKey) || "[]");
    supabase.from("cash").upsert([{ id: pKey, project: pKey, cashiqd: cashIQD, cashusd: cashUSD, exchangerate: exchangeRate, cashlog: JSON.stringify(cashLogData), formatted_at: localStorage.getItem("karo_formatted_" + pKey) || "" }]);
  }, [cashIQD, cashUSD, exchangeRate, pKey]);"""

new2 = """  const cashRemoteRef = useRef(false);
  useEffect(() => {
    if (!pKey || pKey === "default") return;
    if (cashRemoteRef.current) { cashRemoteRef.current = false; return; }
    const cashLogData = JSON.parse(localStorage.getItem("karo_cashLog_" + pKey) || "[]");
    supabase.from("cash").upsert([{ id: pKey, project: pKey, cashiqd: cashIQD, cashusd: cashUSD, exchangerate: exchangeRate, cashlog: JSON.stringify(cashLogData), formatted_at: localStorage.getItem("karo_formatted_" + pKey) || "" }]);
  }, [cashIQD, cashUSD, exchangeRate, pKey]);"""

if old2 in src:
    src = src.replace(old2, new2)
    changes.append("✅ FIX 2: cash useEffect — cashRemoteRef زیاد کرا")
else:
    changes.append("⚠️  FIX 2: cash useEffect نەدۆزرایەوە")

# ============================================================
# FIX 3: onCashUpdate — cashRemoteRef.current = true زیاد بکە
# ============================================================
old3 = """    onCashUpdate={cash => {
      setCashIQD(cash.cashiqd || 0);
      setCashUSD(cash.cashusd || 0);
      setExchangeRate(cash.exchangerate || 1500);
      localStorage.setItem("karo_cashIQD_" + loggedUser.project, JSON.stringify(cash.cashiqd || 0));
      localStorage.setItem("karo_cashUSD_" + loggedUser.project, JSON.stringify(cash.cashusd || 0));
      window.dispatchEvent(new Event("karoDataUpdate"));
    }}"""

new3 = """    onCashUpdate={cash => {
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

if old3 in src:
    src = src.replace(old3, new3)
    changes.append("✅ FIX 3: onCashUpdate — cashRemoteRef.current = true زیاد کرا")
else:
    changes.append("⚠️  FIX 3: onCashUpdate cashRemoteRef نەدۆزرایەوە")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — Cash Sync Fix")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("✅ فایل پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: cash realtime sync" && git push')
