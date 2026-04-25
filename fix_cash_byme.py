FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8-sig") as f:
    src = f.read()

changes = []

# ============================================================
# چارەسەری تەواو:
# - cashUpdatedByMe ref — ئەگەر ئەم براوزەرە خۆی گۆڕی true
# - fetchFromSupabase — cashUpdatedByMe = false دادەنێت
# - cash useEffect — تەنها ئەگەر cashUpdatedByMe = true Supabase نوێ دەکات
# ============================================================

old1 = """  const cashRemoteRef = useRef(false);
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
  }, [pKey]);"""

new1 = """  const cashUpdatedByMe = useRef(false);
  useEffect(() => {
    const cashHandler = () => {
      const newIQD = JSON.parse(localStorage.getItem("karo_cashIQD_" + pKey) || "0");
      const newUSD = JSON.parse(localStorage.getItem("karo_cashUSD_" + pKey) || "0");
      // ئەم event لە براوزەری دیکەوە هات — ئەم براوزەرە گۆڕیی نەکردووە
      cashUpdatedByMe.current = false;
      setCashIQD(newIQD);
      setCashUSD(newUSD);
    };
    window.addEventListener("karoDataUpdate", cashHandler);
    return () => window.removeEventListener("karoDataUpdate", cashHandler);
  }, [pKey]);
  useEffect(() => {
    if (!pKey || pKey === "default") return;
    // تەنها ئەگەر ئەم براوزەرە خۆی گۆڕی Supabase نوێ بکە
    if (!cashUpdatedByMe.current) return;
    cashUpdatedByMe.current = false;
    const cashLogData = JSON.parse(localStorage.getItem("karo_cashLog_" + pKey) || "[]");
    supabase.from("cash").upsert([{ id: pKey, project: pKey, cashiqd: cashIQD, cashusd: cashUSD, exchangerate: exchangeRate, cashlog: JSON.stringify(cashLogData), formatted_at: localStorage.getItem("karo_formatted_" + pKey) || "" }]);
  }, [cashIQD, cashUSD, exchangeRate, pKey]);"""

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: cashUpdatedByMe — تەنها ئەم براوزەرە Supabase نوێ دەکات")
else:
    changes.append("⚠️  FIX 1: نەدۆزرایەوە")

# ئێستا هەموو جێگایەک کە setCashIQD یان setCashUSD دەکرێت لە براوزەری خۆی
# cashUpdatedByMe.current = true زیاد بکە
# بزانم کوێ setCashIQD لە addPayment و markReceived و claimDeposit دەکرێت

# onCashUpdate — براوزەری دیکە گۆڕیی — cashUpdatedByMe = false بمێنێتەوە
old2 = """    onCashUpdate={cash => {
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

new2 = """    onCashUpdate={cash => {
      // براوزەری دیکە گۆڕیی — ئەم براوزەرە Supabase نوێ ناکات
      cashUpdatedByMe.current = false;
      localStorage.setItem("karo_cashIQD_" + loggedUser.project, JSON.stringify(cash.cashiqd || 0));
      localStorage.setItem("karo_cashUSD_" + loggedUser.project, JSON.stringify(cash.cashusd || 0));
      setCashIQD(cash.cashiqd || 0);
      setCashUSD(cash.cashusd || 0);
      setExchangeRate(cash.exchangerate || 1500);
      window.dispatchEvent(new Event("karoDataUpdate"));
    }}"""

if old2 in src:
    src = src.replace(old2, new2)
    changes.append("✅ FIX 2: onCashUpdate — cashUpdatedByMe = false")
else:
    changes.append("⚠️  FIX 2: onCashUpdate نەدۆزرایەوە")

# fetchFromSupabase — براوزەری خۆی لە Supabase خوێند — Supabase نوێ ناکات
old3 = """            localStorage.setItem("karo_cashIQD_" + pk, JSON.stringify(cashData[0].cashiqd || 0));
            localStorage.setItem("karo_cashUSD_" + pk, JSON.stringify(cashData[0].cashusd || 0));
            cashRemoteRef.current = true;
            setCashIQD(cashData[0].cashiqd || 0);
            cashRemoteRef.current = true;
            setCashUSD(cashData[0].cashusd || 0);
            cashRemoteRef.current = true;
            setExchangeRate(cashData[0].exchangerate || 1500);"""

new3 = """            localStorage.setItem("karo_cashIQD_" + pk, JSON.stringify(cashData[0].cashiqd || 0));
            localStorage.setItem("karo_cashUSD_" + pk, JSON.stringify(cashData[0].cashusd || 0));
            cashUpdatedByMe.current = false;
            setCashIQD(cashData[0].cashiqd || 0);
            setCashUSD(cashData[0].cashusd || 0);
            setExchangeRate(cashData[0].exchangerate || 1500);"""

if old3 in src:
    src = src.replace(old3, new3)
    changes.append("✅ FIX 3: fetchFromSupabase — cashUpdatedByMe = false")
else:
    changes.append("⚠️  FIX 3: fetchFromSupabase نەدۆزرایەوە")

# ئێستا دەبێت هەموو جێگایەک کە براوزەری خۆی setCashIQD دەکات cashUpdatedByMe = true بکات
# بزانم لە line-based
with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

# خوێندنەوەی دووبارە بۆ line-based گۆڕان
with open(FILE, "r", encoding="utf-8") as f:
    lines = f.readlines()

cash_changes = 0
for i, line in enumerate(lines):
    stripped = line.strip()
    indent = line[:len(line) - len(line.lstrip())]
    
    # setCashIQD(prev => prev + ...) یان setCashIQD(prev => prev - ...) — براوزەری خۆی گۆڕی
    if ("setCashIQD(prev =>" in stripped or "setCashUSD(prev =>" in stripped) and "cashUpdatedByMe" not in "".join(lines[max(0,i-2):i]):
        lines.insert(i, indent + "cashUpdatedByMe.current = true;\n")
        cash_changes += 1
        
if cash_changes > 0:
    with open(FILE, "w", encoding="utf-8") as f:
        f.writelines(lines)
    changes.append(f"✅ FIX 4: {cash_changes} setCash(prev=>) — cashUpdatedByMe = true زیاد کرا")
else:
    changes.append("⚠️  FIX 4: setCash(prev=>) نەدۆزرایەوە")

print("\n" + "="*55)
print("  کارۆ گروپ — Cash Sync Complete Rewrite")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("✅ فایل پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: cash updatedByMe flag" && git push')
