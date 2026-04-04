
with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# doFormat async بکەین
for i, line in enumerate(lines):
    if 'const doFormat = () => {' in line:
        lines[i] = '  const doFormat = async () => {\n'
        break

# لاین 1050-1068 دەگۆڕین
lines[1049] = '      await supabase.from("expenses").delete().eq("project", pKey);\n'
lines[1050] = '      await supabase.from("concrete").delete().eq("project", pKey);\n'
lines[1051] = '      await supabase.from("loans").delete().eq("project", pKey);\n'
lines[1052] = '      await supabase.from("contractor").delete().eq("project", pKey);\n'
lines[1053] = '      await supabase.from("cash").delete().eq("project", pKey);\n'
lines[1054] = '      localStorage.setItem("karo_exp_" + pKey, JSON.stringify([]));\n'
lines[1055] = '      localStorage.setItem("karo_conc_" + pKey, JSON.stringify([]));\n'
lines[1056] = '      localStorage.setItem("karo_loans_" + pKey, JSON.stringify([]));\n'
lines[1057] = '      localStorage.setItem("karo_contr_" + pKey, JSON.stringify([]));\n'
lines[1058] = '      localStorage.setItem("karo_cashIQD_" + pKey, JSON.stringify(0));\n'
lines[1059] = '      localStorage.setItem("karo_cashUSD_" + pKey, JSON.stringify(0));\n'
lines[1060] = '      setCashIQD(0);\n'
lines[1061] = '      setCashUSD(0);\n'
lines[1062] = '      setCashLog([]);\n'
lines[1063] = '      setExchangeRate(1500);\n'
lines[1064] = '      setFormatModal(false);\n'
lines[1065] = '      setFmtUser("");\n'
lines[1066] = '      setFmtPass("");\n'
lines[1067] = '      alert(t.formatSuccess);\n'
lines[1068] = ''

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')
