with open('src/RealtimeSync.js', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'if (!window.karoLocal) fetchAndUpdate("concrete", "karo_conc",',
    'fetchAndUpdate("concrete", "karo_conc_",'
)

with open('src/RealtimeSync.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('done!')