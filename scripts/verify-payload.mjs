/**
 * Verify namespace injection + rendered content on key pages.
 * Usage: node scripts/verify-payload.mjs [baseUrl]
 */
const base = process.argv[2] ?? "http://localhost:3001";

const pages = [
  ["/en", "home en"],
  ["/ja", "home ja"],
  ["/en/tools/1rm-calculator", "tool en"],
  ["/ja/tools/1rm-calculator", "tool ja"],
  ["/en/blog/how-to-build-a-resume", "blog en"],
  ["/ja/blog/how-to-compress-video", "blog ja"],
];

(async () => {
  for (const [u, n] of pages) {
    const r = await fetch(base + u);
    const h = await r.text();
    const kb = (h.length / 1024).toFixed(1);
    // Flight payload escapes quotes as \" — match those for namespace keys.
    const hasKey = (k) => h.includes(`\\"${k}\\"`) || h.includes(`"${k}"`);
    const out = {
      sizeKB: kb,
      toolsNS: hasKey("formulaNote") ? "YES" : "no",
      homeNS: hasKey("searchPlaceholder") ? "yes" : "no",
      blogLayoutNS: hasKey("tryCta") ? "yes" : "no",
      commonNS: hasKey("Copied!") ? "yes" : "no",
      ownTool: hasKey("1rm-calculator") ? "yes" : "no",
      otherTool: hasKey("401k-calculator") ? "yes" : "no",
      // Rendered text (unescaped in HTML):
      renderedHomeTool: h.includes("What Is My Browser") ? "yes" : "no",
      renderedCopyBtn: h.includes(">Copy<") ? "yes" : "no",
      renderedTryCta: h.includes("Try ") ? "yes" : "no",
    };
    console.log(n.padEnd(22), r.status, JSON.stringify(out));
  }
})();
