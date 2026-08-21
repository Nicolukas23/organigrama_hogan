const fs = require('fs');
const html = fs.readFileSync('/Users/nicolassantos/Desktop/Proyectos/tableros/tablero_liderazgo.html', 'utf8');

const js = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const dataMatch = html.match(/<script id="DS" type="application\/json">([\s\S]*?)<\/script>/);
const DS = JSON.parse(dataMatch[1]);

global.document = {
  getElementById: (id) => ({ id, textContent: '', innerHTML: '', style: {}, appendChild: () => {}, value: '' }),
  createElement: () => ({ className: '', innerHTML: '', style: {} }),
  querySelector: () => ({ innerHTML: '' }),
  documentElement: { classList: { toggle: () => {}, contains: () => false } }
};
global.localStorage = { getItem: () => null, setItem: () => {} };
global.window = { location: { href: '' }, addEventListener: () => {} };

eval(js);

raw = DS;
CUR = { rol: 'ADMIN', email: 'admin' };
document.getElementById('fDir').value = 'Direccion Auditoria';
document.getElementById('fSearch').value = '';
document.getElementById('fGer').value = '';
document.getElementById('fJefe').value = '';
document.getElementById('fCaja').value = '';
applyFilters();

console.log("kpiTotal:", document.getElementById('kpiTotal').textContent);
console.log("kpiTop:", document.getElementById('kpiTop').textContent);
for(let b=1; b<=9; b++) {
  console.log(`cnt${b}:`, document.getElementById(`cnt${b}`).textContent);
}

