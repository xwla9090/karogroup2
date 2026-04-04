with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# لاین 676 دوای concrete fetch، loans و contractor زیاد دەکەین
lines[675] = '''            localStorage.setItem("karo_conc_" + pk, JSON.stringify(mapped));
          }
          const { data: loansData } = await supabase.from("loans").select("*").eq("project", pk);
          if (loansData) {
            const mapped = loansData.map(l => ({ id: l.id, date: l.date, type: l.type, personName: l.personname, amountIQD: l.amountiqd, amountUSD: l.amountusd, note: l.note, returned: l.returned, marked: l.marked }));
            localStorage.setItem("karo_loans_" + pk, JSON.stringify(mapped));
          }
          const { data: contrData } = await supabase.from("contractor").select("*").eq("project", pk);
          if (contrData) {
            const mapped = contrData.map(c => ({ id: c.id, date: c.date, type: c.type, personName: c.personname, amountIQD: c.amountiqd, amountUSD: c.amountusd, note: c.note, marked: c.marked }));
            localStorage.setItem("karo_contr_" + pk, JSON.stringify(mapped));
          }
'''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')