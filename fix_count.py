with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()
opens = 0
closes = 0
for i in range(2868, 3482):
    opens += lines[i].count('{')
    closes += lines[i].count('}')
print('opens:', opens, 'closes:', closes, 'diff:', opens-closes)