FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8") as f:
    src = f.read()

changes = []

# ============================================================
# FIX 1: cash useEffect — _karoLocal چێک بکە
# ============================================================
old1 = """  useEffect(() => {
    if (!pKey || pKey === "default") return;
    const cashLogData = JSON.parse(localStorage.getItem("karo_cashLog_" + pKey) || "[]");
    supabase.from("cash").upsert([{ id: pKey, project: pKey, cashiqd: cashIQD, cashusd: cashUSD, exchangerate: exchangeRate, cashlog: JSON.stringify(cashLogData), formatted_at: localStorage.getItem("karo_formatted_" + pKey) || "" }]);
  }, [cashIQD, cashUSD, exchangeRate, pKey]);"""

new1 = """  useEffect(() => {
    if (!pKey || pKey === "default") return;
    if (window._karoLocal) return;
    const cashLogData = JSON.parse(localStorage.getItem("karo_cashLog_" + pKey) || "[]");
    supabase.from("cash").upsert([{ id: pKey, project: pKey, cashiqd: cashIQD, cashusd: cashUSD, exchangerate: exchangeRate, cashlog: JSON.stringify(cashLogData), formatted_at: localStorage.getItem("karo_formatted_" + pKey) || "" }]);
  }, [cashIQD, cashUSD, exchangeRate, pKey]);"""

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: cash useEffect — _karoLocal چێک زیاد کرا")
else:
    changes.append("⚠️  FIX 1: cash useEffect نەدۆزرایەوە")

# ============================================================
# FIX 2: RealtimeSync cash handler — _karoLocal = true زیاد بکە
# ============================================================
RT_FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\RealtimeSync.js"

with open(RT_FILE, "r", encoding="utf-8") as f:
    rt_src = f.read()

rt_changes = []

old2 = """        if (newData.cashiqd !== undefined) {
          localStorage.setItem("karo_cashIQD_" + project, JSON.stringify(newData.cashiqd || 0));
          localStorage.setItem("karo_cashUSD_" + project, JSON.stringify(newData.cashusd || 0));
          if (setCashIQD) setCashIQD(newData.cashiqd || 0);
          if (setCashUSD) setCashUSD(newData.cashusd || 0);
          window.dispatchEvent(new Event("karoDataUpdate"));
        }"""

new2 = """        if (newData.cashiqd !== undefined) {
          window._karoLocal = true;
          localStorage.setItem("karo_cashIQD_" + project, JSON.stringify(newData.cashiqd || 0));
          localStorage.setItem("karo_cashUSD_" + project, JSON.stringify(newData.cashusd || 0));
          if (setCashIQD) setCashIQD(newData.cashiqd || 0);
          if (setCashUSD) setCashUSD(newData.cashusd || 0);
          window.dispatchEvent(new Event("karoDataUpdate"));
          setTimeout(() => { window._karoLocal = false; }, 3000);
        }"""

if old2 in rt_src:
    rt_src = rt_src.replace(old2, new2)
    rt_changes.append("✅ FIX 2: RealtimeSync cash — _karoLocal زیاد کرا")
else:
    rt_changes.append("⚠️  FIX 2: RealtimeSync cash نەدۆزرایەوە")

with open(RT_FILE, "w", encoding="utf-8") as f:
    f.write(rt_src)

# ============================================================
# ذخیره App.js
# ============================================================
with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — Fix 10")
print("="*55)
for c in changes + rt_changes:
    print(c)
print("="*55)
print("✅ App.js و RealtimeSync.js پاشەکەوت کران")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: cash sync loop" && git push')
