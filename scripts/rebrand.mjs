// One-off: rebrand the site from toolpile.app / ToolPile to toolkitlife.com / ToolkitLife.
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const targets = [join(root, "src"), join(root, "messages")];
const extensions = new Set([".ts", ".tsx", ".js", ".mjs", ".json", ".css"]);

function walk(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      walk(full, files);
    } else if (extensions.has(entry.name.slice(entry.name.lastIndexOf(".")))) {
      files.push(full);
    }
  }
  return files;
}

let changed = 0;
for (const base of targets) {
  for (const file of walk(base)) {
    const original = readFileSync(file, "utf8");
    let content = original;
    content = content.replaceAll("toolpile.app", "toolkitlife.com");
    content = content.replaceAll("ToolPile", "ToolkitLife");
    content = content.replaceAll("toolpile-models", "toolkitlife-models");
    if (content !== original) {
      writeFileSync(file, content);
      changed++;
      console.log(`updated ${file.replace(root + "\\", "")}`);
    }
  }
}
console.log(`done, ${changed} files changed`);
