const { JSDOM } = require("jsdom");
const fs = require('fs');
const html = fs.readFileSync('/Users/nicolassantos/Desktop/Proyectos/tableros/tablero_liderazgo.html', 'utf8');

const fakeFetch = (url) => {
  if (url.includes('ninebox')) {
    const nb = JSON.parse(fs.readFileSync('/Users/nicolassantos/Desktop/Proyectos/temp.json', 'utf8'));
    return Promise.resolve({ json: () => Promise.resolve(nb) });
  }
  if (url.includes('tableros_json')) {
    return Promise.resolve({ json: () => Promise.resolve([]) });
  }
  return Promise.resolve({ json: () => Promise.resolve([]) });
};

const store = { 'lider_email': 'nicolas.santos@claro.com.co' };
const dom = new JSDOM(html, { 
  runScripts: "dangerously", 
  url: "http://localhost/",
  pretendToBeVisual: true,
  beforeParse(window) {
    window.fetch = fakeFetch;
    window.localStorage = {
      getItem: (k) => store[k] || null,
      setItem: (k, v) => { store[k] = v; }
    };
  }
});

const d = dom.window.document;

setTimeout(() => {
  console.log("\n=== AFTER 3 SECONDS ===");
  console.log("CUR:", dom.window.CUR ? JSON.stringify({nombre: dom.window.CUR.nombre, rol: dom.window.CUR.rol}) : 'null (NOT ON WINDOW)');
  console.log("kpiTotal:", d.getElementById('kpiTotal').textContent);
  console.log("kpiTop:", d.getElementById('kpiTop').textContent);
  console.log("resultCount:", d.getElementById('resultCount').textContent);
  
  // Check direction filter
  console.log("fDir value:", d.getElementById('fDir').value);
  console.log("fDir options:", d.getElementById('fDir').options.length);
  
  for(let b=1; b<=9; b++) {
    const cnt = d.getElementById('cnt' + b);
    const box = d.getElementById('box' + b);
    console.log(`Box ${b}: count=${cnt ? cnt.textContent : 'N/A'}, children=${box ? box.children.length : 'N/A'}`);
  }
  
  // Now try manually setting filter and calling applyFilters
  console.log("\n=== MANUAL FILTER TEST ===");
  d.getElementById('fDir').value = 'Direccion Auditoria';
  // Can we access applyFilters? 
  // Since it's defined with 'function', it should be on window in browser
  // but JSDOM may not put it there
  if (typeof dom.window.applyFilters === 'function') {
    dom.window.applyFilters();
    console.log("After manual filter:");
    console.log("kpiTotal:", d.getElementById('kpiTotal').textContent);
    for(let b=1; b<=9; b++) {
      console.log(`Box ${b}: count=${d.getElementById('cnt'+b).textContent}`);
    }
  } else {
    console.log("applyFilters not on window!");
  }
}, 3000);
