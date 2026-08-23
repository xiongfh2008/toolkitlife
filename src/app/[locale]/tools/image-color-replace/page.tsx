"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

const MAX_DIM = 3000;

export default function ImageColorReplacePage() {
  const t = useTranslations("tools.image-color-replace");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [source, setSource] = useState("#ff0000");
  const [target, setTarget] = useState("#00ff00");
  const [targetEmpty, setTargetEmpty] = useState(false);
  const [tolerance, setTolerance] = useState(60);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [picked, setPicked] = useState(false);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        setImg(image);
        setPicked(false);
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

  const hexToRgb = (hex: string) => {
    const m = hex.replace("#", "");
    return [parseInt(m.slice(0, 2), 16), parseInt(m.slice(2, 4), 16), parseInt(m.slice(4, 6), 16)];
  };

  // Pick the source color from the original image on click.
  const handlePick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * canvas.height);
    const temp = document.createElement("canvas");
    temp.width = canvas.width;
    temp.height = canvas.height;
    const tctx = temp.getContext("2d");
    if (!tctx) return;
    tctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const d = tctx.getImageData(x, y, 1, 1).data;
    const hex = `#${[d[0], d[1], d[2]].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
    setSource(hex);
    setPicked(true);
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
    const [sr, sg, sb] = hexToRgb(source);
    const [tr, tg, tb] = targetEmpty ? [0, 0, 0] : hexToRgb(target);
    for (let i = 0; i < data.length; i += 4) {
      const dist = Math.max(Math.abs(data[i] - sr), Math.abs(data[i + 1] - sg), Math.abs(data[i + 2] - sb));
      if (dist <= tolerance) {
        if (targetEmpty) {
          data[i + 3] = 0;
        } else {
          data[i] = tr;
          data[i + 1] = tg;
          data[i + 2] = tb;
        }
      }
    }
    ctx.putImageData(src, 0, 0);
  }, [img, source, target, targetEmpty, tolerance]);

  const handleNewImage = () => {
    setImg(null);
    setPicked(false);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "color-replaced.png";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }, "image/png");
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const inputCls = "w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200";

  return (
    <ToolLayout
      title={t("title")}
      slug="image-color-replace"
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
            onClick={() => document.getElementById("crep-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">🔄</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input id="crep-in" type="file" accept="image/*" className="hidden" onChange={handleUpload} />
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

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.source")}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="h-10 w-12 cursor-pointer rounded border border-zinc-700 bg-transparent"
                  />
                  <button
                    onClick={() => setPicked(true)}
                    className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
                  >
                    {t("labels.pick")}
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.target")}</label>
                <input
                  type="color"
                  value={target}
                  disabled={targetEmpty}
                  onChange={(e) => setTarget(e.target.value)}
                  className="h-10 w-full cursor-pointer rounded border border-zinc-700 bg-transparent disabled:opacity-30"
                />
                <label className="mt-1 flex cursor-pointer items-center gap-2 text-xs text-zinc-500">
                  <input
                    type="checkbox"
                    checked={targetEmpty}
                    onChange={(e) => setTargetEmpty(e.target.checked)}
                    className="h-3.5 w-3.5 accent-blue-600"
                  />
                  {t("labels.toTransparent")}
                </label>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">
                  {t("labels.tolerance")} · {tolerance}
                </label>
                <input
                  type="range"
                  min={0}
                  max={255}
                  step={1}
                  value={tolerance}
                  onChange={(e) => setTolerance(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>

            {picked && <p className="text-sm text-zinc-500">{t("labels.pickHint")}</p>}

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
                  <canvas ref={canvasRef} onClick={handlePick} className="w-full cursor-crosshair" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
