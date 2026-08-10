"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

const SOCIAL_PRESETS = [
  { label: "Instagram Post", w: 1080, h: 1080 },
  { label: "Instagram Portrait", w: 1080, h: 1350 },
  { label: "Instagram Story / Reels", w: 1080, h: 1920 },
  { label: "Facebook Post", w: 1200, h: 630 },
  { label: "Facebook Cover", w: 820, h: 312 },
  { label: "X Post", w: 1600, h: 900 },
  { label: "X Banner", w: 1500, h: 500 },
  { label: "YouTube Thumbnail", w: 1280, h: 720 },
  { label: "LinkedIn Post", w: 1200, h: 627 },
  { label: "LinkedIn Banner", w: 1584, h: 396 },
  { label: "Pinterest Pin", w: 1000, h: 1500 },
  { label: "TikTok", w: 1080, h: 1920 },
  { label: "WhatsApp Status", w: 1080, h: 1920 },
];

export default function ImageResizerPage() {
  const t = useTranslations("tools.image-resizer");
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [scale, setScale] = useState("100");
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [dragging, setDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          setImg(image);
          setWidth(String(image.naturalWidth));
          setHeight(String(image.naturalHeight));
          setScale("100");
        };
        image.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadFile(file);
    e.target.value = "";
  };

  useEffect(() => {
    if (!img || !canvasRef.current) return;

    const w = parseInt(width, 10);
    const h = parseInt(height, 10);
    if (Number.isNaN(w) || Number.isNaN(h) || w <= 0 || h <= 0) return;

    const canvas = canvasRef.current;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
  }, [img, width, height]);

  const updateWidth = (value: string) => {
    setWidth(value);
    if (maintainAspect && img) {
      const w = parseInt(value, 10);
      if (!Number.isNaN(w) && img.naturalWidth > 0) {
        const aspect = img.naturalHeight / img.naturalWidth;
        setHeight(String(Math.round(w * aspect)));
      }
    }
  };

  const updateHeight = (value: string) => {
    setHeight(value);
    if (maintainAspect && img) {
      const h = parseInt(value, 10);
      if (!Number.isNaN(h) && img.naturalHeight > 0) {
        const aspect = img.naturalWidth / img.naturalHeight;
        setWidth(String(Math.round(h * aspect)));
      }
    }
  };

  const updateScale = (value: string) => {
    setScale(value);
    if (img) {
      const s = parseFloat(value);
      if (!Number.isNaN(s) && s > 0) {
        setWidth(String(Math.round(img.naturalWidth * (s / 100))));
        setHeight(String(Math.round(img.naturalHeight * (s / 100))));
      }
    }
  };

  const applyPreset = (p: { label: string; w: number; h: number }) => {
    if (!img) return;
    // Presets set an exact output size, so aspect-lock would distort them.
    setMaintainAspect(false);
    setWidth(String(p.w));
    setHeight(String(p.h));
    setScale(String(Math.round((p.w / img.naturalWidth) * 100)));
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "resized-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="image-resizer"
    >
      <div className="max-w-4xl space-y-4">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-4">
          {/* Drop zone */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) loadFile(file);
            }}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-10 text-center transition-colors ${
              dragging
                ? "border-blue-600 bg-blue-600/10"
                : "border-zinc-700 bg-zinc-800/50 hover:border-blue-600/50"
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-10 w-10 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2 1.586-1.586a2 2 0 0 1 2.828 0L20 14" />
              <path d="M14 8h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
            </svg>
            <p className="text-sm font-medium text-zinc-300">{t("labels.dropPrompt")}</p>
            <p className="text-xs text-zinc-500">{t("labels.dropHint")}</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {img && (
            <>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-zinc-400">
                <span>
                  {t("labels.originalSize")}: {img.naturalWidth} × {img.naturalHeight}
                </span>
                <span>
                  {t("labels.newSize")}: {width || "–"} × {height || "–"}
                </span>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  {t("labels.presets")}
                </label>
                <div className="flex flex-wrap gap-2">
                  {SOCIAL_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => applyPreset(p)}
                      className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:border-blue-500/40 hover:text-blue-600"
                    >
                      {p.label} {p.w}×{p.h}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-300">
                    {t("labels.width")}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={width}
                    onChange={(e) => updateWidth(e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-300">
                    {t("labels.height")}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={height}
                    onChange={(e) => updateHeight(e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-300">
                    {t("labels.scale")}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={scale}
                    onChange={(e) => updateScale(e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>
              </div>

              <button
                onClick={() => setMaintainAspect((v) => !v)}
                aria-pressed={maintainAspect}
                title={
                  maintainAspect ? t("labels.lockAspect") : t("labels.unlockAspect")
                }
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  maintainAspect
                    ? "border-blue-600/50 bg-blue-600/10 text-blue-600"
                    : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {maintainAspect ? (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0" />
                  </svg>
                )}
                {t("labels.maintainAspect")}
              </button>
            </>
          )}
        </div>

        {img && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">{t("labels.preview")}</label>
              <button
                onClick={handleDownload}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
              >
                {t("buttons.download")}
              </button>
            </div>
            <div className="overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4">
              <canvas
                ref={canvasRef}
                className="max-w-full border border-zinc-800"
              />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
