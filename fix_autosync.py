FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\AutoSync.js"

CORRECT = '''import { useEffect, useRef } from "react";
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
        var cashLogData = [];
        try { cashLogData = JSON.parse(localStorage.getItem("karo_cashLog_" + project) || "[]"); } catch(e) {}
        var uLen = users ? users.length : 0;
        var hash = cashIQD + "" + cashUSD + "" + uLen + "_" + Math.floor(Date.now()/5000);
        if (hash === lastHash.current) return;
        lastHash.current = hash;

        // cash تەنها — conc و exp و loans لە ئێرە لابران چونکە RealtimeSync ئەمەی دەکات
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
'''

with open(FILE, "w", encoding="utf-8") as f:
    f.write(CORRECT)

print("\n" + "="*55)
print("  کارۆ گروپ — AutoSync Final Fix")
print("="*55)
print("✅ conc, exp, loans لە AutoSync لابران")
print("✅ تەنها cash و users دەمێنێتەوە")
print("="*55)
print("✅ AutoSync.js پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: AutoSync only cash and users" && git push')
