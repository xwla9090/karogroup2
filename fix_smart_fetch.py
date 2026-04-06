with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[712] = '''      const smartFetch = async () => {
        try {
          const { data: expData } = await supabase.from("expenses").select("*").eq("project", pk);
          if (expData) {
            const local = JSON.parse(localStorage.getItem("karo_exp_" + pk) || "[]");
            if (expData.length !== local.length) {
              const mapped = expData.map(e => ({ id: e.id, date: e.date, amountIQD: e.amountiqd, amountUSD: e.amountusd, receiptNo: e.receiptno, note: e.note, marked: e.marked }));
              localStorage.setItem("karo_exp_" + pk, JSON.stringify(mapped));
              window.dispatchEvent(new Event("karoDataUpdate"));
            }
          }
        } catch(e) {}
      };
      smartFetch();
'''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')