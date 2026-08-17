const fs = require('fs');
const XLSX = require('xlsx');

// Read Excel
const wb = XLSX.readFile('/Users/nicolassantos/Desktop/Proyectos/reporte_sucesores (3).xlsx');

// Map names to expediente IDs
const nameToExp = {
  'Vargas Blanco Freddy Alexander': '80150353',
  'Salas Mahecha Viviana Andrea': '53120673',
  'Morales Clavijo Luis German': '79297860',
  'Lopez Tavera Maria Paula Catalina': '52804512',
  'Ojeda Luna Juan Manuel': '1085273858',
  'Castañeda Guerrero Maria Teresa Del Pilar': '52709691',
  'Estupiñan Lopez Andres Fernando': '4617732',
  'Montagut Morales Pedro Angel': '1032365189',
  'Avila Plata Oscar Mauricio': '80099040',
  'Gonzalez Chaves Diego Miguel': '79965710',
  'De La Roche Benitez Sonia Angelica': '52153221',
  'Perez Palma Julio Cesar': '8126425'
};

// Extract data from each person sheet
const hoganUpdates = {};
const personSheets = wb.SheetNames.filter(n => 
  !['Índice Sucesores','Fortalezas y Desarrollo','Análisis Grupal'].includes(n)
);

personSheets.forEach(sheetName => {
  const ws = wb.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(ws, {header: 1, defval: ''});
  const nombre = data[0]?.[0] || sheetName;
  const exp = nameToExp[nombre];
  
  if(!exp) return;
  
  // Extract competencias
  const competencias = [];
  for(let i = 5; i <= 14; i++){
    const comp = data[i]?.[9];
    const score = data[i]?.[10];
    if(comp && score !== undefined && score !== ''){
      competencias.push({nombre: comp, puntaje: parseInt(score) || 0});
    }
  }
  
  // Extract fortalezas
  const fortalezas = [];
  let inFortalezas = false;
  for(let i = 27; i < data.length; i++){
    const label = data[i]?.[0] || '';
    const desc = data[i]?.[1] || '';
    if(label === 'FORTALEZAS'){ inFortalezas = true; continue; }
    if(label === 'OPORTUNIDADES'){ inFortalezas = false; continue; }
    if(inFortalezas && label && desc) fortalezas.push({competencia: label, descripcion: desc});
  }
  
  // Extract oportunidades
  const oportunidades = [];
  let inOportunidades = false;
  for(let i = 27; i < data.length; i++){
    const label = data[i]?.[0] || '';
    const desc = data[i]?.[1] || '';
    if(label === 'OPORTUNIDADES'){ inOportunidades = true; continue; }
    if(label.includes('SUGERENCIAS DE DESARROLLO')){ inOportunidades = false; continue; }
    if(inOportunidades && label && desc) oportunidades.push({competencia: label, descripcion: desc});
  }
  
  // Extract desarrollo
  const desarrollo = [];
  let inDesarrollo = false;
  for(let i = 27; i < data.length; i++){
    const label = data[i]?.[0] || '';
    const desc = data[i]?.[1] || '';
    if(label.includes('SUGERENCIAS DE DESARROLLO')){ inDesarrollo = true; continue; }
    if(inDesarrollo && label && desc) desarrollo.push({competencia: label, acciones: desc});
  }
  
  hoganUpdates[exp] = { competencias, fortalezas, oportunidades, desarrollo };
});

// Read ficha_data.js
let fichaContent = fs.readFileSync('/Users/nicolassantos/Desktop/Proyectos/data/ficha_data.js', 'utf8');

// Find hogan section
const hoganStart = fichaContent.indexOf('"hogan":{');
const objStart = fichaContent.indexOf('{', hoganStart);

let depth = 0;
let objEnd = objStart;
for(let i = objStart; i < fichaContent.length; i++){
  if(fichaContent[i] === '{') depth++;
  if(fichaContent[i] === '}') depth--;
  if(depth === 0){ objEnd = i + 1; break; }
}

// Parse the hogan section to remove old entries for our 12 people
let hoganStr = fichaContent.substring(objStart, objEnd);

// Remove old entries for our people
Object.keys(hoganUpdates).forEach(exp => {
  const entryKey = `"${exp}":`;
  let idx = hoganStr.indexOf(entryKey);
  while(idx > -1){
    // Find the end of this entry
    let entryDepth = 0;
    let entryEnd = idx + entryKey.length;
    for(let i = idx + entryKey.length; i < hoganStr.length; i++){
      if(hoganStr[i] === '{') entryDepth++;
      if(hoganStr[i] === '}') entryDepth--;
      if(entryDepth === 0){ entryEnd = i + 1; break; }
    }
    
    const oldEntry = hoganStr.substring(idx, entryEnd);
    // Check if there's a comma after the entry
    if(entryEnd < hoganStr.length && hoganStr[entryEnd] === ','){
      hoganStr = hoganStr.substring(0, idx) + hoganStr.substring(entryEnd + 1);
    } else if(idx > 0 && hoganStr[idx-1] === ','){
      hoganStr = hoganStr.substring(0, idx - 1) + hoganStr.substring(entryEnd);
    } else {
      hoganStr = hoganStr.substring(0, idx) + hoganStr.substring(entryEnd);
    }
    
    idx = hoganStr.indexOf(entryKey);
  }
});

// Now add new entries
const escapeStr = s => s.replace(/"/g, '\\"').replace(/\n/g, ' ');

Object.entries(hoganUpdates).forEach(([exp, data]) => {
  const compJson = JSON.stringify(data.competencias);
  const fortalezasStr = data.fortalezas.map(f => `• ${f.competencia} — ${f.descripcion}`).join(' ');
  const oportunidadesStr = data.oportunidades.map(o => `• ${o.competencia} — ${o.descripcion}`).join(' ');
  const desarrolloStr = data.desarrollo.map(d => `• ${d.competencia}: ${d.acciones}`).join(' ');
  
  const newEntry = `"${exp}":{"tipo":null,"competencias":${compJson},"fortalezas":"${escapeStr(fortalezasStr)}","oportunidades":"${escapeStr(oportunidadesStr)}","desarrollo":"${escapeStr(desarrolloStr)}"`;
  
  // Add before closing brace
  hoganStr = hoganStr.slice(0, -1) + ',' + newEntry + '}';
  console.log('Added:', exp);
});

// Rebuild file
const beforeHogan = fichaContent.substring(0, objStart);
const afterHogan = fichaContent.substring(objEnd);
const newContent = beforeHogan + hoganStr + afterHogan;

fs.writeFileSync('/Users/nicolassantos/Desktop/Proyectos/data/ficha_data.js', newContent);
console.log('\nDone! ficha_data.js cleaned and updated');
