/**
 * Measure the RSC payload of key pages against a running server (dev or prod).
 * Usage: node scripts/measure-payload.mjs [baseUrl]
 */
const base = process.argv[2] ?? "http://localhost:3001";

const pages = [
  ["/en", "home en"],
  ["/zh", "home zh"],
  ["/ja", "home ja"],
  ["/ko", "home ko"],
  ["/en/tools/1rm-calculator", "tool en"],
  ["/ja/tools/1rm-calculator", "tool ja"],
  ["/ko/tools/401k-calculator", "tool ko 401k"],
  ["/en/blog/how-to-build-a-resume", "blog en"],
  ["/ja/blog/how-to-compress-video", "blog ja"],
  ["/en/blog", "blog index"],
  ["/en/privacy", "privacy"],
];

(async () => {
  for (const [u, n] of pages) {
    const r = await fetch(base + u);
    const h = await r.text();
    const kb = (h.length / 1024).toFixed(1);
    const markers = {
      sizeKB: kb,
      toolsNS: h.includes("formulaNote") ? "YES" : "no", // key exists only in tools.*
      homeNS: /\"home\"/.test(h) ? "yes" : "no",
      blogLayoutNS: /\"tryCta\"/.test(h) ? "yes" : "no",
      commonNS: h.includes("Copied!") ? "yes" : "no",
      ownTool: h.includes("1rm-calculator") ? "yes" : "no",
      otherTool: h.includes("401k-calculator") ? "yes" : "no",
    };
    console.log(n.padEnd(22), r.status, JSON.stringify(markers));
  }
})();
