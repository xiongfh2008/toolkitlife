"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

interface CheckResult {
  original: string;
  finalUrl: string;
  statusCode: number | string;
  redirect: boolean;
  reached: boolean;
}

const PROXIES = [
  (url: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
];

export default function RedirectCheckerPage() {
  const t = useTranslations("tools.redirect-checker");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);

  const normalize = (raw: string) => {
    let u = raw.trim();
    if (!u) return "";
    if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
    return u;
  };

  const check = async () => {
    const target = normalize(url);
    if (!target) {
      setError(t("messages.empty"));
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    for (const proxy of PROXIES) {
      try {
        const res = await fetch(proxy(target), { signal: AbortSignal.timeout(20000) });
        if (!res.ok) continue;
        const json = (await res.json()) as {
          status?: { url?: string; http_code?: number };
          contents?: string;
        };
        const finalUrl = json.status?.url ?? target;
        const statusCode = json.status?.http_code ?? res.status;
        setResult({
          original: target,
          finalUrl,
          statusCode,
          redirect: finalUrl !== target,
          reached: true,
        });
        return;
      } catch {
        // try the next proxy
      }
    }
    setError(t("messages.fetchFailed"));
    setLoading(false);
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="redirect-checker"
    >
      <div className="max-w-4xl space-y-4">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            {t("labels.url")}
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && check()}
              placeholder="https://example.com"
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
            <button
              onClick={check}
              disabled={loading}
              className="shrink-0 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-60"
            >
              {loading ? t("buttons.checking") : t("buttons.check")}
            </button>
          </div>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        </div>

        {result && (
          <div className="space-y-3">
            <div
              className={`rounded-lg border p-4 ${
                result.redirect
                  ? "border-amber-700 bg-amber-900/20"
                  : "border-emerald-700 bg-emerald-900/20"
              }`}
            >
              <div className="text-sm font-medium text-zinc-200">
                {result.redirect ? t("labels.hasRedirect") : t("labels.noRedirect")}
              </div>
              <div className="mt-2 space-y-1.5 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="shrink-0 text-zinc-500">{t("labels.originalUrl")}</span>
                  <span className="break-all text-right text-zinc-100">{result.original}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="shrink-0 text-zinc-500">{t("labels.finalUrl")}</span>
                  <span className="break-all text-right text-zinc-100">{result.finalUrl}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="shrink-0 text-zinc-500">{t("labels.statusCode")}</span>
                  <span className="text-right text-zinc-100">{result.statusCode}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-zinc-500">{t("messages.disclaimer")}</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
