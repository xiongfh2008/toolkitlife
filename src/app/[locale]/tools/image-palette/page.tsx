"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { extractPalette, type PaletteColor } from "@/lib/image-analysis";

const MAX_DIM = 1200;

export default function ImagePalettePage() {
  const t = useTranslations("tools.image-palette");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [count, setCount] = useState(8);
  const [palette, setPalette] = useState<PaletteColor[]>([]);
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        setImg(image);
        setPalette([]);
        setError("");
        setCopied("");
      };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    loadFile(file);
  };

  const process = useCallback(async () => {
    if (!img || processing) return;
    setProcessing(true);
    setError("");
    try {
      const scale = Math.min(1, MAX_DIM / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.max(1, Math.round(img.naturalWidth * scale));
      const h = Math.max(1, Math.round(img.naturalHeight * scale));
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, w, h);
      const src = ctx.getImageData(0, 0, w, h);
      setPalette(extractPalette(src, count));
      setCopied("");
    } catch (err) {
      console.error(err);
      setError(t("errors.process"));
    } finally {
      setProcessing(false);
    }
  }, [img, processing, count, t]);

  const copyColor = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      // clipboard unavailable
    }
  };

  const handleNewImage = () => {
    setImg(null);
    setPalette([]);
    setCopied("");
    setError("");
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      slug="image-palette"
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
            onClick={() => document.getElementById("pal-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">🎨</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input
              id="pal-in"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt="Original"
                  className="max-w-full rounded border border-zinc-800"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm text-zinc-400">
                    {t("labels.colors")}: {count}
                  </label>
                  <input
                    type="range"
                    min={4}
                    max={16}
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value, 10))}
                    className="w-full max-w-xs accent-blue-500"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => void process()}
                    disabled={processing}
                    className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
                  >
                    {processing ? t("status.processing") : t("buttons.analyze")}
                  </button>
                  <button
                    onClick={handleNewImage}
                    className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
                  >
                    {t("buttons.newImage")}
                  </button>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <canvas ref={canvasRef} className="hidden" />
              </div>
            </div>

            {palette.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-zinc-300">{t("labels.palette")}</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {palette.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => void copyColor(c.hex)}
                      className="group overflow-hidden rounded-lg border border-zinc-800 text-left transition-colors hover:border-blue-500/50"
                    >
                      <div
                        className="h-16 w-full"
                        style={{ backgroundColor: c.hex }}
                      />
                      <div className="space-y-0.5 bg-zinc-900 px-3 py-2">
                        <p className="font-mono text-xs text-zinc-200">
                          {c.hex}
                          {copied === c.hex && (
                            <span className="ml-1 text-emerald-400">✓</span>
                          )}
                        </p>
                        <p className="text-[11px] text-zinc-500">
                          {Math.round(c.ratio * 100)}%
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-zinc-500">{t("labels.clickToCopy")}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
