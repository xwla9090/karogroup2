f=open('App.js','r',encoding='utf-8')
lines=f.readlines()
f.close()

totals = '''            <div style={{ display: "flex", gap: 15, marginBottom: 15, flexWrap: "wrap", justifyContent: "center" }}>
              <div style={{ background: "#D1FAE5", borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
                <span style={{ color: "#059669", fontSize: 11 }}>{t.loanTake} ({t.iqd}): </span>
                <strong style={{ color: "#059669", fontSize: 15 }}>{fmt(totalTakeIQD)}</strong>
              </div>
              <div style={{ background: "#D1FAE5", borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
                <span style={{ color: "#059669", fontSize: 11 }}>{t.loanTake} ({t.usd}): </span>
                <strong style={{ color: "#059669", fontSize: 15 }}>${fmt(totalTakeUSD)}</strong>
              </div>
              <div style={{ background: "#FEE2E2", borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
                <span style={{ color: "#EF4444", fontSize: 11 }}>{t.loanGive} ({t.iqd}): </span>
                <strong style={{ color: "#EF4444", fontSize: 15 }}>{fmt(totalGiveIQD)}</strong>
              </div>
              <div style={{ background: "#FEE2E2", borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
                <span style={{ color: "#EF4444", fontSize: 11 }}>{t.loanGive} ({t.usd}): </span>
                <strong style={{ color: "#EF4444", fontSize: 15 }}>${fmt(totalGiveUSD)}</strong>
              </div>
            </div>
'''

lines.insert(2463, totals)

f=open('App.js','w',encoding='utf-8')
f.writelines(lines)
f.close()
print('Done')
