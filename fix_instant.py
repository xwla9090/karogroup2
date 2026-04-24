FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\RealtimeSync.js"

with open(FILE, "r", encoding="utf-8") as f:
    src = f.read()

old1 = """    const fetchAndUpdate = async (table, localKey, mapper) => {
      if (window._karoLocal) return;
      await new Promise(r => setTimeout(r, 3000));
      if (window._karoLocal) return;
      const { data } = await supabase.from(table).select("*").eq("project", project);
      if (data) {
        const local = JSON.parse(localStorage.getItem(localKey + project) || "[]");
        if (JSON.stringify(data.sort((a,b)=>a.id>b.id?1:-1)) !== JSON.stringify(local.sort((a,b)=>a.id>b.id?1:-1))) {
          localStorage.setItem(localKey + project, JSON.stringify(data.map(mapper)));
          window.dispatchEvent(new Event("karoDataUpdate"));
        }
      }
      window._karoLocal = false;
    };"""

new1 = """    const fetchAndUpdate = async (table, localKey, mapper) => {
      const { data } = await supabase.from(table).select("*").eq("project", project);
      if (data) {
        localStorage.setItem(localKey + project, JSON.stringify(data.map(mapper)));
        window.dispatchEvent(new Event("karoDataUpdate"));
      }
    };"""

changes = []
if old1 in src:
    src = src.replace(old1, new1)
    changes.append("✅ FIX 1: setTimeout(3000) و _karoLocal لابران — ڕاستەوخۆ")
else:
    changes.append("⚠️  FIX 1: fetchAndUpdate نەدۆزرایەوە")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(src)

print("\n" + "="*55)
print("  کارۆ گروپ — Instant Sync Fix")
print("="*55)
for c in changes:
    print(c)
print("="*55)
print("✅ RealtimeSync.js پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: instant realtime sync" && git push')
