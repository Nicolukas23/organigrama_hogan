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

// Wait 4 seconds for everything to settle
setTimeout(() => {
  console.log("\n=== STATE AFTER 4s ===");
  console.log("kpiTotal:", d.getElementById('kpiTotal').textContent);
  console.log("resultCount:", d.getElementById('resultCount').textContent);
  console.log("loginOverlay display:", d.getElementById('loginOverlay').style.display);
  console.log("mainContent display:", d.getElementById('mainContent').style.display);
  
  for(let b=1; b<=9; b++) {
    const cnt = d.getElementById('cnt' + b);
    const box = d.getElementById('box' + b);
    console.log('Box ' + b + ': count=' + (cnt ? cnt.textContent : 'N/A') + ', children=' + (box ? box.children.length : 'N/A'));
  }

  // Check matrix-cells content
  const mc = d.querySelector('.matrix-cells');
  if (mc) {
    console.log('\nmatrix-cells innerHTML length:', mc.innerHTML.length);
    if (mc.innerHTML.includes('Error')) {
      console.log('ERROR MESSAGE:', mc.innerHTML.substring(0, 500));
    }
  }
}, 4000);
