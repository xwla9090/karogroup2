FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8-sig") as f:
    src = f.read()

changes = []

old1 = """          if (cashData && cashData[0]) {
            setCashIQD(cashData[0].cashiqd || 0);
            setCashUSD(cashData[0].cashusd || 0);
            setExchangeRate(cashData[0].exchangerate || 1500);"""

new1 = """          if (cashData && cashData[0]) {
            cashRemoteRef.current = true;
            setCashIQD(cashData[0].cashiqd || 0);
            cashRemoteRef.current = true;
            setCashUSD(cashData[0].cashusd || 0);
            cashRemoteRef.current = true;
            setExchangeRate(cashData[0].exchangerate || 1500);"""

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: fetchFromSupabase — cashRemoteRef زیاد کرا")
else:
    changes.append("⚠️  FIX 1: fetchFromSupabase نەدۆزرایەوە")

# catch branch یش چاک بکە
old2 = """        } catch(e) {
          setCashIQD(getLS(`karo_cashIQD_${pk}`, 0));
          setCashUSD(getLS(`karo_cashUSD_${pk}`, 0));
          setExchangeRate(getLS(`karo_rate_${pk}`, 1500));
          setCashLog(getLS(`karo_cashLog_${pk}`, []));
        }"""

new2 = """        } catch(e) {
          cashRemoteRef.current = true;
          setCashIQD(getLS(`karo_cashIQD_${pk}`, 0));
          cashRemoteRef.current = true;
          setCashUSD(getLS(`karo_cashUSD_${pk}`, 0));
          cashRemoteRef.current = true;
          setExchangeRate(getLS(`karo_rate_${pk}`, 1500));
          setCashLog(getLS(`karo_cashLog_${pk}`, []));
        }"""

if old2 in src:
    src = src.replace(old2, new2)
    changes.append("✅ FIX 2: catch branch — cashRemoteRef زیاد کرا")
else:
    changes.append("⚠️  FIX 2: catch branch نەدۆزرایەوە")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — fetchFromSupabase Fix")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("✅ فایل پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: fetchFromSupabase cashRemoteRef all" && git push')
