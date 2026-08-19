import fs from "fs";
import path from "path";

/**
 * One-time migration: wire the per-slug ToolMessages provider into every tool
 * layout so tool pages only receive their own detail bundle (~3-20KB) instead
 * of all 299 bundles (~1MB) shipped by the [locale] layout before it excluded
 * the `tools` namespace.
 *
 * Safe to re-run (skips files that already contain ToolMessages).
 */
const toolsDir = path.join(
  process.cwd(),
  "src",
  "app",
  "[locale]",
  "tools"
);

let updated = 0;
let skipped = 0;
const problems = [];

for (const entry of fs.readdirSync(toolsDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  if (entry.name === "[slug]") continue;

  const dir = path.join(toolsDir, entry.name);
  if (!fs.existsSync(path.join(dir, "page.tsx"))) continue; // non-tool dirs

  const layoutPath = path.join(dir, "layout.tsx");
  if (!fs.existsSync(layoutPath)) {
    problems.push(`${entry.name}: no layout.tsx`);
    continue;
  }

  let src = fs.readFileSync(layoutPath, "utf-8");

  const slug = entry.name;

  // Already fully migrated: async Layout that awaits params and passes the
  // locale to ToolMessages. Anything else (sync passthrough or sync-wrapped)
  // must still be converted.
  const migratedRe =
    /export default async function Layout\(\{\s*children,\s*params,\s*\}: \{ children: React\.ReactNode;\s*params: Promise<\{ locale: string \}>; \}\)[\s\S]*?<ToolMessages slug="[^"]+" locale=\{locale\}>/;
  if (migratedRe.test(src)) {
    skipped++;
    continue;
  }

  // 1. Add the import after the last existing import statement (idempotent).
  if (!src.includes(`import ToolMessages from "@/components/ToolMessages";`)) {
    const importRe = /^import .*;\n/gm;
    const imports = src.match(importRe) ?? [];
    if (imports.length === 0) {
      problems.push(`${slug}: no imports`);
      continue;
    }
    const lastImport = imports[imports.length - 1];
    src = src.replace(
      lastImport,
      lastImport + `import ToolMessages from "@/components/ToolMessages";\n`
    );
  }

  // 2. Make the Layout async, read the locale from params, and wrap children
  //    with the per-slug provider.
  // Sync passthrough: `return children;`
  const passthroughRe =
    /export default function Layout\(\{ children \}: \{ children: React\.ReactNode \}\)\s*\{\s*return children;\s*\}/;
  // Sync wrapped (previous migration run): `<ToolMessages slug="X">`
  const wrappedRe =
    /export default function Layout\(\{ children \}: \{ children: React\.ReactNode \}\)\s*\{\s*return \(\s*<ToolMessages slug="[^"]+">\s*\{children\}\s*<\/ToolMessages>\s*\);\s*\}/;
  if (!passthroughRe.test(src) && !wrappedRe.test(src)) {
    problems.push(`${slug}: unexpected Layout signature`);
    continue;
  }
  src = src.replace(
    /export default function Layout\(\{ children \}: \{ children: React\.ReactNode \}\)\s*\{[\s\S]*?\n\}/,
    `export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <ToolMessages slug="${slug}" locale={locale}>
      {children}
    </ToolMessages>
  );
}`
  );

  fs.writeFileSync(layoutPath, src);
  updated++;
}

console.log(`updated: ${updated}`);
console.log(`skipped (already wrapped): ${skipped}`);
if (problems.length) {
  console.log(`problems (${problems.length}):`);
  for (const p of problems) console.log("  " + p);
} else {
  console.log("problems: none");
}
