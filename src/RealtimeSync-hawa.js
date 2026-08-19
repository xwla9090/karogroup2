import { useEffect } from "react";
import { supabase } from "./supabase";

export default function RealtimeSync({ project, setCashIQD, setCashUSD }) {
  useEffect(() => {
    if (!project) return;

    // ==================== چارەسەری کێشەی گەرانەوەی داتا ====================
    // کێشە: کاتێک بەکارهێنەر داتا دەنووسێت، _karoLocal=true دەبێت
    // بەڵام ئەگەر Supabase trigger بگات پێش ئەوەی _karoLocal=false ببێت،
    // fetchAndUpdate داتای کۆن دێنێتەوە و نرخی نوێ دەگۆڕێت.
    //
    // چارەسەر: بەجای ئەوەی رەقیب بین لەگەل _karoLocal،
    // هەر trigger ی دەبێتە "pending" و بعد لە ئەوەی _karoLocal=false بوو
    // ئەوکات دەخوێنینەوە — نەک یەکسەر.
    // ئەمەش دووبارە نووسینی داتای کۆن بەسەر نوێدا ئەوەندەی کەم دەکات.

    const DEBOUNCE_MS = 500; // چاوەڕوان بکە نیو چرکە بعد لە trigger
    const LOCAL_BLOCK_MS = 12000; // ئەگەر _karoLocal=true بوو، 12چ چاوەڕوان بکە

    const pendingTimers = {};

    const fetchAndUpdate = async (table, localKey, mapper) => {
      // ئەگەر _karoLocal=true بوو، یەکسەر مەرەوە — بەڵام schedule بکە
      if (window._karoLocal) {
        // schedule بکە بعد لەوەی _karoLocal=false بووە
        const checkInterval = setInterval(() => {
          if (!window._karoLocal) {
            clearInterval(checkInterval);
            doFetch();
          }
        }, 300);
        // زیادترین چاوەڕوان: LOCAL_BLOCK_MS
        setTimeout(() => clearInterval(checkInterval), LOCAL_BLOCK_MS);
        return;
      }
      doFetch();

      async function doFetch() {
        // دووبارە تاقیکردنەوە پێش خوێندنەوە
        if (window._karoLocal) return;

        // کاچەی پێشوو بخوێنە بۆ بەراوردکردن
        const localBefore = localStorage.getItem(localKey + project);

        const { data, error } = await supabase
          .from(table)
          .select("*")
          .eq("project", project);

        if (error || !data) return;

        // ئەگەر لەناو ماوەی خوێندنەوەدا _karoLocal=true بووە، مەرەوە
        if (window._karoLocal) return;

        // ئەگەر localStorage گۆڕا لەناو ئەو ماوەیەدا (یەنی بەکارهێنەر نووسیوە)، مەرەوە
        const localAfter = localStorage.getItem(localKey + project);
        if (localBefore !== localAfter) return;

        const mapped = data.map(mapper);
        const local = JSON.parse(localAfter || "[]");

        const remoteStr = JSON.stringify(
          [...data].sort((a, b) => (a.id > b.id ? 1 : -1))
        );
        const localStr = JSON.stringify(
          [...local].sort((a, b) => (a.id > b.id ? 1 : -1))
        );

        if (remoteStr !== localStr) {
          localStorage.setItem(localKey + project, JSON.stringify(mapped));
          window.dispatchEvent(new Event("karoDataUpdate"));
        }
      }
    };

    // دروستکردنی debounced version بۆ هەر تەیبڵ
    const makeDebouncedFetch = (table, localKey, mapper) => {
      return () => {
        const key = table + "_" + project;
        if (pendingTimers[key]) clearTimeout(pendingTimers[key]);
        pendingTimers[key] = setTimeout(() => {
          delete pendingTimers[key];
          fetchAndUpdate(table, localKey, mapper);
        }, DEBOUNCE_MS);
      };
    };

    const expSub = supabase
      .channel("exp2_" + project)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "expenses",
          filter: "project=eq." + project,
        },
        makeDebouncedFetch("expenses", "karo_exp_", (e) => ({
          id: e.id,
          date: e.date,
          amountIQD: e.amountiqd,
          amountUSD: e.amountusd,
          receiptNo: e.receiptno,
          note: e.note,
          marked: e.marked,
        }))
      )
      .subscribe();

    const concSub = supabase
      .channel("conc2_" + project)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "concrete",
          filter: "project=eq." + project,
        },
        makeDebouncedFetch("concrete", "karo_conc_", (c) => ({
          id: c.id,
          date: c.date,
          currency: c.currency,
          meters: c.meters,
          pricePerMeter: c.pricepermeter,
          totalPrice: c.totalprice,
          deposit: c.deposit,
          depositPercent: c.depositpercent,
          received: c.received,
          isReceived: c.isreceived,
          depositClaimed: c.depositclaimed,
          note: c.note,
          marked: c.marked,
          paidAmount: c.paidamount,
          payments: JSON.parse(c.payments || "[]"),
        }))
      )
      .subscribe();

    const cashSub = supabase
      .channel("cash_rt_" + project)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cash",
          filter: "project=eq." + project,
        },
        async (payload) => {
          const newData = payload.new;
          if (!newData) return;

          // ئەگەر _karoLocal=true بوو، cash trigger ئیش ناکات
          // چونکە cash بەکارهێنەر خۆی نووسیوە
          if (window._karoLocal) return;

          const localFormatted = localStorage.getItem(
            "karo_formatted_" + project
          );
          if (
            newData.formatted_at &&
            newData.formatted_at !== localFormatted
          ) {
            localStorage.setItem(
              "karo_formatted_" + project,
              newData.formatted_at
            );
            localStorage.setItem("karo_exp_" + project, JSON.stringify([]));
            localStorage.setItem("karo_conc_" + project, JSON.stringify([]));
            localStorage.setItem("karo_loans_" + project, JSON.stringify([]));
            localStorage.setItem("karo_contr_" + project, JSON.stringify([]));
            localStorage.setItem("karo_inv_" + project, JSON.stringify([]));
            localStorage.setItem(
              "karo_cashIQD_" + project,
              JSON.stringify(0)
            );
            localStorage.setItem(
              "karo_cashUSD_" + project,
              JSON.stringify(0)
            );
            localStorage.setItem(
              "karo_cashLog_" + project,
              JSON.stringify([])
            );
            window.dispatchEvent(new Event("karoDataUpdate"));
            return;
          }

          if (newData.cashiqd !== undefined) {
            localStorage.setItem(
              "karo_cashIQD_" + project,
              JSON.stringify(newData.cashiqd || 0)
            );
            localStorage.setItem(
              "karo_cashUSD_" + project,
              JSON.stringify(newData.cashusd || 0)
            );
            if (setCashIQD) setCashIQD(newData.cashiqd || 0);
            if (setCashUSD) setCashUSD(newData.cashusd || 0);
          }

          if (newData.cashlog) {
            const localCashLog = JSON.parse(
              localStorage.getItem("karo_cashLog_" + project) || "[]"
            );
            const remoteCashLog = JSON.parse(newData.cashlog || "[]");
            if (remoteCashLog.length !== localCashLog.length) {
              localStorage.setItem("karo_cashLog_" + project, newData.cashlog);
              window.dispatchEvent(new Event("karoDataUpdate"));
            }
          }
        }
      )
      .subscribe();

    return () => {
      // پاککردنەوەی هەموو pending timer ـەکان
      Object.values(pendingTimers).forEach((t) => clearTimeout(t));
      supabase.removeChannel(expSub);
      supabase.removeChannel(concSub);
      supabase.removeChannel(cashSub);
    };
  }, [project]);

  return null;
}
