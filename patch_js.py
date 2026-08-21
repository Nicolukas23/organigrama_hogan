import re

with open('/Users/nicolassantos/.gemini/antigravity/brain/637e5680-8295-4897-9c40-d62c7fcf6f60/scratch/generate_tablero.py', 'r') as f:
    content = f.read()

# Make getCajaNum completely bulletproof
content = re.sub(
    r'function getCajaNum\(c\)\{.*?return isNaN\(n\) \? null : n;\n\}',
    r'''function getCajaNum(c){
  if(c === null || c === undefined || c === '') return null;
  const n = parseInt(String(c).replace(/[^0-9-]/g, ''), 10);
  return isNaN(n) ? null : n;
}''',
    content, flags=re.DOTALL
)

with open('/Users/nicolassantos/.gemini/antigravity/brain/637e5680-8295-4897-9c40-d62c7fcf6f60/scratch/generate_tablero.py', 'w') as f:
    f.write(content)

print("Patched.")
