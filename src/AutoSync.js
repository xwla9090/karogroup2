import { useEffect, useRef } from "react";
import { supabase } from "./supabase";
function getLS(k) { try { var v = JSON.parse(localStorage.getItem(k)); return Array.isArray(v) ? v : []; } catch(e) { return []; } }
function N(v) { return Number(v) ? Number(v) : 0; }
function S(v) { return v ? String(v) : ""; }
function B(v) { return v ? true : false; }
export default function AutoSync({ project, cashIQD, cashUSD, exchangeRate, users }) {
  const lastHash = useRef("");
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
        var hash = exp.length + "" + conc.length + "" + loans.length + "" + contr.length + "" + inv.length + "" + cashIQD + "" + cashUSD + "" + uLen;
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

        // چێک بکە ئایا format کراوەتەوە
        const { data: cashCheck } = await supabase.from("cash").select("formatted_at, cashlog").eq("project", project).single();
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
    var interval = setInterval(doSync, 60000);
    return () => clearInterval(interval);
  }, [project, cashIQD, cashUSD, exchangeRate, users]);
  return null;
}