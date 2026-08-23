"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

export default function ImgSizePage() {
  const t = useTranslations("tools.img-size");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [keepAspect, setKeepAspect] = useState(true);
  const [quality, setQuality] = useState(0.92);
  const [format, setFormat] = useState<"image/png" | "image/jpeg" | "image/webp">("image/png");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [resultUrl, setResultUrl] = useState("");

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        setImg(image);
        setWidth(image.naturalWidth);
        setHeight(image.naturalHeight);
      };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const onWidthChange = (v: number) => {
    setWidth(v);
    if (keepAspect && img) setHeight(Math.max(1, Math.round((v * img.naturalHeight) / img.naturalWidth)));
  };
  const onHeightChange = (v: number) => {
    setHeight(v);
    if (keepAspect && img) setWidth(Math.max(1, Math.round((v * img.naturalWidth) / img.naturalHeight)));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const w = Math.min(Math.max(Math.round(width), 1), 8192);
    const h = Math.min(Math.max(Math.round(height), 1), 8192);
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, w, h);
    setResultUrl(canvas.toDataURL(format, quality));
  }, [img, width, height, format, quality]);

  const handleDownload = () => {
    if (!resultUrl) return;
    const ext = format === "image/jpeg" ? "jpg" : format === "image/webp" ? "webp" : "png";
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `resized-${width}x${height}.${ext}`;
    a.click();
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const inputCls =
    "w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200";

  return (
    <ToolLayout
      title={t("title")}
      slug="img-size"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="max-w-4xl space-y-4">
        {!img ? (
          <div
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files?.[0];
              if (f) loadFile(f);
            }}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("size-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">📐</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input id="size-in" type="file" accept="image/*" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) loadFile(f);
              e.target.value = "";
            }} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => { setImg(null); setResultUrl(""); }} className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}>
                {t("buttons.newImage")}
              </button>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.width")}</label>
                  <input type="number" min={1} max={8192} value={width} onChange={(e) => onWidthChange(Number(e.target.value) || 1)} className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.height")}</label>
                  <input type="number" min={1} max={8192} value={height} onChange={(e) => onHeightChange(Number(e.target.value) || 1)} className={inputCls} />
                </div>
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
                <input type="checkbox" checked={keepAspect} onChange={(e) => setKeepAspect(e.target.checked)} className="accent-blue-500" />
                {t("labels.keepAspect")}
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as typeof format)}
                className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200"
              >
                <option value="image/png">PNG</option>
                <option value="image/jpeg">JPG</option>
                <option value="image/webp">WebP</option>
              </select>
              {format !== "image/png" && (
                <label className="flex items-center gap-2 text-sm text-zinc-300">
                  {t("labels.quality")}
                  <input type="number" min={0.1} max={1} step={0.01} value={quality} onChange={(e) => setQuality(Number(e.target.value) || 0.9)} className="w-20 rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm" />
                </label>
              )}
              <button onClick={handleDownload} className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}>
                {t("buttons.download")}
              </button>
            </div>
            <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
              <canvas ref={canvasRef} className="w-full" />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
