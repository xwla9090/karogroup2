with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

changed = 0
for i, line in enumerate(lines):
    # تەنها لاینە تەواوەکان دەگۆڕین
    if 'setItems(prev => prev.filter(i => i.id !== id));' in line and i > 1828:
        lines[i] = line.rstrip('\n') + '\n    window.dispatchEvent(new Event("karoLocalChange"));\n'
        changed += 1
    elif 'setItems(prev => prev.map(i => i.id===id?' in line and '}:i));' in line and i > 1828:
        lines[i] = line.rstrip('\n') + '\n    window.dispatchEvent(new Event("karoLocalChange"));\n'
        changed += 1
    elif 'setItems(prev => prev.map(i => i.id === id ?' in line and '} : i));' in line and i > 1828:
        lines[i] = line.rstrip('\n') + '\n    window.dispatchEvent(new Event("karoLocalChange"));\n'
        changed += 1

print(f'changed {changed} lines!')

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('saved!')