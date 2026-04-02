import { useEffect, useRef } from "react";
import { supabase } from "./supabase";
function getLS(k) { try { var v = JSON.parse(localStorage.getItem(k)); return Array.isArray(v) ? v : []; } catch(e) { return []; } }
function N(v) { return Number(v) ? Number(v) : 0; }
function S(v) { return v ? String(v) : ""; }
function B(v) { return v ? true : false; }
export default function AutoSync({ project, cashIQD, cashUSD, exchangeRate, users }) {
  const lastHash = useRef("");
  const pauseFetch = useRef(false);

  useEffect(() => {
    if (!project) return;

    const handleLocalChange = () => {
      pauseFetch.current = true;
      setTimeout(() => { pauseFetch.current = false; }, 10000);
    };
    window.addEventListener("karoLocalChange", handleLocalChange);

    const doSync = async () => {
      try {
        var exp = getLS("karo_exp_" + project);
        var conc = getLS("karo_conc_" + project);
        var uLen = users ? users.length : 0;
        var hash = exp.length + "" + conc.length + "" + cashIQD + "" + cashUSD + "" + uLen + "_" + Math.floor(Date.now()/3000);
        if (hash === lastHash.current) return;
        lastHash.current = hash;
        await supabase.from("expenses").delete().eq("project", project);
        if (exp.length > 0) {
          var rows = [];
          for (var j = 0; j < exp.length; j++) {
            var e = exp[j];
            rows.push({ id: e.id, project: project, date: e.date, amountiqd: N(e.amountIQD), amountusd: N(e.amountUSD), receiptno: S(e.receiptNo), note: S(e.note), marked: B(e.marked) });
          }
          await supabase.from("expenses").upsert(rows);
        }
        await supabase.from("concrete").delete().eq("project", project);
        if (conc.length > 0) {
          var rows2 = [];
          for (var k = 0; k < conc.length; k++) {
            var c = conc[k];
            rows2.push({ id: c.id, project: project, date: c.date, currency: S(c.currency) ? S(c.currency) : "iqd", meters: N(c.meters), pricepermeter: N(c.pricePerMeter), totalprice: N(c.totalPrice), deposit: N(c.deposit), depositpercent: N(c.depositPercent), received: N(c.received), isreceived: B(c.isReceived), depositclaimed: B(c.depositClaimed), note: c.note, marked: B(c.marked), paidamount: N(c.paidAmount), payments: JSON.stringify(c.payments||[]) });
          }
          await supabase.from("concrete").upsert(rows2);
        }
        await supabase.from("cash").upsert([{ id: project, project: project, cashiqd: cashIQD, cashusd: cashUSD, exchangerate: exchangeRate }]);
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
      } catch(err) { console.error("Sync error:", err); }
    };

    const fetchFromSupabase = async () => {
      if (pauseFetch.current) return;
      try {
        const { data: expData } = await supabase.from("expenses").select("*").eq("project", project);
        if (expData) {
          const mapped = expData.map(e => ({ id: e.id, date: e.date, amountIQD: e.amountiqd, amountUSD: e.amountusd, receiptNo: e.receiptno, note: e.note, marked: e.marked }));
          const local = getLS("karo_exp_" + project);
          if (mapped.length !== local.length) {
            localStorage.setItem("karo_exp_" + project, JSON.stringify(mapped));
            window.dispatchEvent(new Event("karoDataUpdate"));
          }
        }
        const { data: concData } = await supabase.from("concrete").select("*").eq("project", project);
        if (concData) {
          const mapped = concData.map(c => ({ id: c.id, date: c.date, currency: c.currency, meters: c.meters, pricePerMeter: c.pricepermeter, totalPrice: c.totalprice, deposit: c.deposit, depositPercent: c.depositpercent, received: c.received, isReceived: c.isreceived, depositClaimed: c.depositclaimed, note: c.note, marked: c.marked, paidAmount: c.paidamount, payments: JSON.parse(c.payments||"[]") }));
          const local = getLS("karo_conc_" + project);
          if (mapped.length !== local.length) {
            localStorage.setItem("karo_conc_" + project, JSON.stringify(mapped));
            window.dispatchEvent(new Event("karoDataUpdate"));
          }
        }
      } catch(err) { console.error("Fetch error:", err); }
    };

    doSync();
    var syncInterval = setInterval(doSync, 3000);
    var fetchInterval = setInterval(fetchFromSupabase, 3000);

    return () => {
      clearInterval(syncInterval);
      clearInterval(fetchInterval);
      window.removeEventListener("karoLocalChange", handleLocalChange);
    };
  }, [project, cashIQD, cashUSD, exchangeRate, users]);

  return null;
}