FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8-sig") as f:
    src = f.read()

changes = []

# ============================================================
# هەموو concrete فەنکشنەکان — _karoLocal بگۆڕە بۆ setTimeout
# ============================================================

# FIX 1: deletePayment
old1 = """    window._karoLocal = true;
    await supabase.from("concrete").upsert([{
      id: updItem.id, project: pKey, date: updItem.date,
      currency: String(updItem.currency||"iqd"),
      meters: Number(updItem.meters||0),
      pricepermeter: Number(updItem.pricePerMeter||0),
      totalprice: Number(updItem.totalPrice||0),
      deposit: Number(updItem.deposit||0),
      depositpercent: Number(updItem.depositPercent||0),
      received: Number(updItem.received||0),
      isreceived: false,
      depositclaimed: !!updItem.depositClaimed,
      note: String(updItem.note||""),
      marked: !!updItem.marked,
      paidamount: Number(updItem.paidAmount||0),
      payments: JSON.stringify(updItem.payments||[])
    }]);
    window._karoLocal = false;
  };

  const unclaimDeposit"""

new1 = """    window._karoLocal = true;
    await supabase.from("concrete").upsert([{
      id: updItem.id, project: pKey, date: updItem.date,
      currency: String(updItem.currency||"iqd"),
      meters: Number(updItem.meters||0),
      pricepermeter: Number(updItem.pricePerMeter||0),
      totalprice: Number(updItem.totalPrice||0),
      deposit: Number(updItem.deposit||0),
      depositpercent: Number(updItem.depositPercent||0),
      received: Number(updItem.received||0),
      isreceived: false,
      depositclaimed: !!updItem.depositClaimed,
      note: String(updItem.note||""),
      marked: !!updItem.marked,
      paidamount: Number(updItem.paidAmount||0),
      payments: JSON.stringify(updItem.payments||[])
    }]);
    setTimeout(() => { window._karoLocal = false; }, 2000);
  };

  const unclaimDeposit"""

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: deletePayment — setTimeout زیاد کرا")
else:
    changes.append("⚠️  FIX 1: deletePayment نەدۆزرایەوە")

# FIX 2: handleSave concrete
old2 = """    window._karoLocal = true;
    await supabase.from("concrete").upsert([{
      id: item.id, project: pKey, date: item.date,
      currency: String(item.currency || "iqd"),
      meters: Number(item.meters || 0),
      pricepermeter: Number(item.pricePerMeter || 0),
      totalprice: Number(item.totalPrice || 0),
      deposit: Number(item.deposit || 0),
      depositpercent: Number(item.depositPercent || 0),
      received: Number(item.received || 0),
      isreceived: false, depositclaimed: false,
      note: String(item.note || ""), marked: false,
      paidamount: 0, payments: "[]"
    }]);
    window._karoLocal = false;
    resetForm();
    setShowForm(false);"""

new2 = """    window._karoLocal = true;
    await supabase.from("concrete").upsert([{
      id: item.id, project: pKey, date: item.date,
      currency: String(item.currency || "iqd"),
      meters: Number(item.meters || 0),
      pricepermeter: Number(item.pricePerMeter || 0),
      totalprice: Number(item.totalPrice || 0),
      deposit: Number(item.deposit || 0),
      depositpercent: Number(item.depositPercent || 0),
      received: Number(item.received || 0),
      isreceived: false, depositclaimed: false,
      note: String(item.note || ""), marked: false,
      paidamount: 0, payments: "[]"
    }]);
    setTimeout(() => { window._karoLocal = false; }, 2000);
    resetForm();
    setShowForm(false);"""

if old2 in src:
    src = src.replace(old2, new2)
    changes.append("✅ FIX 2: handleSave concrete — setTimeout زیاد کرا")
else:
    changes.append("⚠️  FIX 2: handleSave concrete نەدۆزرایەوە")

# FIX 3: markReceived concrete
old3 = """      window._karoLocal = true;
      await supabase.from("concrete").upsert([{ id: id, project: pKey, isreceived: true, paidamount: Number(item.received||0), payments: JSON.stringify(item.payments||[]) }], { onConflict: "id" });
      window._karoLocal = false;"""

new3 = """      window._karoLocal = true;
      await supabase.from("concrete").upsert([{ id: id, project: pKey, isreceived: true, paidamount: Number(item.received||0), payments: JSON.stringify(item.payments||[]) }], { onConflict: "id" });
      setTimeout(() => { window._karoLocal = false; }, 2000);"""

if old3 in src:
    src = src.replace(old3, new3)
    changes.append("✅ FIX 3: markReceived — setTimeout زیاد کرا")
else:
    changes.append("⚠️  FIX 3: markReceived نەدۆزرایەوە")

# FIX 4: addPayment concrete
old4 = """    window._karoLocal = true;
    await supabase.from("concrete").upsert([{
      id: updItem.id, project: pKey, date: updItem.date,
      currency: String(updItem.currency||"iqd"),
      meters: Number(updItem.meters||0),
      pricepermeter: Number(updItem.pricePerMeter||0),
      totalprice: Number(updItem.totalPrice||0),
      deposit: Number(updItem.deposit||0),
      depositpercent: Number(updItem.depositPercent||0),
      received: Number(updItem.received||0),
      isreceived: !!updItem.isReceived,
      depositclaimed: !!updItem.depositClaimed,
      note: String(updItem.note||""),
      marked: !!updItem.marked,
      paidamount: Number(updItem.paidAmount||0),
      payments: JSON.stringify(updItem.payments||[])
    }]);
    window._karoLocal = false;
  };

  const claimDeposit"""

new4 = """    window._karoLocal = true;
    await supabase.from("concrete").upsert([{
      id: updItem.id, project: pKey, date: updItem.date,
      currency: String(updItem.currency||"iqd"),
      meters: Number(updItem.meters||0),
      pricepermeter: Number(updItem.pricePerMeter||0),
      totalprice: Number(updItem.totalPrice||0),
      deposit: Number(updItem.deposit||0),
      depositpercent: Number(updItem.depositPercent||0),
      received: Number(updItem.received||0),
      isreceived: !!updItem.isReceived,
      depositclaimed: !!updItem.depositClaimed,
      note: String(updItem.note||""),
      marked: !!updItem.marked,
      paidamount: Number(updItem.paidAmount||0),
      payments: JSON.stringify(updItem.payments||[])
    }]);
    setTimeout(() => { window._karoLocal = false; }, 2000);
  };

  const claimDeposit"""

if old4 in src:
    src = src.replace(old4, new4)
    changes.append("✅ FIX 4: addPayment — setTimeout زیاد کرا")
else:
    changes.append("⚠️  FIX 4: addPayment نەدۆزرایەوە")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — Concrete Timeout Fix")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("✅ فایل پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: concrete sync timeout" && git push')
