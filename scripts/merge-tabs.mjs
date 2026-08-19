import fs from "fs";
import path from "path";

/**
 * Merges the temporary Tracking/Domain scenes into the Marketing scene:
 * 1. Home card category for the 6 tools: Tracking/Domain -> Marketing.
 * 2. Removes the scenes.tracking / scenes.domain keys.
 * 3. Removes the home.categories Tracking / Domain keys.
 * Tool page metadata.category stays as-is (shown inside the tool page only).
 *
 * The message files have mixed LF/CRLF endings, so each line's trailing \r
 * is stripped for matching and restored when writing back.
 */
const root = process.cwd();
const LOCALES = ["en", "zh", "ja", "ko"];
const SLUGS = [
  "what-is-my-browser",
  "geo-ip-locator",
  "redirect-checker",
  "is-it-down",
  "domain-age",
  "domain-hosting",
];

for (const locale of LOCALES) {
  const file = path.join(root, "messages", `${locale}.json`);
  const lines = fs
    .readFileSync(file, "utf-8")
    .split("\n")
    .map((raw) => ({
      text: raw.endsWith("\r") ? raw.slice(0, -1) : raw,
      cr: raw.endsWith("\r"),
    }));

  // 1) Rewrite home.tools.<slug>.category inside the 6-space-indented entries.
  for (const slug of SLUGS) {
    const start = lines.findIndex((l) => l.text === `      "${slug}": {`);
    if (start === -1) throw new Error(`${locale}: home entry for ${slug} not found`);
    for (let i = start + 1; i < lines.length; i++) {
      const m = lines[i].text.match(/^(\s*)"category": "(Tracking|Domain)",?$/);
      if (m) {
        lines[i].text = `${m[1]}"category": "Marketing",`;
        break;
      }
      if (lines[i].text.match(/^\s*"icon"/)) break; // home entry ended without category
    }
  }

  // 2) Remove scenes.tracking / scenes.domain lines, fix the marketing trailing comma.
  const filtered = [];
  let removed = 0;
  for (const line of lines) {
    if (/^\s*"tracking": .*,$/.test(line.text) && removed < 1) {
      removed++;
      continue;
    }
    if (/^\s*"domain": .*$/.test(line.text) && removed < 2) {
      removed++;
      // The preceding "marketing" line needs its trailing comma removed.
      const prev = filtered[filtered.length - 1];
      if (prev && /^\s*"marketing": .*,$/.test(prev.text)) {
        prev.text = prev.text.replace(/,$/, "");
      }
      continue;
    }
    filtered.push(line);
  }

  // 3) Remove home.categories "Tracking" / "Domain" lines.
  const final = [];
  let catRemoved = 0;
  for (const line of filtered) {
    if (/^\s*"(Tracking|Domain)": .*,$/.test(line.text) && catRemoved < 2) {
      catRemoved++;
      continue;
    }
    final.push(line);
  }

  if (removed !== 2) throw new Error(`${locale}: scenes tracking/domain removal incomplete (${removed})`);
  if (catRemoved !== 2) throw new Error(`${locale}: categories removal incomplete (${catRemoved})`);

  const out = final.map((l) => (l.cr ? `${l.text}\r` : l.text)).join("\n");
  fs.writeFileSync(file, out);
  console.log(`Updated ${locale}.json (scenes:${removed}, categories:${catRemoved})`);
}
