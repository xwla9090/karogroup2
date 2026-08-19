/* ============================================================================
   KARO SYNC CORE  (v3)
   ----------------------------------------------------------------------------
   چارەسەری کێشەی «داتا دەگەڕێتەوە / خۆکار دەسڕێتەوە».

   بنەما:
   1. هەموو نووسینێک یەکسەر دەچێتە ناو PENDING QUEUE و دەستبەجێ دەنێردرێت.
      (هیچ setTimeout / هیچ دواکەوتن نییە — UI یەکسەر نوێ دەبێتەوە)
   2. تا کاتێک نووسینەکە لەلایەن سێرڤەرەوە پەسەند نەکراوە، ئەو ڕیزە
      «pending» ـە و هیچ داتایەکی سێرڤەر ناتوانێت لەسەری بنووسێت.
      → ئیتر داتای نوێ خۆکار ناسڕدرێتەوە.
   3. سڕینەوە TOMBSTONE دروست دەکات. تا ٦٠ خولەک، ئەگەر سێرڤەر ئەو ڕیزە
      بگەڕێنێتەوە، پشتگوێ دەخرێت و سڕینەوەکە دووبارە دەنێردرێتەوە.
      → ئیتر ڕیزی سڕاو ناگەڕێتەوە.
   4. MERGE لە جیاتی OVERWRITE. هیچ کاتێک لیستی سێرڤەر بە تەواوی
      لە جیاتی لیستی ناوخۆیی دانانرێت.
   5. قاسە بە DELTA دەنووسرێت (RPC ـی atomic) نەک بە نرخی ڕەها.
      → دوو بەکارهێنەر هاوکات، هیچ پارەیەک لەدەست ناچێت.
   ========================================================================== */

import { supabase } from "./supabase";

/* ============================ HELPERS ============================ */
const N = v => (Number(v) ? Number(v) : 0);
const S = v => (v == null ? "" : String(v));
const B = v => !!v;

function jget(k, d) {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; }
}
function jset(k, v) {
  try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; }
}
function arr(v) { return Array.isArray(v) ? v : []; }

export function emitUpdate() {
  try { window.dispatchEvent(new Event("karoDataUpdate")); } catch (e) {}
}

/* ============================ TABLE SCHEMA ============================
   هەموو mapper ـەکان لێرەن — پێشتر لە ٣ فایلدا دووبارە بوونەوە و
   لە یەکتر جیا ببوونەوە، کە خۆی سەرچاوەی هەڵە بوو.
   ==================================================================== */
export const TABLES = {
  expenses: {
    lsKey: "karo_exp_",
    /* خانەی تەنها-ناوخۆیی: لە سێرڤەر پاشەکەوت ناکرێت، کەواتە
       لە کاتی merge دەبێت بپارێزرێت (پێشتر وێنەی وەسڵ لەدەست دەچوو) */
    keepLocal: ["receiptImg"],
    fromRow: e => ({
      id: e.id, date: e.date, amountIQD: e.amountiqd, amountUSD: e.amountusd,
      receiptNo: e.receiptno, note: e.note, marked: e.marked
    }),
    toRow: (i, project) => ({
      id: i.id, project, date: S(i.date), amountiqd: N(i.amountIQD), amountusd: N(i.amountUSD),
      receiptno: S(i.receiptNo), note: S(i.note), marked: B(i.marked)
    })
  },

  concrete: {
    lsKey: "karo_conc_",
    keepLocal: [],
    fromRow: c => ({
      id: c.id, date: c.date, currency: c.currency, meters: c.meters,
      pricePerMeter: c.pricepermeter, totalPrice: c.totalprice, deposit: c.deposit,
      depositPercent: c.depositpercent, received: c.received, isReceived: c.isreceived,
      depositClaimed: c.depositclaimed, note: c.note, marked: c.marked,
      paidAmount: c.paidamount,
      payments: (() => {
        try { return Array.isArray(c.payments) ? c.payments : JSON.parse(c.payments || "[]"); }
        catch (e) { return []; }
      })()
    }),
    toRow: (c, project) => ({
      id: c.id, project, date: S(c.date), currency: S(c.currency || "iqd"),
      meters: N(c.meters), pricepermeter: N(c.pricePerMeter), totalprice: N(c.totalPrice),
      deposit: N(c.deposit), depositpercent: N(c.depositPercent), received: N(c.received),
      isreceived: B(c.isReceived), depositclaimed: B(c.depositClaimed), note: S(c.note),
      marked: B(c.marked), paidamount: N(c.paidAmount), payments: JSON.stringify(c.payments || [])
    })
  },

  loans: {
    lsKey: "karo_loans_",
    keepLocal: [],
    fromRow: l => ({
      id: l.id, date: l.date, type: l.type, personName: l.personname,
      amountIQD: l.amountiqd, amountUSD: l.amountusd, note: l.note,
      returned: l.returned, marked: l.marked
    }),
    toRow: (l, project) => ({
      id: l.id, project, date: S(l.date), type: S(l.type), personname: S(l.personName),
      amountiqd: N(l.amountIQD), amountusd: N(l.amountUSD), note: S(l.note),
      returned: B(l.returned), marked: B(l.marked)
    })
  },

  contractor: {
    lsKey: "karo_contr_",
    keepLocal: [],
    fromRow: c => ({
      id: c.id, date: c.date, type: c.type, personName: c.personname,
      amountIQD: c.amountiqd, amountUSD: c.amountusd, note: c.note, marked: c.marked
    }),
    toRow: (c, project) => ({
      id: c.id, project, date: S(c.date), type: S(c.type), personname: S(c.personName),
      amountiqd: N(c.amountIQD), amountusd: N(c.amountUSD), note: S(c.note), marked: B(c.marked)
    })
  },

  invoices: {
    lsKey: "karo_inv_",
    keepLocal: [],
    fromRow: i => ({
      id: i.id, date: i.date, invoiceNo: i.invoiceno, currency: i.currency,
      billTo: i.billto, billPhone: i.billphone,
      items: (() => {
        try { return Array.isArray(i.items) ? i.items : JSON.parse(i.items || "[]"); }
        catch (e) { return []; }
      })(),
      total: i.total, marked: i.marked
    }),
    toRow: (i, project) => ({
      id: i.id, project, date: S(i.date), invoiceno: S(i.invoiceNo), currency: S(i.currency),
      billto: S(i.billTo), billphone: S(i.billPhone), items: JSON.stringify(i.items || []),
      total: N(i.total), marked: B(i.marked)
    })
  }
};

export const SYNCED_TABLES = Object.keys(TABLES);

/* ============================ PENDING QUEUE ============================
   هەر نووسینێک لێرە تۆمار دەکرێت پێش ئەوەی بنێردرێت. تا سەرکەوتوو نەبێت
   نامێنێتەوە. ئەمە هەم offline ـە و هەم قەڵغانە لە دژی سڕینەوەی خۆکار.
   ==================================================================== */
const PENDING_KEY = "karo_pending_v3";
const TOMB_KEY = "karo_tomb_v3";
const TOMB_TTL = 60 * 60 * 1000;   // ١ کاتژمێر
const MAX_TRIES = 50;

function getPending() { return arr(jget(PENDING_KEY, [])); }
function setPending(q) { jset(PENDING_KEY, q); }

function getTombs() {
  const now = Date.now();
  const list = arr(jget(TOMB_KEY, [])).filter(t => now - (t.ts || 0) < TOMB_TTL);
  return list;
}
function addTomb(table, id) {
  const list = getTombs().filter(t => !(t.table === table && t.id === id));
  list.push({ table, id, ts: Date.now() });
  jset(TOMB_KEY, list);
}
function clearTomb(table, id) {
  jset(TOMB_KEY, getTombs().filter(t => !(t.table === table && String(t.id) === String(id))));
}

/** ناسنامەی ئەو ڕیزانەی هێشتا لە ڕیزی چاوەڕوانیدان بۆ ئەم تەیبڵە */
function pendingIds(table) {
  const s = new Set();
  for (const op of getPending()) {
    if (op.table === table && op.id != null) s.add(String(op.id));
  }
  return s;
}

export function pendingCount() { return getPending().length; }

/** یەک op زیاد بکە و یەکسەر flush بکە (بێ هیچ دواکەوتنێک) */
function enqueue(op) {
  const q = getPending();
  /* ئەگەر op ـێکی چاوەڕوان بۆ هەمان (table,id) هەبوو، لە جیاتی
     کۆکردنەوەی ملیۆن op، نوێترین جێگەی دەگرێتەوە */
  const idx = q.findIndex(o => o.table === op.table && String(o.id) === String(op.id));
  const entry = { ...op, opId: Math.random().toString(36).slice(2) + Date.now(), tries: 0, ts: Date.now() };
  if (idx >= 0) q[idx] = entry; else q.push(entry);
  setPending(q);
  scheduleFlush();
}

/* ============================ FLUSH ============================ */
let flushing = false;
let flushAgain = false;

export async function flush() {
  if (flushing) { flushAgain = true; return; }
  if (typeof navigator !== "undefined" && navigator.onLine === false) return;
  flushing = true;
  try {
    const snapshot = getPending();
    for (const op of snapshot) {
      /* لەوانەیە لە کاتی await ـدا ئەم op ـە جێگۆڕکێی پێکرابێت */
      if (!getPending().some(o => o.opId === op.opId)) continue;

      let ok = false;
      try {
        let res;
        if (op.action === "upsert") {
          res = await supabase.from(op.table).upsert(op.row, { onConflict: "id" });
        } else if (op.action === "delete") {
          res = await supabase.from(op.table).delete().eq("id", op.id);
        } else if (op.action === "patch") {
          res = await supabase.from(op.table).update(op.patch).eq("id", op.id);
        }
        if (res && res.error) throw res.error;
        ok = true;
      } catch (e) {
        console.warn("[sync] op failed:", op.table, op.action, op.id, e && e.message);
      }

      const cur = getPending();
      const i = cur.findIndex(o => o.opId === op.opId);
      if (i < 0) continue;

      if (ok) {
        cur.splice(i, 1);
        if (op.action === "delete") clearTomb(op.table, op.id);
        setPending(cur);
        emitUpdate();
      } else {
        cur[i].tries = (cur[i].tries || 0) + 1;
        if (cur[i].tries >= MAX_TRIES) {
          console.error("[sync] op دوای " + MAX_TRIES + " هەوڵ لادەبرێت:", op.table, op.id);
          cur.splice(i, 1);
        }
        setPending(cur);
        /* ئەگەر تۆڕ کەوتووە، بەردەوام مەبە */
        if (typeof navigator !== "undefined" && navigator.onLine === false) break;
      }
    }
  } finally {
    flushing = false;
    if (flushAgain) { flushAgain = false; setTimeout(flush, 0); }
  }
}

let flushTimer = null;
function scheduleFlush() {
  /* «دەستبەجێ» بەڵام لە microtask ـێکدا، تا چەند نووسینێکی پێکەوە
     لە یەک render ـدا وەک یەک دەستە بنێردرێن */
  if (flushTimer) return;
  flushTimer = setTimeout(() => { flushTimer = null; flush(); }, 0);
}

/* ============================ LOCAL STORE ============================ */
export function localList(table, project) {
  const def = TABLES[table];
  if (!def) return [];
  return arr(jget(def.lsKey + project, []));
}
export function saveLocalList(table, project, list) {
  const def = TABLES[table];
  if (!def) return;
  jset(def.lsKey + project, arr(list));
}

/* ============================ MERGE ============================
   یاسا:
     • ڕیزی tombstoned      → هەرگیز دووبارە زیاد ناکرێتەوە
     • ڕیزی pending          → نۆسخەی ناوخۆیی هەمیشە دەبات
     • ئەوانی تر             → سێرڤەر سەرچاوەی ڕاستە
     • خانەی تەنها-ناوخۆیی   → دەپارێزرێت (وێنەی وەسڵ …)
   full=true واتە لیستی تەواوی سێرڤەرمان هەیە، کەواتە ئەو ڕیزە
   ناوخۆییانەی لە سێرڤەردا نین (و pending نین) بەڕاستی سڕاونەتەوە.
   ============================================================= */
export function mergeRemote(table, project, remoteRows, opts) {
  const def = TABLES[table];
  if (!def) return false;
  const full = !!(opts && opts.full);
  const local = localList(table, project);
  const pend = pendingIds(table);
  const localById = new Map(local.map(r => [String(r.id), r]));
  /* یەک جار بخوێنەوە — نەک بۆ هەر ڕیزێک (کە بۆ سەدان ڕیز خاو دەبوو) */
  const tombSet = new Set(getTombs().filter(t => t.table === table).map(t => String(t.id)));

  const out = [];
  const seen = new Set();
  let resurrect = [];

  for (const raw of arr(remoteRows)) {
    const id = String(raw.id);
    if (tombSet.has(id)) {
      /* سێرڤەر ڕیزێکی سڕاوی گەڕاندەوە → سڕینەوەکە دووبارە بنێرە */
      resurrect.push(id);
      continue;
    }
    seen.add(id);
    if (pend.has(id)) {
      const l = localById.get(id);
      if (l) { out.push(l); continue; }
    }
    const mapped = def.fromRow(raw);
    const l = localById.get(id);
    if (l && def.keepLocal.length) {
      for (const k of def.keepLocal) {
        if (mapped[k] === undefined && l[k] !== undefined) mapped[k] = l[k];
      }
    }
    out.push(mapped);
  }

  /* ڕیزە ناوخۆییەکانی نەهاتوون لە سێرڤەر */
  for (const l of local) {
    const id = String(l.id);
    if (seen.has(id)) continue;
    if (pend.has(id)) { out.push(l); continue; }   // هێشتا نەنێردراوە
    if (!full) out.push(l);                        // زانیاریمان تەواو نییە → مەیسڕە
    /* full && !pending && !remote → لە ئامێرێکی تر سڕاوەتەوە → لادەبرێت */
  }

  for (const id of resurrect) {
    enqueue({ table, action: "delete", id });
  }

  const before = JSON.stringify(local);
  const after = JSON.stringify(out);
  if (before === after) return false;
  saveLocalList(table, project, out);
  return true;
}

/** یەک ڕیزی سێرڤەر جێبەجێ بکە — بۆ Realtime (دەستبەجێ، بێ هیچ fetch) */
export function applyRemoteRow(table, project, raw) {
  return mergeRemote(table, project, [raw], { full: false });
}

/** سڕینەوەی ڕیزێک لە ئامێرێکی تر — بۆ Realtime */
export function applyRemoteDelete(table, project, id) {
  const key = String(id);
  if (pendingIds(table).has(key)) return false;   // ئێمە خۆمان دەیگۆڕین
  const local = localList(table, project);
  const out = local.filter(r => String(r.id) !== key);
  if (out.length === local.length) return false;
  saveLocalList(table, project, out);
  return true;
}

/* ============================ PUBLIC WRITE API ============================ */

/** ڕیز(ەکان) بنووسە: ناوخۆیی یەکسەر + بەرەو سێرڤەر دەستبەجێ لە پاشبنەوە */
export function pushUpsert(table, project, rows) {
  const def = TABLES[table];
  if (!def) return Promise.resolve({ error: null });
  const list = Array.isArray(rows) ? rows : [rows];
  for (const r of list) {
    if (!r || r.id == null) continue;
    clearTomb(table, r.id);
    enqueue({ table, action: "upsert", id: r.id, row: r });
  }
  return Promise.resolve({ error: null, data: list });
}

/** سڕینەوە: tombstone + ناردنی دەستبەجێ */
export function pushDelete(table, id) {
  if (!TABLES[table]) return Promise.resolve({ error: null });
  addTomb(table, id);
  enqueue({ table, action: "delete", id });
  return Promise.resolve({ error: null });
}

/** گۆڕینی چەند خانەیەک (بۆ نموونە marked) */
export function pushPatch(table, id, patch) {
  if (!TABLES[table]) return Promise.resolve({ error: null });
  const q = getPending();
  const existing = q.find(o => o.table === table && String(o.id) === String(id) && o.action === "upsert");
  if (existing) {
    /* upsert ـێکی چاوەڕوان هەیە — patch ـەکەی تێکەڵ بکە، تا نەڕەوێتەوە */
    existing.row = { ...existing.row, ...patch };
    setPending(q);
    scheduleFlush();
    return Promise.resolve({ error: null });
  }
  enqueue({ table, action: "patch", id, patch });
  return Promise.resolve({ error: null });
}

/* ==================================================================
   karoDB — هەمان شێوەی supabase.from(...) بەڵام بە پاراستنی سەرەوە.
   وا دەکات گۆڕانکاری لە App.js کەم و ڕوون بێت.
   ================================================================== */
export const karoDB = {
  from(table) {
    return {
      upsert: rows => pushUpsert(table, (Array.isArray(rows) ? rows[0] : rows)?.project, rows),
      delete: () => ({
        eq: (col, val) => {
          if (col === "id") return pushDelete(table, val);
          /* سڕینەوەی کۆمەڵ (Format) — ڕاستەوخۆ، بێ queue */
          return supabase.from(table).delete().eq(col, val);
        }
      }),
      update: patch => ({
        eq: (col, val) => (col === "id"
          ? pushPatch(table, val, patch)
          : supabase.from(table).update(patch).eq(col, val))
      }),
      select: (...a) => supabase.from(table).select(...a),
      insert: rows => supabase.from(table).insert(rows)
    };
  }
};

/* ============================ RECONCILE ============================
   تۆڕی سەلامەتی: هەموو تەیبڵێک بخوێنەوە و MERGE بکە (نەک overwrite).
   ================================================================== */
export async function reconcileTable(table, project) {
  if (!TABLES[table] || !project) return false;
  try {
    const { data, error } = await supabase.from(table).select("*").eq("project", project);
    if (error || !data) return false;
    return mergeRemote(table, project, data, { full: true });
  } catch (e) {
    console.warn("[sync] reconcile failed", table, e && e.message);
    return false;
  }
}

export async function reconcileAll(project) {
  if (!project) return;
  await flush();                                   // یەکەم ئەوەی ناردنی ماوە بینێرە
  const results = await Promise.all(SYNCED_TABLES.map(t => reconcileTable(t, project)));
  if (results.some(Boolean)) emitUpdate();
}

/* ==================================================================
   CASH — بە DELTA نەک بە نرخی ڕەها
   ------------------------------------------------------------------
   RPC ـی karo_cash_delta لە Supabase کاری atomic دەکات:
       cashiqd = cashiqd + delta
   کەواتە دوو بەکارهێنەری هاوکات یەکتر ناسڕنەوە.
   ئەگەر RPC دانەمەزرابێت، دەگەڕێتەوە بۆ read-modify-write ـی
   دووبارەکراوە — کە هێشتا لە نووسینی ڕەهای کوێر باشترە.
   ================================================================== */

let rpcDeltaAvailable = null;      // null = هێشتا نەزانراوە
let cashInFlight = 0;              // ژمارەی delta ـی لە ڕێگادا
export function cashBusy() { return cashInFlight > 0; }
let cashChain = Promise.resolve(); // زنجیرە — نووسینەکانی قاسە یەک بە یەک

function cashLSKeys(project) {
  return {
    iqd: "karo_cashIQD_" + project,
    usd: "karo_cashUSD_" + project,
    rate: "karo_rate_" + project,
    log: "karo_cashLog_" + project
  };
}

function isMissingFunction(err) {
  if (!err) return false;
  const m = (err.message || "") + " " + (err.code || "") + " " + (err.details || "");
  return /PGRST202|could not find the function|does not exist|schema cache/i.test(m);
}

function readLocalCash(project) {
  const k = cashLSKeys(project);
  return {
    iqd: N(jget(k.iqd, 0)),
    usd: N(jget(k.usd, 0)),
    rate: N(jget(k.rate, 1500)) || 1500
  };
}

function writeLocalCash(project, iqd, usd, rate) {
  const k = cashLSKeys(project);
  jset(k.iqd, N(iqd));
  jset(k.usd, N(usd));
  if (rate != null) jset(k.rate, N(rate) || 1500);
}

function appendLocalLog(project, entry) {
  if (!entry) return;
  const k = cashLSKeys(project);
  const log = arr(jget(k.log, []));
  if (log.some(l => l && l.id === entry.id)) return;
  log.push(entry);
  jset(k.log, log);
}

/**
 * گۆڕانکاری قاسە بە DELTA.
 * @param {string} project
 * @param {number} dIQD  گۆڕانی دینار (+/-)
 * @param {number} dUSD  گۆڕانی دۆلار (+/-)
 * @param {object|null} logEntry تۆمارێکی مێژوو {id,date,desc,iqd,usd,time}
 */
export function cashDelta(project, dIQD, dUSD, logEntry) {
  const di = N(dIQD), du = N(dUSD);
  if (!project || project === "default") return Promise.resolve({ error: null });

  /* ١) ناوخۆیی یەکسەر — بەکارهێنەر هیچ دواکەوتنێک نابینێت */
  const cur = readLocalCash(project);
  writeLocalCash(project, cur.iqd + di, cur.usd + du, null);
  appendLocalLog(project, logEntry);

  /* ٢) سێرڤەر — بە زنجیرە، تا دوو delta تێکەڵ نەبن */
  cashInFlight++;
  cashChain = cashChain
    .then(() => sendCashDelta(project, di, du, logEntry))
    .catch(() => {})
    .then(r => { cashInFlight--; return r; });
  return cashChain;
}

async function sendCashDelta(project, di, du, logEntry, retry) {
  if (di === 0 && du === 0 && !logEntry) return { error: null };
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    queueCashDelta(project, di, du, logEntry);
    return { error: null, queued: true };
  }

  if (rpcDeltaAvailable !== false) {
    try {
      const { data, error } = await supabase.rpc("karo_cash_delta", {
        p_project: project,
        p_diqd: di,
        p_dusd: du,
        p_log: logEntry ? [logEntry] : []
      });
      if (error) {
        if (isMissingFunction(error)) {
          rpcDeltaAvailable = false;
          console.warn("[sync] karo_cash_delta RPC نەدۆزرایەوە — دەگەڕێمەوە بۆ read-modify-write. تکایە supabase_migration.sql جێبەجێ بکە.");
        } else {
          throw error;
        }
      } else {
        rpcDeltaAvailable = true;
        applyServerCash(project, data);
        return { error: null };
      }
    } catch (e) {
      if (!retry) {
        queueCashDelta(project, di, du, logEntry);
        return { error: e, queued: true };
      }
      return { error: e };
    }
  }

  /* ---- FALLBACK: read-modify-write بە دووبارەکردنەوە ---- */
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const { data: row, error: selErr } = await supabase
        .from("cash").select("cashiqd,cashusd,exchangerate,cashlog")
        .eq("project", project).maybeSingle();
      if (selErr) throw selErr;

      if (!row) {
        const c = readLocalCash(project);
        const { error: insErr } = await supabase.from("cash").insert([{
          id: project, project, cashiqd: c.iqd, cashusd: c.usd,
          exchangerate: c.rate, cashlog: JSON.stringify(arr(jget(cashLSKeys(project).log, [])))
        }]);
        if (insErr) throw insErr;
        return { error: null };
      }

      const oldIQD = N(row.cashiqd), oldUSD = N(row.cashusd);
      let log;
      try { log = arr(typeof row.cashlog === "string" ? JSON.parse(row.cashlog || "[]") : row.cashlog); }
      catch (e) { log = []; }
      if (logEntry && !log.some(l => l && l.id === logEntry.id)) log.push(logEntry);

      const { data: upd, error: updErr } = await supabase
        .from("cash")
        .update({ cashiqd: oldIQD + di, cashusd: oldUSD + du, cashlog: JSON.stringify(log) })
        .eq("project", project)
        .eq("cashiqd", oldIQD)      // پشکنینی هاوکات — ئەگەر گۆڕابێت، دووبارە هەوڵ بدە
        .eq("cashusd", oldUSD)
        .select();
      if (updErr) throw updErr;
      if (upd && upd.length > 0) {
        applyServerCash(project, [{ cashiqd: oldIQD + di, cashusd: oldUSD + du, exchangerate: row.exchangerate }]);
        return { error: null };
      }
      /* ڕیزەکە لە کاتی خوێندنەوە و نووسیندا گۆڕا → دووبارە */
    } catch (e) {
      if (attempt === 3) {
        queueCashDelta(project, di, du, logEntry);
        return { error: e, queued: true };
      }
    }
  }
  queueCashDelta(project, di, du, logEntry);
  return { error: new Error("cash delta: retries exhausted"), queued: true };
}

/* ---- ڕیزی چاوەڕوانی قاسە (offline) ---- */
const CASH_Q_KEY = "karo_cashq_v3";
function queueCashDelta(project, di, du, logEntry) {
  const q = arr(jget(CASH_Q_KEY, []));
  q.push({ project, di, du, logEntry, ts: Date.now() });
  jset(CASH_Q_KEY, q);
}
export async function flushCashQueue() {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return;
  let q = arr(jget(CASH_Q_KEY, []));
  if (!q.length) return;
  jset(CASH_Q_KEY, []);
  const failed = [];
  for (const item of q) {
    const r = await sendCashDelta(item.project, item.di, item.du, item.logEntry, true);
    if (r && r.error) failed.push(item);
  }
  if (failed.length) jset(CASH_Q_KEY, arr(jget(CASH_Q_KEY, [])).concat(failed));
}

function applyServerCash(project, data) {
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return;
  writeLocalCash(project, N(row.cashiqd), N(row.cashusd), row.exchangerate);
  if (window.__karoOnCashFromServer) {
    window.__karoOnCashFromServer({
      cashiqd: N(row.cashiqd), cashusd: N(row.cashusd),
      exchangerate: N(row.exchangerate) || 1500
    });
  }
  emitUpdate();
}

/**
 * دانانی نرخی ڕەهای قاسە (تەنها بۆ «ئیدت قاسە»ی ئەدمین).
 * ئەمە بە ئەنقەست ڕەهایە — بەکارهێنەر بە ئاگاداری بڕەکە دیاری دەکات.
 */
export async function cashSetAbsolute(project, iqd, usd, logEntry) {
  if (!project || project === "default") return { error: null };
  writeLocalCash(project, iqd, usd, null);
  appendLocalLog(project, logEntry);
  cashChain = cashChain.then(async () => {
    try {
      const { data: row } = await supabase.from("cash").select("cashiqd,cashusd,cashlog")
        .eq("project", project).maybeSingle();
      let log;
      try { log = arr(typeof row?.cashlog === "string" ? JSON.parse(row.cashlog || "[]") : row?.cashlog); }
      catch (e) { log = []; }
      if (logEntry && !log.some(l => l && l.id === logEntry.id)) log.push(logEntry);

      if (!row) {
        await supabase.from("cash").insert([{
          id: project, project, cashiqd: N(iqd), cashusd: N(usd),
          exchangerate: readLocalCash(project).rate, cashlog: JSON.stringify(log)
        }]);
      } else {
        await supabase.from("cash")
          .update({ cashiqd: N(iqd), cashusd: N(usd), cashlog: JSON.stringify(log) })
          .eq("project", project);
      }
    } catch (e) { console.warn("[sync] cashSetAbsolute", e && e.message); }
  }).catch(() => {});
  return cashChain;
}

/** پاشەکەوتکردنی نرخی ئاڵوگۆڕ */
export async function cashSetRate(project, rate) {
  if (!project || project === "default") return { error: null };
  const k = cashLSKeys(project);
  jset(k.rate, N(rate) || 1500);
  cashChain = cashChain.then(async () => {
    try { await supabase.from("cash").update({ exchangerate: N(rate) || 1500 }).eq("project", project); }
    catch (e) { console.warn("[sync] cashSetRate", e && e.message); }
  }).catch(() => {});
  return cashChain;
}

/* ==================================================================
   RAW QUEUE — بۆ تەیبڵەکانی وەک users کە کلیلیان id نییە.
   هەمان بەڵێنی سەلامەتی: ئەگەر ئینتەرنێت نەبوو یان هەڵە ڕوویدا،
   کردارەکە نافەوتێت — دواتر دووبارە دەنێردرێت.
   ================================================================== */
const RAW_Q_KEY = "karo_rawq_v3";

function rawQueue() { return arr(jget(RAW_Q_KEY, [])); }

async function rawExec(op) {
  if (op.action === "upsert") return supabase.from(op.table).upsert(op.rows);
  if (op.action === "delete") return supabase.from(op.table).delete().eq(op.column, op.value);
  return { error: null };
}

function rawEnqueue(op) {
  const q = rawQueue();
  q.push({ ...op, opId: Math.random().toString(36).slice(2) + Date.now(), tries: 0 });
  jset(RAW_Q_KEY, q);
}

export async function flushRaw() {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return;
  const snapshot = rawQueue();
  if (!snapshot.length) return;
  for (const op of snapshot) {
    let ok = false;
    try {
      const res = await rawExec(op);
      if (res && res.error) throw res.error;
      ok = true;
    } catch (e) { console.warn("[sync] raw op failed:", op.table, op.action, e && e.message); }
    const cur = rawQueue();
    const i = cur.findIndex(o => o.opId === op.opId);
    if (i < 0) continue;
    if (ok) cur.splice(i, 1);
    else {
      cur[i].tries = (cur[i].tries || 0) + 1;
      if (cur[i].tries >= MAX_TRIES) cur.splice(i, 1);
    }
    jset(RAW_Q_KEY, cur);
  }
}

export async function upsertOrQueue(table, rows) {
  try {
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      rawEnqueue({ action: "upsert", table, rows });
      return { error: null, queued: true };
    }
    const res = await supabase.from(table).upsert(rows);
    if (res && res.error) { rawEnqueue({ action: "upsert", table, rows }); return res; }
    return res;
  } catch (e) {
    rawEnqueue({ action: "upsert", table, rows });
    return { error: e, queued: true };
  }
}

export async function deleteOrQueue(table, column, value) {
  try {
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      rawEnqueue({ action: "delete", table, column, value });
      return { error: null, queued: true };
    }
    const res = await supabase.from(table).delete().eq(column, value);
    if (res && res.error) { rawEnqueue({ action: "delete", table, column, value }); return res; }
    return res;
  } catch (e) {
    rawEnqueue({ action: "delete", table, column, value });
    return { error: e, queued: true };
  }
}

/* ============================ WINDOW BRIDGE ============================ */
if (typeof window !== "undefined") {
  window.__karoSync = {
    flush, flushCashQueue, flushRaw, reconcileAll, reconcileTable,
    pendingCount, cashDelta, cashSetAbsolute, cashSetRate, cashBusy,
    upsertOrQueue, deleteOrQueue,
    getPending, getTombs
  };
  window.addEventListener("online", () => { flush(); flushCashQueue(); flushRaw(); });
}
