const { JSDOM } = require("jsdom");
const fs = require('fs');
const html = fs.readFileSync('/Users/nicolassantos/Desktop/Proyectos/tableros/tablero_liderazgo.html', 'utf8');

// Provide a fake fetch that returns empty so refreshFromSupabase doesn't break things
const dom = new JSDOM(html, { 
  runScripts: "dangerously", 
  url: "http://localhost/",
  resources: "usable",
  pretendToBeVisual: true
});
const window = dom.window;

// Mock fetch to return empty (so supabase refresh doesn't nuke data)
window.fetch = () => Promise.resolve({ json: () => Promise.resolve([]) });

// Wait for DOMContentLoaded to fire
setTimeout(() => {
  const d = window.document;
  
  // Check if ALL has data
  console.log("ALL length:", window.ALL ? window.ALL.length : "undefined");
  console.log("LEADERS length:", window.LEADERS ? window.LEADERS.length : "undefined");
  
  // Simulate login
  const user = {
    nombre: 'NICOLAS SANTOS',
    cargo: 'Administrador',
    email: 'nicolas.santos@claro.com.co',
    expediente: 'ADMIN-01',
    rol: 'admin',
    scope_dir: 'Todas las Direcciones',
    scope_ger: 'Todas las Gerencias'
  };
  
  window.CUR = user;
  d.getElementById('fSearch').value = '';
  d.getElementById('fCaja').value = '';
  d.getElementById('fDir').value = 'Direccion Auditoria';
  d.getElementById('fGer').value = '';
  d.getElementById('fJefe').value = '';
  
  window.applyFilters();
  
  console.log("\n=== RESULTS AFTER FILTER ===");
  console.log("FILTERED length:", window.FILTERED ? window.FILTERED.length : "undefined");
  console.log("kpiTotal:", d.getElementById('kpiTotal').textContent);
  console.log("kpiTop:", d.getElementById('kpiTop').textContent);
  
  for(let b=1; b<=9; b++) {
    const cnt = d.getElementById('cnt' + b);
    const box = d.getElementById('box' + b);
    console.log(`Box ${b}: count=${cnt ? cnt.textContent : 'N/A'}, children=${box ? box.children.length : 'N/A'}`);
  }
  
  // Check Hogan section
  const tg = d.getElementById('teamCompGrid');
  console.log("\nHogan grid children:", tg ? tg.children.length : "N/A");
  console.log("Hogan grid content snippet:", tg ? tg.innerHTML.substring(0, 200) : "N/A");
  
}, 2000);
