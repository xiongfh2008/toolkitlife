/**
 * Measure the actual initial-load JavaScript of a page: parse <script src>
 * from the served HTML, download each JS file, and sum the sizes.
 * Usage: node scripts/measure-initial-js.mjs [baseUrl]
 */
const base = process.argv[2] ?? "http://localhost:3001";

const pages = [
  ["/en", "home en"],
  ["/en/tools/1rm-calculator", "tool en"],
  ["/en/blog/how-to-build-a-resume", "blog en"],
];

(async () => {
  for (const [u, n] of pages) {
    const r = await fetch(base + u);
    const html = await r.text();
    const srcs = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]);
    const local = srcs.filter((s) => !s.startsWith("http"));
    const sizes = [];
    let total = 0;
    for (const s of local) {
      const sr = await fetch(base + s);
      const b = await sr.arrayBuffer();
      sizes.push([b.byteLength, s]);
      total += b.byteLength;
    }
    sizes.sort((a, b) => b[0] - a[0]);
    console.log(`\n=== ${n} (${u}) ===  initial JS: ${(total / 1024).toFixed(0)} KB, ${local.length} scripts`);
    for (const [sz, s] of sizes.slice(0, 8)) {
      console.log(`  ${(sz / 1024).toFixed(0).padStart(6)} KB  ${s}`);
    }
  }
})();
