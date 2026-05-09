import { useEffect, useRef } from "react";
import { supabase } from "./supabase";

// ============ HELPERS ============
function getLS(k) { try { var v = JSON.parse(localStorage.getItem(k)); return Array.isArray(v) ? v : []; } catch (e) { return []; } }
function N(v) { return Number(v) ? Number(v) : 0; }
function S(v) { return v ? String(v) : ""; }
function B(v) { return v ? true : false; }

// ============ OFFLINE QUEUE ============
const QUEUE_KEY = "karo_sync_queue_v2";

function getQueue() {
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]"); } catch (e) { return []; }
}

function saveQueue(q) {
  try { localStorage.setItem(QUEUE_KEY, JSON.stringify(q)); } catch (e) {}
}

function addToQueue(op) {
  const q = getQueue();
  q.push({ ...op, qid: Math.random().toString(36).slice(2) + Date.now(), tries: 0, ts: Date.now() });
  saveQueue(q);
}

async function flushQueue() {
  if (!navigator.onLine) return { flushed: 0, remaining: getQueue().length };

  let q = getQueue();
  if (q.length === 0) return { flushed: 0, remaining: 0 };

  console.log("[AutoSync] flushing queue, items:", q.length);
  const remaining = [];
  let flushed = 0;

  for (const item of q) {
    try {
      let result;
      if (item.action === "upsert") {
        result = await supabase.from(item.table).upsert(item.data);
      } else if (item.action === "insert") {
        result = await supabase.from(item.table).insert(item.data);
      } else if (item.action === "delete") {
        result = await supabase.from(item.table).delete().eq(item.column, item.value);
      }
      if (result && result.error) throw result.error;
      flushed++;
    } catch (e) {
      console.error("[AutoSync] queue item failed:", e);
      item.tries = (item.tries || 0) + 1;
      if (item.tries < 5) remaining.push(item);
    }
  }

  saveQueue(remaining);
  return { flushed, remaining: remaining.length };
}

if (typeof window !== "undefined") {
  window.__karoSync = {
    addToQueue,
    flushQueue,
    getQueue,
    upsertOrQueue: async (table, data) => {
      try {
        if (!navigator.onLine) {
          addToQueue({ action: "upsert", table, data });
          return { error: null, queued: true };
        }
        const result = await supabase.from(table).upsert(data);
        if (result.error) {
          addToQueue({ action: "upsert", table, data });
        }
        return result;
      } catch (e) {
        addToQueue({ action: "upsert", table, data });
        return { error: e, queued: true };
      }
    },
    insertOrQueue: async (table, data) => {
      try {
        if (!navigator.onLine) {
          addToQueue({ action: "insert", table, data });
          return { error: null, queued: true };
        }
        const result = await supabase.from(table).insert(data);
        if (result.error) {
          addToQueue({ action: "insert", table, data });
        }
        return result;
      } catch (e) {
        addToQueue({ action: "insert", table, data });
        return { error: e, queued: true };
      }
    },
    deleteOrQueue: async (table, column, value) => {
      try {
        if (!navigator.onLine) {
          addToQueue({ action: "delete", table, column, value });
          return { error: null, queued: true };
        }
        const result = await supabase.from(table).delete().eq(column, value);
        if (result.error) {
          addToQueue({ action: "delete", table, column, value });
        }
        return result;
      } catch (e) {
        addToQueue({ action: "delete", table, column, value });
        return { error: e, queued: true };
      }
    }
  };
}

// ============ MAIN COMPONENT ============
export default function AutoSync({ project, cashIQD, cashUSD, exchangeRate, users }) {
  const lastHash = useRef("");
  const isReady = useRef(false);

  useEffect(() => {
    if (!project) return;

    const readyTimer = setTimeout(() => { isReady.current = true; }, 5000);

    const doSync = async () => {
      if (!isReady.current) return;
      if (!navigator.onLine) return;
      
      // ⭐⭐⭐ یەکەم: ئەگەر format لە ئارادایە (لەم browser-ـەدا)، هیچ مەکە ⭐⭐⭐
      if (window._karoFormatting) {
        console.log("[AutoSync] 🚨 format in progress — skipping");
        return;
      }

      try {
        // ⭐⭐⭐ هەنگاوی ١: یەکەم پشکنینی formatted_at — پێش هەر شتێک ⭐⭐⭐
        // ئەمە دەگرێت لە race condition: ئەگەر کاربەرێکی تر Format-ی کردبێت،
        // ئێمە **هیچ** upload مەکەین تا داتاکانیان نەدزێینەوە
        try {
          const { data: cashCheck } = await supabase.from("cash")
            .select("formatted_at")
            .eq("project", project)
            .maybeSingle();
          
          if (cashCheck && cashCheck.formatted_at) {
            const localFormatted = localStorage.getItem("karo_formatted_" + project);
            if (localFormatted && localFormatted !== cashCheck.formatted_at) {
              console.log("[AutoSync] 🚨 FORMAT DETECTED — aborting all uploads");
              // هیچ مەکە — RealtimeSync دواتر page-ـە reload دەکات
              return;
            }
            // ئەگەر یەکەم جار بێت، formatted_at-ـی local تۆمار بکە
            if (!localFormatted) {
              localStorage.setItem("karo_formatted_" + project, cashCheck.formatted_at);
            }
          }
        } catch (e) { console.error("[AutoSync] format check error:", e); }

        // ⭐ هەنگاوی ٢: queue-ی pending writes flush بکە
        await flushQueue();

        var exp = getLS("karo_exp_" + project);
        var conc = getLS("karo_conc_" + project);
        var loans = getLS("karo_loans_" + project);
        var contr = getLS("karo_contr_" + project);
        var inv = getLS("karo_inv_" + project);
        var cashLogData = [];
        try { cashLogData = JSON.parse(localStorage.getItem("karo_cashLog_" + project) || "[]"); } catch (e) {}
        var uLen = users ? users.length : 0;
        var hash = exp.length + "" + conc.length + "" + loans.length + "" + contr.length + "" + inv.length + "" + cashIQD + "" + cashUSD + "" + uLen + "" + cashLogData.length;
        if (hash === lastHash.current) return;
        lastHash.current = hash;

        if (loans.length > 0) {
          var rows3 = [];
          for (var l = 0; l < loans.length; l++) {
            var ln = loans[l];
            rows3.push({ id: ln.id, project: project, date: S(ln.date), type: S(ln.type), personname: S(ln.personName), amountiqd: N(ln.amountIQD), amountusd: N(ln.amountUSD), note: S(ln.note), returned: B(ln.returned), marked: B(ln.marked) });
          }
          await supabase.from("loans").upsert(rows3);
        }

        if (contr.length > 0) {
          var rows4 = [];
          for (var ct = 0; ct < contr.length; ct++) {
            var cn = contr[ct];
            rows4.push({ id: cn.id, project: project, date: S(cn.date), type: S(cn.type), personname: S(cn.personName), amountiqd: N(cn.amountIQD), amountusd: N(cn.amountUSD), note: S(cn.note), marked: B(cn.marked) });
          }
          await supabase.from("contractor").upsert(rows4);
        }

        if (inv.length > 0) {
          var rows5 = [];
          for (var iv = 0; iv < inv.length; iv++) {
            var invoice = inv[iv];
            rows5.push({ id: invoice.id, project: project, date: S(invoice.date), invoiceno: S(invoice.invoiceNo), currency: S(invoice.currency), billto: S(invoice.billTo), billphone: S(invoice.billPhone), items: JSON.stringify(invoice.items || []), total: N(invoice.total), marked: B(invoice.marked) });
          }
          await supabase.from("invoices").upsert(rows5);
        }

        // ⭐ پێش ئەوەی cash upsert بکەین، یەک پشکنینی تر بکەین
        // (لەوانەیە لەو ماوەی نێوانەی پێشوو format ڕوویداوە)
        if (window._karoFormatting) return;

        await supabase.from("cash").upsert([{ id: project, project: project, cashiqd: cashIQD, cashusd: cashUSD, exchangerate: exchangeRate, cashlog: JSON.stringify(cashLogData), formatted_at: localStorage.getItem("karo_formatted_" + project) || "" }]);

        // ⭐ cashLog → cash_history sync (offline-resilience)
        if (cashLogData.length > 0) {
          try {
            const { data: histData } = await supabase.from("cash_history").select("id").eq("project", project);
            const remoteIds = new Set((histData || []).map(h => h.id));
            const toInsert = cashLogData
              .filter(log => log.id && !remoteIds.has(log.id))
              .map(log => ({
                id: log.id,
                project: project,
                amountiqd: N(log.iqd),
                amountusd: N(log.usd),
                note: S(log.desc || "")
              }));
            if (toInsert.length > 0) {
              console.log("[AutoSync] healing cash_history, inserting:", toInsert.length);
              await supabase.from("cash_history").insert(toInsert);
            }
          } catch (e) { console.error("[AutoSync] cash_history heal error:", e); }
        }

        if (users && users.length > 0) {
          for (var m = 0; m < users.length; m++) {
            var u = users[m];
            await supabase.from("users").upsert([{ username: u.username, password: u.password, project: u.project, label: u.label, isadmin: B(u.isAdmin), isfrozen: B(u.isFrozen) }]);
          }
          var dbUsers = await supabase.from("users").select("username");
          if (dbUsers.data) {
            var localNames = users.map(function (u) { return u.username; });
            for (var n = 0; n < dbUsers.data.length; n++) {
              if (localNames.indexOf(dbUsers.data[n].username) === -1) {
                await supabase.from("users").delete().eq("username", dbUsers.data[n].username);
              }
            }
          }
        }

      } catch (err) { console.error("[AutoSync] sync error:", err); }
    };

    var firstSync = setTimeout(doSync, 6000);
    var interval = setInterval(doSync, 60000);

    const onOnline = async () => {
      console.log("[AutoSync] online — immediate sync");
      await flushQueue();
      doSync();
    };
    window.addEventListener("online", onOnline);

    const onFocus = () => {
      if (navigator.onLine) {
        flushQueue();
      }
    };
    window.addEventListener("focus", onFocus);

    return () => {
      clearTimeout(readyTimer);
      clearTimeout(firstSync);
      clearInterval(interval);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("focus", onFocus);
    };
  }, [project, cashIQD, cashUSD, exchangeRate, users]);

  return null;
}
