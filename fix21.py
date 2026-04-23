FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\RealtimeSync.js"

CORRECT = '''import { useEffect } from "react";
import { supabase } from "./supabase";

export default function RealtimeSync({ project, onExpUpdate, onLoansUpdate, onConcUpdate, onCashUpdate }) {
  useEffect(() => {
    if (!project) return;

    const fetchAndUpdate = async (table, mapper, callback) => {
      const { data } = await supabase.from(table).select("*").eq("project", project);
      if (data && callback) callback(data.map(mapper));
    };

    const expSub = supabase.channel("exp2_" + project)
      .on("postgres_changes", { event: "*", schema: "public", table: "expenses", filter: "project=eq." + project }, () => {
        fetchAndUpdate("expenses", e => ({ id: e.id, date: e.date, amountIQD: e.amountiqd, amountUSD: e.amountusd, receiptNo: e.receiptno, note: e.note, marked: e.marked }), onExpUpdate);
      }).subscribe();

    const loansSub = supabase.channel("loans_" + project)
      .on("postgres_changes", { event: "*", schema: "public", table: "loans", filter: "project=eq." + project }, () => {
        fetchAndUpdate("loans", l => ({ id: l.id, type: l.type, personName: l.personname, amountIQD: l.amountiqd, amountUSD: l.amountusd, note: l.note, date: l.date, returned: l.returned, marked: l.marked }), onLoansUpdate);
      }).subscribe();

    const concSub = supabase.channel("conc2_" + project)
      .on("postgres_changes", { event: "*", schema: "public", table: "concrete", filter: "project=eq." + project }, () => {
        fetchAndUpdate("concrete", c => ({ id: c.id, date: c.date, currency: c.currency, meters: c.meters, pricePerMeter: c.pricepermeter, totalPrice: c.totalprice, deposit: c.deposit, depositPercent: c.depositpercent, received: c.received, isReceived: c.isreceived, depositClaimed: c.depositclaimed, note: c.note, marked: c.marked, paidAmount: c.paidamount, payments: JSON.parse(c.payments||"[]") }), onConcUpdate);
      }).subscribe();

    const cashSub = supabase.channel("cash_rt_" + project)
      .on("postgres_changes", { event: "*", schema: "public", table: "cash", filter: "project=eq." + project }, async (payload) => {
        const newData = payload.new;
        if (!newData) return;

        const localFormatted = localStorage.getItem("karo_formatted_" + project);
        if (newData.formatted_at && newData.formatted_at !== localFormatted) {
          localStorage.setItem("karo_formatted_" + project, newData.formatted_at);
          ["exp","conc","loans","contr","inv"].forEach(k => localStorage.setItem("karo_" + k + "_" + project, "[]"));
          localStorage.setItem("karo_cashIQD_" + project, "0");
          localStorage.setItem("karo_cashUSD_" + project, "0");
          localStorage.setItem("karo_cashLog_" + project, "[]");
          window.dispatchEvent(new Event("karoDataUpdate"));
          return;
        }

        if (onCashUpdate) onCashUpdate(newData);
      }).subscribe();

    return () => {
      supabase.removeChannel(expSub);
      supabase.removeChannel(concSub);
      supabase.removeChannel(loansSub);
      supabase.removeChannel(cashSub);
    };
  }, [project]);

  return null;
}
'''

with open(FILE, "w", encoding="utf-8") as f:
    f.write(CORRECT)

print("\n" + "="*55)
print("  کارۆ گروپ — Fix 21")
print("="*55)
print("✅ FIX 1: ignoreRef لە RealtimeSync لابرا")
print("✅ FIX 2: هەموو table بەبێ ignore")
print("="*55)
print("✅ RealtimeSync.js پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: remove ignore from realtime" && git push')
