"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

type Mode = "url" | "html";

interface TagRow {
  key: string;
  value: string;
}

interface Analysis {
  rows: TagRow[];
  warnings: string[];
}

function analyzeHtml(html: string): Analysis {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const rows: TagRow[] = [];
  const warnings: string[] = [];

  const title = doc.querySelector("title")?.textContent?.trim() ?? "";
  if (title) {
    rows.push({ key: "Title", value: title });
  } else {
    warnings.push("Missing <title> tag");
  }

  const metaNames = [
    "description",
    "keywords",
    "robots",
    "author",
    "viewport",
    "generator",
    "theme-color",
  ];
  const metaProps = [
    "og:title",
    "og:description",
    "og:image",
    "og:url",
    "og:type",
    "og:site_name",
    "twitter:card",
    "twitter:title",
    "twitter:description",
    "twitter:image",
  ];

  for (const name of metaNames) {
    const el = doc.querySelector(`meta[name="${name}"]`);
    const content = el?.getAttribute("content")?.trim() ?? "";
    if (content) rows.push({ key: name, value: content });
  }
  for (const prop of metaProps) {
    const el = doc.querySelector(`meta[property="${prop}"]`);
    const content = el?.getAttribute("content")?.trim() ?? "";
    if (content) rows.push({ key: prop, value: content });
  }

  const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute("href");
  if (canonical) rows.push({ key: "Canonical", value: canonical });

  const h1 = doc.querySelector("h1")?.textContent?.trim() ?? "";
  if (h1) rows.push({ key: "H1", value: h1 });

  const hasDescription = rows.some((r) => r.key === "description");
  if (!hasDescription) warnings.push("Missing meta description");
  if (title.length > 60) warnings.push("Title is longer than 60 characters");
  if (title && title.length < 15) warnings.push("Title is shorter than 15 characters");
  const desc = rows.find((r) => r.key === "description")?.value ?? "";
  if (desc && desc.length > 160) warnings.push("Meta description is longer than 160 characters");

  return { rows, warnings };
}

const PROXIES = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
];

export default function MetaTagsAnalyzerPage() {
  const t = useTranslations("tools.meta-tags-analyzer");
  const [mode, setMode] = useState<Mode>("url");
  const [url, setUrl] = useState("");
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Analysis | null>(null);

  const analyzePasted = useCallback(() => {
    if (!html.trim()) return;
    setResult(analyzeHtml(html));
    setError("");
  }, [html]);

  const analyzeUrl = useCallback(async () => {
    const target = url.trim();
    if (!target) return;
    setLoading(true);
    setError("");
    setResult(null);
    let fetched = "";
    for (const proxy of PROXIES) {
      try {
        const res = await fetch(proxy(target), { signal: AbortSignal.timeout(20000) });
        if (!res.ok) continue;
        fetched = await res.text();
        if (fetched && fetched.trim()) break;
      } catch {
        // try the next proxy
      }
    }
    if (!fetched.trim()) {
      setError(t("messages.fetchFailed"));
      setLoading(false);
      return;
    }
    setResult(analyzeHtml(fetched));
    setLoading(false);
  }, [url, t]);

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="meta-tags-analyzer"
    >
      <div className="max-w-3xl space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setMode("url");
              setError("");
              setResult(null);
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              mode === "url"
                ? "bg-blue-600 text-white"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            {t("labels.urlMode")}
          </button>
          <button
            onClick={() => {
              setMode("html");
              setError("");
              setResult(null);
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              mode === "html"
                ? "bg-blue-600 text-white"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            {t("labels.htmlMode")}
          </button>
        </div>

        {mode === "url" ? (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.url")}
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
            <button
              onClick={analyzeUrl}
              disabled={loading || !url.trim()}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? t("buttons.loading") : t("buttons.analyze")}
            </button>
            <p className="text-xs text-zinc-500">{t("messages.proxyNote")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.html")}
              </label>
              <textarea
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                placeholder={t("placeholders.html")}
                rows={10}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
            <button
              onClick={analyzePasted}
              disabled={!html.trim()}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t("buttons.analyze")}
            </button>
          </div>
        )}

        {error && (
          <p className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        {result && (
          <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900 p-5">
            {result.warnings.length > 0 && (
              <div className="space-y-1">
                {result.warnings.map((w) => (
                  <p
                    key={w}
                    className="rounded-lg border border-amber-800 bg-amber-950/40 px-3 py-2 text-xs text-amber-300"
                  >
                    ⚠ {w}
                  </p>
                ))}
              </div>
            )}

            {result.rows.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {result.rows.map((row) => (
                      <tr
                        key={row.key}
                        className="border-b border-zinc-800 align-top"
                      >
                        <td className="whitespace-nowrap py-2 pr-4 font-mono text-xs text-zinc-500">
                          {row.key}
                        </td>
                        <td className="py-2 break-all text-zinc-200">
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-zinc-500">{t("messages.noTags")}</p>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
