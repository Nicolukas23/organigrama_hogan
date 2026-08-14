const XLSX = require('xlsx');
const fs = require('fs');

function gv(row, i) { return row && row[i] !== undefined ? row[i] : null; }

// Read Excel
const wb = XLSX.readFile('/Users/nicolassantos/Desktop/Proyectos/Info Ficha Talento 2.xlsx');

// === DESEMPENO ===
const desempeno = {};
const desSheet = wb.Sheets['Desempeño'];
const desData = XLSX.utils.sheet_to_json(desSheet, {header:1});
// Headers: expediente, 2024, 2025, 2026
const desHeaders = desData[0].map(h => String(h||'').toLowerCase().trim());
const expIdx = desHeaders.findIndex(h => h.includes('expediente'));

for(let i=1; i<desData.length; i++){
  const row = desData[i];
  if(!row || !row[expIdx]) continue;
  const exp = String(row[expIdx]).trim();
  if(!exp) continue;
  desempeno[exp] = {
    y2024: row[1] !== undefined && row[1] !== null ? row[1] : null,
    y2025: row[2] !== undefined && row[2] !== null ? row[2] : null,
    y2026: row[3] !== undefined && row[3] !== null ? row[3] : null,
  };
}
console.log('Desempeno:', Object.keys(desempeno).length);
console.log('79965710:', JSON.stringify(desempeno['79965710']));
console.log('1085273858:', JSON.stringify(desempeno['1085273858']));

// === TALENTOS ===
const talentos = {};
const tSheet = wb.Sheets['Talentos'];
if(tSheet){
  const tData = XLSX.utils.sheet_to_json(tSheet, {header:1});
  let hRow = -1;
  for(let i=0;i<5;i++){
    if(tData[i] && tData[i].some(c=>String(c||'').toLowerCase().includes('expediente'))){hRow=i;break;}
  }
  if(hRow>=0){
    const h = tData[hRow].map(x=>String(x||'').toLowerCase().trim());
    const eI=h.findIndex(x=>x.includes('expediente')), tI=h.findIndex(x=>x.includes('talento'));
    const sdI=h.findIndex(x=>x.includes('soy dueño')||x.includes('soy dueno'));
    const slI=h.findIndex(x=>x.includes('soy l')||x.includes('soy l'));
    const sdiI=h.findIndex(x=>x.includes('soy digital'));
    for(let i=hRow+1;i<tData.length;i++){
      const r=tData[i]; if(!r||!r[eI]) continue;
      const exp=String(r[eI]).trim(); if(!exp) continue;
      talentos[exp]={exp, talento:gv(r,tI)||'', soy_dueno:gv(r,sdI), soy_lider:gv(r,slI), soy_digital:gv(r,sdiI)};
    }
  }
}
console.log('Talentos:', Object.keys(talentos).length);

// === OBJETIVOS ===
const objetivos = {};
const oSheet = wb.Sheets['Objetivo Desarrollo'];
if(oSheet){
  const oData = XLSX.utils.sheet_to_json(oSheet, {header:1});
  let hRow=-1;
  for(let i=0;i<5;i++){
    if(oData[i]&&oData[i].some(c=>String(c||'').toLowerCase().includes('expediente'))){hRow=i;break;}
  }
  if(hRow>=0){
    const h=oData[hRow].map(x=>String(x||'').toLowerCase().trim());
    const eI=h.findIndex(x=>x.includes('expediente')), oI=h.findIndex(x=>x.includes('objetivo')), tI=h.findIndex(x=>x.includes('talento'));
    for(let i=hRow+1;i<oData.length;i++){
      const r=oData[i]; if(!r||!r[eI]) continue;
      const exp=String(r[eI]).trim(); if(!exp) continue;
      objetivos[exp]={exp, obj:gv(r,oI)||'', talento:gv(r,tI)||''};
    }
  }
}
console.log('Objetivos:', Object.keys(objetivos).length);

// === 360 ===
const tres60 = {};
const s360 = wb.Sheets['360'];
if(s360){
  const d360 = XLSX.utils.sheet_to_json(s360, {header:1});
  let hRow=-1;
  for(let i=0;i<5;i++){
    if(d360[i]&&d360[i].some(c=>String(c||'').toLowerCase().includes('expediente'))){hRow=i;break;}
  }
  if(hRow>=0){
    const h=d360[hRow].map(x=>String(x||'').toLowerCase().trim());
    const eI=h.findIndex(x=>x.includes('expediente')), cI=h.findIndex(x=>x.includes('competencia')||x.includes('comportamiento'));
    const lI=h.findIndex(x=>x.includes('l')||x.includes('lider')), pI=h.findIndex(x=>x.includes('propio'));
    const rI=h.findIndex(x=>x.includes('reporte')), paI=h.findIndex(x=>x.includes('par'));
    for(let i=hRow+1;i<d360.length;i++){
      const r=d360[i]; if(!r||!r[eI]) continue;
      const exp=String(r[eI]).trim(); if(!exp) continue;
      if(!tres60[exp]) tres60[exp]=[];
      tres60[exp].push({dim:gv(r,cI)||'', lider:gv(r,lI), propio:gv(r,pI), reporte:gv(r,rI), par:gv(r,paI)});
    }
  }
}
console.log('360:', Object.keys(tres60).length);

// === CLIMA ===
const clima = {};
const cSheet = wb.Sheets['Clima'];
if(cSheet){
  const cData = XLSX.utils.sheet_to_json(cSheet, {header:1});
  let hRow=-1;
  for(let i=0;i<5;i++){
    if(cData[i]&&cData[i].some(c=>String(c||'').toLowerCase().includes('expediente'))){hRow=i;break;}
  }
  if(hRow>=0){
    const h=cData[hRow].map(x=>String(x||'').toLowerCase().trim());
    const eI=h.findIndex(x=>x.includes('expediente')), dI=h.findIndex(x=>x.includes('dimensi')||x.includes('dimension'));
    const pI=h.findIndex(x=>x.includes('porcentaje')||x.includes('pct'));
    for(let i=hRow+1;i<cData.length;i++){
      const r=cData[i]; if(!r||!r[eI]) continue;
      const exp=String(r[eI]).trim(); if(!exp) continue;
      if(!clima[exp]) clima[exp]=[];
      clima[exp].push({dim:gv(r,dI)||'', pct:gv(r,pI)});
    }
  }
}
console.log('Clima:', Object.keys(clima).length);

// === HOGAN ===
const hogan = {};
const hSheet = wb.Sheets['HOGAN'];
if(hSheet){
  const hData = XLSX.utils.sheet_to_json(hSheet, {header:1});
  let hRow=-1;
  for(let i=0;i<5;i++){
    if(hData[i]&&hData[i].some(c=>String(c||'').toLowerCase().includes('expediente'))){hRow=i;break;}
  }
  if(hRow>=0){
    const h=hData[hRow].map(x=>String(x||'').toLowerCase().trim());
    const eI=h.findIndex(x=>x.includes('expediente'));
    // dynamically find all columns
    for(let i=hRow+1;i<hData.length;i++){
      const r=hData[i]; if(!r||!r[eI]) continue;
      const exp=String(r[eI]).trim(); if(!exp) continue;
      hogan[exp]={};
      for(let j=0;j<h.length;j++){
        if(j===eI) continue;
        hogan[exp][h[j]]=gv(r,j);
      }
    }
  }
}
console.log('Hogan:', Object.keys(hogan).length);

// Output just desempeno update to the existing file
// Read current file and replace desempeno section
const filePath = '/Users/nicolassantos/Desktop/Proyectos/ficha_data.js';
const content = fs.readFileSync(filePath, 'utf8');

// Replace desempeno section
const desStr = JSON.stringify(desempeno);
const newContent = content.replace(
  /"desempeno":\{[^}]*\}/,
  '"desempeno":' + desStr
);

fs.writeFileSync(filePath, newContent);
console.log('\nDesempeno section updated in ficha_data.js');
console.log('File size:', fs.statSync(filePath).size);
