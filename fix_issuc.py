with open('/Users/nicolassantos/.gemini/antigravity/brain/637e5680-8295-4897-9c40-d62c7fcf6f60/scratch/generate_tablero.py', 'r') as f:
    content = f.read()

content = content.replace(
    r"return ['si','sí'].includes((v || '').toLowerCase().trim());",
    r"return ['si','sí'].includes(String(v || '').toLowerCase().trim());"
)

with open('/Users/nicolassantos/.gemini/antigravity/brain/637e5680-8295-4897-9c40-d62c7fcf6f60/scratch/generate_tablero.py', 'w') as f:
    f.write(content)
