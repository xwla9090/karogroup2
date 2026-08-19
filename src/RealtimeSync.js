/* ============================================================================
   REALTIME SYNC  (v3)
   ----------------------------------------------------------------------------
   • گۆڕانکاری لە ئامێرێکی تر یەکسەر جێبەجێ دەبێت — بە payload ـی Realtime
     خۆی، بەبێ هیچ fetch ـێکی زیادە. (دواکەوتن ≈ ٥٠–٢٠٠ms)
   • هیچ فلاگی بلۆککەری گشتی (_karoLocal) نییە. پاراستن لە ڕێگەی
     pending-queue ـی sync.js دەکرێت، کە وردترە و ڕیز-بە-ڕیزە.
   • هیچ کاتێک localStorage بە تەواوی لە جیاتی داتای سێرڤەر دانانرێت —
     هەمیشە MERGE دەکرێت.
   ========================================================================== */

import { useEffect, useRef } from "react";
import { supabase } from "./supabase";
import {
  SYNCED_TABLES, TABLES,
  applyRemoteRow, applyRemoteDelete,
  reconcileAll, flush, flushCashQueue, emitUpdate, cashBusy
} from "./sync";

const RECONCILE_MS = 45000;   // تۆڕی سەلامەتی
const CASH_POLL_MS = 20000;

export default function RealtimeSync({ project, onCashUpdate, setCashIQD, setCashUSD, setExchangeRate }) {
  const onCashUpdateRef = useRef(onCashUpdate);
  const setCashIQDRef = useRef(setCashIQD);
  const setCashUSDRef = useRef(setCashUSD);
  const setRateRef = useRef(setExchangeRate);

  useEffect(() => {
    onCashUpdateRef.current = onCashUpdate;
    setCashIQDRef.current = setCashIQD;
    setCashUSDRef.current = setCashUSD;
    setRateRef.current = setExchangeRate;
  });

  const cashSigRef = useRef("");
  const personsSigRef = useRef("");
  const reloadingRef = useRef(false);

  useEffect(() => {
    if (!project) return;
    reloadingRef.current = false;

    /* ================= CASH ================= */
    const applyCash = (row) => {
      if (!row || reloadingRef.current) return;

      /* ---- پشکنینی Format ---- */
      const formattedAt = row.formatted_at || "";
      if (formattedAt) {
        const localFormatted = localStorage.getItem("karo_formatted_" + project);
        if (localFormatted && localFormatted !== formattedAt) {
          console.log("[RealtimeSync] 🚨 FORMAT DETECTED — clearing local + reload");
          reloadingRef.current = true;
          window._karoFormatting = true;
          localStorage.setItem("karo_formatted_" + project, formattedAt);
          SYNCED_TABLES.forEach(t => localStorage.setItem(TABLES[t].lsKey + project, "[]"));
          localStorage.setItem("karo_cashIQD_" + project, "0");
          localStorage.setItem("karo_cashUSD_" + project, "0");
          localStorage.setItem("karo_cashLog_" + project, "[]");
          /* ڕیزی چاوەڕوان و tombstone ـەکانیش پاک بکەرەوە — ئەگینا
             پاش Format داتای کۆن دیسان دەنێردرێتەوە */
          localStorage.removeItem("karo_pending_v3");
          localStorage.removeItem("karo_tomb_v3");
          localStorage.removeItem("karo_cashq_v3");
          setTimeout(() => window.location.reload(), 1500);
          return;
        }
        if (!localFormatted) localStorage.setItem("karo_formatted_" + project, formattedAt);
      }

      /* ---- ئەگەر delta ـێکی خۆمان لە ڕێگادایە، چاوەڕێ بکە ----
         (RPC ـەکە خۆی نرخی دروست دەگەڕێنێتەوە و دایدەنێت) */
      if (cashBusy()) return;

      const iqd = Number(row.cashiqd || 0);
      const usd = Number(row.cashusd || 0);
      const rate = Number(row.exchangerate || 0) || 1500;
      const log = row.cashlog == null ? null : row.cashlog;

      const sig = iqd + ":" + usd + ":" + rate + ":" + (typeof log === "string" ? log.length : 0);
      if (sig === cashSigRef.current) return;
      cashSigRef.current = sig;

      localStorage.setItem("karo_cashIQD_" + project, JSON.stringify(iqd));
      localStorage.setItem("karo_cashUSD_" + project, JSON.stringify(usd));
      localStorage.setItem("karo_rate_" + project, JSON.stringify(rate));
      if (log != null) {
        localStorage.setItem("karo_cashLog_" + project,
          typeof log === "string" ? log : JSON.stringify(log));
      }

      if (onCashUpdateRef.current) {
        onCashUpdateRef.current({ cashiqd: iqd, cashusd: usd, exchangerate: rate, cashlog: log });
      } else {
        if (setCashIQDRef.current) setCashIQDRef.current(iqd);
        if (setCashUSDRef.current) setCashUSDRef.current(usd);
        if (setRateRef.current) setRateRef.current(rate);
      }
      emitUpdate();
    };

    /* sync.js پاش هەر RPC ـێکی قاسە ئەمە بانگ دەکات */
    window.__karoOnCashFromServer = (c) => {
      cashSigRef.current = "";
      if (onCashUpdateRef.current) onCashUpdateRef.current(c);
      else {
        if (setCashIQDRef.current) setCashIQDRef.current(c.cashiqd);
        if (setCashUSDRef.current) setCashUSDRef.current(c.cashusd);
      }
    };

    const fetchCash = async () => {
      if (reloadingRef.current || !navigator.onLine) return;
      try {
        const { data, error } = await supabase.from("cash").select("*")
          .eq("project", project).maybeSingle();
        if (error || !data) return;
        applyCash(data);
      } catch (e) { /* بێدەنگ — polling دواتر دووبارە هەوڵ دەدات */ }
    };

    /* ================= PERSONS ================= */
    const fetchPersons = async () => {
      if (reloadingRef.current || !navigator.onLine) return;
      try {
        const { data } = await supabase.from("persons").select("*").eq("project", project);
        if (!data) return;
        const loanP = data.filter(p => p.type === "loan").map(p => p.name);
        const contrP = data.filter(p => p.type === "contractor").map(p => p.name);
        const sig = JSON.stringify(loanP) + "|" + JSON.stringify(contrP);
        if (sig === personsSigRef.current) return;
        personsSigRef.current = sig;
        localStorage.setItem("karo_loanPersons_" + project, JSON.stringify(loanP));
        localStorage.setItem("karo_contrPersons_" + project, JSON.stringify(contrP));
        emitUpdate();
      } catch (e) {}
    };

    /* ================= یەکەم بارکردن ================= */
    let alive = true;
    (async () => {
      await fetchCash();
      if (!alive || reloadingRef.current) return;
      await reconcileAll(project);
      if (!alive) return;
      await fetchPersons();
      emitUpdate();
    })();

    /* ================= REALTIME (دەستبەجێ) ================= */
    const chans = [];
    const suffix = "_" + project + "_" + Date.now();

    for (const table of SYNCED_TABLES) {
      const ch = supabase
        .channel(table + "_rt" + suffix)
        .on("postgres_changes",
          { event: "*", schema: "public", table, filter: "project=eq." + project },
          (payload) => {
            if (reloadingRef.current) return;
            let changed = false;
            if (payload.eventType === "DELETE") {
              const id = payload.old && payload.old.id;
              if (id != null) changed = applyRemoteDelete(table, project, id);
            } else if (payload.new) {
              /* ⭐ ڕاستەوخۆ لە payload ـەوە — هیچ fetch ـێکی زیادە نییە */
              changed = applyRemoteRow(table, project, payload.new);
            }
            if (changed) emitUpdate();
          })
        .subscribe();
      chans.push(ch);
    }

    const cashCh = supabase
      .channel("cash_rt" + suffix)
      .on("postgres_changes",
        { event: "*", schema: "public", table: "cash", filter: "project=eq." + project },
        (payload) => { if (payload.new) applyCash(payload.new); })
      .subscribe();
    chans.push(cashCh);

    const personsCh = supabase
      .channel("persons_rt" + suffix)
      .on("postgres_changes",
        { event: "*", schema: "public", table: "persons", filter: "project=eq." + project },
        () => fetchPersons())
      .subscribe();
    chans.push(personsCh);

    /* ================= تۆڕی سەلامەتی =================
       ئەگەر WebSocket بکەوێت (مۆبایل، تۆڕی لاواز)، ئەمانە
       دەستبەجێ داتاکە دەگەڕێننەوە بۆ ڕێکخستن. */
    const cashPoll = setInterval(() => {
      if (navigator.onLine && document.visibilityState === "visible") fetchCash();
    }, CASH_POLL_MS);

    const fullPoll = setInterval(() => {
      if (navigator.onLine && document.visibilityState === "visible" && !reloadingRef.current) {
        reconcileAll(project);
        fetchPersons();
      }
    }, RECONCILE_MS);

    const onVisibility = () => {
      if (document.visibilityState === "visible" && navigator.onLine && !reloadingRef.current) {
        flush(); flushCashQueue();
        fetchCash();
        reconcileAll(project);
        fetchPersons();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onOnline = () => {
      if (reloadingRef.current) return;
      flush(); flushCashQueue();
      fetchCash();
      reconcileAll(project);
    };
    window.addEventListener("online", onOnline);

    return () => {
      alive = false;
      clearInterval(cashPoll);
      clearInterval(fullPoll);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("online", onOnline);
      if (window.__karoOnCashFromServer) delete window.__karoOnCashFromServer;
      chans.forEach(c => { try { supabase.removeChannel(c); } catch (e) {} });
    };
  }, [project]);

  return null;
}
