#!/usr/bin/env node
/**
 * sync_tableros.js
 * Sube a Supabase la data embebida en cada tablero HTML (ninebox, hogan,
 * index, organigrama, umm, practicantes) para que los tableros la lean en vivo.
 *
 * Uso:
 *   node sync_tableros.js                       # sube todos
 *   node sync_tableros.js --tablero=ninebox     # solo uno
 *
 * Requiere variables de entorno SUPABASE_URL y SUPABASE_SERVICE_KEY (ver .env)
 */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const PROY = '/Users/nicolassantos/Desktop/Proyectos';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('ERROR: faltan SUPABASE_URL y/o SUPABASE_SERVICE_KEY');
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { auth: { persistSession: false } });

const args = process.argv.slice(2);
const only = (args.find(a => a.startsWith('--tablero=')) || '').split('=')[1] || null;

function extractNinebox() {
  const src = fs.readFileSync(`${PROY}/ninebox.html`, 'utf8');
  const m = src.match(/<script id="dataStore" type="application\/json">([\s\S]*?)<\/script>/);
  if (!m) throw new Error('no dataStore en ninebox.html');
  const rows = JSON.parse(m[1]);
  return rows.map(r => ({ ...r, updated_at: new Date().toISOString() }));
}

function extractPracticantes() {
  const src = fs.readFileSync(`${PROY}/practicantes.html`, 'utf8');
  const m = src.match(/const DATA=(\[[\s\S]*?\]);/);
  if (!m) throw new Error('no DATA en practicantes.html');
  const rows = JSON.parse(m[1]);
  return rows.map(r => ({ doc: String(r.doc), data: r, updated_at: new Date().toISOString() }));
}

function extractJsonConst(file, varName) {
  const src = fs.readFileSync(`${PROY}/${file}`, 'utf8');
  const lines = src.split('\n');
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`const ${varName} =`)) { start = i; break; }
  }
  if (start < 0) throw new Error(`no const ${varName} en ${file}`);
  let acc = lines[start].replace(`const ${varName} =`, '');
  let depth = (acc.match(/\{/g) || []).length - (acc.match(/\}/g) || []).length;
  let i = start + 1;
  while (depth > 0 && i < lines.length) {
    acc += lines[i];
    depth += (lines[i].match(/\{/g) || []).length - (lines[i].match(/\}/g) || []).length;
    i++;
  }
  return eval('(' + acc.replace(/;\s*$/, '') + ')');
}

function extractHogan() { return extractJsonConst('hogan.html', 'DATA'); }
function extractIndex() { return extractJsonConst('index.html', 'DATA'); }
function extractOrganigrama() { return extractJsonConst('organigrama_hogan_claro.html', 'DATA'); }

async function upsert(table, rows) {
  if (!rows.length) return console.log(`  ${table}: 0 filas`);
  const chunks = [];
  for (let i = 0; i < rows.length; i += 500) chunks.push(rows.slice(i, i + 500));
  for (const chunk of chunks) {
    const { error } = await supabase.from(table).upsert(chunk);
    if (error) throw new Error(`Error en ${table}: ${error.message}`);
  }
  console.log(`  ${table}: ${rows.length} filas OK`);
}

async function main() {
  console.log('=== SYNC TABLEROS → SUPABASE ===');
  const jobs = [
    { name: 'ninebox', fn: extractNinebox, table: 'ninebox', onConflict: 'expediente' },
    { name: 'practicantes', fn: extractPracticantes, table: 'practicantes', onConflict: 'doc' },
    { name: 'hogan', fn: extractHogan, table: 'tableros_json', clave: 'hogan' },
    { name: 'index', fn: extractIndex, table: 'tableros_json', clave: 'index' },
    { name: 'organigrama', fn: extractOrganigrama, table: 'tableros_json', clave: 'organigrama' },
  ];
  for (const job of jobs) {
    if (only && job.name !== only) continue;
    console.log(`${job.name}:`);
    const data = job.fn();
    if (job.clave) {
      const { error } = await supabase.from(job.table).upsert({ clave: job.clave, data, updated_at: new Date().toISOString() }, { onConflict: 'clave' });
      if (error) throw new Error(`Error en ${job.name}: ${error.message}`);
      console.log(`  ${job.table} (${job.clave}): ${JSON.stringify(data).length} bytes OK`);
    } else {
      await upsert(job.table, data);
    }
  }
  console.log('=== COMPLETADO ===');
}

main().catch(e => { console.error(e); process.exit(1); });