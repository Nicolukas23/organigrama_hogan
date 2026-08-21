const fs = require('fs');

const html = fs.readFileSync('/Users/nicolassantos/Desktop/Proyectos/tableros/tablero_liderazgo.html', 'utf8');
const jsonMatch = html.match(/<script id="DS" type="application\/json">([\s\S]*?)<\/script>/);
if(!jsonMatch) throw new Error("No JSON found");

const raw = JSON.parse(jsonMatch[1]);
console.log("Raw count:", raw.length);

function getCajaNum(c){
  if(c === null || c === undefined || c === '') return null;
  const n = parseInt(String(c).replace(/[^0-9-]/g, ''), 10);
  return isNaN(n) ? null : n;
}

const valid = raw.filter(r => {
  const d = (r.direccion || '').toLowerCase();
  return !d.includes('comit') && !d.includes('gestion humana') && !d.includes('humana');
});

let ALL = valid.map(r => {
  const copy = { ...r };
  copy.caja = getCajaNum(copy.caja);
  return copy;
});

let FILTERED = ALL;

const top = FILTERED.filter(r => [7,8,9].includes(getCajaNum(r.caja))).length;
console.log("Top count (7,8,9):", top);

const b7 = FILTERED.filter(r => getCajaNum(r.caja) === 7).length;
console.log("Caja 7:", b7);

// Let's test a specific direction like the user might
const dir = "Direccion Corporativa Mercado Masivo";
FILTERED = ALL.filter(r => r.direccion === dir);
console.log(`Top in ${dir}:`, FILTERED.filter(r => [7,8,9].includes(getCajaNum(r.caja))).length);
console.log(`Total in ${dir}:`, FILTERED.length);

