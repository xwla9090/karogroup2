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
        var uLen = users ? users.length : 0;
        var hash = exp.length + "_" + conc.length + "_" + cashIQD + "_" + cashUSD + "_" + uLen + "_" + Math.floor(Date.now()/5000);
        if (hash === lastHash.current) return;
        lastHash.current = hash;
        await supabase.from("expenses").delete().eq("project", project);
        if (exp.length > 0) {
          var rows = [];
          for (var i = 0; i < exp.length; i++) {
            var e = exp[i];
            rows.push({ id: e.id, project: project, date: e.date, amountiqd: N(e.amountIQD), amountusd: N(e.amountUSD), receiptno: S(e.receiptNo), note: S(e.note), marked: B(e.marked) });
          }
          await supabase.from("expenses").upsert(rows);
        }
        await supabase.from("concrete").delete().eq("project", project);
        if (conc.length > 0) {
          var rows2 = [];
          for (var i = 0; i < conc.length; i++) {
            var c = conc[i];
            rows2.push({ id: c.id, project: project, date: c.date, currency: S(c.currency) ? S(c.currency) : "iqd", meters: N(c.meters), pricepermeter: N(c.pricePerMeter), totalprice: N(c.totalPrice), deposit: N(c.deposit), depositpercent: N(c.depositPercent), received: N(c.received), isreceived: B(c.isReceived), depositclaimed: B(c.depositClaimed), note: S(c.note), marked: B(c.marked), paidamount: N(c.paidAmount), payments: JSON.stringify(c.payments||[]) });
          }
          await supabase.from("concrete").upsert(rows2);
        }
        await supabase.from("cash").upsert([{ id: project, project: project, cashiqd: cashIQD, cashusd: cashUSD, exchangerate: exchangeRate }]);
        if (users && users.length > 0) {
          for (var i = 0; i < users.length; i++) {
            var u = users[i];
            await supabase.from("users").upsert([{ username: u.username, password: u.password, project: u.project, label: u.label, isadmin: B(u.isAdmin), isfrozen: B(u.isFrozen) }]);
          }
          var dbUsers = await supabase.from("users").select("username");
          if (dbUsers.data) {
            var localNames = users.map(function(u) { return u.username; });
            for (var i = 0; i < dbUsers.data.length; i++) {
              if (localNames.indexOf(dbUsers.data[i].username) === -1) {
                await supabase.from("users").delete().eq("username", dbUsers.data[i].username);
              }
            }
          }
        }
        console.log("Synced:", project);
      } catch(err) { console.error("Sync error:", err); }
    };
    doSync();
    var interval = setInterval(doSync, 5000);
    return () => clearInterval(interval);
  }, [project, cashIQD, cashUSD, exchangeRate, users]);
  return null;
}
