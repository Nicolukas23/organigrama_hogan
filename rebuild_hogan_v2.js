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
  
  // Extract competencias (rows 5-14)
  const competencias = {};
  for(let i = 5; i <= 14; i++){
    const comp = data[i]?.[9];
    const score = data[i]?.[10];
    if(comp && score !== undefined && score !== ''){
      competencias[comp] = parseInt(score) || 0;
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
    if(inFortalezas && label && desc){
      fortalezas.push({competencia: label, descripcion: desc});
    }
  }
  
  // Extract oportunidades
  const oportunidades = [];
  let inOportunidades = false;
  for(let i = 27; i < data.length; i++){
    const label = data[i]?.[0] || '';
    const desc = data[i]?.[1] || '';
    if(label === 'OPORTUNIDADES'){ inOportunidades = true; continue; }
    if(label.includes('SUGERENCIAS DE DESARROLLO')){ inOportunidades = false; continue; }
    if(inOportunidades && label && desc){
      oportunidades.push({competencia: label, descripcion: desc});
    }
  }
  
  // Extract desarrollo suggestions
  const desarrollo = [];
  let inDesarrollo = false;
  for(let i = 27; i < data.length; i++){
    const label = data[i]?.[0] || '';
    const desc = data[i]?.[1] || '';
    if(label.includes('SUGERENCIAS DE DESARROLLO')){ inDesarrollo = true; continue; }
    if(inDesarrollo && label && desc){
      desarrollo.push({competencia: label, acciones: desc});
    }
  }
  
  hoganUpdates[exp] = { competencias, fortalezas, oportunidades, desarrollo };
});

// Read existing ficha_data.js
let fichaContent = fs.readFileSync('/Users/nicolassantos/Desktop/Proyectos/ficha_data.js', 'utf8');

// Find hogan section boundaries
const hoganStart = fichaContent.indexOf('"hogan":{');
if(hoganStart === -1){
  console.log('ERROR: hogan section not found');
  process.exit(1);
}

// Find the start of the hogan object (the { after "hogan":)
const objStart = fichaContent.indexOf('{', hoganStart);

// Find the end of the hogan object by counting braces
let depth = 0;
let objEnd = objStart;
for(let i = objStart; i < fichaContent.length; i++){
  if(fichaContent[i] === '{') depth++;
  if(fichaContent[i] === '}') depth--;
  if(depth === 0){ objEnd = i + 1; break; }
}

const hoganStr = fichaContent.substring(objStart, objEnd);

// Parse existing hogan entries
// We'll do string manipulation to add/update entries
let updatedHogan = hoganStr;

Object.entries(hoganUpdates).forEach(([exp, data]) => {
  const entryKey = `"${exp}":`;
  const entryIdx = updatedHogan.indexOf(entryKey);
  
  // Build new entry
  const compEntries = Object.entries(data.competencias).map(([k,v]) => `"${k}":${v}`).join(',');
  const fortalezasStr = data.fortalezas.map(f => `• ${f.competencia} — ${f.descripcion}`).join(' ');
  const oportunidadesStr = data.oportunidades.map(o => `• ${o.competencia} — ${o.descripcion}`).join(' ');
  const desarrolloStr = data.desarrollo.map(d => `• ${d.competencia}: ${d.acciones}`).join(' ');
  
  const newEntry = `"${exp}":{"tipo":null,"competencias":[${compEntries}],"fortalezas":"${fortalezasStr.replace(/"/g, '\\"')}","oportunidades":"${oportunidadesStr.replace(/"/g, '\\"')}","desarrollo":"${desarrolloStr.replace(/"/g, '\\"')}"`;
  
  if(entryIdx > -1){
    // Find the end of this entry
    let entryDepth = 0;
    let entryEnd = entryIdx + entryKey.length;
    for(let i = entryIdx + entryKey.length; i < updatedHogan.length; i++){
      if(updatedHogan[i] === '{') entryDepth++;
      if(updatedHogan[i] === '}') entryDepth--;
      if(entryDepth === 0){ entryEnd = i + 1; break; }
    }
    
    // Replace old entry
    const oldEntry = updatedHogan.substring(entryIdx, entryEnd);
    updatedHogan = updatedHogan.replace(oldEntry, newEntry);
    console.log('Updated:', exp);
  } else {
    // Add new entry before the closing brace
    updatedHogan = updatedHogan.slice(0, -1) + ',' + newEntry + '}';
    console.log('Added:', exp);
  }
});

// Rebuild the file
const beforeHogan = fichaContent.substring(0, objStart);
const afterHogan = fichaContent.substring(objEnd);
const newContent = beforeHogan + updatedHogan + afterHogan;

fs.writeFileSync('/Users/nicolassantos/Desktop/Proyectos/ficha_data.js', newContent);
console.log('\nDone! ficha_data.js updated');
