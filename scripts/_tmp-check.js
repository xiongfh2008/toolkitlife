const s = require('fs').readFileSync('d:/AIProject/toolkitlife/messages/es.json', 'utf8');
const m = [...s.matchAll(/"category": "([^"]+)"/g)].map(x => x[1]);
const u = {};
m.forEach(c => { u[c] = (u[c] || 0) + 1; });
console.log(JSON.stringify(u, null, 1));
