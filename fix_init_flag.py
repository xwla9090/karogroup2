FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\RealtimeSync.js"

with open(FILE, "r", encoding="utf-8") as f:
    src = f.read()

changes = []

old1 = """      if (cashRes && cashRes.data) {
        // localStorage نوێ بکەرەوە بەلام setCash ناکەین تا loop نەدروست بێت
        localStorage.setItem("karo_cashIQD_" + project, JSON.stringify(cashRes.data.cashiqd || 0));
        localStorage.setItem("karo_cashUSD_" + project, JSON.stringify(cashRes.data.cashusd || 0));
        if (onCashUpdate) onCashUpdate(cashRes.data);
        else {
          if (setCashIQD) setCashIQD(cashRes.data.cashiqd || 0);
          if (setCashUSD) setCashUSD(cashRes.data.cashusd || 0);
        }
        changed = true;
      }"""

new1 = """      if (cashRes && cashRes.data) {
        localStorage.setItem("karo_cashIQD_" + project, JSON.stringify(cashRes.data.cashiqd || 0));
        localStorage.setItem("karo_cashUSD_" + project, JSON.stringify(cashRes.data.cashusd || 0));
        // _karoInitLoad flag — cash useEffect ignore بکات
        window._karoInitLoad = true;
        if (onCashUpdate) onCashUpdate(cashRes.data);
        else {
          if (setCashIQD) setCashIQD(cashRes.data.cashiqd || 0);
          if (setCashUSD) setCashUSD(cashRes.data.cashusd || 0);
        }
        setTimeout(() => { window._karoInitLoad = false; }, 2000);
        changed = true;
      }"""

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: initialLoad — _karoInitLoad flag زیاد کرا")
else:
    changes.append("⚠️  FIX 1: initialLoad نەدۆزرایەوە")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

# ============================================================
# App.js — cash useEffect _karoInitLoad چێک بکە
# ============================================================
APP_FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(APP_FILE, "r", encoding="utf-8-sig") as f:
    app_src = f.read()

old2 = """  const cashRemoteRef = useRef(false);
  useEffect(() => {
    if (!pKey || pKey === "default") return;
    if (cashRemoteRef.current) { cashRemoteRef.current = false; return; }
    const cashLogData = JSON.parse(localStorage.getItem("karo_cashLog_" + pKey) || "[]");
    supabase.from("cash").upsert([{ id: pKey, project: pKey, cashiqd: cashIQD, cashusd: cashUSD, exchangerate: exchangeRate, cashlog: JSON.stringify(cashLogData), formatted_at: localStorage.getItem("karo_formatted_" + pKey) || "" }]);
  }, [cashIQD, cashUSD, exchangeRate, pKey]);"""

new2 = """  const cashRemoteRef = useRef(false);
  useEffect(() => {
    if (!pKey || pKey === "default") return;
    if (cashRemoteRef.current) { cashRemoteRef.current = false; return; }
    if (window._karoInitLoad) { window._karoInitLoad = false; return; }
    const cashLogData = JSON.parse(localStorage.getItem("karo_cashLog_" + pKey) || "[]");
    supabase.from("cash").upsert([{ id: pKey, project: pKey, cashiqd: cashIQD, cashusd: cashUSD, exchangerate: exchangeRate, cashlog: JSON.stringify(cashLogData), formatted_at: localStorage.getItem("karo_formatted_" + pKey) || "" }]);
  }, [cashIQD, cashUSD, exchangeRate, pKey]);"""

if old2 in app_src:
    app_src = app_src.replace(old2, new2)
    changes.append("✅ FIX 2: cash useEffect — _karoInitLoad چێک زیاد کرا")
else:
    changes.append("⚠️  FIX 2: cash useEffect نەدۆزرایەوە")

with open(APP_FILE, "w", encoding="utf-8") as f:
    f.write(app_src)

print("\n" + "="*55)
print("  کارۆ گروپ — InitialLoad Flag Fix")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("✅ فایلەکان پاشەکەوت کران")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: initialLoad cash flag" && git push')
