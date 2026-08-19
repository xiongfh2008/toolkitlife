/**
 * Dev-server smoke test: home + tool page rendering and warm load timing.
 * Usage: node scripts/dev-smoke.mjs [baseUrl]
 */
const base = process.argv[2] ?? "http://localhost:3112";

async function timed(path) {
  const t0 = Date.now();
  const r = await fetch(base + path);
  const h = await r.text();
  return { ms: Date.now() - t0, status: r.status, h };
}

(async () => {
  // warm up both routes first (dev compiles on first request)
  await timed("/en");
  await timed("/en/tools/1rm-calculator");

  const home = await timed("/en");
  console.log(`\n[home /en] ${home.status}  warm TTFB: ${home.ms}ms  HTML: ${(home.h.length / 1024).toFixed(0)}KB`);
  console.log("  tool name 'Browser Info':", home.h.includes("Browser Info"));
  console.log("  nav text 'All Tools':", home.h.includes("All Tools"));
  console.log("  footer text:", home.h.includes("Terms") || home.h.includes("Privacy"));
  console.log("  scene tab markup sample:", [...new Set([...home.h.matchAll(/href="([^"]*scene[^"]*)"/g)].map((m) => m[1]))].slice(0, 6).join(" | "));
  console.log("  scene mentions in HTML:", (home.h.match(/scene/g) ?? []).length);

  const tool = await timed("/en/tools/1rm-calculator");
  console.log(`\n[tool /en/tools/1rm-calculator] ${tool.status}  warm TTFB: ${tool.ms}ms  HTML: ${(tool.h.length / 1024).toFixed(0)}KB`);
  console.log("  breadcrumb scene link '#scene=calculator':", tool.h.includes("#scene=calculator"));
  console.log("  title '1RM Calculator':", tool.h.includes("1RM Calculator"));
  console.log("  tool content 'Weight Lifted':", tool.h.includes("Weight Lifted"));
  console.log("  nav/footer:", tool.h.includes("All Tools") && tool.h.includes("Terms"));

  // other locales spot check
  const ja = await timed("/ja/tools/1rm-calculator");
  console.log(`\n[ja tool] ${ja.status}  warm TTFB: ${ja.ms}ms  HTML: ${(ja.h.length / 1024).toFixed(0)}KB`);
  console.log("  ja content (1RM 計算):", ja.h.includes("1RM"));
})();
