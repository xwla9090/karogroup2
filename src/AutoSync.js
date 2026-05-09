import { useEffect, useRef } from "react";
import { supabase } from "./supabase";

// ============ HELPERS ============
function getLS(k) { try { var v = JSON.parse(localStorage.getItem(k)); return Array.isArray(v) ? v : []; } catch (e) { return []; } }
function N(v) { return Number(v) ? Number(v) : 0; }
function S(v) { return v ? String(v) : ""; }
function B(v) { return v ? true : false; }

// ============ OFFLINE QUEUE ============
const QUEUE_KEY = "karo_sync_queue_v2";
function getQueue() { try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]"); } catch (e) { return []; } }
function saveQueue(q) { try { localStorage.setItem(QUEUE_KEY, JSON.stringify(q)); } catch (e) {} }
function addToQueue(op) {
  const q = getQueue();
  q.push({ ...op, qid: Math.random().toString(36).slice(2) + Date.now(), tries: 0, ts: Date.now() });
  saveQueue(q);
}
async function flushQueue() {
  if (!navigator.onLine) return { flushed: 0, remaining: getQueue().length };
  let q = getQueue();
  if (q.length === 0) return { flushed: 0, remaining: 0 };
  const remaining = [];
  let flushed = 0;
  for (const item of q) {
    try {
      let result;
      if (item.action === "upsert") result = await supabase.from(item.table).upsert(item.data);
      else if (item.action === "insert") result = await supabase.from(item.table).insert(item.data);
      else if (item.action === "delete") result = await supabase.from(item.table).delete().eq(item.column, item.value);
      if (result && result.error) throw result.error;
      flushed++;
    } catch (e) {
      item.tries = (item.tries || 0) + 1;
      if (item.tries < 5) remaining.push(item);
    }
  }
  saveQueue(remaining);
  return { flushed, remaining: remaining.length };
}

if (typeof window !== "undefined") {
  window.__karoSync = {
    addToQueue, flushQueue, getQueue,
    upsertOrQueue: async (table, data) => {
      try {
        if (!navigator.onLine) { addToQueue({ action: "upsert", table, data }); return { error: null, queued: true }; }
        const result = await supabase.from(table).upsert(data);
        if (result.error) addToQueue({ action: "upsert", table, data });
        return result;
      } catch (e) { addToQueue({ action: "upsert", table, data }); return { error: e, queued: true }; }
    },
    insertOrQueue: async (table, data) => {
      try {
        if (!navigator.onLine) { addToQueue({ action: "insert", table, data }); return { error: null, queued: true }; }
        const result = await supabase.from(table).insert(data);
        if (result.error) addToQueue({ action: "insert", table, data });
        return result;
      } catch (e) { addToQueue({ action: "insert", table, data }); return { error: e, queued: true }; }
    },
    deleteOrQueue: async (table, column, value) => {
      try {
        if (!navigator.onLine) { addToQueue({ action: "delete", table, column, value }); return { error: null, queued: true }; }
        const result = await supabase.from(table).delete().eq(column, value);
        if (result.error) addToQueue({ action: "delete", table, column, value });
        return result;
      } catch (e) { addToQueue({ action: "delete", table, column, value }); return { error: e, queued: true }; }
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

    // ⭐ helper بۆ پشکنینی فلاگ — لە چەند شوێن بانگ دەکرێت
    const isFormatting = () => window._karoFormatting === true;

    const doSync = async () => {
      if (!isReady.current) return;
      if (!navigator.onLine) return;
      if (isFormatting()) { console.log("[AutoSync] 🚨 format flag set — skipping"); return; }

      try {
        // ⭐⭐⭐ هەنگاوی ١: یەکەم پشکنینی formatted_at لە سێرڤەر ⭐⭐⭐
        let supabaseFormattedAtStart = null;
        try {
          const { data: cashCheck } = await supabase.from("cash").select("formatted_at").eq("project", project).maybeSingle();
          if (cashCheck) {
            supabaseFormattedAtStart = cashCheck.formatted_at || "";
            const localFormatted = localStorage.getItem("karo_formatted_" + project) || "";
            if (supabaseFormattedAtStart && localFormatted && localFormatted !== supabaseFormattedAtStart) {
              console.log("[AutoSync] 🚨 FORMAT DETECTED at start — aborting");
              return;
            }
            // یەکەم جار ـ تەنها save بکە
            if (!localFormatted && supabaseFormattedAtStart) {
              localStorage.setItem("karo_formatted_" + project, supabaseFormattedAtStart);
            }
          }
        } catch (e) { console.error("[AutoSync] format check error:", e); }

        // ⭐ Queue flush
        await flushQueue();
        if (isFormatting()) return;

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

        // ⭐ پشکنین پێش هەر upsert
        if (loans.length > 0 && !isFormatting()) {
          var rows3 = loans.map(ln => ({ id: ln.id, project: project, date: S(ln.date), type: S(ln.type), personname: S(ln.personName), amountiqd: N(ln.amountIQD), amountusd: N(ln.amountUSD), note: S(ln.note), returned: B(ln.returned), marked: B(ln.marked) }));
          await supabase.from("loans").upsert(rows3);
        }

        if (contr.length > 0 && !isFormatting()) {
          var rows4 = contr.map(cn => ({ id: cn.id, project: project, date: S(cn.date), type: S(cn.type), personname: S(cn.personName), amountiqd: N(cn.amountIQD), amountusd: N(cn.amountUSD), note: S(cn.note), marked: B(cn.marked) }));
          await supabase.from("contractor").upsert(rows4);
        }

        if (inv.length > 0 && !isFormatting()) {
          var rows5 = inv.map(invoice => ({ id: invoice.id, project: project, date: S(invoice.date), invoiceno: S(invoice.invoiceNo), currency: S(invoice.currency), billto: S(invoice.billTo), billphone: S(invoice.billPhone), items: JSON.stringify(invoice.items || []), total: N(invoice.total), marked: B(invoice.marked) }));
          await supabase.from("invoices").upsert(rows5);
        }

        // ⭐⭐⭐ گرنگترین چارەسەر: ATOMIC CONDITIONAL UPDATE بۆ cash ⭐⭐⭐
        // ئەگەر formatted_at لە سێرڤەر گۆڕاوە (واتە کاربەرێکی تر Format ی کردووە)،
        // ئەو کاتە UPDATE هیچ نانووسێتەوە چونکە eq(formatted_at, localFormatted) match ناکات
        if (!isFormatting()) {
          try {
            const localFormatted = localStorage.getItem("karo_formatted_" + project) || "";
            
            // یەکەم: پشکنین cash row هەیە یان نا
            const { data: existingCash } = await supabase.from("cash").select("formatted_at").eq("project", project).maybeSingle();
            
            if (!existingCash) {
              // Row نییە — INSERT بکە
              await supabase.from("cash").insert([{
                id: project,
                project: project,
                cashiqd: cashIQD,
                cashusd: cashUSD,
                exchangerate: exchangeRate,
                cashlog: JSON.stringify(cashLogData),
                formatted_at: localFormatted
              }]);
            } else {
              const supabaseFormatted = existingCash.formatted_at || "";
              
              if (supabaseFormatted !== localFormatted) {
                // Format ڕوویداوە — هیچ مەکە
                console.log("[AutoSync] 🚨 Format detected before cash UPDATE — aborting");
                return;
              }
              
              // ⭐ ATOMIC UPDATE — تەنیا ئەگەر formatted_at هێشتا یەکسانە
              // ئەگەر کاربەرێکی تر لەو کاتەدا Format بکات، ئەم UPDATE هیچ نانووسێتەوە
              const { error: updateError } = await supabase
                .from("cash")
                .update({
                  cashiqd: cashIQD,
                  cashusd: cashUSD,
                  exchangerate: exchangeRate,
                  cashlog: JSON.stringify(cashLogData)
                })
                .eq("project", project)
                .eq("formatted_at", supabaseFormatted);
              
              if (updateError) console.error("[AutoSync] cash update error:", updateError);
            }
          } catch (e) { console.error("[AutoSync] cash sync error:", e); }
        }

        // cashLog → cash_history sync
        if (cashLogData.length > 0 && !isFormatting()) {
          try {
            const { data: histData } = await supabase.from("cash_history").select("id").eq("project", project);
            const remoteIds = new Set((histData || []).map(h => h.id));
            const toInsert = cashLogData
              .filter(log => log.id && !remoteIds.has(log.id))
              .map(log => ({ id: log.id, project: project, amountiqd: N(log.iqd), amountusd: N(log.usd), note: S(log.desc || "") }));
            if (toInsert.length > 0 && !isFormatting()) {
              await supabase.from("cash_history").insert(toInsert);
            }
          } catch (e) { console.error("[AutoSync] cash_history heal error:", e); }
        }

        if (users && users.length > 0 && !isFormatting()) {
          for (var m = 0; m < users.length; m++) {
            if (isFormatting()) break;
            var u = users[m];
            await supabase.from("users").upsert([{ username: u.username, password: u.password, project: u.project, label: u.label, isadmin: B(u.isAdmin), isfrozen: B(u.isFrozen) }]);
          }
          if (!isFormatting()) {
            var dbUsers = await supabase.from("users").select("username");
            if (dbUsers.data) {
              var localNames = users.map(u => u.username);
              for (var n = 0; n < dbUsers.data.length; n++) {
                if (isFormatting()) break;
                if (localNames.indexOf(dbUsers.data[n].username) === -1) {
                  await supabase.from("users").delete().eq("username", dbUsers.data[n].username);
                }
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
      if (isFormatting()) return;
      await flushQueue();
      doSync();
    };
    window.addEventListener("online", onOnline);

    const onFocus = () => {
      if (navigator.onLine && !isFormatting()) flushQueue();
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
