with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

with open('concrete_funcs.txt', 'w', encoding='utf-8') as out:
    for i in range(2917, 3160):
        out.write(f"{i+1}: {lines[i]}")

print('done!')