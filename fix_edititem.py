with open('src/App.js', encoding='utf-8') as f:
    lines = f.readlines()

# لاین 2875 دوای editModalOpen، editItem زیاد بکەین
lines[2874] = '  const [editModalOpen, setEditModalOpen] = useState(false);\n  const [editItem, setEditItem] = useState(null);\n'

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('done!')