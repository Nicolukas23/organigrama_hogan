const { JSDOM } = require("jsdom");
const fs = require('fs');
const html = fs.readFileSync('/Users/nicolassantos/Desktop/Proyectos/tableros/tablero_liderazgo.html', 'utf8');

// Mock fetch to simulate what Supabase returns  
const fakeFetch = (url) => {
  if (url.includes('ninebox')) {
    // Return the real data we know Supabase has
    const nb = JSON.parse(fs.readFileSync('/Users/nicolassantos/Desktop/Proyectos/temp.json', 'utf8'));
    return Promise.resolve({ json: () => Promise.resolve(nb) });
  }
  if (url.includes('tableros_json')) {
    return Promise.resolve({ json: () => Promise.resolve([]) });
  }
  return Promise.resolve({ json: () => Promise.resolve([]) });
};

const dom = new JSDOM(html, { 
  runScripts: "dangerously", 
  url: "http://localhost/",
  pretendToBeVisual: true,
  beforeParse(window) {
    window.fetch = fakeFetch;
    // Mock localStorage
    const store = {};
    window.localStorage = {
      getItem: (k) => store[k] || null,
      setItem: (k, v) => { store[k] = v; }
    };
  }
});

const d = dom.window.document;

// Wait for DOMContentLoaded + Supabase refresh to complete
setTimeout(() => {
  console.log("\n=== AFTER 3 SECONDS (Supabase should have refreshed) ===");
  console.log("kpiTotal:", d.getElementById('kpiTotal').textContent);
  console.log("kpiTop:", d.getElementById('kpiTop').textContent);
  console.log("resultCount:", d.getElementById('resultCount').textContent);
  
  for(let b=1; b<=9; b++) {
    const cnt = d.getElementById('cnt' + b);
    const box = d.getElementById('box' + b);
    console.log(`Box ${b}: count=${cnt ? cnt.textContent : 'N/A'}, children=${box ? box.children.length : 'N/A'}`);
  }
}, 3000);
