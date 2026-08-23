"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

const MAX_DIM = 3000;

interface Region {
  x: number;
  y: number;
  w: number;
  h: number;
}

export default function ImageRegionMaskPage() {
  const t = useTranslations("tools.image-region-mask");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [mode, setMode] = useState<"mosaic" | "blur">("mosaic");
  const [blockSize, setBlockSize] = useState(12);
  const [regions, setRegions] = useState<Region[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const regionsRef = useRef<Region[]>([]);
  regionsRef.current = regions;

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        setImg(image);
        setRegions([]);
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

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const onPointerDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    dragRef.current = getPos(e, canvas);
  };

  const onPointerUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !dragRef.current) return;
    const pos = getPos(e, canvas);
    const x = Math.min(dragRef.current.x, pos.x);
    const y = Math.min(dragRef.current.y, pos.y);
    const w = Math.abs(pos.x - dragRef.current.x);
    const h = Math.abs(pos.y - dragRef.current.y);
    dragRef.current = null;
    if (w < 4 || h < 4) return;
    setRegions([...regionsRef.current, { x, y, w, h }]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const scale = Math.min(1, MAX_DIM / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.round(img.naturalWidth * scale);
    const h = Math.round(img.naturalHeight * scale);
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, w, h);

    for (const r of regions) {
      const rx = Math.max(0, Math.round(r.x));
      const ry = Math.max(0, Math.round(r.y));
      const rw = Math.min(w - rx, Math.round(r.w));
      const rh = Math.min(h - ry, Math.round(r.h));
      if (rw <= 0 || rh <= 0) continue;
      if (mode === "mosaic") {
        const imgData = ctx.getImageData(rx, ry, rw, rh);
        const b = Math.max(blockSize, 2);
        for (let y = 0; y < rh; y += b) {
          for (let x = 0; x < rw; x += b) {
            const bw = Math.min(b, rw - x);
            const bh = Math.min(b, rh - y);
            const sample = ctx.getImageData(rx + x, ry + y, 1, 1).data;
            ctx.fillStyle = `rgb(${sample[0]},${sample[1]},${sample[2]})`;
            ctx.fillRect(rx + x, ry + y, bw, bh);
          }
        }
        void imgData;
      } else {
        ctx.save();
        ctx.filter = `blur(${Math.max(blockSize, 2)}px)`;
        ctx.drawImage(canvas, rx, ry, rw, rh, rx, ry, rw, rh);
        ctx.restore();
      }
      ctx.strokeStyle = "rgba(255,255,255,0.8)";
      ctx.lineWidth = 1;
      ctx.strokeRect(rx + 0.5, ry + 0.5, rw, rh);
    }
  }, [img, mode, blockSize, regions]);

  const handleNewImage = () => {
    setImg(null);
    setRegions([]);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Render a clean result without region outlines.
    const out = document.createElement("canvas");
    out.width = canvas.width;
    out.height = canvas.height;
    const octx = out.getContext("2d");
    if (!octx) return;
    octx.drawImage(img!, 0, 0, canvas.width, canvas.height);
    for (const r of regions) {
      const rx = Math.max(0, Math.round(r.x));
      const ry = Math.max(0, Math.round(r.y));
      const rw = Math.min(canvas.width - rx, Math.round(r.w));
      const rh = Math.min(canvas.height - ry, Math.round(r.h));
      if (rw <= 0 || rh <= 0) continue;
      if (mode === "mosaic") {
        const b = Math.max(blockSize, 2);
        for (let y = 0; y < rh; y += b) {
          for (let x = 0; x < rw; x += b) {
            const bw = Math.min(b, rw - x);
            const bh = Math.min(b, rh - y);
            const sample = octx.getImageData(rx + x, ry + y, 1, 1).data;
            octx.fillStyle = `rgb(${sample[0]},${sample[1]},${sample[2]})`;
            octx.fillRect(rx + x, ry + y, bw, bh);
          }
        }
      } else {
        octx.save();
        octx.filter = `blur(${Math.max(blockSize, 2)}px)`;
        octx.drawImage(out, rx, ry, rw, rh, rx, ry, rw, rh);
        octx.restore();
      }
    }
    out.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "masked.png";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }, "image/png");
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      slug="image-region-mask"
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
            onClick={() => document.getElementById("mask-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">🎭</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input id="mask-in" type="file" accept="image/*" className="hidden" onChange={handleUpload} />
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
                onClick={() => setRegions([])}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {t("buttons.clear")}
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
                <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.mode")}</label>
                <div className="flex gap-2">
                  {(["mosaic", "blur"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`${btn} ${mode === m ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}
                    >
                      {m === "mosaic" ? t("labels.mosaic") : t("labels.blur")}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">
                  {t("labels.size")} · {blockSize}
                </label>
                <input
                  type="range"
                  min={2}
                  max={60}
                  step={1}
                  value={blockSize}
                  onChange={(e) => setBlockSize(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>

            <p className="text-sm text-zinc-500">{t("labels.hint")} · {regions.length}</p>

            <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
              <canvas
                ref={canvasRef}
                onMouseDown={onPointerDown}
                onMouseUp={onPointerUp}
                className="w-full cursor-crosshair"
              />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
