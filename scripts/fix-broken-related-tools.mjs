import fs from "fs";
import path from "path";

const messagesDir = path.join(process.cwd(), "messages");
const toolsDir = path.join(process.cwd(), "src/app/[locale]/tools");

const existingSlugs = new Set(
  fs
    .readdirSync(toolsDir)
    .filter((name) => fs.statSync(path.join(toolsDir, name)).isDirectory())
);

const locales = ["en", "zh", "ja", "ko"];

for (const locale of locales) {
  const filePath = path.join(messagesDir, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const tools = data.tools;
  let removedCount = 0;

  for (const [slug, tool] of Object.entries(tools)) {
    if (!tool.relatedTools || !Array.isArray(tool.relatedTools)) continue;
    const before = tool.relatedTools.length;
    tool.relatedTools = tool.relatedTools.filter((rt) => {
      const match = rt.href.match(/^\/tools\/([a-z0-9-]+)$/);
      if (!match) return true;
      const targetSlug = match[1];
      if (!existingSlugs.has(targetSlug)) {
        console.log(`[${locale}] ${slug}: remove related tool -> ${rt.href} (${rt.name})`);
        return false;
      }
      return true;
    });
    removedCount += before - tool.relatedTools.length;
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Updated messages/${locale}.json, removed ${removedCount} broken related tool(s).`);
}
