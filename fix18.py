FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\AutoSync.js"

with open(FILE, "r", encoding="utf-8") as f:
    src = f.read()

changes = []

# FIX: loans upsert لە AutoSync لاببە — چونکە RealtimeSync و handleSave ئەمەی دەکەن
old1 = """        if (loans.length > 0) {
          var rows3 = [];
          for (var l = 0; l < loans.length; l++) {
            var ln = loans[l];
            rows3.push({ id: ln.id, project: project, date: S(ln.date), type: S(ln.type), personname: S(ln.personName), amountiqd: N(ln.amountIQD), amountusd: N(ln.amountUSD), note: S(ln.note), returned: B(ln.returned), marked: B(ln.marked) });
          }
          await supabase.from("loans").upsert(rows3);
        }"""

new1 = """        // loans AutoSync لە ئێرەوە لابرا — handleSave و RealtimeSync ئەمەی دەکەن
        // AutoSync loans نانێردرێت چونکە localStorage داتای کۆن دەبێت"""

if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: loans upsert لە AutoSync لابرا")
else:
    changes.append("⚠️  FIX 1: loans upsert نەدۆزرایەوە")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — Fix 18")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("✅ AutoSync.js پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: remove loans from AutoSync" && git push')
