const fs = require('fs');
const html = fs.readFileSync('/Users/nicolassantos/Desktop/Proyectos/tableros/tablero_liderazgo.html', 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
try {
  new Function(script);
  console.log("No syntax errors!");
} catch (e) {
  console.error("Syntax Error:", e);
}
