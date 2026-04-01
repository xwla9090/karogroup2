
with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[726] = '''  if (page === "dashboard" && loggedUser) return <><AutoSync project={loggedUser.project} cashIQD={cashIQD} cashUSD={cashUSD} exchangeRate={exchangeRate} users={users} /><RealtimeSync project={loggedUser.project}
    onExpUpdate={data => {
      const mapped = data.map(e => ({ id: e.id, date: e.date, amountIQD: e.amountiqd, amountUSD: e.amountusd, receiptNo: e.receiptno, note: e.note, marked: e.marked }));
      localStorage.setItem("karo_exp_" + loggedUser.project, JSON.stringify(mapped));
    }}
    onConcUpdate={data => {
      const mapped = data.map(c => ({ id: c.id, date: c.date, currency: c.currency, meters: c.meters, pricePerMeter: c.pricepermeter, totalPrice: c.totalprice, deposit: c.deposit, depositPercent: c.depositpercent, received: c.received, isReceived: c.isreceived, depositClaimed: c.depositclaimed, note: c.note, marked: c.marked, paidAmount: c.paidamount, payments: JSON.parse(c.payments||"[]") }));
      localStorage.setItem("karo_conc_" + loggedUser.project, JSON.stringify(mapped));
    }}
    onCashUpdate={cash => {
      setCashIQD(cash.cashiqd || 0);
      setCashUSD(cash.cashusd || 0);
      setExchangeRate(cash.exchangerate || 1500);
      localStorage.setItem("karo_cashIQD_" + loggedUser.project, JSON.stringify(cash.cashiqd || 0));
      localStorage.setItem("karo_cashUSD_" + loggedUser.project, JSON.stringify(cash.cashusd || 0));
    }}
  /><Dashboard {...shared} setLang={setLang} user={loggedUser} dashPage={dashPage} setDashPage={setDashPage} onLogout={handleLogout} setDark={setDark} fontIdx={fontIdx} setFontIdx={setFontIdx} />  </>
'''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')
