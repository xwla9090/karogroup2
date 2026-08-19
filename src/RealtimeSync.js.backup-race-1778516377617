import { useEffect, useRef } from "react";
import { supabase } from "./supabase";

export default function RealtimeSync({ project, onExpUpdate, onConcUpdate, onCashUpdate, setCashIQD, setCashUSD }) {
  // ============ REFS بۆ callbacks (چارەسەری stale closure) ============
  const onExpUpdateRef = useRef(onExpUpdate);
  const onConcUpdateRef = useRef(onConcUpdate);
  const onCashUpdateRef = useRef(onCashUpdate);
  const setCashIQDRef = useRef(setCashIQD);
  const setCashUSDRef = useRef(setCashUSD);

  useEffect(() => {
    onExpUpdateRef.current = onExpUpdate;
    onConcUpdateRef.current = onConcUpdate;
    onCashUpdateRef.current = onCashUpdate;
    setCashIQDRef.current = setCashIQD;
    setCashUSDRef.current = setCashUSD;
  });

  const dataHashRef = useRef({});
  const cashHashRef = useRef("");
  const personsHashRef = useRef("");
  const cashPollRef = useRef(null);
  const fullPollRef = useRef(null);
  const reloadingRef = useRef(false);

  useEffect(() => {
    if (!project) return;

    // ============ MAPPERS ============
    const expMapper = e => ({ id: e.id, date: e.date, amountIQD: e.amountiqd, amountUSD: e.amountusd, receiptNo: e.receiptno, note: e.note, marked: e.marked });

    const concMapper = c => ({ id: c.id, date: c.date, currency: c.currency, meters: c.meters, pricePerMeter: c.pricepermeter, totalPrice: c.totalprice, deposit: c.deposit, depositPercent: c.depositpercent, received: c.received, isReceived: c.isreceived, depositClaimed: c.depositclaimed, note: c.note, marked: c.marked, paidAmount: c.paidamount, payments: (() => { try { return Array.isArray(c.payments) ? c.payments : JSON.parse(c.payments || "[]"); } catch (e) { return []; } })() });

    const loanMapper = l => ({ id: l.id, date: l.date, type: l.type, personName: l.personname, amountIQD: l.amountiqd, amountUSD: l.amountusd, note: l.note, returned: l.returned, marked: l.marked });

    const contrMapper = c => ({ id: c.id, date: c.date, type: c.type, personName: c.personname, amountIQD: c.amountiqd, amountUSD: c.amountusd, note: c.note, marked: c.marked });

    const invMapper = i => ({ id: i.id, date: i.date, invoiceNo: i.invoiceno, currency: i.currency, billTo: i.billto, billPhone: i.billphone, items: (() => { try { return Array.isArray(i.items) ? i.items : JSON.parse(i.items || "[]"); } catch (e) { return []; } })(), total: i.total, marked: i.marked });

    // ============ HASH HELPER ============
    const hashRows = (rows) => {
      if (!Array.isArray(rows)) return "";
      return rows.length + ":" + rows.map(r => JSON.stringify(r)).sort().join("|").length;
    };

    // ============ FETCH TABLE ============
    const fetchTable = async (table, localKey, mapper) => {
      if (reloadingRef.current) return;
      try {
        const { data, error } = await supabase.from(table).select("*").eq("project", project);
        if (error || !data) return;

        const hash = hashRows(data);
        if (hash === dataHashRef.current[table]) return;
        dataHashRef.current[table] = hash;

        localStorage.setItem(localKey + project, JSON.stringify(data.map(mapper)));
        window.dispatchEvent(new Event("karoDataUpdate"));
      } catch (e) {
        console.error("[RealtimeSync] fetchTable error:", table, e);
      }
    };

    // ============ FETCH CASH ============
    const fetchCash = async () => {
      if (reloadingRef.current) return;
      try {
        const { data: cashData, error } = await supabase.from("cash").select("*").eq("project", project).maybeSingle();
        if (error) { console.error("[RealtimeSync] fetchCash error:", error); return; }
        if (!cashData) return;

        const realCashIQD = Number(cashData.cashiqd || 0);
        const realCashUSD = Number(cashData.cashusd || 0);
        const exchangeRate = cashData.exchangerate || 1500;
        const cashlog = cashData.cashlog || "[]";
        const formattedAt = cashData.formatted_at || "";

        // ⭐⭐⭐ FORMAT DETECTION (پشکنینی Format) ⭐⭐⭐
        if (formattedAt) {
          const localFormatted = localStorage.getItem("karo_formatted_" + project);
          
          if (localFormatted && localFormatted !== formattedAt) {
            console.log("[RealtimeSync] 🚨 FORMAT DETECTED — blocking AutoSync + reloading");
            
            // ⭐⭐⭐ گرنگ: یەکەم فلاگی Format دانێ — AutoSync یەکسەر بلۆک دەبێت
            window._karoFormatting = true;
            reloadingRef.current = true;
            
            // localStorage بە تەواوی پاک بکەرەوە
            localStorage.setItem("karo_formatted_" + project, formattedAt);
            localStorage.setItem("karo_exp_" + project, "[]");
            localStorage.setItem("karo_conc_" + project, "[]");
            localStorage.setItem("karo_loans_" + project, "[]");
            localStorage.setItem("karo_contr_" + project, "[]");
            localStorage.setItem("karo_inv_" + project, "[]");
            localStorage.setItem("karo_cashIQD_" + project, JSON.stringify(0));
            localStorage.setItem("karo_cashUSD_" + project, JSON.stringify(0));
            localStorage.setItem("karo_cashLog_" + project, "[]");
            
            // ٢٠٠ ملی چرکە چاوەڕێ، دواتر reload
            setTimeout(() => {
              window.location.reload();
            }, 200);
            return;
          }
          
          // یەکەم جار: تەنها save بکە
          if (!localFormatted) {
            localStorage.setItem("karo_formatted_" + project, formattedAt);
          }
        }

        const cashHash = realCashIQD + ":" + realCashUSD + ":" + exchangeRate + ":" + cashlog.length + ":" + formattedAt;

        if (cashHash === cashHashRef.current) return;
        cashHashRef.current = cashHash;

        localStorage.setItem("karo_cashIQD_" + project, JSON.stringify(realCashIQD));
        localStorage.setItem("karo_cashUSD_" + project, JSON.stringify(realCashUSD));

        if (cashData.cashlog) {
          localStorage.setItem("karo_cashLog_" + project, cashData.cashlog);
        }

        window._cashUpdatedByMe = false;

        if (onCashUpdateRef.current) {
          onCashUpdateRef.current({
            cashiqd: realCashIQD,
            cashusd: realCashUSD,
            exchangerate: exchangeRate,
            cashlog: cashlog
          });
        } else {
          if (setCashIQDRef.current) setCashIQDRef.current(realCashIQD);
          if (setCashUSDRef.current) setCashUSDRef.current(realCashUSD);
        }

        window.dispatchEvent(new Event("karoDataUpdate"));
      } catch (e) {
        console.error("[RealtimeSync] fetchCash error:", e);
      }
    };

    // ============ FETCH PERSONS ============
    const fetchPersons = async () => {
      if (reloadingRef.current) return;
      try {
        const { data } = await supabase.from("persons").select("*").eq("project", project);
        if (!data) return;

        const loanPersons = data.filter(p => p.type === "loan").map(p => p.name);
        const contrPersons = data.filter(p => p.type === "contractor").map(p => p.name);
        const hash = JSON.stringify(loanPersons) + "|" + JSON.stringify(contrPersons);

        if (hash === personsHashRef.current) return;
        personsHashRef.current = hash;

        localStorage.setItem("karo_loanPersons_" + project, JSON.stringify(loanPersons));
        localStorage.setItem("karo_contrPersons_" + project, JSON.stringify(contrPersons));
        window.dispatchEvent(new Event("karoDataUpdate"));
      } catch (e) {
        console.error("[RealtimeSync] fetchPersons error:", e);
      }
    };

    // ============ FETCH ALL ============
    const fetchAll = async () => {
      if (!navigator.onLine || reloadingRef.current) return;
      // ⭐ یەکەم cash بپشکنە — ئەگەر format بوو reload دەکات
      await fetchCash();
      if (reloadingRef.current) return;
      await Promise.all([
        fetchTable("expenses", "karo_exp_", expMapper),
        fetchTable("concrete", "karo_conc_", concMapper),
        fetchTable("loans", "karo_loans_", loanMapper),
        fetchTable("contractor", "karo_contr_", contrMapper),
        fetchTable("invoices", "karo_inv_", invMapper),
        fetchPersons()
      ]);
    };

    // ============ یەکەم بارکردن ============
    fetchAll();

    // ============ REALTIME SUBSCRIPTIONS ============
    const channelSuffix = "_" + Date.now();

    const expSub = supabase.channel("exp_rt_" + project + channelSuffix)
      .on("postgres_changes", { event: "*", schema: "public", table: "expenses", filter: "project=eq." + project },
        () => {
          fetchTable("expenses", "karo_exp_", expMapper);
          fetchCash();
        }).subscribe();

    const concSub = supabase.channel("conc_rt_" + project + channelSuffix)
      .on("postgres_changes", { event: "*", schema: "public", table: "concrete", filter: "project=eq." + project },
        () => {
          fetchTable("concrete", "karo_conc_", concMapper);
          fetchCash();
        }).subscribe();

    const loanSub = supabase.channel("loan_rt_" + project + channelSuffix)
      .on("postgres_changes", { event: "*", schema: "public", table: "loans", filter: "project=eq." + project },
        () => {
          fetchTable("loans", "karo_loans_", loanMapper);
          fetchCash();
        }).subscribe();

    const contrSub = supabase.channel("contr_rt_" + project + channelSuffix)
      .on("postgres_changes", { event: "*", schema: "public", table: "contractor", filter: "project=eq." + project },
        () => {
          fetchTable("contractor", "karo_contr_", contrMapper);
          fetchCash();
        }).subscribe();

    const invSub = supabase.channel("inv_rt_" + project + channelSuffix)
      .on("postgres_changes", { event: "*", schema: "public", table: "invoices", filter: "project=eq." + project },
        () => fetchTable("invoices", "karo_inv_", invMapper)).subscribe();

    const personsSub = supabase.channel("persons_rt_" + project + channelSuffix)
      .on("postgres_changes", { event: "*", schema: "public", table: "persons", filter: "project=eq." + project },
        () => fetchPersons()).subscribe();

    const cashSub = supabase.channel("cash_rt_" + project + channelSuffix)
      .on("postgres_changes", { event: "*", schema: "public", table: "cash", filter: "project=eq." + project },
        () => fetchCash()).subscribe();

    // ============ POLLING FALLBACK ============
    cashPollRef.current = setInterval(() => {
      if (navigator.onLine && document.visibilityState === "visible" && !reloadingRef.current) {
        fetchCash();
      }
    }, 2000);

    fullPollRef.current = setInterval(() => {
      if (navigator.onLine && document.visibilityState === "visible" && !reloadingRef.current) {
        fetchAll();
      }
    }, 5000);

    // ============ VISIBILITY CHANGE ============
    const onVisibility = () => {
      if (document.visibilityState === "visible" && navigator.onLine && !reloadingRef.current) {
        fetchAll();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    // ============ ONLINE EVENT ============
    const onOnline = () => {
      if (reloadingRef.current) return;
      console.log("[RealtimeSync] online — fetching all");
      fetchAll();
    };
    window.addEventListener("online", onOnline);

    // ============ CLEANUP ============
    return () => {
      if (cashPollRef.current) clearInterval(cashPollRef.current);
      if (fullPollRef.current) clearInterval(fullPollRef.current);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("online", onOnline);
      supabase.removeChannel(expSub);
      supabase.removeChannel(concSub);
      supabase.removeChannel(loanSub);
      supabase.removeChannel(contrSub);
      supabase.removeChannel(invSub);
      supabase.removeChannel(personsSub);
      supabase.removeChannel(cashSub);
    };
  }, [project]);

  return null;
}
