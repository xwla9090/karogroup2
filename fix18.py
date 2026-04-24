with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# لاین 3237 و 3238 دەگۆڕین بۆ یەک تەیبڵی ڕاست
lines[3236] = '                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 15, fontSize: 13 }}>\n                      <thead>\n'
lines[3237] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')