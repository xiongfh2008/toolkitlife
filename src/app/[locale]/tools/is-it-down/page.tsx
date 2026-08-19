"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

interface DownResult {
  url: string;
  online: boolean;
  status: number;
  ms: number;
}

const PROXIES = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
];

export default function IsItDownPage() {
  const t = useTranslations("tools.is-it-down");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<DownResult | null>(null);

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
    const start = performance.now();
    for (const proxy of PROXIES) {
      try {
        const res = await fetch(proxy(target), { signal: AbortSignal.timeout(15000) });
        const ms = Math.round(performance.now() - start);
        setResult({
          url: target,
          online: true,
          status: res.status,
          ms,
        });
        return;
      } catch {
        // try the next proxy
      }
    }
    const ms = Math.round(performance.now() - start);
    setResult({ url: target, online: false, status: 0, ms });
    setLoading(false);
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="is-it-down"
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
              className={`rounded-lg border p-6 text-center ${
                result.online
                  ? "border-emerald-700 bg-emerald-900/20"
                  : "border-red-700 bg-red-900/20"
              }`}
            >
              <div
                className={`text-2xl font-bold ${
                  result.online ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {result.online ? t("messages.online") : t("messages.offline")}
              </div>
              <p className="mt-2 break-all text-sm text-zinc-400">{result.url}</p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <div className="flex justify-between gap-4 py-1.5 text-sm">
                <span className="text-zinc-500">{t("labels.status")}</span>
                <span className="text-zinc-100">{result.status || "—"}</span>
              </div>
              <div className="flex justify-between gap-4 py-1.5 text-sm">
                <span className="text-zinc-500">{t("labels.responseTime")}</span>
                <span className="text-zinc-100">{result.ms} ms</span>
              </div>
            </div>
            <p className="text-xs text-zinc-500">{t("messages.disclaimer")}</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
