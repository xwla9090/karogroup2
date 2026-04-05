import { useEffect, useRef } from "react";
import { supabase } from "./supabase";
function getLS(k) { try { var v = JSON.parse(localStorage.getItem(k)); return Array.isArray(v) ? v : []; } catch(e) { return []; } }
function N(v) { return Number(v) ? Number(v) : 0; }
function S(v) { return v ? String(v) : ""; }
function B(v) { return v ? true : false; }
export default function AutoSync({ project, cashIQD, cashUSD, exchangeRate, users }) {
  const lastHash = useRef("");
  const lastFetch = useRef(0);
  useEffect(() => {
    if (!project) return;

    const doSync = async () => {
      try {
        var exp = getLS("karo_exp_" + project);
        var conc = getLS("karo_conc_" + project);
        var loans = getLS("karo_loans_" + project);
        var contr = getLS("karo_contr_" + project);
        var inv = getLS("karo_inv_" + project);
        var cashLogData = [];
        try { cashLogData = JSON.parse(localStorage.getItem("karo_cashLog_" + project) || "[]"); } catch(e) {}
        var uLen = users ? users.length : 0;
        var hash = exp.length + "" + conc.length + "" + loans.length + "" + contr.length + "" + inv.length + "" + cashIQD + "" + cashUSD + "" + uLen + "_" + Math.floor(Date.now()/5000);
        if (hash === lastHash.current) return;
        lastHash.current = hash;

        if (exp.length > 0) {
          var rows = [];
          for (var j = 0; j < exp.length; j++) {
            var e = exp[j];
            rows.push({ id: e.id, project: project, date: e.date, amountiqd: N(e.amountIQD), amountusd: N(e.amountUSD), receiptno: S(e.receiptNo), note: S(e.note), marked: B(e.marked) });
          }
          await supabase.from("expenses").upsert(rows);
        }

        if (conc.length > 0) {
          var rows2 = [];
          for (var k = 0; k < conc.length; k++) {
            var c = conc[k];
            rows2.push({ id: c.id, project: project, date: c.date, currency: S(c.currency) ? S(c.currency) : "iqd", meters: N(c.meters), pricepermeter: N(c.pricePerMeter), totalprice: N(c.totalPrice), deposit: N(c.deposit), depositpercent: N(c.depositPercent), received: N(c.received), isreceived: B(c.isReceived), depositclaimed: B(c.depositClaimed), note: S(c.note), marked: B(c.marked), paidamount: N(c.paidAmount), payments: JSON.stringify(c.payments||[]) });
          }
          await supabase.from("concrete").upsert(rows2);
        }

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
            rows5.push({ id: invoice.id, project: project, date: S(invoice.date), invoiceno: S(invoice.invoiceNo), currency: S(invoice.currency), billto: S(invoice.billTo), billphone: S(invoice.billPhone), items: JSON.stringify(invoice.items||[]), total: N(invoice.total), marked: B(invoice.marked) });
          }
          await supabase.from("invoices").upsert(rows5);
        }

        await supabase.from("cash").upsert([{ id: project, project: project, cashiqd: cashIQD, cashusd: cashUSD, exchangerate: exchangeRate, cashlog: JSON.stringify(cashLogData), formatted_at: localStorage.getItem("karo_formatted_" + project) || "" }]);

        if (users && users.length > 0) {
          for (var m = 0; m < users.length; m++) {
            var u = users[m];
            await supabase.from("users").upsert([{ username: u.username, password: u.password, project: u.project, label: u.label, isadmin: B(u.isAdmin), isfrozen: B(u.isFrozen) }]);
          }
          var dbUsers = await supabase.from("users").select("username");
          if (dbUsers.data) {
            var localNames = users.map(function(u) { return u.username; });
            for (var n = 0; n < dbUsers.data.length; n++) {
              if (localNames.indexOf(dbUsers.data[n].username) === -1) {
                await supabase.from("users").delete().eq("username", dbUsers.data[n].username);
              }
            }
          }
        }

        // fetch لە Supabase بۆ sync گۆڕانکاری و سڕینەوە
        var now = Date.now();
        if (now - lastFetch.current > 5000) {
          lastFetch.current = now;
          const { data: expFull } = await supabase.from("expenses").select("*").eq("project", project);
          if (expFull) {
            const mapped = expFull.map(e => ({ id: e.id, date: e.date, amountIQD: e.amountiqd, amountUSD: e.amountusd, receiptNo: e.receiptno, note: e.note, marked: e.marked }));
            const local = getLS("karo_exp_" + project);
            if (JSON.stringify(mapped.sort((a,b)=>a.id>b.id?1:-1)) !== JSON.stringify(local.sort((a,b)=>a.id>b.id?1:-1))) {
              localStorage.setItem("karo_exp_" + project, JSON.stringify(mapped));
              window.dispatchEvent(new Event("karoDataUpdate"));
            }
          }
          const { data: concFull } = await supabase.from("concrete").select("*").eq("project", project);
          if (concFull) {
            const mapped = concFull.map(c => ({ id: c.id, date: c.date, currency: c.currency, meters: c.meters, pricePerMeter: c.pricepermeter, totalPrice: c.totalprice, deposit: c.deposit, depositPercent: c.depositpercent, received: c.received, isReceived: c.isreceived, depositClaimed: c.depositclaimed, note: c.note, marked: c.marked, paidAmount: c.paidamount, payments: JSON.parse(c.payments||"[]") }));
            const local = getLS("karo_conc_" + project);
            if (JSON.stringify(mapped.sort((a,b)=>a.id>b.id?1:-1)) !== JSON.stringify(local.sort((a,b)=>a.id>b.id?1:-1))) {
              localStorage.setItem("karo_conc_" + project, JSON.stringify(mapped));
              window.dispatchEvent(new Event("karoDataUpdate"));
            }
          }
          const { data: loansFull } = await supabase.from("loans").select("*").eq("project", project);
          if (loansFull) {
            const mapped = loansFull.map(l => ({ id: l.id, date: l.date, type: l.type, personName: l.personname, amountIQD: l.amountiqd, amountUSD: l.amountusd, note: l.note, returned: l.returned, marked: l.marked }));
            const local = getLS("karo_loans_" + project);
            if (JSON.stringify(mapped.sort((a,b)=>a.id>b.id?1:-1)) !== JSON.stringify(local.sort((a,b)=>a.id>b.id?1:-1))) {
              localStorage.setItem("karo_loans_" + project, JSON.stringify(mapped));
              window.dispatchEvent(new Event("karoDataUpdate"));
            }
          }
          const { data: contrFull } = await supabase.from("contractor").select("*").eq("project", project);
          if (contrFull) {
            const mapped = contrFull.map(c => ({ id: c.id, date: c.date, type: c.type, personName: c.personname, amountIQD: c.amountiqd, amountUSD: c.amountusd, note: c.note, marked: c.marked }));
            const local = getLS("karo_contr_" + project);
            if (JSON.stringify(mapped.sort((a,b)=>a.id>b.id?1:-1)) !== JSON.stringify(local.sort((a,b)=>a.id>b.id?1:-1))) {
              localStorage.setItem("karo_contr_" + project, JSON.stringify(mapped));
              window.dispatchEvent(new Event("karoDataUpdate"));
            }
          }
          const { data: invFull } = await supabase.from("invoices").select("*").eq("project", project);
          if (invFull) {
            const mapped = invFull.map(i => ({ id: i.id, date: i.date, invoiceNo: i.invoiceno, currency: i.currency, billTo: i.billto, billPhone: i.billphone, items: JSON.parse(i.items||"[]"), total: i.total, marked: i.marked }));
            const local = getLS("karo_inv_" + project);
            if (JSON.stringify(mapped.sort((a,b)=>a.id>b.id?1:-1)) !== JSON.stringify(local.sort((a,b)=>a.id>b.id?1:-1))) {
              localStorage.setItem("karo_inv_" + project, JSON.stringify(mapped));
              window.dispatchEvent(new Event("karoDataUpdate"));
            }
          }
        }

        // چێک بکە ئایا format کراوەتەوە
        const { data: cashCheck } = await supabase.from("cash").select("formatted_at, cashlog, exchangerate").eq("project", project).single();
        if (cashCheck && cashCheck.formatted_at) {
          const localFormatted = localStorage.getItem("karo_formatted_" + project);
          if (localFormatted !== cashCheck.formatted_at) {
            localStorage.setItem("karo_formatted_" + project, cashCheck.formatted_at);
            localStorage.setItem("karo_exp_" + project, JSON.stringify([]));
            localStorage.setItem("karo_conc_" + project, JSON.stringify([]));
            localStorage.setItem("karo_loans_" + project, JSON.stringify([]));
            localStorage.setItem("karo_contr_" + project, JSON.stringify([]));
            localStorage.setItem("karo_inv_" + project, JSON.stringify([]));
            localStorage.setItem("karo_cashIQD_" + project, JSON.stringify(0));
            localStorage.setItem("karo_cashUSD_" + project, JSON.stringify(0));
            localStorage.setItem("karo_cashLog_" + project, JSON.stringify([]));
            window.dispatchEvent(new Event("karoDataUpdate"));
          }
        }

        if (cashCheck && cashCheck.cashlog) {
          const remoteCashLog = JSON.parse(cashCheck.cashlog || "[]");
          const localCashLog = JSON.parse(localStorage.getItem("karo_cashLog_" + project) || "[]");
          if (remoteCashLog.length !== localCashLog.length) {
            localStorage.setItem("karo_cashLog_" + project, cashCheck.cashlog);
            window.dispatchEvent(new Event("karoDataUpdate"));
          }
        }

      } catch(err) { console.error("Sync error:", err); }
    };
    doSync();
    var interval = setInterval(doSync, 5000);
    return () => clearInterval(interval);
  }, [project, cashIQD, cashUSD, exchangeRate, users]);
  return null;
}