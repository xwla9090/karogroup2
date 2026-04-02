import { useEffect } from "react";
import { supabase } from "./supabase";

function getLS(k) { try { var v = JSON.parse(localStorage.getItem(k)); return Array.isArray(v) ? v : []; } catch(e) { return []; } }

export default function RealtimeSync({ project, onExpUpdate, onConcUpdate, onCashUpdate }) {
  useEffect(() => {
    if (!project) return;

    const expSub = supabase
      .channel("exp_rt_" + project)
      .on("postgres_changes", { event: "*", schema: "public", table: "expenses", filter: "project=eq." + project },
        async () => {
          const { data } = await supabase.from("expenses").select("*").eq("project", project);
          if (!data) return;
          const mapped = data.map(e => ({ id: e.id, date: e.date, amountIQD: e.amountiqd, amountUSD: e.amountusd, receiptNo: e.receiptno, note: e.note, marked: e.marked }));
          const local = getLS("karo_exp_" + project);
          if (mapped.length !== local.length) {
            localStorage.setItem("karo_exp_" + project, JSON.stringify(mapped));
            window.dispatchEvent(new Event("karoDataUpdate"));
          }
        }
      ).subscribe();

    const concSub = supabase
      .channel("conc_rt_" + project)
      .on("postgres_changes", { event: "*", schema: "public", table: "concrete", filter: "project=eq." + project },
        async () => {
          const { data } = await supabase.from("concrete").select("*").eq("project", project);
          if (!data) return;
          const mapped = data.map(c => ({ id: c.id, date: c.date, currency: c.currency, meters: c.meters, pricePerMeter: c.pricepermeter, totalPrice: c.totalprice, deposit: c.deposit, depositPercent: c.depositpercent, received: c.received, isReceived: c.isreceived, depositClaimed: c.depositclaimed, note: c.note, marked: c.marked, paidAmount: c.paidamount, payments: JSON.parse(c.payments||"[]") }));
          const local = getLS("karo_conc_" + project);
          if (mapped.length !== local.length) {
            localStorage.setItem("karo_conc_" + project, JSON.stringify(mapped));
            window.dispatchEvent(new Event("karoDataUpdate"));
          }
        }
      ).subscribe();

    return () => {
      supabase.removeChannel(expSub);
      supabase.removeChannel(concSub);
    };
  }, [project]);

  return null;
}
