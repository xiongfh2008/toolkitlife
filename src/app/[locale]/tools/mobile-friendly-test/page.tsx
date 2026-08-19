"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

interface CheckItem {
  key: string;
  pass: boolean;
}

interface Report {
  score: number;
  checks: CheckItem[];
}

const PROXIES = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
];

function runChecks(html: string, t: (key: string) => string): Report {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const checks: CheckItem[] = [];

  const viewport = doc.querySelector('meta[name="viewport"]')?.getAttribute("content") ?? "";
  checks.push({
    key: "viewport",
    pass: /width\s*=\s*device-width/i.test(viewport),
  });

  const title = doc.querySelector("title")?.textContent?.trim() ?? "";
  checks.push({ key: "title", pass: title.length > 0 });

  const desc = doc.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() ?? "";
  checks.push({ key: "description", pass: desc.length > 0 });

  const style = doc.querySelector("style")?.textContent ?? "";
  const hasMediaQueries = /@media/i.test(style) || html.toLowerCase().includes("@media");
  checks.push({ key: "responsive", pass: hasMediaQueries });

  const hasFontSize = /font-size\s*:\s*(1[2-9]|[2-9]\d|1\d\d)/i.test(style);
  checks.push({ key: "fontSize", pass: hasFontSize });

  const passed = checks.filter((c) => c.pass).length;
  return { score: Math.round((passed / checks.length) * 100), checks };
}

export default function MobileFriendlyTestPage() {
  const t = useTranslations("tools.mobile-friendly-test");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState<Report | null>(null);

  const runCheck = useCallback(async () => {
    const target = url.trim();
    if (!target) {
      setError(t("messages.empty"));
      return;
    }
    setLoading(true);
    setError("");
    setReport(null);
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
    setReport(runChecks(fetched, t));
    setLoading(false);
  }, [url, t]);

  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40";

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="mobile-friendly-test"
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.url")}</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t("placeholders.url")}
            className={inputCls}
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={runCheck}
            disabled={loading}
            className="rounded-lg px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50"
          >
            {loading ? t("buttons.checking") : t("buttons.check")}
          </button>
          {error && <span className="text-sm text-red-400">{error}</span>}
        </div>
        {report && (
          <div className="space-y-4">
            <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4">
              <div className="text-sm text-zinc-400">{t("labels.score")}</div>
              <div className="mt-1 flex items-center gap-3">
                <span
                  className={`text-4xl font-bold ${
                    report.score >= 80
                      ? "text-emerald-400"
                      : report.score >= 50
                        ? "text-amber-400"
                        : "text-red-400"
                  }`}
                >
                  {report.score}
                </span>
                <span className="text-zinc-400">/ 100</span>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg border border-zinc-700">
              {report.checks.map((c) => (
                <div
                  key={c.key}
                  className="flex items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900 px-4 py-3 text-sm last:border-b-0"
                >
                  <span className="text-zinc-200">
                    {c.pass ? t(`messages.${c.key}Pass`) : t(`messages.${c.key}Fail`)}
                  </span>
                  <span
                    className={
                      c.pass
                        ? "shrink-0 text-emerald-400"
                        : "shrink-0 text-red-400"
                    }
                  >
                    {c.pass ? t("labels.pass") : t("labels.fail")}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-500">{t("messages.disclaimer")}</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
