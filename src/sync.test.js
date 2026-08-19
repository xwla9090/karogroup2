/* تاقیکردنەوەی یاساکانی MERGE — دڵنیابوون لەوەی داتا نە دەگەڕێتەوە
   نە خۆکار دەسڕێتەوە. */

jest.mock("./supabase", () => ({
  supabase: {
    from: () => ({
      upsert: async () => ({ error: null }),
      delete: () => ({ eq: async () => ({ error: null }) }),
      update: () => ({ eq: async () => ({ error: null }) }),
      select: () => ({ eq: async () => ({ data: [], error: null }) })
    }),
    rpc: async () => ({ data: null, error: null })
  }
}));

const sync = require("./sync");

const P = "testproj";
const KEY = "karo_exp_" + P;

beforeEach(() => {
  localStorage.clear();
});

/* ڕیزێکی سێرڤەر */
const row = (id, amt, note) => ({
  id, project: P, date: "2026-08-19",
  amountiqd: amt, amountusd: 0, receiptno: "", note: note || "", marked: false
});

test("١) داتای سێرڤەر دەگاتە localStorage", () => {
  sync.mergeRemote("expenses", P, [row("a", 100)], { full: true });
  const list = sync.localList("expenses", P);
  expect(list).toHaveLength(1);
  expect(list[0].amountIQD).toBe(100);
});

test("٢) ڕیزی تازە زیادکراو (pending) بە داتای سێرڤەر ناسڕدرێتەوە", () => {
  // بەکارهێنەر ڕیزێک زیاد دەکات — هێشتا نەگەیشتووەتە سێرڤەر
  sync.saveLocalList("expenses", P, [{ id: "new1", date: "2026-08-19", amountIQD: 500 }]);
  sync.pushUpsert("expenses", P, [row("new1", 500)]);

  // سێرڤەر لیستی خۆی دەنێرێت — بێ ئەم ڕیزە
  sync.mergeRemote("expenses", P, [], { full: true });

  const ids = sync.localList("expenses", P).map(r => r.id);
  expect(ids).toContain("new1");          // ⭐ نەسڕاوەتەوە
});

test("٣) ڕیزی سڕاو ناگەڕێتەوە، سڕینەوەکەش دووبارە ڕیز دەکرێت", () => {
  sync.mergeRemote("expenses", P, [row("x", 100)], { full: true });
  expect(sync.localList("expenses", P)).toHaveLength(1);

  sync.saveLocalList("expenses", P, []);
  sync.pushDelete("expenses", "x");

  // سێرڤەر هێشتا ڕیزەکەی هەیە (سڕینەوەکە نەگەیشتووە)
  const before = sync.pendingCount();
  sync.mergeRemote("expenses", P, [row("x", 100)], { full: true });

  expect(sync.localList("expenses", P)).toHaveLength(0);   // ⭐ نەگەڕاوەتەوە
  expect(sync.pendingCount()).toBeGreaterThanOrEqual(before);
});

test("٤) ڕیزی لە ئامێرێکی تر سڕاو (نە pending) لادەبرێت", () => {
  sync.saveLocalList("expenses", P, [
    { id: "keep", amountIQD: 1 },
    { id: "gone", amountIQD: 2 }
  ]);
  sync.mergeRemote("expenses", P, [row("keep", 1)], { full: true });
  const ids = sync.localList("expenses", P).map(r => r.id);
  expect(ids).toEqual(["keep"]);
});

test("٥) merge ـی تاک (realtime) ڕیزەکانی تر لانابات", () => {
  sync.saveLocalList("expenses", P, [{ id: "a", amountIQD: 1 }, { id: "b", amountIQD: 2 }]);
  sync.applyRemoteRow("expenses", P, row("c", 3));
  const ids = sync.localList("expenses", P).map(r => r.id).sort();
  expect(ids).toEqual(["a", "b", "c"]);
});

test("٦) وێنەی وەسڵ (خانەی تەنها-ناوخۆیی) لە merge ـدا نافەوتێت", () => {
  sync.saveLocalList("expenses", P, [
    { id: "a", amountIQD: 100, receiptImg: "data:image/png;base64,XXX" }
  ]);
  sync.mergeRemote("expenses", P, [row("a", 250)], { full: true });
  const it = sync.localList("expenses", P)[0];
  expect(it.amountIQD).toBe(250);                              // نوێکراوە
  expect(it.receiptImg).toBe("data:image/png;base64,XXX");     // ⭐ پارێزراوە
});

test("٧) گۆڕانی بڕ بە هەمان درێژی دیار دەبێت (باگی hash ـی کۆن)", () => {
  sync.mergeRemote("expenses", P, [row("a", 100000)], { full: true });
  const changed = sync.mergeRemote("expenses", P, [row("a", 200000)], { full: true });
  expect(changed).toBe(true);
  expect(sync.localList("expenses", P)[0].amountIQD).toBe(200000);
});

test("٨) سڕینەوەی realtime کاریگەری لەسەر ڕیزی pending نییە", () => {
  sync.saveLocalList("expenses", P, [{ id: "mine", amountIQD: 9 }]);
  sync.pushUpsert("expenses", P, [row("mine", 9)]);
  const changed = sync.applyRemoteDelete("expenses", P, "mine");
  expect(changed).toBe(false);
  expect(sync.localList("expenses", P)).toHaveLength(1);
});

test("٩) سلفەی کۆنکرێت: payments بە دروستی map دەکرێت", () => {
  sync.mergeRemote("concrete", P, [{
    id: "c1", project: P, date: "2026-08-19", currency: "iqd",
    meters: 10, pricepermeter: 100, totalprice: 1000, deposit: 200,
    depositpercent: 20, received: 800, isreceived: false, depositclaimed: true,
    note: "", marked: false, paidamount: 300,
    payments: JSON.stringify([{ id: "p1", amount: 300, date: "2026-08-19" }])
  }], { full: true });
  const c = sync.localList("concrete", P)[0];
  expect(c.payments).toHaveLength(1);
  expect(c.payments[0].amount).toBe(300);
  expect(c.depositClaimed).toBe(true);
});
