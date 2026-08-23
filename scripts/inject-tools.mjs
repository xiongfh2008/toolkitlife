import fs from "fs";
import path from "path";

/**
 * Inject tool translations (home.tools card + tools.<slug> bundle) from
 * scripts/tool-data/*.json into the 5 locale message files.
 *
 * Each data file:
 *   { slug, icon, home: {en,zh,ja,ko,ru: {name, description, category}},
 *     tools: {en,zh,ja,ko,ru: {metadata, title, description, category, keywords, faqs, relatedTools, labels, buttons, upload?, errors?}} }
 *
 * Idempotent: existing keys are never overwritten. Ends with a parity check.
 */
const LOCALES = ["en", "zh", "ja", "ko", "ru"];
const messagesDir = path.join(process.cwd(), "messages");
const dataDir = path.join(process.cwd(), "scripts", "tool-data");

const data = {};
for (const f of fs.readdirSync(dataDir).filter((x) => x.endsWith(".json")).sort()) {
  const d = JSON.parse(fs.readFileSync(path.join(dataDir, f), "utf-8"));
  if (!d.slug) throw new Error(`tool-data/${f}: missing slug`);
  data[d.slug] = d;
}
console.log(`loaded ${Object.keys(data).length} tools from tool-data/`);

for (const locale of LOCALES) {
  const file = path.join(messagesDir, `${locale}.json`);
  const msg = JSON.parse(fs.readFileSync(file, "utf-8"));
  let added = 0;
  for (const slug of Object.keys(data)) {
    const d = data[slug];
    if (!msg.home.tools[slug]) {
      msg.home.tools[slug] = {
        name: d.home[locale].name,
        description: d.home[locale].description,
        category: d.home[locale].category,
        icon: d.icon,
      };
      added++;
    }
    if (!msg.tools[slug]) {
      msg.tools[slug] = d.tools[locale];
      added++;
    }
  }
  fs.writeFileSync(file, JSON.stringify(msg, null, 2) + "\n");
  console.log(`${locale}.json: +${added} blocks`);
}

// Structural parity check across locales (values ignored, shapes compared)
const base = JSON.parse(fs.readFileSync(path.join(messagesDir, "en.json"), "utf-8"));
const shape = (o) => JSON.stringify(o, (k, v) => (typeof v === "string" ? "" : v));
for (const locale of LOCALES.slice(1)) {
  const d = JSON.parse(fs.readFileSync(path.join(messagesDir, `${locale}.json`), "utf-8"));
  for (const slug of Object.keys(data)) {
    if (!d.tools[slug]) throw new Error(`${locale} missing tools.${slug}`);
    if (shape(base.tools[slug]) !== shape(d.tools[slug])) {
      throw new Error(`${locale} tools.${slug} shape mismatch`);
    }
  }
  if (Object.keys(d.home.tools).length !== Object.keys(base.home.tools).length) {
    throw new Error(`${locale} home.tools count mismatch`);
  }
}
console.log("parity OK: all locales match en shapes & home.tools counts");
