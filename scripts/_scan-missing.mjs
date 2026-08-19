import fs from "fs";
import path from "path";

const toolsDir = path.join(process.cwd(), "src/app/[locale]/tools");
const dirs = fs.readdirSync(toolsDir, { withFileTypes: true }).filter((d) => d.isDirectory());

function resolve(obj, p) {
  for (const k of p.split(".")) {
    if (obj == null || !(k in obj)) return undefined;
    obj = obj[k];
  }
  return obj;
}

for (const locale of ["en", "zh", "ja", "ko"]) {
  const data = JSON.parse(fs.readFileSync(`messages/${locale}.json`, "utf-8"));
  const missing = [];
  for (const d of dirs) {
    const page = path.join(toolsDir, d.name, "page.tsx");
    if (!fs.existsSync(page)) continue;
    const src = fs.readFileSync(page, "utf-8");
    const paths = new Set();
    for (const m of src.matchAll(/t\.raw\(\s*["']([^"']+)["']/g)) paths.add(m[1]);
    for (const m of src.matchAll(/(?<![.\w])t\(\s*["']([^"']+)["']/g)) paths.add(m[1]);
    for (const m of src.matchAll(/t\.raw\(\s*`([^`$]+)`/g)) paths.add(m[1]);
    for (const m of src.matchAll(/(?<![.\w])t\(\s*`([^`$]+)`/g)) paths.add(m[1]);
    const tool = data.tools[d.name];
    for (const p of paths) {
      if (resolve(tool, p) === undefined) missing.push(`${d.name}: ${p}`);
    }
  }
  console.log(`${locale}: ${missing.length} missing${missing.length ? "\n" + missing.join("\n") : ""}`);
}
