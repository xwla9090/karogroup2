/* ============================================================================
   AUTO SYNC  (v3)
   ----------------------------------------------------------------------------
   ⚠️ گۆڕانکاریی گەورە:
   ئەم کۆمپۆنێنتە ئیتر «هەموو localStorage هەر ٦٠ چرکە بۆ سێرڤەر» نانێرێت.
   ئەو ڕەفتارە هۆکاری سەرەکی گەڕانەوەی داتا بوو: ئامێرێکی کۆن داتای
   کۆنی خۆی دەنووسییەوە بەسەر داتای نوێی سێرڤەردا و ڕیزە سڕاوەکانی
   زیندوو دەکردەوە.

   ئێستا تەنها ئەم کارانە دەکات:
     ١. ڕیزی چاوەڕوانی نووسین (pending queue) دەنێرێت — هەر ١٠ چرکە،
        هەروەها لە کاتی online/focus بوونەوە.
     ٢. مێژووی قاسە (cash_history) پڕ دەکاتەوە بۆ ئەوانەی لەدەست چوون.
     ٣. Backup ـی خۆکاری تێلێگرام هەر ١٠ ڕۆژ.
   ========================================================================== */

import { useEffect } from "react";
import { supabase } from "./supabase";
import { flush, flushCashQueue, flushRaw, pendingCount } from "./sync";

const FLUSH_MS = 10000;

function getLS(k) {
  try { const v = JSON.parse(localStorage.getItem(k)); return Array.isArray(v) ? v : []; }
  catch (e) { return []; }
}
const N = v => (Number(v) ? Number(v) : 0);
const S = v => (v ? String(v) : "");

export default function AutoSync({ project }) {
  useEffect(() => {
    if (!project) return;

    const isFormatting = () => window._karoFormatting === true;

    /* ================= ١. ناردنی ڕیزی چاوەڕوان ================= */
    const doFlush = async () => {
      if (isFormatting() || !navigator.onLine) return;
      await flush();
      await flushCashQueue();
      await flushRaw();
    };

    const flushInterval = setInterval(doFlush, FLUSH_MS);
    doFlush();

    /* ================= ٢. چاککردنەوەی cash_history ================= */
    const healHistory = async () => {
      if (isFormatting() || !navigator.onLine) return;
      if (pendingCount() > 0) return;               // یەکەم ئەوەی ماوە بنێرە
      try {
        const log = getLS("karo_cashLog_" + project);
        if (!log.length) return;
        const { data } = await supabase.from("cash_history").select("id").eq("project", project);
        const remote = new Set((data || []).map(h => h.id));
        const missing = log
          .filter(l => l && l.id && !remote.has(l.id))
          .map(l => ({
            id: l.id, project,
            amountiqd: N(l.iqd), amountusd: N(l.usd), note: S(l.desc || "")
          }));
        if (missing.length) await supabase.from("cash_history").insert(missing);
      } catch (e) { /* بێدەنگ */ }
    };
    const healTimer = setTimeout(healHistory, 20000);
    const healInterval = setInterval(healHistory, 5 * 60 * 1000);

    /* ================= ٣. BACKUP ی تێلێگرام ================= */
    const BOT_TOKEN = process.env.REACT_APP_TG_BOT_TOKEN || "";
    const CHAT_ID = process.env.REACT_APP_TG_CHAT_ID || "";
    const BACKUP_KEY = "karo_last_backup_" + project;

    const sendToTelegram = async (text) => {
      if (!BOT_TOKEN || !CHAT_ID) return;
      try {
        await fetch("https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "HTML" })
        });
      } catch (e) { console.error("[Backup] telegram error:", e); }
    };

    const sendFileToTelegram = async (content, filename, caption) => {
      if (!BOT_TOKEN || !CHAT_ID) return;
      try {
        const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
        const fd = new FormData();
        fd.append("chat_id", CHAT_ID);
        fd.append("document", blob, filename);
        fd.append("caption", caption);
        await fetch("https://api.telegram.org/bot" + BOT_TOKEN + "/sendDocument", { method: "POST", body: fd });
      } catch (e) { console.error("[Backup] file send error:", e); }
    };

    const makeCSV = (headers, rows) => {
      let csv = "﻿" + headers.join(",") + "\n";
      rows.forEach(r => { csv += r.map(c => `"${String(c || "").replace(/"/g, '""')}"`).join(",") + "\n"; });
      return csv;
    };

    const doBackup = async () => {
      if (!navigator.onLine || !BOT_TOKEN || !CHAT_ID) return;
      try {
        const last = localStorage.getItem(BACKUP_KEY);
        const now = Date.now();
        const TEN_DAYS = 10 * 24 * 60 * 60 * 1000;
        if (last && (now - Number(last)) < TEN_DAYS) return;

        const exp = getLS("karo_exp_" + project);
        const conc = getLS("karo_conc_" + project);
        const loans = getLS("karo_loans_" + project);
        const contr = getLS("karo_contr_" + project);
        const cashIQDVal = JSON.parse(localStorage.getItem("karo_cashIQD_" + project) || "0");
        const cashUSDVal = JSON.parse(localStorage.getItem("karo_cashUSD_" + project) || "0");
        const today = new Date().toISOString().slice(0, 10);

        await sendToTelegram(
          `🔄 <b>Backup خۆکار</b>\n\n` +
          `📁 پرۆژە: <b>${project}</b>\n` +
          `📅 بەروار: <b>${today}</b>\n\n` +
          `💰 قاسە:\n   دینار: <b>${Math.round(cashIQDVal)}</b>\n   دۆڵار: <b>$${Math.round(cashUSDVal)}</b>\n\n` +
          `📊 خەرجی: <b>${exp.length}</b> تۆمار\n` +
          `🏗 سلفە: <b>${conc.length}</b> تۆمار\n` +
          `💳 قەرز: <b>${loans.length}</b> تۆمار\n` +
          `👷 مقاول: <b>${contr.length}</b> تۆمار`
        );

        if (exp.length) await sendFileToTelegram(makeCSV(
          ["بەروار", "بڕی دینار", "بڕی دۆلار", "ژمارەی وەسڵ", "تێبینی"],
          exp.map(e => [e.date || "", e.amountIQD || 0, e.amountUSD || 0, e.receiptNo || "", e.note || ""])
        ), `expenses_${project}_${today}.csv`, `📝 خەرجیەکان — ${project} — ${today}`);

        if (conc.length) await sendFileToTelegram(makeCSV(
          ["بەروار", "دراو", "مەتر", "نرخی مەتر", "کۆی گشتی", "تەئمین", "وەرگیراو", "تێبینی"],
          conc.map(c => [c.date || "", c.currency || "", c.meters || 0, c.pricePerMeter || 0, c.totalPrice || 0, c.deposit || 0, c.received || 0, c.note || ""])
        ), `concrete_${project}_${today}.csv`, `🏗 سلفەی کۆنکریت — ${project} — ${today}`);

        if (loans.length) await sendFileToTelegram(makeCSV(
          ["بەروار", "جۆر", "ناوی کەس", "بڕی دینار", "بڕی دۆلار", "گەڕێنداوەتەوە", "تێبینی"],
          loans.map(l => [l.date || "", l.type || "", l.personName || "", l.amountIQD || 0, l.amountUSD || 0, l.returned ? "بەڵێ" : "نەخێر", l.note || ""])
        ), `loans_${project}_${today}.csv`, `💳 قەرز — ${project} — ${today}`);

        if (contr.length) await sendFileToTelegram(makeCSV(
          ["بەروار", "جۆر", "ناوی کەس", "بڕی دینار", "بڕی دۆلار", "تێبینی"],
          contr.map(c => [c.date || "", c.type || "", c.personName || "", c.amountIQD || 0, c.amountUSD || 0, c.note || ""])
        ), `contractor_${project}_${today}.csv`, `👷 مقاول — ${project} — ${today}`);

        await sendToTelegram(`✅ <b>Backup تەواو بوو!</b>\n\n📁 پرۆژە: <b>${project}</b>`);
        localStorage.setItem(BACKUP_KEY, String(now));
      } catch (e) { console.error("[Backup] error:", e); }
    };

    const backupTimer = setTimeout(doBackup, 15 * 60 * 1000);
    const backupInterval = setInterval(doBackup, 24 * 60 * 60 * 1000);

    /* ================= ڕووداوەکان ================= */
    const onOnline = () => doFlush();
    const onFocus = () => doFlush();
    window.addEventListener("online", onOnline);
    window.addEventListener("focus", onFocus);

    /* ئاگادارکردنەوە پێش داخستنی پەڕە ئەگەر نووسین ماوە */
    const onBeforeUnload = (e) => {
      if (pendingCount() > 0 && navigator.onLine) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      clearInterval(flushInterval);
      clearTimeout(healTimer);
      clearInterval(healInterval);
      clearTimeout(backupTimer);
      clearInterval(backupInterval);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [project]);

  return null;
}
