FILE = r"C:\Users\surface\OneDrive\Desktop\karogroup2\src\App.js"

with open(FILE, "r", encoding="utf-8-sig") as f:
    lines = f.readlines()

changes = 0

for i, line in enumerate(lines):
    if "cashUpdatedByMe.current" in line:
        lines[i] = line.replace("cashUpdatedByMe.current", "window._cashUpdatedByMe")
        changes += 1

with open(FILE, "w", encoding="utf-8") as f:
    f.writelines(lines)

print(f"✅ {changes} خەت گۆڕدرا — cashUpdatedByMe → window._cashUpdatedByMe")
print("\nئێستا ئەمەی خوارەوە بنووسە:")
print('  git add . && git commit -m "fix: cashUpdatedByMe window global" && git push')
