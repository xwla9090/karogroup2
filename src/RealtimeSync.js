import { useEffect } from "react";
import { supabase } from "./supabase";

export default function RealtimeSync({ project, onExpUpdate, onConcUpdate, onCashUpdate, setCashIQD, setCashUSD }) {
  useEffect(() => {
    if (!project) return;

    const fetchAndUpdate = async (table, localKey, mapper) => {
      const { data } = await supabase.from(table).select("*").eq("project", project);
      if (data) {
        localStorage.setItem(localKey + project, JSON.stringify(data.map(mapper)));
        window.dispatchEvent(new Event("karoDataUpdate"));
      }
    };

    // کاتی کردنەوەی براوسەر — هەموو داتا بخوێنەوە
    const initialLoad = async () => {
      const concMapper = c => ({ id: c.id, date: c.date, currency: c.currency, meters: c.meters, pricePerMeter: c.pricepermeter, totalPrice: c.totalprice, deposit: c.deposit, depositPercent: c.depositpercent, received: c.received, isReceived: c.isreceived, depositClaimed: c.depositclaimed, note: c.note, marked: c.marked, paidAmount: c.paidamount, payments: (() => { try { return Array.isArray(c.payments) ? c.payments : JSON.parse(c.payments||"[]"); } catch(e) { return []; } })() });
      const expMapper = e => ({ id: e.id, date: e.date, amountIQD: e.amountiqd, amountUSD: e.amountusd, receiptNo: e.receiptno, note: e.note, marked: e.marked });

      const [expRes, concRes, cashRes, histRes] = await Promise.all([
        supabase.from("expenses").select("*").eq("project", project),
        supabase.from("concrete").select("*").eq("project", project),
        supabase.from("cash").select("*").eq("project", project).single(),
        supabase.from("cash_history").select("amountiqd,amountusd").eq("project", project)
      ]);

      let changed = false;
      if (expRes.data) { localStorage.setItem("karo_exp_" + project, JSON.stringify(expRes.data.map(expMapper))); changed = true; }
      if (concRes.data) { localStorage.setItem("karo_conc_" + project, JSON.stringify(concRes.data.map(concMapper))); changed = true; }

      // ⭐ گۆڕانکاری گرنگ: کۆی cash_history بخوێنەوە بۆ قاسە
      let realCashIQD = 0;
      let realCashUSD = 0;
      
      if (histRes.data && histRes.data.length > 0) {
        realCashIQD = histRes.data.reduce((a, b) => a + Number(b.amountiqd || 0), 0);
        realCashUSD = histRes.data.reduce((a, b) => a + Number(b.amountusd || 0), 0);
      } else if (cashRes.data) {
        realCashIQD = cashRes.data.cashiqd || 0;
        realCashUSD = cashRes.data.cashusd || 0;
      }

      // ⭐ یەکسەر localStorage و state نوێ بکە
      localStorage.setItem("karo_cashIQD_" + project, JSON.stringify(realCashIQD));
      localStorage.setItem("karo_cashUSD_" + project, JSON.stringify(realCashUSD));
      
      if (onCashUpdate) onCashUpdate({ cashiqd: realCashIQD, cashusd: realCashUSD });
      else {
        if (setCashIQD) setCashIQD(realCashIQD);
        if (setCashUSD) setCashUSD(realCashUSD);
      }

      // ⭐ گرنگترین: یەکسەر cash table نوێ بکە لە Supabase بە بەهای ڕاست
      // بۆ ئەوەی AutoSync ـی هیچ براوسەرێک نەتوانێت بیگۆڕێت بە 0
      await supabase.from("cash").upsert([{
        id: project,
        project: project,
        cashiqd: realCashIQD,
        cashusd: realCashUSD,
        exchangerate: cashRes.data ? (cashRes.data.exchangerate || 1500) : 1500,
        cashlog: cashRes.data ? cashRes.data.cashlog : "[]",
        formatted_at: cashRes.data ? (cashRes.data.formatted_at || "") : ""
      }]);

      if (cashRes.data && cashRes.data.cashlog) {
        localStorage.setItem("karo_cashLog_" + project, cashRes.data.cashlog);
      }

      changed = true;
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
          if (onCashUpdate) onCashUpdate(newData);
          else {
            if (setCashIQD) setCashIQD(newData.cashiqd || 0);
            if (setCashUSD) setCashUSD(newData.cashusd || 0);
          }
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

    const histSub = supabase.channel("hist_" + project)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "cash_history", filter: "project=eq." + project }, async () => {
        const { data: histData } = await supabase.from("cash_history").select("amountiqd,amountusd").eq("project", project);
        if (histData) {
          const totalIQD = histData.reduce((a, b) => a + Number(b.amountiqd || 0), 0);
          const totalUSD = histData.reduce((a, b) => a + Number(b.amountusd || 0), 0);
          localStorage.setItem("karo_cashIQD_" + project, JSON.stringify(totalIQD));
          localStorage.setItem("karo_cashUSD_" + project, JSON.stringify(totalUSD));
          if (onCashUpdate) onCashUpdate({ cashiqd: totalIQD, cashusd: totalUSD });
          else {
            if (setCashIQD) setCashIQD(totalIQD);
            if (setCashUSD) setCashUSD(totalUSD);
          }
          window.dispatchEvent(new Event("karoDataUpdate"));
        }
      }).subscribe();

    return () => {
      supabase.removeChannel(expSub);
      supabase.removeChannel(concSub);
      supabase.removeChannel(cashSub);
      supabase.removeChannel(histSub);
    };
  }, [project]);

  return null;
}
