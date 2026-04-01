f=open('App.js','r',encoding='utf-8')
t=f.read()
f.close()

# 1. Remove the debounced save useEffect completely
old_save = '''  useEffect(() => {
    if(pKeyRef.current === "default" || pKeyRef.current === "LOADING") return;
    const timer = setTimeout(() => {
      setLS("karo_cashIQD_" + pKeyRef.current, cashIQD);
      setLS("karo_cashUSD_" + pKeyRef.current, cashUSD);
      setLS("karo_rate_" + pKeyRef.current, exchangeRate);
      setLS("karo_cashLog_" + pKeyRef.current, cashLog);
    }, 300);
    return () => clearTimeout(timer);
  }, [cashIQD, cashUSD, exchangeRate, cashLog]);'''
t = t.replace(old_save, '')

# 2. Remove pKeyRef and related
t = t.replace('const pKeyRef = useRef(pKey);\n', '')
t = t.replace('  useEffect(() => { pKeyRef.current = pKey; }, [pKey]);\n', '')
t = t.replace('\n  const origSetCashIQD = setCashIQD;\n  const origSetCashUSD = setCashUSD;\n  const origSetExRate = setExchangeRate;\n  const origSetCashLog = setCashLog;\n\n  setCashIQD = (v) => { origSetCashIQD(v); };\n  setCashUSD = (v) => { origSetCashUSD(v); };\n  setExchangeRate = (v) => { origSetExRate(v); };\n  setCashLog = (v) => { origSetCashLog(v); };\n', '')

# 3. Remove LOADING load useEffect
old_load = '''  useEffect(() => {
    if (loggedUser) {
      const pk = loggedUser.project;
      pKeyRef.current = "LOADING";
      const iqd = getLS("karo_cashIQD_" + pk, 0);
      const usd = getLS("karo_cashUSD_" + pk, 0);
      const rate = getLS("karo_rate_" + pk, 1500);
      const log = getLS("karo_cashLog_" + pk, []);
      setCashIQD(iqd);
      setCashUSD(usd);
      setExchangeRate(rate);
      setCashLog(log);
      setTimeout(() => { pKeyRef.current = pk; }, 500);
    }
  }, [loggedUser?.project]);'''

new_load = '''  useEffect(() => {
    if (loggedUser) {
      const pk = loggedUser.project;
      setCashIQD(getLS("karo_cashIQD_" + pk, 0));
      setCashUSD(getLS("karo_cashUSD_" + pk, 0));
      setExchangeRate(getLS("karo_rate_" + pk, 1500));
      setCashLog(getLS("karo_cashLog_" + pk, []));
    }
  }, [loggedUser?.project]);'''
t = t.replace(old_load, new_load)

# 4. Add simple direct save useEffects with loggedUser check
old_addcash = '  const addCashLog = useCallback((desc, iqd, usd) => {'
new_addcash = '''  useEffect(() => { if(loggedUser) setLS("karo_cashIQD_" + loggedUser.project, cashIQD); }, [cashIQD]);
  useEffect(() => { if(loggedUser) setLS("karo_cashUSD_" + loggedUser.project, cashUSD); }, [cashUSD]);
  useEffect(() => { if(loggedUser) setLS("karo_rate_" + loggedUser.project, exchangeRate); }, [exchangeRate]);
  useEffect(() => { if(loggedUser) setLS("karo_cashLog_" + loggedUser.project, cashLog); }, [cashLog]);

  const addCashLog = useCallback((desc, iqd, usd) => {'''
t = t.replace(old_addcash, new_addcash)

f=open('App.js','w',encoding='utf-8')
f.write(t)
f.close()
print('Done')