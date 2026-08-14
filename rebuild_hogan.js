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
  console.log('Extracted:', exp, nombre);
});

// Read existing ficha_data.js
const fichaContent = fs.readFileSync('/Users/nicolassantos/Desktop/Proyectos/ficha_data.js', 'utf8');

// Find hogan section and update each person
let updatedContent = fichaContent;

Object.entries(hoganUpdates).forEach(([exp, data]) => {
  // Find this person's hogan entry
  const personPattern = new RegExp(`"${exp}":\\{[^}]*"competencias":\\[([^\\]]*)\\]`);
  const match = updatedContent.match(personPattern);
  
  if(match){
    // Update competencias array
    const compArray = Object.entries(data.competencias).map(([k,v]) => `"${k}":${v}`);
    const newCompetencias = `[${compArray.join(',')}]`;
    updatedContent = updatedContent.replace(personPattern, `"${exp}":{"tipo":null,"competencias":${newCompetencias}`);
    console.log('Updated competencias for', exp);
  } else {
    console.log('WARNING: Could not find competencias pattern for', exp);
  }
});

// Write updated file
fs.writeFileSync('/Users/nicolassantos/Desktop/Proyectos/ficha_data.js', updatedContent);
console.log('\nDone! Updated ficha_data.js');
