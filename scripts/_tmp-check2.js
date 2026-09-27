const fs = require('fs');
const path = 'd:/AIProject/toolkitlife/scripts';
const files = fs.readdirSync(path).filter(f => f.startsWith('_done-') && f.endsWith('.json'));
const want = ['video-watermark', 'unit-converter', 'image-upscaler', 'image-filters', 'image-pixelate', 'image-negative', 'image-edge-detect', 'image-oil-paint', 'qr-code-generator', 'fancy-text-generator', 'convert', 'video-to-gif', 'video-compressor'];
const seen = {};
for (const f of files) {
  const o = JSON.parse(fs.readFileSync(path + '/' + f, 'utf8'));
  for (const [k, v] of Object.entries(o)) {
    if ((/\.title$/.test(k) || /relatedTools\.\d+\.name$/.test(k) || /\.name$/.test(k)) && typeof v === 'string') {
      for (const w of want) {
        if (k.includes(w) && !seen[k]) { seen[k] = 1; console.log(f, '|', k, '=>', v); }
      }
    }
  }
}
