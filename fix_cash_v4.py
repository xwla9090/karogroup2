APP_FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(APP_FILE, "r", encoding="utf-8-sig") as f:
    src = f.read()

changes = []

# FIX: cash useEffect — تەنها ئەگەر بڕەکە گۆڕدرا نوێ بکاتەوە
old1 = """  const cashRemoteRef = useRef(false);
  useEffect(() => {
    if (!pKey || pKey === "default") return;
    if (cashRemoteRef.current) { cashRemoteRef.current = false; return; }
    const cashLogData = JSON.parse(localStorage.getItem("karo_cashLog_" + pKey) || "[]");
    supabase.from("cash").upsert([{ id: pKey, project: pKey, cashiqd: cashIQD, cashusd: cashUSD, exchangerate: exchangeRate, cashlog: JSON.stringify(cashLogData), formatted_at: localStorage.getItem("karo_formatted_" + pKey) || "" }]);
  }, [cashIQD, cashUSD, exchangeRate, pKey]);"""

new1 = """  const cashRemoteRef = useRef(false);
  const prevCashRef = useRef({ iqd: null, usd: null });
  useEffect(() => {
    if (!pKey || pKey === "default") return;
    if (cashRemoteRef.current) { cashRemoteRef.current = false; return; }
    // ئەگەر بڕەکە لە Supabase هاتووە (هەمان بڕ) نوێ مەکە
    if (prevCashRef.current.iqd === cashIQD && prevCashRef.current.usd === cashUSD) return;
    prevCashRef.current = { iqd: cashIQD, usd: cashUSD };
    const cashLogData = JSON.parse(localStorage.getItem("karo_cashLog_" + pKey) || "[]");
    supabase.from("cash").upsert([{ id: pKey, project: pKey, cashiqd: cashIQD, cashusd: cashUSD, exchangerate: exchangeRate, cashlog: JSON.stringify(cashLogData), formatted_at: localStorage.getItem("karo_formatted_" + pKey) || "" }]);
  }, [cashIQD, cashUSD, exchangeRate, pKey]);"""

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: prevCashRef زیاد کرا — تەنها کاتی گۆڕان نوێ دەکاتەوە")
else:
    changes.append("⚠️  FIX 1: cash useEffect نەدۆزرایەوە")

with open(APP_FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — Cash Final Fix v4")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("✅ فایل پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: cash prevRef no loop" && git push')
