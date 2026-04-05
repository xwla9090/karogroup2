with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[698] = '''          }
          const { data: invData } = await supabase.from("invoices").select("*").eq("project", pk);
          if (invData) {
            const mapped = invData.map(i => ({ id: i.id, date: i.date, invoiceNo: i.invoiceno, currency: i.currency, billTo: i.billto, billPhone: i.billphone, items: JSON.parse(i.items||"[]"), total: i.total, marked: i.marked }));
            localStorage.setItem("karo_inv_" + pk, JSON.stringify(mapped));
          }
'''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')