const XLSX = require('xlsx');
const fs = require('fs');

// Helper to get value safely
function getVal(row, idx) {
  return row && row[idx] !== undefined ? row[idx] : null;
}

// Read Excel files
const wb1 = XLSX.readFile('/Users/nicolassantos/Desktop/Proyectos/Info Ficha Talento 1.xlsx');
const wb2 = XLSX.readFile('/Users/nicolassantos/Desktop/Proyectos/Info Ficha Talento 2.xlsx');
const wbPlantilla = XLSX.readFile('/Users/nicolassantos/Desktop/Proyectos/Planta_de_Personal_Mayo_2026.xlsx');
const wb9box = XLSX.readFile('/Users/nicolassantos/Desktop/Proyectos/PARTICIPANTES NINE BOX (22).xlsx');

// ============ 1. INFORMACION (from Planta) ============
const informacion = {};
const plantillaSheet = wbPlantilla.Sheets['Planta_de_Personal_Mayo_2026'];
const plantillaData = XLSX.utils.sheet_to_json(plantillaSheet, { header: 1 });

// Find header row
let plantillaHeaderRow = -1;
for (let i = 0; i < Math.min(5, plantillaData.length); i++) {
  const row = plantillaData[i];
  if (row && row.some(cell => cell && String(cell).toLowerCase().includes('expediente'))) {
    plantillaHeaderRow = i;
    break;
  }
}

if (plantillaHeaderRow >= 0) {
  const headers = plantillaData[plantillaHeaderRow].map(h => String(h || '').toLowerCase().trim());
  
  const colIdx = {
    expediente: headers.findIndex(h => h.includes('expediente')),
    nombre: headers.findIndex(h => h.includes('nombre')),
    cargo: headers.findIndex(h => h.includes('cargo')),
    empresa: headers.findIndex(h => h.includes('empresa')),
    area: headers.findIndex(h => h.includes('área') || h.includes('area')),
    ciudades: headers.findIndex(h => h.includes('ciudad')),
    jefe: headers.findIndex(h => h.includes('jefe directo') || h.includes('jefe')),
    fecha_ingreso: headers.findIndex(h => h.includes('fecha de ingreso') || h.includes('fecha ingreso')),
    tipo_vinculacion: headers.findIndex(h => h.includes('tipo de vinculación') || h.includes('tipo vinculacion')),
    estado: headers.findIndex(h => h.includes('estado')),
    antiguedad: headers.findIndex(h => h.includes('antigüedad') || h.includes('antiguedad')),
  };

  for (let i = plantillaHeaderRow + 1; i < plantillaData.length; i++) {
    const row = plantillaData[i];
    if (!row || !row[colIdx.expediente]) continue;
    const exp = String(row[colIdx.expediente]).trim();
    if (!exp || exp === 'undefined') continue;

    informacion[exp] = {
      expediente: exp,
      nombre: getVal(row, colIdx.nombre) || '',
      cargo: getVal(row, colIdx.cargo) || '',
      empresa: getVal(row, colIdx.empresa) || '',
      area: getVal(row, colIdx.area) || '',
      ciudades: getVal(row, colIdx.ciudades) || '',
      jefe: getVal(row, colIdx.jefe) || '',
      fecha_ingreso: getVal(row, colIdx.fecha_ingreso) || '',
      tipo_vinculacion: getVal(row, colIdx.tipo_vinculacion) || '',
      estado: getVal(row, colIdx.estado) || '',
      antiguedad: getVal(row, colIdx.antiguedad) || '',
    };
  }
}

console.log(`Informacion: ${Object.keys(informacion).length} records`);

// ============ 2. FORMACION (from Info Ficha Talento 1.xlsx) ============
const formacion = {};
const formSheet = wb1.Sheets['Formación&Experiencia'];
const formData = XLSX.utils.sheet_to_json(formSheet, { header: 1 });

let formHeaderRow = -1;
for (let i = 0; i < Math.min(5, formData.length); i++) {
  const row = formData[i];
  if (row && row.some(cell => cell && String(cell).toLowerCase().includes('expediente'))) {
    formHeaderRow = i;
    break;
  }
}

if (formHeaderRow >= 1) {
  const headers = formData[formHeaderRow - 1].map(h => String(h || '').toLowerCase().trim());
  
  // Find column indices
  const formColIdx = {
    expediente: headers.findIndex(h => h.includes('expediente')),
    educacion_formal: headers.findIndex(h => h.includes('educación formal')),
    educacion_complementaria: headers.findIndex(h => h.includes('educación complementaria')),
    experiencia_claro: headers.findIndex(h => h.includes('experiencia claro')),
    experiencia_otros: headers.findIndex(h => h.includes('experiencia otros')),
  };

  for (let i = formHeaderRow; i < formData.length; i++) {
    const row = formData[i];
    if (!row || !row[formColIdx.expediente]) continue;
    const exp = String(row[formColIdx.expediente]).trim();
    if (!exp || exp === 'undefined') continue;

    formacion[exp] = {
      expediente: exp,
      educacion_formal: getVal(row, formColIdx.educacion_formal) || '',
      educacion_complementaria: getVal(row, formColIdx.educacion_complementaria) || '',
      experiencia_claro: getVal(row, formColIdx.experiencia_claro) || '',
      experiencia_otros: getVal(row, formColIdx.experiencia_otros) || '',
    };
  }
}

console.log(`Formacion: ${Object.keys(formacion).length} records`);

// ============ 3. DESEMPENO (from both files) ============
const desempeno = {};

// Helper to extract desempeño from a workbook
function extractDesempeno(wb, year) {
  const sheet = wb.Sheets['Desempeño'];
  if (!sheet) return;
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
  let headerRow = -1;
  for (let i = 0; i < Math.min(5, data.length); i++) {
    const row = data[i];
    if (row && row.some(cell => cell && String(cell).toLowerCase().includes('expediente'))) {
      headerRow = i;
      break;
    }
  }
  if (headerRow < 0) return;

  const headers = data[headerRow].map(h => String(h || '').toLowerCase().trim());
  const expIdx = headers.findIndex(h => h.includes('expediente'));
  const puntajeIdx = headers.findIndex(h => h.includes('puntaje'));
  const desempenoIdx = headers.findIndex(h => h.includes('desempeño') || h.includes('desempeno'));

  for (let i = headerRow + 1; i < data.length; i++) {
    const row = data[i];
    if (!row || !row[expIdx]) continue;
    const exp = String(row[expIdx]).trim();
    if (!exp) continue;

    if (!desempeno[exp]) desempeno[exp] = { expediente: exp, y2024: null, y2025: null, y2026: null };
    const puntaje = getVal(row, puntajeIdx);
    const desVal = getVal(row, desempenoIdx);
    
    if (year === 2024) {
      desempeno[exp].y2024 = puntaje || desVal;
    } else if (year === 2025) {
      desempeno[exp].y2025 = puntaje || desVal;
    } else if (year === 2026) {
      desempeno[exp].y2026 = puntaje || desVal;
    }
  }
}

extractDesempeno(wb1, 2024);
extractDesempeno(wb1, 2025);
extractDesempeno(wb2, 2026);

// Clean desempeño for people with antigüedad <= 1 year
const ant1YearExp = [];
for (const [exp, info] of Object.entries(informacion)) {
  const ant = String(info.antiguedad || '').toLowerCase();
  if (ant.includes('1 a') || ant === '1 año' || ant === '1 year' || ant.includes('menos de')) {
    if (desempeno[exp]) {
      if (desempeno[exp].y2024 !== null) {
        desempeno[exp].y2024 = null;
        ant1YearExp.push(exp);
      }
      if (desempeno[exp].y2025 !== null) {
        desempeno[exp].y2025 = null;
      }
    }
  }
}
if (ant1YearExp.length > 0) {
  console.log(`Cleaned y2024/y2025 for ${ant1YearExp.length} people with ant<=1:`, ant1YearExp);
}

console.log(`Desempeno: ${Object.keys(desempeno).length} records`);

// ============ 4. TALENTOS ============
const talentos = {};
const talentSheet = wb2.Sheets['Talentos'];
if (talentSheet) {
  const talentData = XLSX.utils.sheet_to_json(talentSheet, { header: 1 });
  let headerRow = -1;
  for (let i = 0; i < Math.min(5, talentData.length); i++) {
    const row = talentData[i];
    if (row && row.some(cell => cell && String(cell).toLowerCase().includes('expediente'))) {
      headerRow = i;
      break;
    }
  }
  if (headerRow >= 0) {
    const headers = talentData[headerRow].map(h => String(h || '').toLowerCase().trim());
    const expIdx = headers.findIndex(h => h.includes('expediente'));
    const talentoIdx = headers.findIndex(h => h.includes('talento'));
    const soyDueñoIdx = headers.findIndex(h => h.includes('soy dueño'));
    const soyLiderIdx = headers.findIndex(h => h.includes('soy líder') || h.includes('soy lider'));
    const soyDigitalIdx = headers.findIndex(h => h.includes('soy digital'));

    for (let i = headerRow + 1; i < talentData.length; i++) {
      const row = talentData[i];
      if (!row || !row[expIdx]) continue;
      const exp = String(row[expIdx]).trim();
      if (!exp) continue;

      talentos[exp] = {
        expediente: exp,
        talento: getVal(row, talentoIdx) || '',
        soy_dueno: getVal(row, soyDueñoIdx),
        soy_lider: getVal(row, soyLiderIdx),
        soy_digital: getVal(row, soyDigitalIdx),
      };
    }
  }
}
console.log(`Talentos: ${Object.keys(talentos).length} records`);

// ============ 5. OBJETIVOS ============
const objetivos = {};
const objSheet = wb2.Sheets['Objetivo Desarrollo'];
if (objSheet) {
  const objData = XLSX.utils.sheet_to_json(objSheet, { header: 1 });
  let headerRow = -1;
  for (let i = 0; i < Math.min(5, objData.length); i++) {
    const row = objData[i];
    if (row && row.some(cell => cell && String(cell).toLowerCase().includes('expediente'))) {
      headerRow = i;
      break;
    }
  }
  if (headerRow >= 0) {
    const headers = objData[headerRow].map(h => String(h || '').toLowerCase().trim());
    const expIdx = headers.findIndex(h => h.includes('expediente'));
    const objIdx = headers.findIndex(h => h.includes('objetivo'));
    const talentoIdx = headers.findIndex(h => h.includes('talento'));

    for (let i = headerRow + 1; i < objData.length; i++) {
      const row = objData[i];
      if (!row || !row[expIdx]) continue;
      const exp = String(row[expIdx]).trim();
      if (!exp) continue;

      objetivos[exp] = {
        expediente: exp,
        obj: getVal(row, objIdx) || '',
        talento: getVal(row, talentoIdx) || '',
      };
    }
  }
}
console.log(`Objetivos: ${Object.keys(objetivos).length} records`);

// ============ 6. 360 ============
const tres60 = {};
const sheet360 = wb2.Sheets['360'];
if (sheet360) {
  const data360 = XLSX.utils.sheet_to_json(sheet360, { header: 1 });
  let headerRow = -1;
  for (let i = 0; i < Math.min(5, data360.length); i++) {
    const row = data360[i];
    if (row && row.some(cell => cell && String(cell).toLowerCase().includes('expediente'))) {
      headerRow = i;
      break;
    }
  }
  if (headerRow >= 0) {
    const headers = data360[headerRow].map(h => String(h || '').toLowerCase().trim());
    const expIdx = headers.findIndex(h => h.includes('expediente'));
    const compIdx = headers.findIndex(h => h.includes('competencia') || h.includes('comportamiento'));
    const liderIdx = headers.findIndex(h => h.includes('líder') || h.includes('lider'));
    const propioIdx = headers.findIndex(h => h.includes('propio'));
    const reporteIdx = headers.findIndex(h => h.includes('reporte'));
    const parIdx = headers.findIndex(h => h.includes('par'));

    for (let i = headerRow + 1; i < data360.length; i++) {
      const row = data360[i];
      if (!row || !row[expIdx]) continue;
      const exp = String(row[expIdx]).trim();
      if (!exp) continue;

      if (!tres60[exp]) tres60[exp] = [];
      tres60[exp].push({
        dim: getVal(row, compIdx) || '',
        lider: getVal(row, liderIdx),
        propio: getVal(row, propioIdx),
        reporte: getVal(row, reporteIdx),
        par: getVal(row, parIdx),
      });
    }
  }
}
console.log(`360: ${Object.keys(tres60).length} records`);

// ============ 7. CLIMA ============
const clima = {};
const climaSheet = wb2.Sheets['Clima'];
if (climaSheet) {
  const climaData = XLSX.utils.sheet_to_json(climaSheet, { header: 1 });
  let headerRow = -1;
  for (let i = 0; i < Math.min(5, climaData.length); i++) {
    const row = climaData[i];
    if (row && row.some(cell => cell && String(cell).toLowerCase().includes('expediente'))) {
      headerRow = i;
      break;
    }
  }
  if (headerRow >= 0) {
    const headers = climaData[headerRow].map(h => String(h || '').toLowerCase().trim());
    const expIdx = headers.findIndex(h => h.includes('expediente'));
    const dimIdx = headers.findIndex(h => h.includes('dimensión') || h.includes('dimension'));
    const pctIdx = headers.findIndex(h => h.includes('porcentaje') || h.includes('pct'));

    for (let i = headerRow + 1; i < climaData.length; i++) {
      const row = climaData[i];
      if (!row || !row[expIdx]) continue;
      const exp = String(row[expIdx]).trim();
      if (!exp) continue;

      if (!clima[exp]) clima[exp] = [];
      clima[exp].push({
        dim: getVal(row, dimIdx) || '',
        pct: getVal(row, pctIdx),
      });
    }
  }
}
console.log(`Clima: ${Object.keys(clima).length} records`);

// ============ 8. SUCESORES (from 9box) ============
const sucesores = {};
const obsSheet = wb9box.Sheets['observaciones'];
if (obsSheet) {
  const obsData = XLSX.utils.sheet_to_json(obsSheet, { header: 1 });
  let headerRow = -1;
  for (let i = 0; i < Math.min(5, obsData.length); i++) {
    const row = obsData[i];
    if (row && row.some(cell => cell && String(cell).toLowerCase().includes('expediente'))) {
      headerRow = i;
      break;
    }
  }
  if (headerRow >= 0) {
    const headers = obsData[headerRow].map(h => String(h || '').toLowerCase().trim());
    const expIdx = headers.findIndex(h => h.includes('expediente'));
    const sucesorIdx = 25; // Z column = index 25
    const tiempoIdx = 26; // AA column = index 26
    const fortalezasIdx = 31; // AF column = index 31
    const oportunidadesIdx = 30; // AE column = index 30

    for (let i = headerRow + 1; i < obsData.length; i++) {
      const row = obsData[i];
      if (!row || !row[expIdx]) continue;
      const exp = String(row[expIdx]).trim();
      if (!exp) continue;

      const sucesor = getVal(row, sucesorIdx);
      const tiempo = getVal(row, tiempoIdx);
      const fortalezas = getVal(row, fortalezasIdx);
      const oportunidades = getVal(row, oportunidadesIdx);

      if (sucesor || tiempo) {
        sucesores[exp] = {
          sucesor: sucesor || '',
          tiempo: tiempo || '',
        };
      }

      // Add fortalezas/oportunidades to ficha data
      if (informacion[exp]) {
        if (fortalezas) informacion[exp].fortalezas = fortalezas;
        if (oportunidades) informacion[exp].oportunidades = oportunidades;
      }
    }
  }
}
console.log(`Sucesores: ${Object.keys(sucesores).length} records`);

// ============ BUILD OUTPUT ============
const output = {
  informacion,
  formacion,
  desempeno,
  talentos,
  objetivos,
  tres60,
  clima,
  sucesores,
};

// Write to file
const jsContent = `window.DATA = ${JSON.stringify(output)};\n`;
fs.writeFileSync('/Users/nicolassantos/Desktop/Proyectos/data/ficha_data.js', jsContent);

console.log('\n=== SUMMARY ===');
console.log(`informacion: ${Object.keys(informacion).length}`);
console.log(`formacion: ${Object.keys(formacion).length}`);
console.log(`desempeno: ${Object.keys(desempeno).length}`);
console.log(`talentos: ${Object.keys(talentos).length}`);
console.log(`objetivos: ${Object.keys(objetivos).length}`);
console.log(`tres60: ${Object.keys(tres60).length}`);
console.log(`clima: ${Object.keys(clima).length}`);
console.log(`sucesores: ${Object.keys(sucesores).length}`);
console.log('ficha_data.js rebuilt successfully!');
