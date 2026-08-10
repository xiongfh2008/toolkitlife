const fs = require('fs');
const html = fs.readFileSync('bmi.html', 'utf8');
console.log('len', html.length);
const m = html.match(/<h2[^>]*>Frequently Asked Questions<\/h2>\s*<div[^>]*class="space-y-4"[^>]*>([\s\S]*?)<\/div>/i);
console.log('match', !!m);
if (m) console.log(m[1].slice(0, 300));
