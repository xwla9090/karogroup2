f = open('src/App.js', 'r', encoding='utf-8')
lines = f.readlines()
f.close()

# Line 584 (index 583) - change useState(USERS) to useState([])
lines[583] = '  const [users, setUsers] = useState([]);\n'

# Find the line with "useEffect(() => { setLS("karo_lang"" to add user loading
# We add a new useEffect right after line 584
insert_code = '''  useEffect(() => {
    async function loadUsers() {
      try {
        const { data } = await supabase.from("users").select("*");
        if (data && data.length > 0) {
          const mapped = data.map(u => ({
            username: u.username,
            password: u.password,
            project: u.project,
            label: u.label,
            isAdmin: u.isadmin || false,
            isFrozen: u.isfrozen || false
          }));
          setUsers(mapped);
        } else {
          setUsers(USERS);
        }
      } catch(e) {
        setUsers(USERS);
      }
    }
    loadUsers();
  }, []);
'''

lines.insert(584, insert_code)

# Add supabase import - find line 2 which has AutoSync import
# Add supabase import after it
for i in range(len(lines)):
    if 'import AutoSync from' in lines[i]:
        lines.insert(i + 1, 'import { supabase } from "./supabase";\n')
        break

f = open('src/App.js', 'w', encoding='utf-8')
f.writelines(lines)
f.close()
print("Users fix done!")