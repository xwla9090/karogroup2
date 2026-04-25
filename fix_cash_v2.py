RT_FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\RealtimeSync.js"
APP_FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

# ============================================================
# FIX: RealtimeSync — initialLoad دەبێت onCashUpdate بەکاربهێنێت
# نەک setCashIQD ڕاستەوخۆ — چونکە onCashUpdate cashRemoteRef دادەنێت
# ============================================================
with open(RT_FILE, "r", encoding="utf-8") as f:
    rt_src = f.read()

old1 = """      if (cashRes && cashRes.data && !localCash) {
        localStorage.setItem("karo_cashIQD_" + project, JSON.stringify(cashRes.data.cashiqd || 0));
        localStorage.setItem("karo_cashUSD_" + project, JSON.stringify(cashRes.data.cashusd || 0));
        if (setCashIQD) setCashIQD(cashRes.data.cashiqd || 0);
        if (setCashUSD) setCashUSD(cashRes.data.cashusd || 0);
        changed = true;
      }"""

new1 = """      if (cashRes && cashRes.data && !localCash) {
        localStorage.setItem("karo_cashIQD_" + project, JSON.stringify(cashRes.data.cashiqd || 0));
        localStorage.setItem("karo_cashUSD_" + project, JSON.stringify(cashRes.data.cashusd || 0));
        // onCashUpdate بەکاربهێنە تا cashRemoteRef دابنێت و loop نەدروست بێت
        if (onCashUpdate) onCashUpdate(cashRes.data);
        else {
          if (setCashIQD) setCashIQD(cashRes.data.cashiqd || 0);
          if (setCashUSD) setCashUSD(cashRes.data.cashusd || 0);
        }
        changed = true;
      }"""

if old1 in rt_src:
    rt_src = rt_src.replace(old1, new1)
    print("✅ FIX 1: initialLoad — onCashUpdate بەکاربرا")
else:
    print("⚠️  FIX 1: initialLoad نەدۆزرایەوە")

with open(RT_FILE, "w", encoding="utf-8") as f:
    f.write(rt_src)

# ============================================================
# FIX 2: App.js — onCashUpdate cashRemoteRef پێش هەموو setCash
# ============================================================
with open(APP_FILE, "r", encoding="utf-8-sig") as f:
    app_src = f.read()

old2 = """    onCashUpdate={cash => {
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

new2 = """    onCashUpdate={cash => {
      cashRemoteRef.current = true;
      localStorage.setItem("karo_cashIQD_" + loggedUser.project, JSON.stringify(cash.cashiqd || 0));
      localStorage.setItem("karo_cashUSD_" + loggedUser.project, JSON.stringify(cash.cashusd || 0));
      setCashIQD(cash.cashiqd || 0);
      cashRemoteRef.current = true;
      setCashUSD(cash.cashusd || 0);
      cashRemoteRef.current = true;
      setExchangeRate(cash.exchangerate || 1500);
      window.dispatchEvent(new Event("karoDataUpdate"));
    }}"""

if old2 in app_src:
    app_src = app_src.replace(old2, new2)
    print("✅ FIX 2: onCashUpdate — cashRemoteRef پێشتر دادەنرێت")
else:
    # تاقی بکەرەوە بە version کۆن
    old2b = """    onCashUpdate={cash => {
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
    new2b = """    onCashUpdate={cash => {
      cashRemoteRef.current = true;
      localStorage.setItem("karo_cashIQD_" + loggedUser.project, JSON.stringify(cash.cashiqd || 0));
      localStorage.setItem("karo_cashUSD_" + loggedUser.project, JSON.stringify(cash.cashusd || 0));
      setCashIQD(cash.cashiqd || 0);
      cashRemoteRef.current = true;
      setCashUSD(cash.cashusd || 0);
      cashRemoteRef.current = true;
      setExchangeRate(cash.exchangerate || 1500);
      window.dispatchEvent(new Event("karoDataUpdate"));
    }}"""
    if old2b in app_src:
        app_src = app_src.replace(old2b, new2b)
        print("✅ FIX 2: onCashUpdate — cashRemoteRef پێشتر دادەنرێت (v2)")
    else:
        print("⚠️  FIX 2: onCashUpdate نەدۆزرایەوە")

with open(APP_FILE, "w", encoding="utf-8") as f:
    f.write(app_src)

print("\n" + "="*55)
print("  کارۆ گروپ — Cash Final Fix")
print("="*55)
print("✅ فایلەکان پاشەکەوت کران")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: cash initialLoad onCashUpdate" && git push')
