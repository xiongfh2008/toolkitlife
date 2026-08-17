"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import type ScreenShot from "js-web-screen-shot";

export default function ScrollCapturePage() {
  const t = useTranslations("tools.scroll-capture");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [resultSize, setResultSize] = useState(0);
  const insRef = useRef<ScreenShot | null>(null);

  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  // 卸载时清理插件残留的覆盖层 DOM。
  useEffect(() => {
    return () => insRef.current?.destroyComponents();
  }, []);

  const reset = useCallback(() => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl("");
    setResultSize(0);
    setError("");
  }, [resultUrl]);

  const start = useCallback(async () => {
    setError("");
    setResultUrl("");
    setResultSize(0);
    setProcessing(true);
    try {
      const { default: ScreenShotClass } = await import("js-web-screen-shot");
      insRef.current?.destroyComponents();
      insRef.current = new ScreenShotClass({
        capture: { source: "display-media" },
        level: 999,
        completeCallback: ({ base64 }) => {
          // base64 形如 "data:image/png;base64,...." —— 转成 blob URL 便于预览与下载。
          const comma = base64.indexOf(",");
          const mime = /data:([^;,]+)/.exec(base64.slice(0, comma))?.[1] || "image/png";
          const bin = atob(base64.slice(comma + 1));
          const bytes = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
          const blob = new Blob([bytes], { type: mime });
          setResultUrl(URL.createObjectURL(blob));
          setResultSize(blob.size);
          setProcessing(false);
        },
        closeCallback: () => setProcessing(false),
        cancelCallback: () => setProcessing(false),
      });
    } catch (err) {
      console.error("[scroll-capture]", err);
      setError(t("errors.startFailed"));
      setProcessing(false);
    }
  }, [t]);

  const download = useCallback(() => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `screen-shot-${Date.now()}.png`;
    a.click();
  }, [resultUrl]);

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      category={t("category")}
      slug="scroll-capture"
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-6">
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
            <button
              onClick={() => {
                setError("");
                start();
              }}
              className="ml-2 underline underline-offset-2 hover:text-red-300"
            >
              {t("buttons.retry")}
            </button>
          </div>
        )}

        {!resultUrl ? (
          <div className="space-y-6">
            <div className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-sm leading-relaxed text-zinc-300">
              <p>{t("intro.line1")}</p>
              <p>{t("intro.line2")}</p>
              <ul className="list-inside list-decimal space-y-1">
                {(t.raw("intro.steps") as string[]).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={start}
              disabled={processing}
              className="w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {processing ? t("processing") : t("start")}
            </button>
            <p className="text-center text-xs text-zinc-500">{t("startHint")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resultUrl}
              alt={t("result.alt")}
              className="w-full rounded-lg border border-zinc-800"
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">
                {t("result.size", { size: (resultSize / 1024).toFixed(1) })}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={reset}
                  className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-600"
                >
                  {t("buttons.restart")}
                </button>
                <button
                  onClick={download}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
                >
                  {t("buttons.download")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
