with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

payment_modal = '''      {paymentModal && (
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

# لاین 3134 (index 3133) پێش alert زیاد دەکەین
lines.insert(3133, payment_modal)

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')
