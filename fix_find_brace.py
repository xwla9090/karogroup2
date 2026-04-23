with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

count = 0
for i in range(2868, 3482):
    count += lines[i].count('{') - lines[i].count('}')
    if count < 0 or count > 5:
        print(f'line {i+1}: count={count} | {lines[i].rstrip()}')