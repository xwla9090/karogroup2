with open('src/AutoSync.js', encoding='utf-8') as f:
    lines = f.readlines()

lines[25] = '''        if (conc.length > 0) {
          var rows2 = [];
          for (var k = 0; k < conc.length; k++) {
            var c = conc[k];
            rows2.push({ id: c.id, project: project, date: c.date, currency: S(c.currency) ? S(c.currency) : "iqd", meters: N(c.meters), pricepermeter: N(c.pricePerMeter), totalprice: N(c.totalPrice), deposit: N(c.deposit), depositpercent: N(c.depositPercent), received: N(c.received), isreceived: B(c.isReceived), depositclaimed: B(c.depositClaimed), note: S(c.note), marked: B(c.marked), paidamount: N(c.paidAmount), payments: JSON.stringify(c.payments||[]) });
          }
          await supabase.from("concrete").upsert(rows2);
        }
'''

with open('src/AutoSync.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')