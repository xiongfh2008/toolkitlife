import fs from "fs";
const data = JSON.parse(fs.readFileSync("messages/en.json", "utf-8"));
const total = fs.statSync("messages/en.json").size;
console.log("en.json total bytes:", total);

const entries = Object.entries(data).map(([key, val]) => ({
  key,
  bytes: Buffer.byteLength(JSON.stringify(val)),
}));
entries.sort((a, b) => b.bytes - a.bytes);
for (const e of entries) {
  console.log(`  ${e.key}: ${e.bytes.toLocaleString()} bytes (${((e.bytes / total) * 100).toFixed(1)}%)`);
}

// home.tools size (what the home page actually needs)
const homeTools = JSON.stringify(data.home?.tools ?? {});
console.log("\nhome.tools bytes:", Buffer.byteLength(homeTools).toLocaleString());
// tools namespace (tool detail pages)
const toolsNs = JSON.stringify(data.tools ?? {});
console.log("tools namespace bytes:", Buffer.byteLength(toolsNs).toLocaleString());

// one tool entry average in tools namespace
const slugs = Object.keys(data.tools ?? {});
if (slugs.length) {
  const one = JSON.stringify(data.tools[slugs[0]]);
  console.log(`\n${slugs.length} tools; avg entry:`, (Buffer.byteLength(toolsNs) / slugs.length).toFixed(0));
  console.log("sample entry keys:", Object.keys(data.tools[slugs[0]]).join(","));
}
