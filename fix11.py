FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8") as f:
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
      window._karoLocal = true;
      setCashIQD(cash.cashiqd || 0);
      setCashUSD(cash.cashusd || 0);
      setExchangeRate(cash.exchangerate || 1500);
      localStorage.setItem("karo_cashIQD_" + loggedUser.project, JSON.stringify(cash.cashiqd || 0));
      localStorage.setItem("karo_cashUSD_" + loggedUser.project, JSON.stringify(cash.cashusd || 0));
      window.dispatchEvent(new Event("karoDataUpdate"));
      setTimeout(() => { window._karoLocal = false; }, 3000);
    }}"""

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: onCashUpdate — karoDataUpdate event زیاد کرا")
else:
    changes.append("⚠️  FIX 1: onCashUpdate نەدۆزرایەوە")

# ============================================================
# FIX 2: handleSave edit — فەرقی پارە درووست بکە نەک گشتی
# ============================================================
old2 = """    if (editItem) {
      const old = items.find(i => i.id === editItem.id);
      if (old && !old.returned) {
        if (old.type==="take") { 
          setCashIQD(p=>p-Number(old.amountIQD||0)); 
          setCashUSD(p=>p-Number(old.amountUSD||0)); 
        } else { 
          setCashIQD(p=>p+Number(old.amountIQD||0)); 
          setCashUSD(p=>p+Number(old.amountUSD||0)); 
        }
      }
      
      if (form.type==="take" && !form.returned) { 
        setCashIQD(p=>p+iqd); 
        setCashUSD(p=>p+usd); 
        addCashLog(`${t.edit} ${t.loanTake}: ${pName}`, iqd, usd); 
      } else if (form.type==="give" && !form.returned) {
        if (iqd>cashIQD||usd>cashUSD) { setAlert(t.noBalance); return; }
        setCashIQD(p=>p-iqd); 
        setCashUSD(p=>p-usd); 
        addCashLog(`${t.edit} ${t.loanGive}: ${pName}`, -iqd, -usd);
      }"""

new2 = """    if (editItem) {
      const old = items.find(i => i.id === editItem.id);
      const oldIQD = (old && !old.returned) ? Number(old.amountIQD||0) : 0;
      const oldUSD = (old && !old.returned) ? Number(old.amountUSD||0) : 0;
      const oldType = old ? old.type : form.type;

      // فەرقی پارە حیساب بکە
      let diffIQD = 0, diffUSD = 0;
      if (form.type === "take") {
        // کۆنەکە برگیرەوە، نوێکە زیاد بکە
        if (oldType === "take") { diffIQD = iqd - oldIQD; diffUSD = usd - oldUSD; }
        else { diffIQD = iqd + oldIQD; diffUSD = usd + oldUSD; }
      } else {
        // give
        if (oldType === "give") { diffIQD = -(iqd - oldIQD); diffUSD = -(usd - oldUSD); }
        else { diffIQD = -(iqd + oldIQD); diffUSD = -(usd + oldUSD); }
      }

      if (form.type === "give" && (cashIQD + diffIQD < 0 || cashUSD + diffUSD < 0)) {
        setAlert(t.noBalance); return;
      }

      setCashIQD(p => p + diffIQD);
      setCashUSD(p => p + diffUSD);
      addCashLog(`${t.edit} ${form.type==="take"?t.loanTake:t.loanGive}: ${pName}`, diffIQD, diffUSD);"""

if old2 in src:
    src = src.replace(old2, new2)
    changes.append("✅ FIX 2: handleSave edit — فەرقی پارە درووست کرا")
else:
    changes.append("⚠️  FIX 2: handleSave edit نەدۆزرایەوە")

# ============================================================
# ذخیره فایل
# ============================================================
with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — Fix 11")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print(f"\n✅ فایل پاشەکەوت کرا:\n   {FILE}")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: cash realtime and edit diff" && git push')
