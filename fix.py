import re

with open('/Users/nicolassantos/.gemini/antigravity/brain/637e5680-8295-4897-9c40-d62c7fcf6f60/scratch/generate_tablero.py', 'r') as f:
    content = f.read()

clean_render_ninebox = r'''function renderNinebox(){
  let totalItems = 0;
  for(let b = 1; b <= 9; b++){
    const items = FILTERED.filter(r => getCajaNum(r.caja) === b);
    totalItems += items.length;
    const cntEl = document.getElementById(`cnt${b}`);
    const boxEl = document.getElementById(`box${b}`);
    if(cntEl) cntEl.textContent = items.length;
    if(boxEl){
      boxEl.innerHTML = '';
      items.forEach(p => {
        const vc = p.hogan_versatilidad === 'Alta Versatilidad' ? 'mb-alta' : 
                   p.hogan_versatilidad === 'Media Versatilidad' ? 'mb-media' : 
                   p.hogan_versatilidad ? 'mb-prof' : '';
        const el = document.createElement('div');
        el.className = 'card-item';
        el.onclick = () => openModal(p);
        el.innerHTML = `
          <div class="ci-name">${p.nombre}</div>
          <div class="ci-sub">${p.cargo || '-'}</div>
          <div class="ci-tags">
            ${vc ? `<span class="mini-badge ${vc}">${p.hogan_versatilidad}</span>` : ''}
            ${p.hogan_potencial !== null && p.hogan_potencial !== undefined ? `<span class="mini-badge mb-pot">Hogan ${p.hogan_potencial}</span>` : ''}
            ${isSuc(p.sucesor) ? '<span class="mini-badge mb-suc">Sucesor</span>' : ''}
          </div>`;
        boxEl.appendChild(el);
      });
    }
  }

  if (totalItems === 0 && FILTERED.length > 0) {
    const fallback = document.querySelector('.matrix-cells');
    if (fallback) {
      fallback.innerHTML = `<div style="grid-column: 1 / -1; padding: 20px; background: rgba(255,0,0,0.1); color: var(--crimson); text-align: center; border-radius: 8px;"><b>Depuración:</b> ${FILTERED.length} colaboradores aquí, pero la matriz está vacía. Ejemplo: ${FILTERED[0].nombre}, Caja: ${FILTERED[0].caja}, Parseada: ${getCajaNum(FILTERED[0].caja)}</div>`;
    }
  }
}'''

content = re.sub(
    r'function renderNinebox\(\)\{.*?(?=function renderHogan\(\)\{)',
    clean_render_ninebox + '\n\n',
    content,
    flags=re.DOTALL
)

with open('/Users/nicolassantos/.gemini/antigravity/brain/637e5680-8295-4897-9c40-d62c7fcf6f60/scratch/generate_tablero.py', 'w') as f:
    f.write(content)

print("Fixed renderNinebox.")
