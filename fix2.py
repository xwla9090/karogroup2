with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

insert = '        <div style={{ display: "flex", gap: 15, marginBottom: 15, flexWrap: "wrap", justifyContent: "center" }}>\n          <div style={{ background: "#FEE2E2", borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>\n            <span style={{ color: "#EF4444", fontSize: 11 }}>{t.withdraw} ({t.iqd}): </span>\n            <strong style={{ color: "#EF4444", fontSize: 15 }}>{fmt(totalWithdrawIQD)}</strong>\n          </div>\n          <div style={{ background: "#D1FAE5", borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>\n            <span style={{ color: "#059669", fontSize: 11 }}>{t.addMoney} ({t.iqd}): </span>\n            <strong style={{ color: "#059669", fontSize: 15 }}>{fmt(totalAddIQD)}</strong>\n          </div>\n        </div>\n'

lines.insert(3313, insert)

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('done!') 
