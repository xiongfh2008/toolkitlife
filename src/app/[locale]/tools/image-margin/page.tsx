"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

const MAX_DIM = 3000;
const PRESETS = ["#ffffff", "#000000", "#ff0000", "#0000ff"];

export default function ImageMarginPage() {
  const t = useTranslations("tools.image-margin");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [margin, setMargin] = useState(50);
  const [transparent, setTransparent] = useState(true);
  const [color, setColor] = useState("#ffffff");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => setImg(image);
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const scale = Math.min(1, MAX_DIM / Math.max(img.naturalWidth, img.naturalHeight));
    const iw = Math.round(img.naturalWidth * scale);
    const ih = Math.round(img.naturalHeight * scale);
    const m = Math.min(Math.max(margin, 0), 2000);
    canvas.width = iw + m * 2;
    canvas.height = ih + m * 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (!transparent) {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, m, m, iw, ih);
  }, [img, margin, transparent, color]);

  const handleNewImage = () => setImg(null);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "image-with-margin.png";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }, "image/png");
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      slug="image-margin"
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
            onClick={() => document.getElementById("margin-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">🖼️</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input id="margin-in" type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleDownload}
                className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
              >
                {t("buttons.download")}
              </button>
              <button
                onClick={handleNewImage}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {t("buttons.newImage")}
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">
                  {t("labels.size")} · {margin}px
                </label>
                <input
                  type="range"
                  min={0}
                  max={500}
                  step={5}
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.color")}</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTransparent(true)}
                    className={`${btn} ${transparent ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}
                  >
                    {t("labels.transparent")}
                  </button>
                  {PRESETS.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setTransparent(false);
                        setColor(c);
                      }}
                      style={{ backgroundColor: c }}
                      className={`h-8 w-8 rounded-full border-2 ${!transparent && color === c ? "border-blue-500" : "border-zinc-700"}`}
                      aria-label={c}
                    />
                  ))}
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => {
                      setTransparent(false);
                      setColor(e.target.value);
                    }}
                    className="h-8 w-10 cursor-pointer rounded border border-zinc-700 bg-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-300">
                {t("labels.original")} / {t("labels.result")}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt="Original" className="w-full rounded-lg border border-zinc-800" />
                </div>
                <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
                  <canvas ref={canvasRef} className="w-full" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
