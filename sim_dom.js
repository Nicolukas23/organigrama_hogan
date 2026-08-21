const { JSDOM } = require("jsdom");
const fs = require('fs');

const html = fs.readFileSync('/Users/nicolassantos/Desktop/Proyectos/tableros/tablero_liderazgo.html', 'utf8');

const dom = new JSDOM(html, { runScripts: "dangerously" });
const window = dom.window;

setTimeout(() => {
  // Check if Ninebox is empty
  let emptyBoxes = 0;
  for(let b=1; b<=9; b++){
    const box = window.document.getElementById(`box${b}`);
    if(box && box.children.length === 0) emptyBoxes++;
  }
  
  const kpiTotal = window.document.getElementById('kpiTotal').textContent;
  
  console.log(`Empty boxes: ${emptyBoxes}/9`);
  console.log(`KPI Total: ${kpiTotal}`);
  
  if (emptyBoxes === 9 && kpiTotal > 0) {
    console.log("BUG CONFIRMED IN DOM!");
  } else {
    console.log("Working properly in DOM.");
  }
}, 3000);
