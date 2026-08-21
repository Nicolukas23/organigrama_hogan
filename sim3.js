const { JSDOM } = require("jsdom");
const fs = require('fs');
const html = fs.readFileSync('/Users/nicolassantos/Desktop/Proyectos/tableros/tablero_liderazgo.html', 'utf8');

const dom = new JSDOM(html, { runScripts: "dangerously", url: "http://localhost/" });
const window = dom.window;

// Simulate login
window.CUR = { rol: 'ADMIN', email: 'admin' };
const d = window.document;

// Trigger filter
d.getElementById('fDir').value = 'Direccion Auditoria';
window.applyFilters();

console.log("kpiTotal:", d.getElementById('kpiTotal').textContent);
console.log("kpiTop:", d.getElementById('kpiTop').textContent);

for(let b=1; b<=9; b++) {
  console.log(`cnt${b}:`, d.getElementById(`cnt${b}`).textContent);
}
