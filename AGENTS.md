# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Overview

ToolkitLife — a free, browser-based tools & calculators website. Next.js 16 (App Router + Turbopack), React 19, TypeScript, Tailwind CSS 4, and next-intl for i18n. ~372 tools across 5 locales (`en`, `zh`, `ja`, `ko`, `ru`). All tool processing runs client-side; no accounts, no server-side storage.

## Common Commands

```bash
npm run dev        # start dev server (port 3000)
npm run build      # production build
npm run lint       # eslint
npx tsc --noEmit   # type check
```

## Architecture

- `src/app/[locale]/` — all routes live under a locale segment (`/en`, `/zh`, ...).
  - `layout.tsx` — root metadata, analytics (GA4/Yandex/Clarity), WebSite+Organization JSON-LD.
  - `tools/{slug}/` — one folder per tool with `page.tsx` + `layout.tsx`; each `layout.tsx` defines per-tool `generateMetadata` (title, OG, hreflang with `"x-default"`).
  - `blog/` — blog index + 11 post pages.
  - `sitemap.ts` — sitemap.xml (tool slugs derived from `messages/en.json`).
  - `robots.ts` — robots.txt incl. explicit AI-crawler rules.
- `src/components/` — `ToolLayout.tsx` (renders SoftwareApplication + FAQPage + HowTo + BreadcrumbList JSON-LD via plain `<script>`), `BlogLayout.tsx`, Nav/Footer, etc.
- `messages/{locale}.json` — all UI strings AND tool metadata (title, description, guide, faqs, relatedTools, keywords). Tool translations live under `tools.{slug}`.
- `public/llms.txt` — AI discovery file listing all tools.

## Key Conventions

- **JSON-LD must use plain `<script>`** (not `next/script`) so it's server-rendered and visible to crawlers.
- **Schema URLs must include the locale prefix**: `https://www.toolkitlife.com/${locale}/tools/${slug}`.
- **hreflang objects need `"x-default"` quoted** — bare `x-default:` is invalid TS.
- **Adding a new tool** = add its messages block under `tools.{slug}` in all 5 locale files; sitemap picks it up automatically from `en.json`.
- **Adding a blog post** = add entry to `src/data/blog-posts.ts` (drives sitemap + RSS) + localized content in `messages/*.json` + a page under `src/app/[locale]/blog/`.
- Copy strings ("370+ tools") are duplicated across `messages/*.json` and README — keep them in sync.
- All tools run fully client-side. Keep large vendor bundles lazy-loaded on tool pages only.
