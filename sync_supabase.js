#!/usr/bin/env node
/**
 * sync_supabase.js
 * Lee los Excels de Ficha de Talento / Nine Box y hace UPSERT en Supabase.
 *
 * Uso:
 *   node sync_supabase.js                       # sincroniza todo
 *   node sync_supabase.js --tabla=personas      # solo una tabla
 *   node sync_supabase.js --min-cols=10         # reporta si cambió el esquema
 *
 * Requiere variables de entorno:
 *   SUPABASE_URL          -> https://xxxx.supabase.co
 *   SUPABASE_SERVICE_KEY  -> service_role key (solo escritura desde aquí, nunca en el front)
 */
const { createClient } = require('@supabase/supabase-js');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const PROYECTOS = '/Users/nicolassantos/Desktop/Proyectos';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('ERROR: faltan SUPABASE_URL y/o SUPABASE_SERVICE_KEY en el entorno.');
  console.error('Ejecuta:  export SUPABASE_URL=...  y  export SUPABASE_SERVICE_KEY=...');
  process.exit(1);
}

const args = process.argv.slice(2);
const onlyTable = (args.find(a => a.startsWith('--tabla=')) || '').split('=')[1] || null;
const onlyTables = onlyTable ? onlyTable.split(',') : null;
const minCols = parseInt((args.find(a => a.startsWith('--min-cols=')) || '').split('=')[1] || '0', 10);

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

// ------------------------------------------------------------
// Helpers (misma lógica que rebuild_ficha.js)
// ------------------------------------------------------------
function getVal(row, idx) {
  return row && row[idx] !== undefined ? row[idx] : null;
}

// Cache de workbooks: cada archivo se lee UNA sola vez (los Excels de 23MB
// son lentos de parsear ~160s). Esto evita re-leer el mismo archivo por tabla.
const wbCache = {};
function readSheet(file, sheetName) {
  if (!wbCache[file]) {
    const t0 = Date.now();
    wbCache[file] = XLSX.readFile(file, { cellFormula: false, cellHTML: false, cellText: false });
    console.log(`  (cache) ${path.basename(file)} leido en ${Date.now() - t0}ms`);
  }
  const sheet = wbCache[file].Sheets[sheetName];
  if (!sheet) {
    console.warn(`  (aviso) no existe la hoja "${sheetName}" en ${path.basename(file)}`);
    return null;
  }
  return XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true });
}

function findHeaderRow(data, needle) {
  for (let i = 0; i < Math.min(5, data.length); i++) {
    const row = data[i];
    if (row && row.some(c => c && String(c).toLowerCase().includes(needle))) return i;
  }
  return -1;
}

function headersAt(data, i) {
  return data[i].map(h => String(h || '').toLowerCase().trim());
}

// ------------------------------------------------------------
// 1. PERSONAS + 2. FORMACION (de Planta + Ficha 1)
// ------------------------------------------------------------
function extractPersonas() {
  const info = {};
  // Fuente principal: hoja INFORMACION de Info Ficha Talento 1.xlsx
  const data = readSheet(`${PROYECTOS}/Info Ficha Talento 1.xlsx`, 'INFORMACION');
  if (!data) return info;
  const hr = findHeaderRow(data, 'cedula');
  if (hr < 0) return info;
  const h = headersAt(data, hr);
  const c = {
    expediente: h.findIndex(x => x.includes('cedula')),
    nombre: h.findIndex(x => x.includes('nombre')),
    direccion_comite: h.findIndex(x => x.includes('direccion comite')),
    area: h.findIndex(x => x.includes('direccion area')),
    gerencia: h.findIndex(x => x.includes('gerencia')),
    fecha_ingreso: h.findIndex(x => x.includes('fecha de ingreso')),
    antiguedad: h.findIndex(x => x.includes('antig')),
    jefe: h.findIndex(x => x.includes('jefe') && !x.includes('expediente')),
  };
  for (let i = hr + 1; i < data.length; i++) {
    const row = data[i];
    if (!row || !row[c.expediente]) continue;
    const exp = String(row[c.expediente]).trim();
    if (!exp || exp === 'undefined') continue;
    info[exp] = {
      expediente: exp,
      nombre: getVal(row, c.nombre) || '',
      cargo: '',
      direccion_comite: getVal(row, c.direccion_comite) || '',
      area: getVal(row, c.area) || '',
      gerencia: getVal(row, c.gerencia) || '',
      fecha_ingreso: getVal(row, c.fecha_ingreso) || '',
      antiguedad: getVal(row, c.antiguedad) || '',
      jefe: getVal(row, c.jefe) || '',
    };
  }
  return info;
}

function extractFormacion() {
  const form = {};
  const data = readSheet(`${PROYECTOS}/Info Ficha Talento 1.xlsx`, 'Formación&Experiencia');
  if (!data) return form;
  const hr = findHeaderRow(data, 'expediente');
  if (hr <= 0) return form;
  const h = headersAt(data, hr - 1); // encabezado una fila arriba
  const c = {
    expediente: h.findIndex(x => x.includes('expediente')),
    educacion_formal: h.findIndex(x => x.includes('educación formal')),
    educacion_complementaria: h.findIndex(x => x.includes('educación complementaria')),
    experiencia_claro: h.findIndex(x => x.includes('experiencia claro')),
    experiencia_otros: h.findIndex(x => x.includes('experiencia otros')),
  };
  for (let i = hr; i < data.length; i++) {
    const row = data[i];
    if (!row || !row[c.expediente]) continue;
    const exp = String(row[c.expediente]).trim();
    if (!exp || exp === 'undefined') continue;
    form[exp] = {
      expediente: exp,
      educacion_formal: getVal(row, c.educacion_formal) || '',
      educacion_complementaria: getVal(row, c.educacion_complementaria) || '',
      experiencia_claro: getVal(row, c.experiencia_claro) || '',
      experiencia_otros: getVal(row, c.experiencia_otros) || '',
    };
  }
  return form;
}

// ------------------------------------------------------------
// 3. DESEMPENO
// ------------------------------------------------------------
function extractDesempeno() {
  const out = {};
  const years = [
    { file: `${PROYECTOS}/Info Ficha Talento 1.xlsx`, year: 2024 },
    { file: `${PROYECTOS}/Info Ficha Talento 1.xlsx`, year: 2025 },
    { file: `${PROYECTOS}/Info Ficha Talento 2.xlsx`, year: 2026 },
  ];
  for (const { file, year } of years) {
    const wb = XLSX.readFile(file);
    const sheet = wb.Sheets['Desempeño'];
    if (!sheet) continue;
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const hr = findHeaderRow(data, 'expediente');
    if (hr < 0) continue;
    const h = headersAt(data, hr);
    const expIdx = h.findIndex(x => x.includes('expediente'));
    const puntajeIdx = h.findIndex(x => x.includes('puntaje'));
    const desempenoIdx = h.findIndex(x => x.includes('desempeño') || x.includes('desempeno'));
    for (let i = hr + 1; i < data.length; i++) {
      const row = data[i];
      if (!row || !row[expIdx]) continue;
      const exp = String(row[expIdx]).trim();
      if (!exp) continue;
      if (!out[exp]) out[exp] = { expediente: exp, y2024: null, y2025: null, y2026: null };
      const v = getVal(row, puntajeIdx) || getVal(row, desempenoIdx);
      out[exp][`y${year}`] = v;
    }
  }
  return out;
}

// ------------------------------------------------------------
// 4-7. TALENTOS, OBJETIVOS, 360, CLIMA (de Ficha 2)
// ------------------------------------------------------------
function extractTalentos() {
  const out = {};
  const data = readSheet(`${PROYECTOS}/Info Ficha Talento 2.xlsx`, 'Talentos');
  if (!data) return out;
  const hr = findHeaderRow(data, 'expediente');
  if (hr < 0) return out;
  const h = headersAt(data, hr);
  const c = {
    expediente: h.findIndex(x => x.includes('expediente')),
    talento: h.findIndex(x => x.includes('talento')),
    soy_dueno: h.findIndex(x => x.includes('soy dueño')),
    soy_lider: h.findIndex(x => x.includes('soy líder') || x.includes('soy lider')),
    soy_digital: h.findIndex(x => x.includes('soy digital')),
  };
  for (let i = hr + 1; i < data.length; i++) {
    const row = data[i];
    if (!row || !row[c.expediente]) continue;
    const exp = String(row[c.expediente]).trim();
    if (!exp) continue;
    out[exp] = {
      expediente: exp,
      talento: getVal(row, c.talento) || '',
      soy_dueno: getVal(row, c.soy_dueno),
      soy_lider: getVal(row, c.soy_lider),
      soy_digital: getVal(row, c.soy_digital),
    };
  }
  return out;
}

function extractObjetivos() {
  const out = {};
  const data = readSheet(`${PROYECTOS}/Info Ficha Talento 2.xlsx`, 'Objetivo Desarrollo');
  if (!data) return out;
  const hr = findHeaderRow(data, 'expediente');
  if (hr < 0) return out;
  const h = headersAt(data, hr);
  const c = {
    expediente: h.findIndex(x => x.includes('expediente')),
    obj: h.findIndex(x => x.includes('objetivo')),
    talento: h.findIndex(x => x.includes('talento')),
  };
  for (let i = hr + 1; i < data.length; i++) {
    const row = data[i];
    if (!row || !row[c.expediente]) continue;
    const exp = String(row[c.expediente]).trim();
    if (!exp) continue;
    out[exp] = { expediente: exp, obj: getVal(row, c.obj) || '', talento: getVal(row, c.talento) || '' };
  }
  return out;
}

function extractTres60() {
  const out = [];
  const data = readSheet(`${PROYECTOS}/Info Ficha Talento 2.xlsx`, '360');
  if (!data) return out;
  const hr = findHeaderRow(data, 'expediente');
  if (hr < 0) return out;
  const h = headersAt(data, hr);
  const c = {
    expediente: h.findIndex(x => x.includes('expediente')),
    competencia: h.findIndex(x => x.includes('competencia') || x.includes('comportamiento')),
    lider: h.findIndex(x => x.includes('líder') || x.includes('lider')),
    propio: h.findIndex(x => x.includes('propio')),
    reporte: h.findIndex(x => x.includes('reporte')),
    par: h.findIndex(x => x.includes('par')),
  };
  for (let i = hr + 1; i < data.length; i++) {
    const row = data[i];
    if (!row || !row[c.expediente]) continue;
    const exp = String(row[c.expediente]).trim();
    if (!exp) continue;
    out.push({
      expediente: exp,
      competencia: getVal(row, c.competencia) || '',
      lider: getVal(row, c.lider),
      propio: getVal(row, c.propio),
      reporte: getVal(row, c.reporte),
      par: getVal(row, c.par),
    });
  }
  return out;
}

function extractClima() {
  const out = [];
  const data = readSheet(`${PROYECTOS}/Info Ficha Talento 2.xlsx`, 'Clima');
  if (!data) return out;
  const hr = findHeaderRow(data, 'expediente');
  if (hr < 0) return out;
  const h = headersAt(data, hr);
  const c = {
    expediente: h.findIndex(x => x.includes('expediente')),
    dimension: h.findIndex(x => x.includes('dimensión') || x.includes('dimension')),
    pct: h.findIndex(x => x.includes('porcentaje') || x.includes('pct')),
  };
  for (let i = hr + 1; i < data.length; i++) {
    const row = data[i];
    if (!row || !row[c.expediente]) continue;
    const exp = String(row[c.expediente]).trim();
    if (!exp) continue;
    out.push({ expediente: exp, dimension: getVal(row, c.dimension) || '', pct: getVal(row, c.pct) });
  }
  return out;
}

// ------------------------------------------------------------
// 8. SUCESORES (de Nine Box observaciones)
// ------------------------------------------------------------
function extractSucesores() {
  const out = {};
  const data = readSheet(`${PROYECTOS}/PARTICIPANTES NINE BOX (22).xlsx`, 'observaciones');
  if (!data) return out;
  const hr = findHeaderRow(data, 'expediente');
  if (hr < 0) return out;
  const h = headersAt(data, hr);
  const expIdx = h.findIndex(x => x.includes('expediente'));
  const sucesorIdx = 25, tiempoIdx = 26, fortalezasIdx = 31, oportunidadesIdx = 30;
  for (let i = hr + 1; i < data.length; i++) {
    const row = data[i];
    if (!row || !row[expIdx]) continue;
    const exp = String(row[expIdx]).trim();
    if (!exp) continue;
    const sucesor = getVal(row, sucesorIdx);
    const tiempo = getVal(row, tiempoIdx);
    if (sucesor || tiempo) {
      out[exp] = { expediente: exp, sucesor: sucesor || '', tiempo: tiempo || '' };
    }
  }
  return out;
}

// ------------------------------------------------------------
// UPSERT helpers
// ------------------------------------------------------------
async function upsertRows(table, rows, opts = {}) {
  if (!rows.length) { console.log(`  ${table}: 0 filas, se omite`); return; }
  const chunks = [];
  for (let i = 0; i < rows.length; i += 500) chunks.push(rows.slice(i, i + 500));
  if (opts.replaceAll) {
    // Tablas con múltiples filas por persona (360, clima): se reemplazan en lote
    // Sanitiza: strings vacíos a null para evitar errores de tipos numéricos
    for (const chunk of chunks) {
      const clean = chunk.map(r => {
        const o = { ...r };
        for (const k of Object.keys(o)) {
          if (o[k] === '' || o[k] === undefined) o[k] = null;
        }
        return o;
      });
      const { error } = await supabase.from(table).insert(clean);
      if (error) throw new Error(`Error en ${table}: ${error.message}`);
    }
  } else {
    for (const chunk of chunks) {
      const { error } = await supabase.from(table).upsert(chunk, { onConflict: 'expediente' });
      if (error) throw new Error(`Error en ${table}: ${error.message}`);
    }
  }
  console.log(`  ${table}: ${rows.length} filas OK`);
}

function objToRows(obj) {
  return Object.values(obj).map(o => ({ ...o, updated_at: new Date().toISOString() }));
}

// ------------------------------------------------------------
// MAIN
// ------------------------------------------------------------
async function main() {
  console.log('=== SYNC SUPABASE ===');
  console.log(`URL: ${SUPABASE_URL}`);
  if (minCols) console.log(`--min-cols=${minCols} (modo esquema)`);

  const personas = onlyTables && !onlyTables.includes('personas') ? {} : extractPersonas();
  const formacion = onlyTables && !onlyTables.includes('formacion') ? {} : extractFormacion();
  const desempeno = onlyTables && !onlyTables.includes('desempeno') ? {} : extractDesempeno();
  const talentos = onlyTables && !onlyTables.includes('talentos') ? {} : extractTalentos();
  const objetivos = onlyTables && !onlyTables.includes('objetivos') ? {} : extractObjetivos();
  const tres60 = onlyTables && !onlyTables.includes('evaluacion_360') ? [] : extractTres60();
  const clima = onlyTables && !onlyTables.includes('clima') ? [] : extractClima();
  const sucesores = onlyTables && !onlyTables.includes('sucesores') ? {} : extractSucesores();

  console.log(`\nLectura: personas=${Object.keys(personas).length}, formacion=${Object.keys(formacion).length}, desempeno=${Object.keys(desempeno).length}, talentos=${Object.keys(talentos).length}, objetivos=${Object.keys(objetivos).length}, 360=${tres60.length}, clima=${clima.length}, sucesores=${Object.keys(sucesores).length}`);

  const jobs = [
    { table: 'personas', rows: objToRows(personas) },
    { table: 'formacion', rows: objToRows(formacion) },
    { table: 'desempeno', rows: objToRows(desempeno) },
    { table: 'talentos', rows: objToRows(talentos) },
    { table: 'objetivos', rows: objToRows(objetivos) },
    { table: 'evaluacion_360', rows: tres60, replaceAll: true },
    { table: 'clima', rows: clima, replaceAll: true },
    { table: 'sucesores', rows: objToRows(sucesores) },
  ];

  for (const job of jobs) {
    if (onlyTables && !onlyTables.includes(job.table)) continue;
    console.log(`\n${job.table}:`);
    if (job.replaceAll) {
      const { error: delErr } = await supabase.from(job.table).delete().neq('expediente', '__none__');
      if (delErr) throw new Error(`Error limpiando ${job.table}: ${delErr.message}`);
    }
    await upsertRows(job.table, job.rows.map(r => ({ ...r, updated_at: new Date().toISOString() })), job);
  }

  console.log('\n=== SYNC COMPLETADO ===');
}

main().catch(err => { console.error(err); process.exit(1); });
