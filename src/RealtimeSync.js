import { useEffect } from "react";
import { supabase } from "./supabase";

export default function RealtimeSync({ project, setCashIQD, setCashUSD }) {
  useEffect(() => {
    if (!project) return;

    const fetchAndUpdate = async (table, localKey, mapper) => {
      if (window._karoLocal) return;
      await new Promise(r => setTimeout(r, 3000));
      if (window._karoLocal) return;
      const { data } = await supabase.from(table).select("*").eq("project", project);
      if (data) {
        const local = JSON.parse(localStorage.getItem(localKey + project) || "[]");
        if (JSON.stringify(data.sort((a,b)=>a.id>b.id?1:-1)) !== JSON.stringify(local.sort((a,b)=>a.id>b.id?1:-1))) {
          localStorage.setItem(localKey + project, JSON.stringify(data.map(mapper)));
          window.dispatchEvent(new Event("karoDataUpdate"));
        }
      }
      window._karoLocal = false;
    };

    // کاتی کرایەوەی براوزەر — هەموو داتا لە Supabase بخوێنەوە
    const initialLoad = async () => {
      const expMapper = e => ({ id: e.id, date: e.date, amountIQD: e.amountiqd, amountUSD: e.amountusd, receiptNo: e.receiptno, note: e.note, marked: e.marked });
      const concMapper = c => ({ id: c.id, date: c.date, currency: c.currency, meters: c.meters, pricePerMeter: c.pricepermeter, totalPrice: c.totalprice, deposit: c.deposit, depositPercent: c.depositpercent, received: c.received, isReceived: c.isreceived, depositClaimed: c.depositclaimed, note: c.note, marked: c.marked, paidAmount: c.paidamount, payments: (() => { try { return Array.isArray(c.payments) ? c.payments : JSON.parse(c.payments||"[]"); } catch(e) { return []; } })() });
      const loansMapper = l => ({ id: l.id, type: l.type, personName: l.personname, amountIQD: l.amountiqd, amountUSD: l.amountusd, note: l.note, date: l.date, returned: l.returned, marked: l.marked });

      const [expRes, concRes, loansRes, cashRes] = await Promise.all([
        supabase.from("expenses").select("*").eq("project", project),
        supabase.from("concrete").select("*").eq("project", project),
        supabase.from("loans").select("*").eq("project", project),
        supabase.from("cash").select("*").eq("project", project).single()
      ]);

      let changed = false;
      if (expRes.data) { localStorage.setItem("karo_exp_" + project, JSON.stringify(expRes.data.map(expMapper))); changed = true; }
      if (concRes.data) { localStorage.setItem("karo_conc_" + project, JSON.stringify(concRes.data.map(concMapper))); changed = true; }
      if (loansRes.data) { localStorage.setItem("karo_loans_" + project, JSON.stringify(loansRes.data.map(loansMapper))); changed = true; }
      if (cashRes.data) {
        localStorage.setItem("karo_cashIQD_" + project, JSON.stringify(cashRes.data.cashiqd || 0));
        localStorage.setItem("karo_cashUSD_" + project, JSON.stringify(cashRes.data.cashusd || 0));
        if (setCashIQD) setCashIQD(cashRes.data.cashiqd || 0);
        if (setCashUSD) setCashUSD(cashRes.data.cashusd || 0);
        changed = true;
      }
      if (changed) window.dispatchEvent(new Event("karoDataUpdate"));
    };
    initialLoad();

    const expSub = supabase.channel("exp2_" + project)
      .on("postgres_changes", { event: "*", schema: "public", table: "expenses", filter: "project=eq." + project }, () => {
        fetchAndUpdate("expenses", "karo_exp_", e => ({ id: e.id, date: e.date, amountIQD: e.amountiqd, amountUSD: e.amountusd, receiptNo: e.receiptno, note: e.note, marked: e.marked }));
      }).subscribe();

    const concSub = supabase.channel("conc2_" + project)
      .on("postgres_changes", { event: "*", schema: "public", table: "concrete", filter: "project=eq." + project }, () => {
        fetchAndUpdate("concrete", "karo_conc_", c => ({ id: c.id, date: c.date, currency: c.currency, meters: c.meters, pricePerMeter: c.pricepermeter, totalPrice: c.totalprice, deposit: c.deposit, depositPercent: c.depositpercent, received: c.received, isReceived: c.isreceived, depositClaimed: c.depositclaimed, note: c.note, marked: c.marked, paidAmount: c.paidamount, payments: JSON.parse(c.payments||"[]") }));
      }).subscribe();

    const cashSub = supabase.channel("cash_rt_" + project)
      .on("postgres_changes", { event: "*", schema: "public", table: "cash", filter: "project=eq." + project }, async (payload) => {
        const newData = payload.new;
        if (!newData) return;
        if (window._karoLocal) return;
        
        const localFormatted = localStorage.getItem("karo_formatted_" + project);
        if (newData.formatted_at && newData.formatted_at !== localFormatted) {
          localStorage.setItem("karo_formatted_" + project, newData.formatted_at);
          localStorage.setItem("karo_exp_" + project, JSON.stringify([]));
          localStorage.setItem("karo_conc_" + project, JSON.stringify([]));
          localStorage.setItem("karo_loans_" + project, JSON.stringify([]));
          localStorage.setItem("karo_contr_" + project, JSON.stringify([]));
          localStorage.setItem("karo_inv_" + project, JSON.stringify([]));
          localStorage.setItem("karo_cashIQD_" + project, JSON.stringify(0));
          localStorage.setItem("karo_cashUSD_" + project, JSON.stringify(0));
          localStorage.setItem("karo_cashLog_" + project, JSON.stringify([]));
          window.dispatchEvent(new Event("karoDataUpdate"));
          return;
        }

        if (newData.cashiqd !== undefined) {
          localStorage.setItem("karo_cashIQD_" + project, JSON.stringify(newData.cashiqd || 0));
          localStorage.setItem("karo_cashUSD_" + project, JSON.stringify(newData.cashusd || 0));
          if (setCashIQD) setCashIQD(newData.cashiqd || 0);
          if (setCashUSD) setCashUSD(newData.cashusd || 0);
          window.dispatchEvent(new Event("karoDataUpdate"));
        }

        if (newData.cashlog) {
          const localCashLog = JSON.parse(localStorage.getItem("karo_cashLog_" + project) || "[]");
          const remoteCashLog = JSON.parse(newData.cashlog || "[]");
          if (remoteCashLog.length !== localCashLog.length) {
            localStorage.setItem("karo_cashLog_" + project, newData.cashlog);
            window.dispatchEvent(new Event("karoDataUpdate"));
          }
        }
      }).subscribe();

    return () => {
      supabase.removeChannel(expSub);
      supabase.removeChannel(concSub);
      supabase.removeChannel(cashSub);
    };
  }, [project]);

  return null;
}