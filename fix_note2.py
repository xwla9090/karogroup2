f = open('src/App.js', 'r', encoding='utf-8')
lines = f.readlines()
f.close()

old = lines[3066]
new = old.replace('border: 2px solid ${item.marked?PRIMARY:s.border}', 'border: `2px solid ${item.marked?PRIMARY:s.border}`')
lines[3066] = new

f = open('src/App.js', 'w', encoding='utf-8')
f.writelines(lines)
f.close()
print("Fix done!")