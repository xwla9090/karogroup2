FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\RealtimeSync.js"

with open(FILE, "r", encoding="utf-8") as f:
    src = f.read()

changes = []

# ============================================================
# FIX 1: loans subscription زیاد بکە
# ============================================================
old1 = """    const cashSub = supabase.channel("cash_rt_" + project)"""

new1 = """    const loansSub = supabase.channel("loans_" + project)
      .on("postgres_changes", { event: "*", schema: "public", table: "loans", filter: "project=eq." + project }, () => {
        fetchAndUpdate("loans", "karo_loans_", l => ({ id: l.id, type: l.type, personName: l.personname, amountIQD: l.amountiqd, amountUSD: l.amountusd, note: l.note, date: l.date, returned: l.returned, marked: l.marked }));
      }).subscribe();

    const cashSub = supabase.channel("cash_rt_" + project)"""

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: loans subscription زیاد کرا")
else:
    changes.append("⚠️  FIX 1: loans subscription نەدۆزرایەوە")

# ============================================================
# FIX 2: cleanup — loansSub زیاد بکە
# ============================================================
old2 = """      supabase.removeChannel(expSub);
      supabase.removeChannel(concSub);
      supabase.removeChannel(cashSub);"""

new2 = """      supabase.removeChannel(expSub);
      supabase.removeChannel(concSub);
      supabase.removeChannel(loansSub);
      supabase.removeChannel(cashSub);"""

if old2 in src:
    src = src.replace(old2, new2)
    changes.append("✅ FIX 2: cleanup loansSub زیاد کرا")
else:
    changes.append("⚠️  FIX 2: cleanup نەدۆزرایەوە")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — RealtimeSync Fix 4")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print(f"\n✅ فایل پاشەکەوت کرا:\n   {FILE}")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: loans realtime subscription" && git push')
