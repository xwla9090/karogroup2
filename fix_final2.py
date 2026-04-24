FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"
AUTO_FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\AutoSync.js"

# ============================================================
# FIX 1: App.js — هەموو _karoLocal لاببە
# ============================================================
with open(FILE, "r", encoding="utf-8-sig") as f:
    lines = f.readlines()

count = 0
for i, line in enumerate(lines):
    stripped = line.strip()
    if stripped in ["window._karoLocal = true;", "window._karoLocal = false;"]:
        lines[i] = ""
        count += 1
    elif "setTimeout(() => { window._karoLocal = false; }" in stripped:
        lines[i] = ""
        count += 1

with open(FILE, "w", encoding="utf-8") as f:
    f.writelines(lines)

print(f"✅ FIX 1: {count} خەتی _karoLocal لابرا لە App.js")

# ============================================================
# FIX 2: AutoSync.js — conc لاببە بە line-based
# ============================================================
with open(AUTO_FILE, "r", encoding="utf-8-sig") as f:
    auto_lines = f.readlines()

in_conc_block = False
new_lines = []
skip_count = 0

i = 0
while i < len(auto_lines):
    line = auto_lines[i]
    # بدۆزەوە بلۆکی conc
    if "conc.length > 0" in line or "karo_conc_" in line and "rows2" in line:
        in_conc_block = True
    
    if in_conc_block:
        skip_count += 1
        # دووانە بعد از }  بلۆک تەواو دەبێت
        if line.strip() == "}" and skip_count > 3:
            in_conc_block = False
            i += 1
            continue
        i += 1
        continue
    
    new_lines.append(line)
    i += 1

# ئەگەر conc block نەدۆزرایەوە، فایل بەیەکەوە بمێنێت
if skip_count == 0:
    print("⚠️  FIX 2: AutoSync conc block نەدۆزرایەوە — دەستی دەگۆڕین")
    # دەستی بگۆڕین
    with open(AUTO_FILE, "r", encoding="utf-8") as f:
        auto_src = f.read()
    
    # ببینە conc rows لەتێیدایە
    if "rows2" in auto_src:
        import re
        # بلۆکی rows2 لاببە
        auto_src = re.sub(
            r'\s*if \(conc\.length > 0\) \{[^}]+var rows2[^}]+\}[^}]+\}[^}]+\}',
            '\n        // concrete AutoSync لابرا',
            auto_src,
            flags=re.DOTALL
        )
        with open(AUTO_FILE, "w", encoding="utf-8") as f:
            f.write(auto_src)
        print("✅ FIX 2: AutoSync conc regex لابرا")
    else:
        print("⚠️  FIX 2: rows2 نەدۆزرایەوە — AutoSync پێشتر چاک بووە")
else:
    with open(AUTO_FILE, "w", encoding="utf-8") as f:
        f.writelines(new_lines)
    print(f"✅ FIX 2: AutoSync conc block لابرا ({skip_count} خەت)")

print("\n" + "="*55)
print("  کارۆ گروپ — Final Fix 2")
print("="*55)
print("✅ _karoLocal تەواو لابرا")
print("✅ AutoSync conc لابرا")
print("="*55)
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: remove karoLocal and AutoSync conc" && git push')
