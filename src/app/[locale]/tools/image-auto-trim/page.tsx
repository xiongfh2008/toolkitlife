"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

const MAX_DIM = 3000;

export default function ImageAutoTrimPage() {
  const t = useTranslations("tools.image-auto-trim");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [mode, setMode] = useState<"transparent" | "corner">("transparent");
  const [result, setResult] = useState("");
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
    const w = Math.round(img.naturalWidth * scale);
    const h = Math.round(img.naturalHeight * scale);
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, w, h);
    const src = ctx.getImageData(0, 0, w, h);
    const data = src.data;

    const isClear = (x: number, y: number) => {
      const i = (y * w + x) * 4;
      if (mode === "transparent") return data[i + 3] < 8;
      const r = data[0], g = data[1], b = data[2];
      return Math.abs(data[i] - r) < 8 && Math.abs(data[i + 1] - g) < 8 && Math.abs(data[i + 2] - b) < 8;
    };

    let minX = w, minY = h, maxX = -1, maxY = -1;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (!isClear(x, y)) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    const nw = maxX - minX + 1;
    const nh = maxY - minY + 1;
    if (nw <= 0 || nh <= 0 || nw >= w || nh >= h) {
      setResult("");
      return;
    }
    const out = document.createElement("canvas");
    out.width = nw;
    out.height = nh;
    const octx = out.getContext("2d");
    if (!octx) return;
    octx.drawImage(canvas, minX, minY, nw, nh, 0, 0, nw, nh);
    setResult(out.toDataURL("image/png"));
  }, [img, mode]);

  const handleNewImage = () => {
    setImg(null);
    setResult("");
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result;
    a.download = "trimmed.png";
    a.click();
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      slug="image-auto-trim"
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
            onClick={() => document.getElementById("trim-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">✂️</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input id="trim-in" type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleDownload}
                disabled={!result}
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

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.mode")}</label>
              <div className="flex gap-2">
                {(["transparent", "corner"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`${btn} ${mode === m ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}
                  >
                    {m === "transparent" ? t("labels.transparent") : t("labels.corner")}
                  </button>
                ))}
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
                <div className="flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                  {result ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={result} alt="Trimmed" className="max-h-72" />
                  ) : (
                    <p className="text-sm text-zinc-500">{t("labels.nothingToTrim")}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
