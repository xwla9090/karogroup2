FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8-sig") as f:
    lines = f.readlines()

changes = 0

for i, line in enumerate(lines):
    stripped = line.strip()
    indent = line[:len(line) - len(line.lstrip())]
    
    # هەموو _karoLocal = true لاببە
    if stripped == "window._karoLocal = true;":
        lines[i] = ""
        changes += 1
    
    # هەموو _karoLocal = false لاببە
    elif stripped == "window._karoLocal = false;":
        lines[i] = ""
        changes += 1
    
    # هەموو setTimeout _karoLocal لاببە
    elif "setTimeout(() => { window._karoLocal = false; }" in stripped:
        lines[i] = ""
        changes += 1

with open(FILE, "w", encoding="utf-8") as f:
    f.writelines(lines)

print("\n" + "="*55)
print("  کارۆ گروپ — Remove _karoLocal")
print("="*55)
print(f"✅ {changes} خەت لابرا (_karoLocal تەواو لابرا)")
print("="*55)
print("✅ فایل پاشەکەوت کرا")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: remove _karoLocal completely" && git push')
