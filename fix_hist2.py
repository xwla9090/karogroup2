f = open('src/App.js', 'r', encoding='utf-8')
lines = f.readlines()
f.close()

# Find and replace the entire table row section
for i in range(len(lines)):
    if '{[...recent].reverse().map(log' in lines[i]:
        start = i
        break

# Replace lines from the map to the closing
new_rows = '''              {[...recent].reverse().map(log => (
                <tr key={log.id} style={{ textAlign: "center" }}>
                  <TD s={s} style={{ direction: "ltr", fontSize: 12, minWidth: 85 }}>{log.date} {log.time}</TD>
                  <TD s={s} style={{ minWidth: 200 }}>{log.desc}</TD>
                  <TD s={s} style={{ direction: "ltr", color: log.iqd>=0?s.success:s.danger, fontWeight: 600, minWidth: 80 }}>
                    {log.iqd>=0?"+":""}{fmt(log.iqd)}
                  </TD>
                  <TD s={s} style={{ direction: "ltr", color: log.usd>=0?s.success:s.danger, fontWeight: 600, minWidth: 70 }}>
                    {log.usd>=0?"+":""}${fmt(log.usd)}
                  </TD>
                  <TD s={s} style={{ direction: "ltr", fontWeight: 600, minWidth: 90, color: PRIMARY }}>{fmt(log.balIQD)}</TD>
                  <TD s={s} style={{ direction: "ltr", fontWeight: 600, minWidth: 80, color: PRIMARY }}>${fmt(log.balUSD)}</TD>
                </tr>
              ))}
'''

# Find end of the map block
for j in range(start, len(lines)):
    if '))}' in lines[j]:
        end = j + 1
        break

lines[start:end] = [new_rows]

f = open('src/App.js', 'w', encoding='utf-8')
f.writelines(lines)
f.close()
print("History fix v2 done!")