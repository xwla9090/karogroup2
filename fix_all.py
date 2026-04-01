# Fix AutoSync.js
f = open('src/AutoSync.js', 'w', encoding='utf-8')
f.write('''import { useEffect } from "react";
import { supabase } from "./supabase";
const getLS = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) } catch(e) { return d } };
export default function AutoSync({ project, cashIQD, cashUSD, exchangeRate }) {
  useEffect(() => {
    if (!project) return;
    const t = setTimeout(async () => {
      try {
        var exp = getLS("karo_exp_" + project, []);
        await supabase.from("expenses").delete().eq("project", project);
        if (exp.length > 0) {
          var rows = [];
          for (var i = 0; i < exp.length; i++) {
            var e = exp[i];
            rows.push({
              id: e.id, project: project, date: e.date,
              amountiqd: Number(e.amountIQD) || 0,
              amountusd: Number(e.amountUSD) || 0,
              receiptno: e.receiptNo || "",
              note: e.note || "",
              marked: e.marked || false
            });
          }
          await supabase.from("expenses").insert(rows);
        }
        var conc = getLS("karo_conc_" + project, []);
        await supabase.from("concrete").delete().eq("project", project);
        if (conc.length > 0) {
          var rows2 = [];
          for (var i = 0; i < conc.length; i++) {
            var c = conc[i];
            rows2.push({
              id: c.id, project: project, date: c.date,
              currency: c.currency || "iqd",
              meters: Number(c.meters) || 0,
              pricepermeter: Number(c.pricePerMeter) || 0,
              totalprice: Number(c.totalPrice) || 0,
              deposit: Number(c.deposit) || 0,
              depositpercent: Number(c.depositPercent) || 0,
              received: Number(c.received) || 0,
              isreceived: c.isReceived || false,
              depositclaimed: c.depositClaimed || false,
              note: c.note || "",
              marked: c.marked || false
            });
          }
          await supabase.from("concrete").insert(rows2);
        }
        var r = await supabase.from("cash").select("*").eq("project", project);
        var cd = { id: project, project: project, cashiqd: cashIQD, cashusd: cashUSD, exchangerate: exchangeRate };
        if (r.data && r.data.length > 0) {
          await supabase.from("cash").update(cd).eq("project", project);
        } else {
          await supabase.from("cash").insert([cd]);
        }
        console.log("Synced:", project);
      } catch(err) { console.error("Sync error:", err); }
    }, 3000);
    return () => clearTimeout(t);
  }, [project, cashIQD, cashUSD, exchangeRate]);
  return null;
}
''')
f.close()
print("AutoSync.js fixed!")