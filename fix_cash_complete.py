RT_FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\RealtimeSync.js"
APP_FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

# ============================================================
# FIX 1: RealtimeSync — initialLoad cash localStorage نوێ نەکات
# ============================================================
with open(RT_FILE, "r", encoding="utf-8") as f:
    rt_src = f.read()

old1 = """      if (cashRes && cashRes.data) {
        // تەنها localStorage نوێ بکەرەوە — setCash ناکەین تا cash useEffect نەکرێتەوە
        localStorage.setItem("karo_cashIQD_" + project, JSON.stringify(cashRes.data.cashiqd || 0));
        localStorage.setItem("karo_cashUSD_" + project, JSON.stringify(cashRes.data.cashusd || 0));
        changed = true;
      }"""

new1 = """      // cash initialLoad دا ناگرێت — RealtimeSync cash channel ئەمەی دەکات"""

if old1 in rt_src:
    rt_src = rt_src.replace(old1, new1)
    print("✅ FIX 1: initialLoad cash لابرا")
else:
    print("⚠️  FIX 1: initialLoad نەدۆزرایەوە")

with open(RT_FILE, "w", encoding="utf-8") as f:
    f.write(rt_src)

# ============================================================
# FIX 2: App.js — cash useEffect لە getLS بخوێنێتەوە نەک state
# ============================================================
with open(APP_FILE, "r", encoding="utf-8-sig") as f:
    app_src = f.read()

# cash useEffect — cashIQD state trigger دەکات loop
# چارەسەر: تەنها کاتێک براوزەری خۆی گۆڕی نوێ بکاتەوە
old2 = """  const cashRemoteRef = useRef(false);
  useEffect(() => {
    if (!pKey || pKey === "default") return;
    if (cashRemoteRef.current) { cashRemoteRef.current = false; return; }
    if (window._karoInitLoad) { window._karoInitLoad = false; return; }
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

if old2 in app_src:
    app_src = app_src.replace(old2, new2)
    print("✅ FIX 2: cash useEffect — _karoInitLoad لابرا")
else:
    print("⚠️  FIX 2: cash useEffect نەدۆزرایەوە")

# FIX 3: onCashUpdate — cashRemoteRef پێش هەموو setCash
old3 = """    onCashUpdate={cash => {
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

new3 = """    onCashUpdate={cash => {
      localStorage.setItem("karo_cashIQD_" + loggedUser.project, JSON.stringify(cash.cashiqd || 0));
      localStorage.setItem("karo_cashUSD_" + loggedUser.project, JSON.stringify(cash.cashusd || 0));
      cashRemoteRef.current = true;
      setCashIQD(cash.cashiqd || 0);
      cashRemoteRef.current = true;
      setCashUSD(cash.cashusd || 0);
      cashRemoteRef.current = true;
      setExchangeRate(cash.exchangerate || 1500);
      window.dispatchEvent(new Event("karoDataUpdate"));
    }}"""

if old3 in app_src:
    app_src = app_src.replace(old3, new3)
    print("✅ FIX 3: onCashUpdate — localStorage پێشتر نوێ کرا")
else:
    print("⚠️  FIX 3: onCashUpdate نەدۆزرایەوە")

# FIX 4: karoDataUpdate handler لە App.js — cash لە localStorage بخوێنێتەوە
old4 = """  useEffect(() => {
    const handler = () => {
      setCashIQD(getLS(`karo_cashIQD_${pKey}`, 0));
      setCashUSD(getLS(`karo_cashUSD_${pKey}`, 0));
    };
    window.addEventListener("karoDataUpdate", handler);
    return () => window.removeEventListener("karoDataUpdate", handler);
  }, [pKey]);"""

# ئەگەر مەوجود نەبوو زیاد بکە
if old4 not in app_src:
    # بدۆزەوە cashRemoteRef useEffect و دواتر handler زیاد بکە
    old4b = """  const cashRemoteRef = useRef(false);
  useEffect(() => {"""
    new4b = """  const cashRemoteRef = useRef(false);
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
  useEffect(() => {"""
    if old4b in app_src:
        app_src = app_src.replace(old4b, new4b, 1)
        print("✅ FIX 4: karoDataUpdate cash handler زیاد کرا")
    else:
        print("⚠️  FIX 4: cash handler نەدۆزرایەوە")

with open(APP_FILE, "w", encoding="utf-8") as f:
    f.write(app_src)

print("\n" + "="*55)
print("  کارۆ گروپ — Cash Complete Fix")
print("="*55)
print("✅ هەموو گۆڕانکارییەکان تەواو بوون")
print("="*55)
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: cash sync complete" && git push')
