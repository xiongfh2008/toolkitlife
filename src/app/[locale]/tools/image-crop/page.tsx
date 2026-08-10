"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

interface CropRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface RatioPreset {
  key: string;
  label: string;
  ratio: number | null;
}

const RATIO_PRESETS: RatioPreset[] = [
  { key: "free", label: "Free", ratio: null },
  { key: "1:1", label: "1:1", ratio: 1 },
  { key: "16:9", label: "16:9", ratio: 16 / 9 },
  { key: "9:16", label: "9:16", ratio: 9 / 16 },
  { key: "instagram", label: "Instagram Post", ratio: 1 },
  { key: "youtube", label: "YouTube Thumbnail", ratio: 16 / 9 },
  { key: "facebook", label: "Facebook Cover", ratio: 820 / 312 },
  { key: "twitter", label: "Twitter Header", ratio: 3 },
  { key: "linkedin", label: "LinkedIn Banner", ratio: 4 },
];

type DragState =
  | { type: "move"; startClientX: number; startClientY: number; orig: CropRect }
  | { type: "draw"; anchorX: number; anchorY: number }
  | null;

export default function ImageCropPage() {
  const t = useTranslations("tools.image-crop");
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [srcUrl, setSrcUrl] = useState("");
  const [rect, setRect] = useState<CropRect>({ x: 0, y: 0, w: 0, h: 0 });
  const [ratio, setRatio] = useState<number | null>(null);
  const [drag, setDrag] = useState<DragState>(null);
  const [dragging, setDragging] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        setImg(image);
        setSrcUrl(reader.result as string);
        setRect({ x: 0, y: 0, w: image.naturalWidth, h: image.naturalHeight });
        setRatio(null);
      };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadFile(file);
    e.target.value = "";
  };

  const toImgCoords = (clientX: number, clientY: number) => {
    const el = wrapRef.current;
    if (!el || !img) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    const sx = img.naturalWidth / r.width;
    const sy = img.naturalHeight / r.height;
    return { x: (clientX - r.left) * sx, y: (clientY - r.top) * sy };
  };

  const clamp = (v: number, min: number, max: number) =>
    Math.min(max, Math.max(min, v));

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!img) return;
    const pos = toImgCoords(e.clientX, e.clientY);
    const inside =
      pos.x >= rect.x &&
      pos.x <= rect.x + rect.w &&
      pos.y >= rect.y &&
      pos.y <= rect.y + rect.h;
    if (inside) {
      setDrag({
        type: "move",
        startClientX: e.clientX,
        startClientY: e.clientY,
        orig: { ...rect },
      });
    } else {
      setDrag({ type: "draw", anchorX: pos.x, anchorY: pos.y });
      setRect({ x: pos.x, y: pos.y, w: 0, h: 0 });
    }
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!img || !drag) return;
    const W = img.naturalWidth;
    const H = img.naturalHeight;

    if (drag.type === "move") {
      const dx = (e.clientX - drag.startClientX) * (W / wrapRef.current!.clientWidth);
      const dy = (e.clientY - drag.startClientY) * (H / wrapRef.current!.clientHeight);
      setRect({
        ...drag.orig,
        x: clamp(drag.orig.x + dx, 0, W - drag.orig.w),
        y: clamp(drag.orig.y + dy, 0, H - drag.orig.h),
      });
      return;
    }

    // draw
    const pos = toImgCoords(e.clientX, e.clientY);
    const dirX = pos.x >= drag.anchorX ? 1 : -1;
    const dirY = pos.y >= drag.anchorY ? 1 : -1;
    let w = Math.abs(pos.x - drag.anchorX);
    let h = Math.abs(pos.y - drag.anchorY);
    if (ratio) {
      if (w / h > ratio) h = w / ratio;
      else w = h * ratio;
    }
    w = clamp(w, 1, W);
    h = clamp(h, 1, H);
    const x = dirX >= 0 ? drag.anchorX : drag.anchorX - w;
    const y = dirY >= 0 ? drag.anchorY : drag.anchorY - h;
    setRect({
      x: clamp(x, 0, W - w),
      y: clamp(y, 0, H - h),
      w: Math.min(w, W),
      h: Math.min(h, H),
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (drag) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }
    setDrag(null);
  };

  const applyRatio = (p: RatioPreset) => {
    if (!img) return;
    const r = p.ratio;
    setRatio(r);
    if (r === null) return;
    let { x, y, w, h } = rect;
    const W = img.naturalWidth;
    const H = img.naturalHeight;
    if (w / h > r) h = w / r;
    else w = h * r;
    if (w > W) {
      w = W;
      h = w / r;
    }
    if (h > H) {
      h = H;
      w = h * r;
    }
    setRect({
      x: clamp(x + (rect.w - w) / 2, 0, W - w),
      y: clamp(y + (rect.h - h) / 2, 0, H - h),
      w,
      h,
    });
  };

  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const { x, y, w, h } = rect;
    canvas.width = Math.max(1, Math.round(w));
    canvas.height = Math.max(1, Math.round(h));
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y, w, h, 0, 0, canvas.width, canvas.height);
  }, [img, rect]);

  // Live preview: keep the result canvas in sync while dragging or switching presets.
  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  const handleDownload = () => {
    drawPreview();
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const link = document.createElement("a");
    link.download = "cropped-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const pct = (v: number, total: number) => (total > 0 ? (v / total) * 100 : 0);

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="image-crop"
    >
      <div className="max-w-4xl space-y-4">
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
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm text-zinc-400">
                {img.naturalWidth} × {img.naturalHeight}
                <span className="mx-2 text-zinc-600">·</span>
                {t("labels.cropSize")}: {Math.round(rect.w)} × {Math.round(rect.h)}
              </div>
              <div className="text-xs text-zinc-500">{t("labels.cropHint")}</div>
            </div>

            {/* Aspect ratio presets */}
            <div className="flex flex-wrap gap-2">
              {RATIO_PRESETS.map((p) => {
                const active =
                  p.ratio === null ? ratio === null : ratio !== null && Math.abs(ratio - p.ratio) < 0.001;
                return (
                  <button
                    key={p.key}
                    onClick={() => applyRatio(p)}
                    className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                      active
                        ? "border-blue-600 bg-blue-600/10 text-blue-600"
                        : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-blue-500/40 hover:text-blue-600"
                    }`}
                  >
                    {p.ratio === null ? t("labels.freeCrop") : p.label}
                  </button>
                );
              })}
            </div>

            {/* Crop canvas */}
            <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
              <div
                ref={wrapRef}
                className="relative cursor-crosshair touch-none select-none"
                style={{ aspectRatio: `${img.naturalWidth} / ${img.naturalHeight}` }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
              >
                <img
                  src={srcUrl}
                  alt=""
                  draggable={false}
                  className="pointer-events-none block h-full w-full select-none"
                />

                {/* Dimmed overlay outside the crop rect */}
                {[
                  { top: 0, left: 0, height: pct(rect.y, img.naturalHeight), width: "100%" },
                  { top: pct(rect.y, img.naturalHeight), left: 0, height: pct(rect.h, img.naturalHeight), width: pct(rect.x, img.naturalWidth) },
                  { top: pct(rect.y, img.naturalHeight), left: pct(rect.x + rect.w, img.naturalWidth), height: pct(rect.h, img.naturalHeight), width: `calc(100% - ${pct(rect.x + rect.w, img.naturalWidth)}%)` },
                  { top: pct(rect.y + rect.h, img.naturalHeight), left: 0, height: `calc(100% - ${pct(rect.y + rect.h, img.naturalHeight)}%)`, width: "100%" },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="pointer-events-none absolute bg-black/50"
                    style={s}
                  />
                ))}

                {/* Crop rect frame */}
                <div
                  className="pointer-events-none absolute border-2 border-white"
                  style={{
                    left: `${pct(rect.x, img.naturalWidth)}%`,
                    top: `${pct(rect.y, img.naturalHeight)}%`,
                    width: `${pct(rect.w, img.naturalWidth)}%`,
                    height: `${pct(rect.h, img.naturalHeight)}%`,
                  }}
                >
                  {/* rule-of-thirds guide lines */}
                  <div className="absolute inset-0">
                    <div className="absolute left-1/3 top-0 h-full w-px bg-white/40" />
                    <div className="absolute left-2/3 top-0 h-full w-px bg-white/40" />
                    <div className="absolute top-1/3 left-0 w-full h-px bg-white/40" />
                    <div className="absolute top-2/3 left-0 w-full h-px bg-white/40" />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview + download */}
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
                <canvas ref={canvasRef} className="max-w-full border border-zinc-800" />
              </div>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
