"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

interface Spec {
  key: string;
  label: string;
  w: number;
  h: number;
}

// All sizes rendered at 300 DPI.
const SPECS: Spec[] = [
  { key: "us", label: "US Passport 2×2 in", w: 600, h: 600 },
  { key: "eu", label: "EU/UK Passport 35×45 mm", w: 413, h: 531 },
  { key: "cn", label: "China Passport 33×48 mm", w: 390, h: 567 },
  { key: "jp", label: "Japan Passport 45×35 mm", w: 531, h: 413 },
  { key: "oneInch", label: "1×1 in (25×25 mm)", w: 300, h: 300 },
  { key: "small", label: "Small ID 30×40 mm", w: 354, h: 472 },
  { key: "cun1", label: "1-inch ID 25×35 mm", w: 295, h: 413 },
  { key: "cun2", label: "2-inch ID 35×49 mm", w: 413, h: 579 },
];

const BG_COLORS = [
  { key: "bgWhite", value: "#ffffff" },
  { key: "bgBlue", value: "#438edb" },
  { key: "bgRed", value: "#d9001b" },
  { key: "bgGray", value: "#d0d0d0" },
];

type Phase = "upload" | "processing" | "edit";

export default function IdPhotoGeneratorPage() {
  const t = useTranslations("tools.id-photo-generator");
  const [phase, setPhase] = useState<Phase>("upload");
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [cutout, setCutout] = useState<HTMLImageElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [spec, setSpec] = useState<Spec>(SPECS[0]);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [scale, setScale] = useState(100);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cutoutUrlRef = useRef("");

  useEffect(() => {
    return () => {
      if (cutoutUrlRef.current) URL.revokeObjectURL(cutoutUrlRef.current);
    };
  }, []);

  const startCutout = useCallback(async (image: HTMLImageElement) => {
    setPhase("processing");
    setProgress(0);
    setError("");
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { removeBackground }: any = await import("@imgly/background-removal");
      const blob: Blob = await removeBackground(image.src, {
        model: "isnet_fp16",
        device: "cpu",
        output: { format: "image/png" },
        progress: (_key: string, current: number, total: number) => {
          if (total > 0) setProgress(Math.min(100, Math.round((current / total) * 100)));
        },
      });
      const url = URL.createObjectURL(blob);
      const cut = new Image();
      cut.onload = () => {
        if (cutoutUrlRef.current) URL.revokeObjectURL(cutoutUrlRef.current);
        cutoutUrlRef.current = url;
        setCutout(cut);
        setSpec(SPECS[0]);
        setBgColor("#ffffff");
        setScale(100);
        setOffsetX(0);
        setOffsetY(0);
        setPhase("edit");
      };
      cut.src = url;
    } catch (err) {
      console.error(err);
      setError(t("errors.failed"));
      setPhase("upload");
    }
  }, [t]);

  const loadFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          setImg(image);
          startCutout(image);
        };
        image.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    },
    [startCutout]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadFile(file);
    e.target.value = "";
  };

  // Render the final ID photo (target size pixels) on the preview canvas.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !cutout) return;
    canvas.width = spec.w;
    canvas.height = spec.h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, spec.w, spec.h);
    const bw = cutout.naturalWidth;
    const bh = cutout.naturalHeight;
    if (bw === 0 || bh === 0) return;
    const s = scale / 100;
    const dw = bw * s;
    const dh = bh * s;
    const dx = (spec.w - dw) / 2 + (offsetX / 100) * spec.w;
    const dy = (spec.h - dh) / 2 + (offsetY / 100) * spec.h;
    ctx.drawImage(cutout, dx, dy, dw, dh);
  }, [cutout, spec, bgColor, scale, offsetX, offsetY]);

  const reset = () => {
    if (cutoutUrlRef.current) URL.revokeObjectURL(cutoutUrlRef.current);
    cutoutUrlRef.current = "";
    setCutout(null);
    setImg(null);
    setPhase("upload");
    setError("");
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = "id-photo.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  const sliderCls =
    "w-full accent-blue-500";

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="id-photo-generator"
    >
      <div className="max-w-4xl space-y-4">
        {/* Upload / processing / edit */}
        {phase !== "edit" ? (
          <div>
            {phase === "upload" ? (
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
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-10 text-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-700 border-t-blue-500" />
                <p className="text-sm font-medium text-zinc-300">{t("labels.processing")}</p>
                <p className="text-xs text-zinc-500">{t("labels.processingHint")}</p>
                <div className="h-2 w-56 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-zinc-400">{progress}%</span>
              </div>
            )}
            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          </div>
        ) : (
          <>
            {/* Size specs */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                {t("labels.spec")}
              </label>
              <div className="flex flex-wrap gap-2">
                {SPECS.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSpec(s)}
                    className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                      spec.key === s.key
                        ? "border-blue-600 bg-blue-600/10 text-blue-600"
                        : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-blue-500/40 hover:text-blue-600"
                    }`}
                  >
                    {s.label} · {s.w}×{s.h} {t("labels.pixel")}
                  </button>
                ))}
              </div>
            </div>

            {/* Background color */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                {t("labels.background")}
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {BG_COLORS.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setBgColor(c.value)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                      bgColor.toLowerCase() === c.value
                        ? "border-blue-600 bg-blue-600/10 text-blue-600"
                        : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-blue-500/40"
                    }`}
                  >
                    <span
                      className="inline-block h-4 w-4 rounded-full border border-black/20"
                      style={{ backgroundColor: c.value }}
                    />
                    {t(`labels.${c.key}`)}
                  </button>
                ))}
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-4 w-4 cursor-pointer border-0 bg-transparent p-0"
                  />
                  {t("labels.bgCustom")}
                </label>
              </div>
            </div>

            {/* Zoom & offsets */}
            <div className="grid gap-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">
                  {t("labels.scale")}: {scale}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="160"
                  step="1"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className={sliderCls}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">
                  {t("labels.offsetX")}: {offsetX}
                </label>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  step="1"
                  value={offsetX}
                  onChange={(e) => setOffsetX(Number(e.target.value))}
                  className={sliderCls}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">
                  {t("labels.offsetY")}: {offsetY}
                </label>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  step="1"
                  value={offsetY}
                  onChange={(e) => setOffsetY(Number(e.target.value))}
                  className={sliderCls}
                />
              </div>
            </div>

            {/* Preview + download */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-zinc-300">
                    {t("labels.preview")} · {spec.w}×{spec.h} {t("labels.pixel")}
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={reset}
                    className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                  >
                    {t("labels.newImage")}
                  </button>
                  <button
                    onClick={download}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
                  >
                    {t("labels.download")}
                  </button>
                </div>
              </div>
              <div className="grid gap-4 lg:grid-cols-[auto,1fr]">
                <div className="overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                  <canvas ref={canvasRef} className="max-w-full border border-zinc-800" />
                </div>
                {img && (
                  <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
                    <p className="border-b border-zinc-800 px-3 py-2 text-xs text-zinc-400">
                      {t("labels.original")}
                    </p>
                    <img
                      src={img.src}
                      alt={t("labels.original")}
                      className="max-h-80 w-full object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
