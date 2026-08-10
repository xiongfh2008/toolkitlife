"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

type BgMode = "solid" | "gradient" | "image" | "blur";
type GradientDir = "to right" | "to bottom";

const PRESET_COLORS = [
  "#ffffff",
  "#f8fafc",
  "#e2e8f0",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#10b981",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#0f172a",
];

interface Result {
  url: string;
}

export default function BackgroundReplacePage() {
  const t = useTranslations("tools.background-replace");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [mode, setMode] = useState<BgMode>("solid");
  const [solidColor, setSolidColor] = useState("#0ea5e9");
  const [gradFrom, setGradFrom] = useState("#6366f1");
  const [gradTo, setGradTo] = useState("#22c55e");
  const [gradDir, setGradDir] = useState<GradientDir>("to right");
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [blurStrength, setBlurStrength] = useState(20);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const resultUrlRef = useRef("");

  const loadImageFile = useCallback(
    (file: File, cb: (img: HTMLImageElement) => void) => {
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.onload = () => cb(image);
        image.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadImageFile(file, (image) => {
      setImg(image);
      setResult(null);
      setError("");
    });
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadImageFile(file, (image) => {
      setBgImage(image);
      setMode("image");
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    loadImageFile(file, (image) => {
      setImg(image);
      setResult(null);
      setError("");
    });
  };

  const handleNewImage = () => {
    setImg(null);
    setResult(null);
    setError("");
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = "";
  };

  /** Draw the chosen background onto a canvas at the image size. */
  const drawBackground = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      if (mode === "solid") {
        ctx.fillStyle = solidColor;
        ctx.fillRect(0, 0, w, h);
        return;
      }
      if (mode === "gradient") {
        const grad = ctx.createLinearGradient(
          gradDir === "to right" ? 0 : w / 2,
          gradDir === "to right" ? h / 2 : 0,
          gradDir === "to right" ? w : w / 2,
          gradDir === "to right" ? h / 2 : h
        );
        grad.addColorStop(0, gradFrom);
        grad.addColorStop(1, gradTo);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        return;
      }
      if (mode === "blur" && img) {
        const off = document.createElement("canvas");
        off.width = w;
        off.height = h;
        const octx = off.getContext("2d");
        if (octx) octx.drawImage(img, 0, 0, w, h);
        const b = Math.max(4, Math.round((Math.min(w, h) * blurStrength) / 100));
        ctx.filter = `blur(${b}px)`;
        ctx.drawImage(off, 0, 0);
        ctx.filter = "none";
        return;
      }
      if (mode === "image" && bgImage) {
        // Cover-fit the background image.
        const scale = Math.max(w / bgImage.naturalWidth, h / bgImage.naturalHeight);
        const bw = bgImage.naturalWidth * scale;
        const bh = bgImage.naturalHeight * scale;
        ctx.drawImage(bgImage, (w - bw) / 2, (h - bh) / 2, bw, bh);
        return;
      }
      // Fallback: dark background.
      ctx.fillStyle = "#18181b";
      ctx.fillRect(0, 0, w, h);
    },
    [mode, solidColor, gradFrom, gradTo, gradDir, blurStrength, img, bgImage]
  );

  const replaceBackground = useCallback(async () => {
    if (!img || processing) return;
    setProcessing(true);
    setProgress(0);
    setError("");
    try {
      setProgress(4);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { removeBackground }: any = await import("@imgly/background-removal");
      const blob: Blob = await removeBackground(img.src, {
        model: "isnet_fp16",
        device: "cpu",
        output: { format: "image/png" },
        progress: (key: string, current: number, total: number) => {
          const pct = total > 0 ? Math.round((current / total) * 70) : 0;
          setProgress(Math.max(pct, 4));
        },
      });
      // Load the cut-out foreground.
      const fg = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("fg load failed"));
        image.src = URL.createObjectURL(blob);
      });

      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no ctx");
      drawBackground(ctx, w, h);
      ctx.drawImage(fg, 0, 0, w, h);
      setProgress(95);

      canvas.toBlob((out) => {
        setProgress(100);
        if (!out) return;
        if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
        const url = URL.createObjectURL(out);
        resultUrlRef.current = url;
        setResult({ url });
        setProcessing(false);
      }, "image/png");
    } catch (err) {
      console.error(err);
      setError(t("errors.replace"));
      setProcessing(false);
    }
  }, [img, processing, drawBackground, t]);

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = "background-replaced.png";
    a.click();
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const bgOption = (key: BgMode, label: string) => (
    <button
      onClick={() => setMode(key)}
      className={`rounded-md px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
        mode === key
          ? "bg-blue-600 text-white"
          : "text-zinc-400 hover:text-zinc-200"
      }`}
    >
      {label}
    </button>
  );

  return (
    <ToolLayout
      title={t("title")}
      slug="background-replace"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="max-w-4xl space-y-4">
        {!img ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">🖼️</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Background options */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <p className="mb-3 text-sm font-medium text-zinc-300">
                {t("labels.background")}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {bgOption("solid", t("modes.solid"))}
                {bgOption("gradient", t("modes.gradient"))}
                {bgOption("image", t("modes.image"))}
                {bgOption("blur", t("modes.blur"))}
              </div>

              {mode === "solid" && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={solidColor}
                      onChange={(e) => setSolidColor(e.target.value)}
                      className="h-9 w-14 cursor-pointer rounded border border-zinc-700 bg-zinc-800"
                    />
                    <span className="font-mono text-sm text-zinc-300">
                      {solidColor}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSolidColor(c)}
                        className="h-7 w-7 rounded-full border border-zinc-600 transition-transform hover:scale-110"
                        style={{ backgroundColor: c }}
                        aria-label={c}
                      />
                    ))}
                  </div>
                </div>
              )}

              {mode === "gradient" && (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <input
                    type="color"
                    value={gradFrom}
                    onChange={(e) => setGradFrom(e.target.value)}
                    className="h-9 w-14 cursor-pointer rounded border border-zinc-700 bg-zinc-800"
                  />
                  <span className="text-zinc-500">→</span>
                  <input
                    type="color"
                    value={gradTo}
                    onChange={(e) => setGradTo(e.target.value)}
                    className="h-9 w-14 cursor-pointer rounded border border-zinc-700 bg-zinc-800"
                  />
                  <select
                    value={gradDir}
                    onChange={(e) => setGradDir(e.target.value as GradientDir)}
                    className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200"
                  >
                    <option value="to right">{t("labels.horizontal")}</option>
                    <option value="to bottom">{t("labels.vertical")}</option>
                  </select>
                </div>
              )}

              {mode === "image" && (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => bgInputRef.current?.click()}
                    className={`${btn} bg-zinc-800 text-zinc-200 hover:bg-zinc-700`}
                  >
                    {bgImage ? t("labels.changeImage") : t("labels.uploadImage")}
                  </button>
                  {bgImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={bgImage.src}
                      alt="background"
                      className="h-12 w-16 rounded border border-zinc-700 object-cover"
                    />
                  )}
                  <input
                    ref={bgInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBgUpload}
                  />
                </div>
              )}

              {mode === "blur" && (
                <div className="mt-4">
                  <label className="mb-1 block text-sm text-zinc-400">
                    {t("labels.blurStrength")}: {blurStrength}%
                  </label>
                  <input
                    type="range"
                    min={5}
                    max={80}
                    value={blurStrength}
                    onChange={(e) => setBlurStrength(parseInt(e.target.value, 10))}
                    className="w-full max-w-xs accent-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => void replaceBackground()}
                disabled={processing}
                className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
              >
                {processing ? t("status.processing") : t("buttons.replace")}
              </button>
              <button
                onClick={handleNewImage}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {t("buttons.newImage")}
              </button>
            </div>

            {processing && (
              <div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-800 bg-red-900/30 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {result && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-zinc-300">
                    {t("labels.original")} / {t("labels.result")}
                  </p>
                  <button
                    onClick={handleDownload}
                    className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
                  >
                    {t("buttons.download")}
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.src}
                      alt="Original"
                      className="w-full rounded-lg border border-zinc-800"
                    />
                  </div>
                  <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={result.url}
                      alt="Result"
                      className="w-full rounded-lg border border-zinc-800"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
