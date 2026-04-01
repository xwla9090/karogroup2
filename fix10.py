
with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

old_modal = '''      {paymentModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, maxWidth: 380, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: "#4DAF94" }}>وەرگرتنی پارە</h3>
            {(() => {
              const item = items.find(i => i.id === paymentModal);
              if (!item) return null;
              const sym = item.currency === "usd" ? "$" : "";
              const paid = Number(item.paidAmount||0);
              const remaining = Math.max(0, Number(item.received||0) - paid);
              return (
                <div>
                  <p style={{ fontSize: 13, color: "#666", marginBottom: 5 }}>کۆی گشتی: <strong>{sym}{fmt(item.received)}</strong></p>
                  <p style={{ fontSize: 13, color: "#059669", marginBottom: 5 }}>وەرگیراو: <strong>{sym}{fmt(paid)}</strong></p>
                  <p style={{ fontSize: 13, color: "#EF4444", marginBottom: 15 }}>ماوە: <strong>{sym}{fmt(remaining)}</strong></p>
                  <input type="number" placeholder="بڕی وەرگرتن" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e5e5", fontSize: 14, textAlign: "center", marginBottom: 15, direction: "ltr" }} />
                  <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                    <button onClick={() => addPayment(paymentModal, paymentAmount)} style={{ background: "#4DAF94", color: "#fff", border: "none", borderRadius: 8, padding: "10px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>وەرگرتن</button>
                    <button onClick={() => { setPaymentModal(null); setPaymentAmount(""); }} style={{ background: "#f5f5f5", color: "#333", border: "1px solid #e5e5e5", borderRadius: 8, padding: "10px 28px", fontSize: 14, cursor: "pointer" }}>پاشگەزبوونەوە</button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
'''

new_modal = '''      {paymentModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, maxWidth: 500, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 15, color: "#4DAF94", textAlign: "center" }}>وەرگرتنی پارە</h3>
            {(() => {
              const item = items.find(i => i.id === paymentModal);
              if (!item) return null;
              const sym = item.currency === "usd" ? "$" : "";
              const effPaid = item.isReceived && !item.paidAmount ? Number(item.received||0) : Number(item.paidAmount||0);
              const remaining = Math.max(0, Number(item.received||0) - effPaid);
              const payments = item.payments || [];
              return (
                <div>
                  <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 15, flexWrap: "wrap" }}>
                    <p style={{ fontSize: 13, color: "#666", margin: 0 }}>کۆی گشتی: <strong>{sym}{fmt(item.received)}</strong></p>
                    <p style={{ fontSize: 13, color: "#059669", margin: 0 }}>وەرگیراو: <strong>{sym}{fmt(effPaid)}</strong></p>
                    <p style={{ fontSize: 13, color: "#EF4444", margin: 0 }}>ماوە: <strong>{sym}{fmt(remaining)}</strong></p>
                  </div>
                  {payments.length > 0 && (

> Hawa:
<table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 15, fontSize: 12 }}>
                      <thead>
                        <tr style={{ background: "#4DAF94", color: "#fff" }}>
                          <th style={{ padding: "6px", textAlign: "center" }}>بەروار</th>
                          <th style={{ padding: "6px", textAlign: "center" }}>بڕ</th>
                          <th style={{ padding: "6px", textAlign: "center" }}>تێبینی</th>
                          <th style={{ padding: "6px", textAlign: "center" }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((p, idx) => (
                          <tr key={p.id} style={{ borderBottom: "1px solid #eee", textAlign: "center" }}>
                            <td style={{ padding: "5px" }}>{p.date}</td>
                            <td style={{ padding: "5px", color: "#059669", fontWeight: 600 }}>{sym}{fmt(p.amount)}</td>
                            <td style={{ padding: "5px" }}>{p.note||"-"}</td>
                            <td style={{ padding: "5px" }}>
                              <button onClick={() => deletePayment(item.id, p.id)} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: 14 }}>🗑</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  {!item.isReceived && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 15 }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} style={{ flex: 1, padding: "8px", borderRadius: 6, border: "1px solid #e5e5e5", fontSize: 13, direction: "ltr" }} />
                        <input type="number" placeholder="بڕ" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} style={{ flex: 1, padding: "8px", borderRadius: 6, border: "1px solid #e5e5e5", fontSize: 13, direction: "ltr", textAlign: "center" }} />
                      </div>
                      <input placeholder="تێبینی" value={paymentNote} onChange={e => setPaymentNote(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1px solid #e5e5e5", fontSize: 13, textAlign: "center" }} />
                      <button onClick={() => addPayment(paymentModal, paymentAmount, paymentDate, paymentNote)} style={{ background: "#4DAF94", color: "#fff", border: "none", borderRadius: 8, padding: "10px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>وەرگرتن</button>
                    </div>
                  )}
                  <button onClick={() => { setPaymentModal(null); setPaymentAmount(""); setPaymentNote(""); }} style={{ width: "100%", background: "#f5f5f5", color: "#333", border: "1px solid #e5e5e5", borderRadius: 8, padding: "8px", fontSize: 13, cursor: "pointer" }}>داخستن</button>
                </div>
              );
            })()}
          </div>
        </div>
      )}
'''

content = ''.join(lines)
if old_modal in content:
    content = content.replace(old_modal, new_modal, 1)
    print('found!')
else:
    print('NOT FOUND')

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('saved!')
