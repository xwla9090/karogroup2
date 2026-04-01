f = open('src/App.js', 'r', encoding='utf-8')
lines = f.readlines()
f.close()

lines[3064] = '                    <TD s={s} style={{ minWidth: 100 }}>{item.note}</TD>\n'
lines[3065] = '                    <TD s={s} style={{ minWidth: 35 }}>\n'
lines[3066] = '                      <button onClick={()=>toggleMark(item.id)} style={{ width: 22, height: 22, borderRadius: 4, border: 2px solid ${item.marked?PRIMARY:s.border}, background: item.marked?PRIMARY:"transparent", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", margin: "0 auto" }}>\n'
lines[3067] = '                        {item.marked&&<I.Check />}\n'
lines[3068] = '                      </button>\n'
lines[3069] = '                    </TD>\n'

f = open('src/App.js', 'w', encoding='utf-8')
f.writelines(lines)
f.close()
print("Note fix done!")