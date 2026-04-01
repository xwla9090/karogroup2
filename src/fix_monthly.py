f=open('App.js','r',encoding='utf-8')
t=f.read()
f.close()

# 1. Add withDeposit state
old_state = '  const [reportRate, setReportRate] = useState(exchangeRate);'
new_state = '  const [reportRate, setReportRate] = useState(exchangeRate);\n  const [withDeposit, setWithDeposit] = useState(false);'
t = t.replace(old_state, new_state)

# 2. Add totalWithDeposit calculation after tConcDep
old_profit = '  const profit = tConcRec - tExp;'
new_profit = '  const tConcTotal = withDeposit ? tConcRec + tConcDep : tConcRec;\n  const profit = tConcTotal - tExp;'
t = t.replace(old_profit, new_profit)

# 3. Add select option after reportRate input (after line with reportRate input closing div)
old_ui = '''        <div>
          <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 3, textAlign: "center" }}>{t.from}</label>'''
new_ui = '''        <div>
          <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 3, textAlign: "center" }}>{t.deposit}</label>
          <select value={withDeposit} onChange={e=>setWithDeposit(e.target.value==="true")} style={{ padding: "8px 15px", borderRadius: 6, border: "1px solid "+s.border, background: s.bgCard2, color: s.text, fontSize: 13, minWidth: 130, textAlign: "center" }}>
            <option value="false">{t.depositNotClaimed}</option>
            <option value="true">{t.deposit}</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 3, textAlign: "center" }}>{t.from}</label>'''
t = t.replace(old_ui, new_ui)

f=open('App.js','w',encoding='utf-8')
f.write(t)
f.close()
print('Done')