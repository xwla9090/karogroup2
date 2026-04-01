f = open('src/AutoSync.js', 'w', encoding='utf-8')
f.write('''import { useEffect, useRef } from "react";
import { supabase } from "./supabase";
const getLS = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) } catch(e) { return d } };
export default function AutoSync({ project, cashIQD, cashUSD, exchangeRate }) {
  const lastHash = useRef("");
  useEffect(() => {
    if (!project) return;
    const doSync = async () => {
      try {
        var exp = getLS("karo_exp_" + project, []);
        var conc = getLS("karo_conc_" + project, []);
        var hash = JSON.stringify({exp:exp.length,conc:conc.length,cashIQD,cashUSD,exchangeRate,t:Math.floor(Date.now()/5000)});
        if (hash === lastHash.current) return;
        lastHash.current = hash;
        await supabase.from("expenses").delete().eq("project", project);
        if (exp.length > 0) {
          var rows = [];
          for (var i = 0; i < exp.length; i++) {
            var e = exp[i];
            rows.push({ id: e.id, project: project, date: e.date, amountiqd: Number(e.amountIQD)0, receiptno: e.receiptNo"", marked: e.marked || false });
          }
          await supabase.from("expenses").insert(rows);
        }
        await supabase.from("concrete").delete().eq("project", project);
        if (conc.length > 0) {
          var rows2 = [];
          for (var i = 0; i < conc.length; i++) {
            var c = conc[i];
            rows2.push({ id: c.id, project: project, date: c.date, currency: c.currency0, pricepermeter: Number(c.pricePerMeter)0, deposit: Number(c.deposit)0, received: Number(c.received)false, depositclaimed: c.depositClaimed"", marked: c.marked || false });
          }
          await supabase.from("concrete").insert(rows2);
        }
        var r = await supabase.from("cash").select("*").eq("project", project);
        var cd = { id: project, project: project, cashiqd: cashIQD, cashusd: cashUSD, exchangerate: exchangeRate };
        if (r.data && r.data.length > 0) { await supabase.from("cash").update(cd).eq("project", project); }
        else { await supabase.from("cash").insert([cd]); }
        console.log("Synced:", project);
      } catch(err) { console.error("Sync error:", err); }
    };
    doSync();
    var interval = setInterval(doSync, 5000);
    return () => clearInterval(interval);
  }, [project, cashIQD, cashUSD, exchangeRate]);
  return null;
}
''')
f.close()
print("AutoSync v2 done!")