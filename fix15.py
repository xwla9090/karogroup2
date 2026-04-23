FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8") as f:
    src = f.read()

changes = []

# ============================================================
# FIX 1: cash useEffect — cashSaveRef بەکاربهێنە
# ============================================================
old1 = """  useEffect(() => {
    if (!pKey || pKey === "default") return;
    if (window._karoIgnore && window._karoIgnore["cash"]) return;
    const cashLogData = JSON.parse(localStorage.getItem("karo_cashLog_" + pKey) || "[]");
    if (window._karoIgnore) window._karoIgnore("cash", 4000);
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
# FIX 2: onCashUpdate — cashSaveRef.current = true
# ============================================================
old2 = """    onCashUpdate={cash => {
      cashSaveRef.current = true;
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
      cashSaveRef.current = true;
      setCashUSD(cash.cashusd || 0);
      cashSaveRef.current = true;
      setExchangeRate(cash.exchangerate || 1500);
      localStorage.setItem("karo_cashIQD_" + loggedUser.project, JSON.stringify(cash.cashiqd || 0));
      localStorage.setItem("karo_cashUSD_" + loggedUser.project, JSON.stringify(cash.cashusd || 0));
      window.dispatchEvent(new Event("karoDataUpdate"));
    }}"""

if old2 in src:
    src = src.replace(old2, new2)
    changes.append("✅ FIX 2: onCashUpdate — cashSaveRef هەر setCash دوای")
else:
    changes.append("⚠️  FIX 2: onCashUpdate نەدۆزرایەوە")

# ============================================================
# ذخیره فایل
# ============================================================
with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — Fix 15")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("✅ فایل پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: cash save ref" && git push')
