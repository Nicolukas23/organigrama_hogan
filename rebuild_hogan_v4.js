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

// Read ficha_data.js and extract the DATA object
const fichaContent = fs.readFileSync('/Users/nicolassantos/Desktop/Proyectos/ficha_data.js', 'utf8');

// Find window.DATA = {...};
const dataStart = fichaContent.indexOf('window.DATA = ');
if(dataStart === -1){
  console.log('ERROR: window.DATA not found');
  process.exit(1);
}

const objStart = fichaContent.indexOf('{', dataStart);

// Find the end of the DATA object
let depth = 0;
let objEnd = objStart;
for(let i = objStart; i < fichaContent.length; i++){
  if(fichaContent[i] === '{') depth++;
  if(fichaContent[i] === '}') depth--;
  if(depth === 0){ objEnd = i + 1; break; }
}

const dataStr = fichaContent.substring(objStart, objEnd);
let DATA;
try {
  DATA = JSON.parse(dataStr);
} catch(e){
  console.log('ERROR: Could not parse DATA:', e.message);
  process.exit(1);
}

// Ensure hogan section exists
if(!DATA.hogan) DATA.hogan = {};

// Update hogan entries
Object.entries(hoganUpdates).forEach(([exp, data]) => {
  const existing = DATA.hogan[exp] || {};
  
  // Build fortalezas string
  const fortalezasStr = data.fortalezas.map(f => `• ${f.competencia} — ${f.descripcion}`).join(' ');
  const oportunidadesStr = data.oportunidades.map(o => `• ${o.competencia} — ${o.descripcion}`).join(' ');
  const desarrolloStr = data.desarrollo.map(d => `• ${d.competencia}: ${d.acciones}`).join(' ');
  
  DATA.hogan[exp] = {
    tipo: existing.tipo || null,
    competencias: data.competencias,
    fortalezas: fortalezasStr,
    oportunidades: oportunidadesStr,
    desarrollo: desarrolloStr,
    hpi: existing.hpi || {},
    hds: existing.hds || {},
    mvpi: existing.mvpi || {},
    foco: existing.foco || '',
    descarriladores: existing.descarriladores || '',
    motivadores: existing.motivadores || ''
  };
  
  console.log('Updated:', exp);
});

// Rebuild the file
const beforeData = fichaContent.substring(0, dataStart + 14);
const afterData = fichaContent.substring(objEnd);
const newDataStr = JSON.stringify(DATA);
const newContent = beforeData + newDataStr + afterData;

fs.writeFileSync('/Users/nicolassantos/Desktop/Proyectos/ficha_data.js', newContent);
console.log('\nDone! ficha_data.js updated successfully');
