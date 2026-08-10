import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src/app/[locale]/page.tsx");
const content = fs.readFileSync(filePath, "utf-8");

// Find the tools array
const match = content.match(/const tools: Tool\[\] = ([\s\S]*?);\s*const categories/);
if (!match) {
  console.error("Could not find tools array");
  process.exit(1);
}

const arrayText = match[1];

// Parse individual tool objects
const toolRegex = /\{\s*name:\s*"([^"]*)",\s*description:\s*"([^"]*)",\s*href:\s*"([^"]*)",\s*icon:\s*"([^"]*)",\s*category:\s*"([^"]*)"\s*\}/g;
const tools = [];
let m;
while ((m = toolRegex.exec(arrayText)) !== null) {
  tools.push({
    name: m[1],
    description: m[2],
    href: m[3],
    icon: m[4],
    category: m[5],
  });
}

// Output as JSON with slug keys
const result = {};
for (const tool of tools) {
  const slug = tool.href.replace("/tools/", "");
  result[slug] = {
    name: tool.name,
    description: tool.description,
    category: tool.category,
    icon: tool.icon,
  };
}

const outPath = path.join(process.cwd(), "scripts/tools-en.json");
fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
console.log(`Extracted ${tools.length} tools to ${outPath}`);
