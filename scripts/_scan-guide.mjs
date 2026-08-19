import fs from "fs";
import path from "path";

const toolsDir = path.join(process.cwd(), "src/app/[locale]/tools");
const dirs = fs.readdirSync(toolsDir, { withFileTypes: true }).filter((d) => d.isDirectory());
const en = JSON.parse(fs.readFileSync("messages/en.json", "utf-8"));

const problems = [];
for (const d of dirs) {
  const page = path.join(toolsDir, d.name, "page.tsx");
  if (!fs.existsSync(page)) continue;
  const src = fs.readFileSync(page, "utf-8");
  const refs = [...src.matchAll(/t\.raw\("guide\.(\w+)/g)].map((m) => m[1]);
  if (!refs.length) continue;
  const g = en.tools[d.name]?.guide;
  for (const r of refs) {
    if (!g || !(r in g)) {
      problems.push(`${d.name}: page uses guide.${r} but message ${g ? "has " + Object.keys(g).join(",") : "has no guide"}`);
    }
  }
}
console.log(problems.length ? problems.join("\n") : "All guide references match message structure.");
