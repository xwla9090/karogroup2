with open('src/App.js', encoding='utf-8') as f:
    content = f.read()

# هەموو karoDataUpdate گوێگرەکان لابەرین
old = '''  useEffect(() => {
    const handler = () => setItems(getLS(KEY, []));
    window.addEventListener("karoDataUpdate", handler);
    return () => window.removeEventListener("karoDataUpdate", handler);
  }, [KEY]);
'''

count = content.count(old)
print(f'found {count} times')
content = content.replace(old, '')

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('saved!')