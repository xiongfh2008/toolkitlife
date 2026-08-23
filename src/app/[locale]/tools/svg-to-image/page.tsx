"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

const SAMPLE =
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">\n  <rect width="400" height="300" fill="#4f46e5"/>\n  <circle cx="150" cy="150" r="80" fill="#fbbf24"/>\n  <rect x="220" y="90" width="130" height="120" rx="16" fill="#34d399"/>\n</svg>';

export default function SvgToImagePage() {
  const t = useTranslations("tools.svg-to-image");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [svg, setSvg] = useState(SAMPLE);
  const [format, setFormat] = useState<"png" | "jpeg" | "webp">("png");
  const [quality, setQuality] = useState(0.92);
  const [scale, setScale] = useState(1);
  const [preview, setPreview] = useState("");
  const [base64, setBase64] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const render = useCallback(() => {
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.naturalWidth * scale);
      canvas.height = Math.round(image.naturalHeight * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      if (format === "jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const p = URL.createObjectURL(blob);
        setPreview(p);
        const reader = new FileReader();
        reader.onload = () => setBase64(reader.result as string);
        reader.readAsDataURL(blob);
        setError("");
      }, `image/${format}`, quality);
      URL.revokeObjectURL(url);
    };
    image.onerror = () => {
      setError(t("errors.failed"));
      URL.revokeObjectURL(url);
    };
    image.src = url;
  }, [svg, format, quality, scale, t]);

  useEffect(() => {
    const id = setTimeout(render, 300);
    return () => clearTimeout(id);
  }, [render]);

  const handleDownload = () => {
    if (!preview) return;
    const a = document.createElement("a");
    a.href = preview;
    a.download = `image.${format}`;
    a.click();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(base64);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const inputCls = "w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200";

  return (
    <ToolLayout
      title={t("title")}
      slug="svg-to-image"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="max-w-4xl space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.svg")}</label>
          <textarea
            value={svg}
            onChange={(e) => setSvg(e.target.value)}
            rows={8}
            spellCheck={false}
            className={`${inputCls} font-mono`}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.format")}</label>
            <div className="flex gap-2">
              {(["png", "jpeg", "webp"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`${btn} ${format === f ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.scale")} · {scale}x
            </label>
            <input
              type="range"
              min={0.25}
              max={4}
              step={0.25}
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.quality")} · {Math.round(quality * 100)}%
            </label>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.02}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex flex-wrap items-center gap-3">
          <button onClick={handleDownload} className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}>
            {t("buttons.download")}
          </button>
          <button onClick={handleCopy} className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}>
            {copied ? t("labels.copied") : t("labels.copyBase64")}
          </button>
        </div>

        {base64 && (
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.base64")}</label>
            <textarea readOnly value={base64} rows={3} className={`${inputCls} font-mono text-xs`} />
          </div>
        )}

        <div className="flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 p-6">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview" className="max-h-80" />
          ) : (
            <p className="text-sm text-zinc-500">{t("labels.preview")}</p>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
