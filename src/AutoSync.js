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

    const isFormatting = () => window._karoFormatting === true;

    // ⭐⭐⭐ ATOMIC CONDITIONAL UPDATE - پشکنینی formatted_at پێش هەر upsert ⭐⭐⭐
    // ئەگەر formatted_at گۆڕابێت لە کاتێکدا کە ئێمە کارمان دەکرد، false دەگەڕێنێتەوە
    const verifyFormatStillSame = async (capturedFmt) => {
      try {
        const { data } = await supabase.from("cash").select("formatted_at").eq("project", project).maybeSingle();
        if (!data) return true;
        const currentFmt = data.formatted_at || "";
        return currentFmt === capturedFmt;
      } catch (e) { return true; }
    };

    const doSync = async () => {
      if (!isReady.current) return;
      if (!navigator.onLine) return;
      if (isFormatting()) { console.log("[AutoSync] 🚨 format flag set — skipping"); return; }

      try {
        // هەنگاوی ١: formatted_at لە سێرڤەر بگرە
        let capturedFormatted = "";
        try {
          const { data: cashCheck } = await supabase.from("cash").select("formatted_at").eq("project", project).maybeSingle();
          if (cashCheck) {
            capturedFormatted = cashCheck.formatted_at || "";
            const localFormatted = localStorage.getItem("karo_formatted_" + project) || "";
            if (capturedFormatted && localFormatted && localFormatted !== capturedFormatted) {
              console.log("[AutoSync] 🚨 FORMAT DETECTED at start — aborting");
              return;
            }
            if (!localFormatted && capturedFormatted) {
              localStorage.setItem("karo_formatted_" + project, capturedFormatted);
            }
          }
        } catch (e) { console.error("[AutoSync] format check error:", e); }

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

        // ⭐⭐⭐ پێش هەر upsert: دیسان formatted_at پشکنین بکە ⭐⭐⭐
        
        if (loans.length > 0 && !isFormatting()) {
          if (!(await verifyFormatStillSame(capturedFormatted))) {
            console.log("[AutoSync] 🚨 format detected before loans — aborting");
            return;
          }
          var rows3 = loans.map(ln => ({ id: ln.id, project: project, date: S(ln.date), type: S(ln.type), personname: S(ln.personName), amountiqd: N(ln.amountIQD), amountusd: N(ln.amountUSD), note: S(ln.note), returned: B(ln.returned), marked: B(ln.marked) }));
          await supabase.from("loans").upsert(rows3);
        }

        if (contr.length > 0 && !isFormatting()) {
          if (!(await verifyFormatStillSame(capturedFormatted))) {
            console.log("[AutoSync] 🚨 format detected before contractor — aborting");
            return;
          }
          var rows4 = contr.map(cn => ({ id: cn.id, project: project, date: S(cn.date), type: S(cn.type), personname: S(cn.personName), amountiqd: N(cn.amountIQD), amountusd: N(cn.amountUSD), note: S(cn.note), marked: B(cn.marked) }));
          await supabase.from("contractor").upsert(rows4);
        }

        if (inv.length > 0 && !isFormatting()) {
          if (!(await verifyFormatStillSame(capturedFormatted))) {
            console.log("[AutoSync] 🚨 format detected before invoices — aborting");
            return;
          }
          var rows5 = inv.map(invoice => ({ id: invoice.id, project: project, date: S(invoice.date), invoiceno: S(invoice.invoiceNo), currency: S(invoice.currency), billto: S(invoice.billTo), billphone: S(invoice.billPhone), items: JSON.stringify(invoice.items || []), total: N(invoice.total), marked: B(invoice.marked) }));
          await supabase.from("invoices").upsert(rows5);
        }

        if (exp.length > 0 && !isFormatting()) {
          if (!(await verifyFormatStillSame(capturedFormatted))) {
            console.log("[AutoSync] 🚨 format detected before expenses — aborting");
            return;
          }
          var rows1 = exp.map(e => ({ id: e.id, project: project, date: S(e.date), amountiqd: N(e.amountIQD), amountusd: N(e.amountUSD), receiptno: S(e.receiptNo), note: S(e.note), marked: B(e.marked) }));
          await supabase.from("expenses").upsert(rows1);
        }

        if (conc.length > 0 && !isFormatting()) {
          if (!(await verifyFormatStillSame(capturedFormatted))) {
            console.log("[AutoSync] 🚨 format detected before concrete — aborting");
            return;
          }
          var rows2 = conc.map(c => ({ id: c.id, project: project, date: S(c.date), currency: S(c.currency || "iqd"), meters: N(c.meters), pricepermeter: N(c.pricePerMeter), totalprice: N(c.totalPrice), deposit: N(c.deposit), depositpercent: N(c.depositPercent), received: N(c.received), isreceived: B(c.isReceived), depositclaimed: B(c.depositClaimed), note: S(c.note), marked: B(c.marked), paidamount: N(c.paidAmount), payments: JSON.stringify(c.payments || []) }));
          await supabase.from("concrete").upsert(rows2);
        }

        // ⭐⭐⭐ ATOMIC CONDITIONAL UPDATE بۆ cash ⭐⭐⭐
        if (!isFormatting()) {
          try {
            const localFormatted = localStorage.getItem("karo_formatted_" + project) || "";
            const { data: existingCash } = await supabase.from("cash").select("formatted_at").eq("project", project).maybeSingle();
            
            if (!existingCash) {
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
                console.log("[AutoSync] 🚨 Format detected before cash UPDATE — aborting");
                return;
              }
              
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

        if (cashLogData.length > 0 && !isFormatting()) {
          if (!(await verifyFormatStillSame(capturedFormatted))) {
            console.log("[AutoSync] 🚨 format detected before cash_history — aborting");
            return;
          }
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
