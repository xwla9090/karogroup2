with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# بزانین کوێ دووجار }; هەیە
for i in range(2868, 3482):
    if lines[i].strip() == '};' and i+1 < len(lines) and lines[i+1].strip() in ['};', '};\n']:
        print(f'duplicate at line {i+1}')