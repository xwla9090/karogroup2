FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"
RT_FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\RealtimeSync.js"

with open(FILE, "r", encoding="utf-8-sig") as f:
    src = f.read()

changes = []

# FIX 1: addCashLog — cash_history row زیاد بکە
old1 = """  const addCashLog = useCallback((desc, iqd, usd) => {
    setCashLog(prev => { const newBalIQD = cashIQD + (Number(iqd) ? Number(iqd) : 0); const newBalUSD = cashUSD + (Number(usd) ? Number(usd) : 0); const n=[...prev, { id: genId(), date: today(), desc, iqd: Number(iqd) ? Number(iqd) : 0, usd: Number(usd) ? Number(usd) : 0, balIQD: newBalIQD, balUSD: newBalUSD, time: new Date().toLocaleTimeString() }]; if(loggedUser) setLS("karo_cashLog_" + loggedUser.project, n); return n; });
  }, [loggedUser, cashIQD, cashUSD]);"""

new1 = """  const addCashLog = useCallback((desc, iqd, usd) => {
    setCashLog(prev => { const newBalIQD = cashIQD + (Number(iqd) ? Number(iqd) : 0); const newBalUSD = cashUSD + (Number(usd) ? Number(usd) : 0); const n=[...prev, { id: genId(), date: today(), desc, iqd: Number(iqd) ? Number(iqd) : 0, usd: Number(usd) ? Number(usd) : 0, balIQD: newBalIQD, balUSD: newBalUSD, time: new Date().toLocaleTimeString() }]; if(loggedUser) setLS("karo_cashLog_" + loggedUser.project, n); return n; });
    if (loggedUser && pKey) {
      const hid = genId();
      supabase.from("cash_history").insert([{
        id: hid,
        project: pKey,
        amountiqd: Number(iqd) || 0,
        amountusd: Number(usd) || 0,
        note: String(desc || "")
      }]);
    }
  }, [loggedUser, cashIQD, cashUSD, pKey]);"""

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: addCashLog — cash_history row زیاد کرا")
else:
    changes.append("⚠️  FIX 1: addCashLog نەدۆزرایەوە")

# FIX 2: fetchFromSupabase — cash_history لە Supabase بخوێنەوە و جەمع بکە
old2 = """          if (cashData && cashData[0]) {
            // تەنها ئەگەر localStorage بەتاڵ بوو cash لە Supabase بگرە
            const localIQD = localStorage.getItem("karo_cashIQD_" + pk);
            const localUSD = localStorage.getItem("karo_cashUSD_" + pk);
            if (!localIQD || localIQD === "0") {
              localStorage.setItem("karo_cashIQD_" + pk, JSON.stringify(cashData[0].cashiqd || 0));
              localStorage.setItem("karo_cashUSD_" + pk, JSON.stringify(cashData[0].cashusd || 0));
              window._cashUpdatedByMe = false;
              setCashIQD(cashData[0].cashiqd || 0);
              setCashUSD(cashData[0].cashusd || 0);
            } else {
              window._cashUpdatedByMe = false;
              setCashIQD(JSON.parse(localIQD));
              setCashUSD(JSON.parse(localUSD || "0"));
            }
            setExchangeRate(cashData[0].exchangerate || 1500);"""

new2 = """          if (cashData && cashData[0]) {
            // cash_history لە Supabase بخوێنەوە و جەمع بکە
            try {
              const { data: histData } = await supabase.from("cash_history").select("amountiqd,amountusd").eq("project", pk);
              if (histData && histData.length > 0) {
                const totalIQD = histData.reduce((a, b) => a + Number(b.amountiqd || 0), 0);
                const totalUSD = histData.reduce((a, b) => a + Number(b.amountusd || 0), 0);
                localStorage.setItem("karo_cashIQD_" + pk, JSON.stringify(totalIQD));
                localStorage.setItem("karo_cashUSD_" + pk, JSON.stringify(totalUSD));
                window._cashUpdatedByMe = false;
                setCashIQD(totalIQD);
                setCashUSD(totalUSD);
              } else {
                window._cashUpdatedByMe = false;
                setCashIQD(cashData[0].cashiqd || 0);
                setCashUSD(cashData[0].cashusd || 0);
              }
            } catch(e) {
              window._cashUpdatedByMe = false;
              setCashIQD(cashData[0].cashiqd || 0);
              setCashUSD(cashData[0].cashusd || 0);
            }
            setExchangeRate(cashData[0].exchangerate || 1500);"""

if old2 in src:
    src = src.replace(old2, new2)
    changes.append("✅ FIX 2: fetchFromSupabase — cash_history جەمع دەکات")
else:
    changes.append("⚠️  FIX 2: fetchFromSupabase نەدۆزرایەوە")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

# FIX 3: RealtimeSync — cash_history گوێ بگرێت
with open(RT_FILE, "r", encoding="utf-8") as f:
    rt_src = f.read()

old3 = """    return () => {
      supabase.removeChannel(expSub);
      supabase.removeChannel(concSub);
      supabase.removeChannel(cashSub);
    };"""

new3 = """    const histSub = supabase.channel("hist_" + project)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "cash_history", filter: "project=eq." + project }, async () => {
        const { data: histData } = await supabase.from("cash_history").select("amountiqd,amountusd").eq("project", project);
        if (histData) {
          const totalIQD = histData.reduce((a, b) => a + Number(b.amountiqd || 0), 0);
          const totalUSD = histData.reduce((a, b) => a + Number(b.amountusd || 0), 0);
          localStorage.setItem("karo_cashIQD_" + project, JSON.stringify(totalIQD));
          localStorage.setItem("karo_cashUSD_" + project, JSON.stringify(totalUSD));
          if (onCashUpdate) onCashUpdate({ cashiqd: totalIQD, cashusd: totalUSD });
          else {
            if (setCashIQD) setCashIQD(totalIQD);
            if (setCashUSD) setCashUSD(totalUSD);
          }
          window.dispatchEvent(new Event("karoDataUpdate"));
        }
      }).subscribe();

    return () => {
      supabase.removeChannel(expSub);
      supabase.removeChannel(concSub);
      supabase.removeChannel(cashSub);
      supabase.removeChannel(histSub);
    };"""

if old3 in rt_src:
    rt_src = rt_src.replace(old3, new3)
    changes.append("✅ FIX 3: RealtimeSync — cash_history channel زیاد کرا")
else:
    changes.append("⚠️  FIX 3: RealtimeSync نەدۆزرایەوە")

with open(RT_FILE, "w", encoding="utf-8") as f:
    f.write(rt_src)

print("\n" + "="*55)
print("  کارۆ گروپ — cash_history Fix")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("✅ فایلەکان پاشەکەوت کران")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: cash_history realtime" && git push')
