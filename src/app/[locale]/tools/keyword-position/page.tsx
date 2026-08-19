"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

interface PositionResult {
  keyword: string;
  position: number | null;
  url: string;
}

const PROXIES = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
];

function normalizeDomain(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .split("?")[0];
}

function parseBing(html: string): { url: string }[] {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const results: { url: string }[] = [];
  const items = doc.querySelectorAll("li.b_algo");
  items.forEach((li) => {
    const a = li.querySelector("h2 a");
    const href = a?.getAttribute("href");
    if (href) results.push({ url: href });
  });
  return results;
}

export default function KeywordPositionPage() {
  const t = useTranslations("tools.keyword-position");
  const [domain, setDomain] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<PositionResult[] | null>(null);

  const runCheck = async () => {
    const d = normalizeDomain(domain);
    const list = keywords
      .split("\n")
      .map((k) => k.trim())
      .filter(Boolean);
    if (!d || list.length === 0) return;

    setLoading(true);
    setError("");
    setResults(null);

    const out: PositionResult[] = [];
    for (const kw of list) {
      const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(kw)}&count=50`;
      let found: { url: string }[] = [];
      let ok = false;
      for (const proxy of PROXIES) {
        try {
          const res = await fetch(proxy(searchUrl), {
            signal: AbortSignal.timeout(20000),
          });
          if (!res.ok) continue;
          const html = await res.text();
          if (!html.trim()) continue;
          found = parseBing(html);
          ok = true;
          break;
        } catch {
          // try next proxy
        }
      }
      if (!ok) {
        out.push({ keyword: kw, position: null, url: "" });
        continue;
      }
      const normalized = d.replace(/^www\./, "");
      let position: number | null = null;
      let matchUrl = "";
      for (let i = 0; i < found.length; i++) {
        const host = normalizeDomain(found[i].url);
        if (host === normalized || host.endsWith(`.${normalized}`)) {
          position = i + 1;
          matchUrl = found[i].url;
          break;
        }
      }
      out.push({ keyword: kw, position, url: matchUrl });
    }
    setResults(out);
    setLoading(false);
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="keyword-position"
    >
      <div className="max-w-3xl space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            {t("labels.domain")}
          </label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            {t("labels.keywords")}
          </label>
          <textarea
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder={t("placeholders.keywords")}
            rows={6}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
          />
        </div>

        <button
          onClick={runCheck}
          disabled={loading || !domain.trim() || !keywords.trim()}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? t("buttons.checking") : t("buttons.check")}
        </button>

        <p className="text-xs text-zinc-500">{t("messages.disclaimer")}</p>

        {error && (
          <p className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        {results && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <h3 className="text-sm font-medium text-zinc-300">
              {t("labels.results")}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-700 text-left text-xs uppercase tracking-wide text-zinc-500">
                    <th className="py-2 pr-4 font-medium">{t("labels.keyword")}</th>
                    <th className="py-2 pr-4 font-medium">{t("labels.position")}</th>
                    <th className="py-2 font-medium">{t("labels.url")}</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => (
                    <tr
                      key={r.keyword}
                      className="border-b border-zinc-800 text-zinc-300"
                    >
                      <td className="py-2 pr-4 font-medium text-zinc-100">
                        {r.keyword}
                      </td>
                      <td className="py-2 pr-4">
                        {r.position ? (
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                              r.position <= 10
                                ? "bg-green-900/60 text-green-300"
                                : "bg-zinc-700 text-zinc-200"
                            }`}
                          >
                            #{r.position}
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-500">
                            {t("labels.notFound")}
                          </span>
                        )}
                      </td>
                      <td className="break-all py-2 text-xs text-zinc-500">
                        {r.url || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {results.some((r) => r.position === null) && (
              <p className="text-xs text-zinc-500">{t("messages.partial")}</p>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
