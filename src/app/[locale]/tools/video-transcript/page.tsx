"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

interface Segment {
  start: number;
  text: string;
}

interface TranscriptResult {
  platform: "youtube" | "bilibili";
  title: string;
  author: string;
  language: string;
  segments: Segment[];
}

function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function VideoTranscriptPage() {
  const t = useTranslations("tools.video-transcript");
  const [url, setUrl] = useState("");
  const [cookie, setCookie] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TranscriptResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const extract = useCallback(async () => {
    setError("");
    setResult(null);
    setCopied(false);
    const trimmed = url.trim();
    if (!trimmed) {
      setError(t("errors.empty"));
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({ url: trimmed });
      if (cookie.trim()) params.set("cookie", cookie.trim());
      const res = await fetch(`/api/video-transcript?${params.toString()}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = await res.json().catch(() => null);
      if (!res.ok || !data?.segments) {
        const code = data?.error;
        if (code === "invalid_url") setError(t("errors.invalidUrl"));
        else if (code === "unsupported_url") setError(t("errors.unsupported"));
        else if (code === "bili_no_subtitle") setError(t("errors.noSubtitle"));
        else if (code === "bili_view_failed") setError(t("errors.biliFailed"));
        else setError(t("errors.failed"));
        return;
      }
      setResult(data as TranscriptResult);
    } catch {
      setError(t("errors.failed"));
    } finally {
      setLoading(false);
    }
  }, [url, cookie, t]);

  const fullText = useMemo(
    () =>
      result
        ? result.segments.map((s) => `[${fmtTime(s.start)}] ${s.text}`).join("\n")
        : "",
    [result]
  );

  const copyAll = useCallback(async () => {
    if (!fullText) return;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError(t("errors.copyFailed"));
    }
  }, [fullText, t]);

  const downloadTxt = useCallback(() => {
    if (!fullText || !result) return;
    const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(result.title || "transcript").replace(/[\\/:*?"<>|]/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [fullText, result]);

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      category={t("category")}
      slug="video-transcript"
    >
      <div className="space-y-4">
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 space-y-4">
          <div>
            <label className="block text-sm text-zinc-300 mb-1.5">
              {t("labels.url")}
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && extract()}
              placeholder={t("labels.urlPlaceholder")}
              className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
            />
            <p className="mt-1.5 text-xs text-zinc-500">{t("labels.supported")}</p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1"
            >
              <span className={`inline-block transition-transform ${showAdvanced ? "rotate-90" : ""}`}>▸</span>
              {t("labels.advanced")}
            </button>
            {showAdvanced && (
              <div className="mt-2">
                <label className="block text-xs text-zinc-400 mb-1.5">
                  {t("labels.cookie")}
                  <span className="ml-2 text-zinc-600">{t("labels.cookieHint")}</span>
                </label>
                <input
                  type="text"
                  value={cookie}
                  onChange={(e) => setCookie(e.target.value)}
                  placeholder={t("labels.cookiePlaceholder")}
                  className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={extract}
              disabled={loading}
              className={`${btn} bg-blue-600 hover:bg-blue-500 text-white px-6`}
            >
              {loading ? t("labels.extracting") : t("labels.extract")}
            </button>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-sm text-red-300">{error}</div>
          )}
        </div>

        {result && (
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <p className="text-xs text-zinc-500 uppercase tracking-wide">{t("labels.result")}</p>
                <h2 className="text-lg font-semibold text-zinc-100 break-words">{result.title}</h2>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-zinc-900 border border-zinc-700 px-2.5 py-0.5 text-zinc-300">
                    {result.platform === "youtube" ? "YouTube" : "Bilibili"}
                  </span>
                  {result.language && (
                    <span className="rounded-full bg-zinc-900 border border-zinc-700 px-2.5 py-0.5 text-zinc-300">
                      {t("labels.language")}: {result.language}
                    </span>
                  )}
                  {result.author && (
                    <span className="rounded-full bg-zinc-900 border border-zinc-700 px-2.5 py-0.5 text-zinc-300">
                      {t("labels.author")}: {result.author}
                    </span>
                  )}
                  <span className="rounded-full bg-zinc-900 border border-zinc-700 px-2.5 py-0.5 text-zinc-300">
                    {result.segments.length} {t("labels.segments")}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyAll}
                  className={`${btn} ${copied ? "bg-green-600 text-white" : "bg-zinc-700 hover:bg-zinc-600 text-zinc-200"}`}
                >
                  {copied ? t("labels.copied") : t("labels.copy")}
                </button>
                <button
                  onClick={downloadTxt}
                  className={`${btn} bg-zinc-700 hover:bg-zinc-600 text-zinc-200`}
                >
                  {t("labels.downloadTxt")}
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-900/70 divide-y divide-zinc-800">
              {result.segments.map((s, i) => (
                <div key={i} className="flex gap-3 px-4 py-2 text-sm">
                  <span className="shrink-0 font-mono text-xs text-zinc-500 pt-0.5 w-11 text-right">
                    {fmtTime(s.start)}
                  </span>
                  <span className="text-zinc-200 leading-relaxed whitespace-pre-wrap">{s.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
