with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[650] = '''  useEffect(() => {
    if (loggedUser) {
      const pk = loggedUser.project;
      // سەرەتا لە Supabase بخوێنینەوە
      const fetchFromSupabase = async () => {
        try {
          const { data: cashData } = await supabase.from("cash").select("*").eq("project", pk);
          if (cashData && cashData[0]) {
            setCashIQD(cashData[0].cashiqd || 0);
            setCashUSD(cashData[0].cashusd || 0);
            setExchangeRate(cashData[0].exchangerate || 1500);
          } else {
            setCashIQD(getLS(`karo_cashIQD_${pk}`, 0));
            setCashUSD(getLS(`karo_cashUSD_${pk}`, 0));
            setExchangeRate(getLS(`karo_rate_${pk}`, 1500));
          }
          const { data: expData } = await supabase.from("expenses").select("*").eq("project", pk);
          if (expData) {
            const mapped = expData.map(e => ({ id: e.id, date: e.date, amountIQD: e.amountiqd, amountUSD: e.amountusd, receiptNo: e.receiptno, note: e.note, marked: e.marked }));
            localStorage.setItem("karo_exp_" + pk, JSON.stringify(mapped));
          }
          const { data: concData } = await supabase.from("concrete").select("*").eq("project", pk);
          if (concData) {
            const mapped = concData.map(c => ({ id: c.id, date: c.date, currency: c.currency, meters: c.meters, pricePerMeter: c.pricepermeter, totalPrice: c.totalprice, deposit: c.deposit, depositPercent: c.depositpercent, received: c.received, isReceived: c.isreceived, depositClaimed: c.depositclaimed, note: c.note, marked: c.marked, paidAmount: c.paidamount, payments: JSON.parse(c.payments||"[]") }));
            localStorage.setItem("karo_conc_" + pk, JSON.stringify(mapped));
            window.dispatchEvent(new Event("karoDataUpdate"));
          }
          setCashLog(getLS(`karo_cashLog_${pk}`, []));
        } catch(e) {
          setCashIQD(getLS(`karo_cashIQD_${pk}`, 0));
          setCashUSD(getLS(`karo_cashUSD_${pk}`, 0));
          setExchangeRate(getLS(`karo_rate_${pk}`, 1500));
          setCashLog(getLS(`karo_cashLog_${pk}`, []));
        }
      };
      fetchFromSupabase();
    }
  }, [loggedUser?.project]);\n'''

lines[651] = ''
lines[652] = ''
lines[653] = ''
lines[654] = ''
lines[655] = ''
lines[656] = ''
lines[657] = ''
lines[658] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')