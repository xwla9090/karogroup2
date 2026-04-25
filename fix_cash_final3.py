FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8-sig") as f:
    src = f.read()

changes = []

old1 = """  const cashRemoteRef = useRef(false);
  const prevCashRef = useRef({ iqd: null, usd: null });
  useEffect(() => {
    const cashHandler = () => {
      const newIQD = JSON.parse(localStorage.getItem("karo_cashIQD_" + pKey) || "0");
      const newUSD = JSON.parse(localStorage.getItem("karo_cashUSD_" + pKey) || "0");
      cashRemoteRef.current = true;
      setCashIQD(newIQD);
      cashRemoteRef.current = true;
      setCashUSD(newUSD);
    };
    window.addEventListener("karoDataUpdate", cashHandler);
    return () => window.removeEventListener("karoDataUpdate", cashHandler);
  }, [pKey]);
  useEffect(() => {
    if (!pKey || pKey === "default") return;
    if (cashRemoteRef.current) { cashRemoteRef.current = false; return; }
    if (prevCashRef.current.iqd === cashIQD && prevCashRef.current.usd === cashUSD) return;
    prevCashRef.current = { iqd: cashIQD, usd: cashUSD };
    const cashLogData = JSON.parse(localStorage.getItem("karo_cashLog_" + pKey) || "[]");
    supabase.from("cash").upsert([{ id: pKey, project: pKey, cashiqd: cashIQD, cashusd: cashUSD, exchangerate: exchangeRate, cashlog: JSON.stringify(cashLogData), formatted_at: localStorage.getItem("karo_formatted_" + pKey) || "" }]);
  }, [cashIQD, cashUSD, exchangeRate, pKey]);"""

new1 = """  const cashRemoteRef = useRef(false);
  useEffect(() => {
    const cashHandler = () => {
      const newIQD = JSON.parse(localStorage.getItem("karo_cashIQD_" + pKey) || "0");
      const newUSD = JSON.parse(localStorage.getItem("karo_cashUSD_" + pKey) || "0");
      cashRemoteRef.current = true;
      setCashIQD(newIQD);
      cashRemoteRef.current = true;
      setCashUSD(newUSD);
    };
    window.addEventListener("karoDataUpdate", cashHandler);
    return () => window.removeEventListener("karoDataUpdate", cashHandler);
  }, [pKey]);
  useEffect(() => {
    if (!pKey || pKey === "default") return;
    if (cashRemoteRef.current) { cashRemoteRef.current = false; return; }
    const cashLogData = JSON.parse(localStorage.getItem("karo_cashLog_" + pKey) || "[]");
    supabase.from("cash").upsert([{ id: pKey, project: pKey, cashiqd: cashIQD, cashusd: cashUSD, exchangerate: exchangeRate, cashlog: JSON.stringify(cashLogData), formatted_at: localStorage.getItem("karo_formatted_" + pKey) || "" }]);
  }, [cashIQD, cashUSD, exchangeRate, pKey]);"""

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: prevCashRef لابرا")
else:
    changes.append("⚠️  FIX 1: نەدۆزرایەوە")

old2 = """          if (cashData && cashData[0]) {
            cashRemoteRef.current = true; setCashIQD(cashData[0].cashiqd || 0);
            cashRemoteRef.current = true; setCashUSD(cashData[0].cashusd || 0);
            cashRemoteRef.current = true; setExchangeRate(cashData[0].exchangerate || 1500);"""

new2 = """          if (cashData && cashData[0]) {
            localStorage.setItem("karo_cashIQD_" + pk, JSON.stringify(cashData[0].cashiqd || 0));
            localStorage.setItem("karo_cashUSD_" + pk, JSON.stringify(cashData[0].cashusd || 0));
            cashRemoteRef.current = true;
            setCashIQD(cashData[0].cashiqd || 0);
            cashRemoteRef.current = true;
            setCashUSD(cashData[0].cashusd || 0);
            cashRemoteRef.current = true;
            setExchangeRate(cashData[0].exchangerate || 1500);"""

if old2 in src:
    src = src.replace(old2, new2)
    changes.append("✅ FIX 2: fetchFromSupabase — localStorage + cashRemoteRef")
else:
    changes.append("⚠️  FIX 2: نەدۆزرایەوە")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — Cash Final")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: cash final" && git push')
