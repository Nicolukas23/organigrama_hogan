import re

with open('/Users/nicolassantos/.gemini/antigravity/brain/637e5680-8295-4897-9c40-d62c7fcf6f60/scratch/generate_tablero.py', 'r') as f:
    content = f.read()

# Comment out refreshFromSupabase call in init()
content = content.replace('refreshFromSupabase();', 'refreshFromSupabase(); // Kept, but let\'s debug below')

# Add fallback error UI in renderNinebox
replacement = r'''
  let totalItems = 0;
  for(let b = 1; b <= 9; b++){
    const items = FILTERED.filter(r => getCajaNum(r.caja) === b);
    totalItems += items.length;
'''

content = re.sub(
    r'for\(let b = 1; b <= 9; b\+\)\{.*?const items = FILTERED\.filter\(r => getCajaNum\(r\.caja\) === b\);',
    replacement,
    content,
    flags=re.DOTALL
)

fallback = r'''
  }
  if(totalItems === 0 && FILTERED.length > 0) {
    document.querySelector('.matrix-cells').innerHTML = `<div style="grid-column: 1 / -1; padding: 20px; background: rgba(255,0,0,0.1); color: var(--crimson); text-align: center; border-radius: 8px;"><b>Modo Depuración:</b> Hay ${FILTERED.length} colaboradores aquí, pero la matriz está vacía.<br><br>Muestra 1 - Nombre: ${FILTERED[0].nombre}, Caja Original: ${FILTERED[0].caja}, Parseada: ${getCajaNum(FILTERED[0].caja)}</div>`;
  }
}

function renderHogan(){
'''

content = content.replace('}\n\nfunction renderHogan(){', fallback)


with open('/Users/nicolassantos/.gemini/antigravity/brain/637e5680-8295-4897-9c40-d62c7fcf6f60/scratch/generate_tablero.py', 'w') as f:
    f.write(content)

print("Patched.")
