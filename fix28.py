with open('src/App.js', encoding='utf-8') as f:
    content = f.read()

# State نوێ زیاد دەکەین
old_state = '  const [editPaymentId, setEditPaymentId] = useState(null);'
new_state = '  const [editPaymentId, setEditPaymentId] = useState(null);\n  const [unmarkModal, setUnmarkModal] = useState(null);'

# ↩ دوگمە دەگۆڕین
old_btn = 'onClick={()=>unmarkReceived(item.id)} title="پاشگەزبوونەوە">✓ هەموی وەرگیرا ↩</span>'
new_btn = 'onClick={()=>setUnmarkModal(item.id)} title="پاشگەزبوونەوە">✓ هەموی وەرگیرا ↩</span>'

# alert دەگۆڕین
old_alert = 'if(amt > maxAmt) { alert("ئەم بڕە زیاترە لە ماوەی پارەکە! ماوە: " + (item?.currency==="usd"?"$":"") + Math.round(maxAmt)); return; }'
new_alert = 'if(amt > maxAmt) { setAlert("ئەم بڕە زیاترە لە ماوەی پارەکە! ماوە: " + (item?.currency==="usd"?"$":"") + Math.round(maxAmt)); return; }'

if old_state in content:
    content = content.replace(old_state, new_state, 1)
    print('state added!')
else:
    print('NOT FOUND state')

if old_btn in content:
    content = content.replace(old_btn, new_btn, 1)
    print('button updated!')
else:
    print('NOT FOUND btn')

if old_alert in content:
    content = content.replace(old_alert, new_alert, 1)
    print('alert fixed!')
else:
    print('NOT FOUND alert')

# پەنجەرەی نوێ زیاد دەکەین پێش alert modal
old_modal = '      {alert && <AlertModal message={alert} onOk={()=>setAlert(null)} s={s} />}\n      {confirmDel && <ConfirmModal'
new_modal = '''      {unmarkModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, maxWidth: 380, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20, color: "#4DAF94" }}>گەڕانەوەی پارە</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button onClick={() => { unmarkReceived(unmarkModal); setUnmarkModal(null); }} style={{ background: "#EF4444", color: "#fff", border: "none", borderRadius: 8, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>هەموو پارەکە بگەڕێتەوە</button>
              <button onClick={() => { setPaymentModal(unmarkModal); setUnmarkModal(null); }} style={{ background: "#F59E0B", color: "#fff", border: "none", borderRadius: 8, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>گۆڕانکاری لە بڕی پارە</button>
              <button onClick={() => setUnmarkModal(null)} style={{ background: "#f5f5f5", color: "#333", border: "1px solid #e5e5e5", borderRadius: 8, padding: "10px", fontSize: 13, cursor: "pointer" }}>هەڵوەشاندنەوە</button>
            </div>
          </div>
        </div>
      )}
      {alert && <AlertModal message={alert} onOk={()=>setAlert(null)} s={s} />}\n      {confirmDel && <ConfirmModal'''

if old_modal in content:
    content = content.replace(old_modal, new_modal, 1)
    print('modal added!')
else:
    print('NOT FOUND modal')

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('saved!')