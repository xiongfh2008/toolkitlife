"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

export default function UrlShortener() {
  const t = useTranslations("tools.url-shortener");
  const [url, setUrl] = useState("");
  const [custom, setCustom] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [provider, setProvider] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const shorten = useCallback(async () => {
    setError("");
    setShortUrl("");
    setCopied(false);
    const trimmed = url.trim();
    if (!trimmed) {
      setError(t("errors.empty"));
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({ url: trimmed });
      if (custom.trim()) params.set("custom", custom.trim());
      const res = await fetch(`/api/shorten?${params.toString()}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = await res.json().catch(() => null);
      if (!res.ok || !data?.shortUrl) {
        if (data?.error === "invalid_url") setError(t("errors.invalidUrl"));
        else setError(t("errors.failed"));
        return;
      }
      setShortUrl(data.shortUrl as string);
      setProvider(data.provider as string);
    } catch {
      setError(t("errors.failed"));
    } finally {
      setLoading(false);
    }
  }, [url, custom, t]);

  const copy = useCallback(async () => {
    if (!shortUrl) return;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(t("errors.copyFailed"));
    }
  }, [shortUrl, t]);

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const steps = t.raw("guide.steps") as string[];

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      category={t("category")}
      slug="url-shortener"
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
      guide={
        <div className="space-y-4 text-sm text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-100">{t("guide.heading")}</h2>
          <ol className="list-decimal list-inside space-y-2">
            {steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 space-y-4">
          <div>
            <label className="block text-sm text-zinc-300 mb-1.5">{t("labels.url")}</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && shorten()}
              placeholder={t("labels.urlPlaceholder")}
              className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-300 mb-1.5">
              {t("labels.custom")}
              <span className="ml-2 text-xs text-zinc-500">{t("labels.customHint")}</span>
            </label>
            <input
              type="text"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder={t("labels.customPlaceholder")}
              className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={shorten}
              disabled={loading}
              className={`${btn} bg-blue-600 hover:bg-blue-500 text-white px-6`}
            >
              {loading ? t("labels.shortening") : t("labels.shorten")}
            </button>
          </div>
          {error && (
            <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-sm text-red-300">{error}</div>
          )}
        </div>

        {shortUrl && (
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 space-y-3">
            <p className="text-xs text-zinc-500 uppercase tracking-wide">{t("labels.result")}</p>
            <div className="flex items-center gap-2">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 truncate rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2.5 text-sm text-blue-400 hover:text-blue-300 hover:border-blue-500/50 transition-colors"
              >
                {shortUrl}
              </a>
              <button
                onClick={copy}
                className={`${btn} ${copied ? "bg-green-600 text-white" : "bg-zinc-700 hover:bg-zinc-600 text-zinc-200"}`}
              >
                {copied ? t("labels.copied") : t("labels.copy")}
              </button>
            </div>
            <p className="text-xs text-zinc-500">
              {t("labels.poweredBy")} {provider}
            </p>
            <p className="text-xs text-amber-400/90 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 leading-relaxed">
              {t("labels.thirdPartyNotice")}
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
