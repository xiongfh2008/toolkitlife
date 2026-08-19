import fs from "fs";
import path from "path";

/**
 * One-time migration: replace the client BlogLayout import with the BlogPost
 * server wrapper (which provides the `blogLayout` namespace via a
 * NextIntlClientProvider) in every static blog post page.
 *
 * Safe to re-run (skips already-migrated pages).
 */
const blogDir = path.join(process.cwd(), "src", "app", "[locale]", "blog");

let updated = 0;
const problems = [];

for (const entry of fs.readdirSync(blogDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const pagePath = path.join(blogDir, entry.name, "page.tsx");
  if (!fs.existsSync(pagePath)) continue;

  let src = fs.readFileSync(pagePath, "utf-8");

  // Already migrated?
  if (src.includes('import BlogPost from "@/components/BlogPost";')) {
    continue;
  }
  if (!src.includes('import BlogLayout from "@/components/BlogLayout";')) {
    problems.push(`${entry.name}: missing BlogLayout import`);
    continue;
  }
  if (!src.includes("<BlogLayout post=")) {
    problems.push(`${entry.name}: unexpected BlogLayout usage`);
    continue;
  }
  if (!src.includes("const { locale } = await params;")) {
    problems.push(`${entry.name}: no locale destructured from params`);
    continue;
  }

  src = src.replace(
    'import BlogLayout from "@/components/BlogLayout";',
    'import BlogPost from "@/components/BlogPost";'
  );
  src = src.replace(/<BlogLayout post=/g, "<BlogPost locale={locale} post=");
  src = src.replace(/<\/BlogLayout>/g, "</BlogPost>");

  fs.writeFileSync(pagePath, src);
  updated++;
}

console.log(`updated: ${updated}`);
if (problems.length) {
  console.log(`problems (${problems.length}):`);
  for (const p of problems) console.log("  " + p);
} else {
  console.log("problems: none");
}
