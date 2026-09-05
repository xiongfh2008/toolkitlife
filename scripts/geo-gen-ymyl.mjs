import fs from "fs";

const en = JSON.parse(fs.readFileSync("messages/en.json", "utf8"));
const home = en.home.tools;
const map = { financial: [], health: [], legal: [] };
for (const [slug, t] of Object.entries(home)) {
  if (t.category === "Finance") map.financial.push(slug);
  else if (t.category === "Health") map.health.push(slug);
  else if (t.category === "Legal") map.legal.push(slug);
}
const lines = [
  "// AUTO-GENERATED from messages/en.json home.tools categories — do not edit by hand.",
  "// Regenerate with: node scripts/geo-gen-ymyl.mjs",
  "",
  'export type YmylKind = "financial" | "health" | "legal";',
  "",
  "export const YMYL_TOOLS: Record<string, YmylKind> = {",
];
for (const kind of ["financial", "health", "legal"]) {
  for (const slug of map[kind]) lines.push(`  "${slug}": "${kind}",`);
}
lines.push("};");
fs.writeFileSync("src/data/ymyl-tools.ts", lines.join("\n") + "\n", "utf8");
console.log(`financial=${map.financial.length} health=${map.health.length} legal=${map.legal.length}`);
console.log("wrote src/data/ymyl-tools.ts");
