"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { encodeGif } from "@/lib/gif-encoder";
import { decodeGif } from "@/lib/gif-decoder";

interface FrameItem {
  id: string;
  source: CanvasImageSource; // HTMLImageElement or canvas (GIF-derived frames)
  name: string;
  naturalWidth: number;
  naturalHeight: number;
}

export default function ImageToGifPage() {
  const t = useTranslations("tools.image-to-gif");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [frames, setFrames] = useState<FrameItem[]>([]);
  const [delayMs, setDelayMs] = useState(200);
  const [width, setWidth] = useState(480);
  const [height, setHeight] = useState(360);
  const [lockAspect, setLockAspect] = useState(true);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [gifSize, setGifSize] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [playing, setPlaying] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const hasFrames = useRef(false);
  const urlRefs = useRef<string[]>([]);

  useEffect(() => {
    const urls = urlRefs.current;
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
      if (gifUrl) URL.revokeObjectURL(gifUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep an animated preview playing through all frames.
  useEffect(() => {
    if (!playing || frames.length === 0) return;
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();
    let idx = 0;

    const step = (now: number) => {
      if (now - last >= Math.max(20, delayMs)) {
        last = now;
        const frame = frames[idx];
        if (frame) {
          drawFrameToCanvas(ctx, frame, width, height);
        }
        idx = (idx + 1) % frames.length;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing, frames, delayMs, width, height]);

  // Render the first frame as a static preview when not playing.
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas || playing || frames.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawFrameToCanvas(ctx, frames[0], width, height);
  }, [frames, playing, width, height]);

  const addFile = useCallback(
    async (file: File) => {
      setError("");
      const isGif = file.type === "image/gif" || /\.gif$/i.test(file.name);
      try {
        const url = URL.createObjectURL(file);
        urlRefs.current.push(url);

        if (isGif) {
          // Extract every frame of the GIF as source material.
          const buf = await file.arrayBuffer();
          const decoded = decodeGif(buf);
          const newFrames: FrameItem[] = decoded.frames.map((f, i) => {
            const canvas = new OffscreenCanvas(decoded.width, decoded.height);
            const ctx = canvas.getContext("2d")!;
            ctx.putImageData(f.imageData, 0, 0);
            return {
              id: `${Date.now()}-${i}`,
              source: canvas,
              name: `${file.name.replace(/\.gif$/i, "")}-frame-${i + 1}`,
              naturalWidth: decoded.width,
              naturalHeight: decoded.height,
            };
          });
          setFrames((prev) => [...prev, ...newFrames]);
          if (newFrames.length > 0) {
            hasFrames.current = true;
            setWidth((w) => w || decoded.width);
            setHeight((h) => h || decoded.height);
          }
          return;
        }

        const img = new Image();
        img.onload = () => {
          if (!hasFrames.current) {
            setWidth(img.naturalWidth);
            setHeight(img.naturalHeight);
          }
          hasFrames.current = true;
          setFrames((prev) => [
            ...prev,
            {
              id: `${Date.now()}`,
              source: img,
              name: file.name.replace(/\.[^.]+$/, ""),
              naturalWidth: img.naturalWidth,
              naturalHeight: img.naturalHeight,
            },
          ]);
        };
        img.src = url;
      } catch (err) {
        console.error(err);
        setError(t("errors.load"));
      }
    },
    [t]
  );

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
      for (const file of list) {
        void addFile(file);
      }
    },
    [addFile]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) handleFiles(e.target.files);
    e.target.value = "";
  };

  const removeFrame = (id: string) => {
    setFrames((prev) => prev.filter((f) => f.id !== id));
  };

  const moveFrame = (index: number, dir: -1 | 1) => {
    setFrames((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const reset = () => {
    setFrames([]);
    setGifUrl(null);
    setGifSize(0);
    setPlaying(false);
    hasFrames.current = false;
  };

  const onWidthChange = (v: number) => {
    setWidth(v);
    if (lockAspect && frames.length > 0) {
      const f = frames[0];
      setHeight(Math.max(1, Math.round((v * f.naturalHeight) / f.naturalWidth)));
    }
  };

  const onHeightChange = (v: number) => {
    setHeight(v);
    if (lockAspect && frames.length > 0) {
      const f = frames[0];
      setWidth(Math.max(1, Math.round((v * f.naturalWidth) / f.naturalHeight)));
    }
  };

  const generateGif = useCallback(async () => {
    if (frames.length === 0) return;
    setProcessing(true);
    setGifUrl(null);
    setError("");
    try {
      const outCanvas = new OffscreenCanvas(width, height);
      const ctx = outCanvas.getContext("2d")!;
      const encoded = frames.map((frame) => {
        ctx.clearRect(0, 0, width, height);
        drawFrameToCanvas(ctx, frame, width, height);
        return {
          imageData: ctx.getImageData(0, 0, width, height),
          delayMs,
        };
      });
      const bytes = encodeGif(encoded);
      const blob = new Blob([new Uint8Array(bytes)], { type: "image/gif" });
      if (gifUrl) URL.revokeObjectURL(gifUrl);
      setGifUrl(URL.createObjectURL(blob));
      setGifSize(blob.size);
      setPlaying(false);
    } catch (err) {
      console.error(err);
      setError(t("errors.encode"));
    } finally {
      setProcessing(false);
    }
  }, [frames, width, height, delayMs, gifUrl, t]);

  const download = useCallback(() => {
    if (!gifUrl) return;
    const a = document.createElement("a");
    a.href = gifUrl;
    a.download = "animation.gif";
    a.click();
  }, [gifUrl]);

  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none";

  return (
    <ToolLayout
      title={t("title")}
      slug="image-to-gif"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-5">
        {/* Upload area */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && fileInputRef.current?.click()
          }
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
          }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
            dragging
              ? "border-blue-600 bg-blue-600/10"
              : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-500"
          }`}
        >
          <span className="text-4xl">{t("upload.icon")}</span>
          <span className="text-sm text-zinc-400">{t("upload.drop")}</span>
          <span className="text-xs text-zinc-500">{t("upload.formats")}</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}

        {frames.length > 0 && (
          <>
            {/* Frame list with reorder / delete */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-300">
                  {t("labels.frames")} ({frames.length})
                </label>
                <button
                  onClick={reset}
                  className="text-xs text-zinc-500 hover:text-zinc-300"
                >
                  {t("buttons.clear")}
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                {frames.map((frame, i) => (
                  <div
                    key={frame.id}
                    className="relative overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900"
                  >
                    <canvas
                      width={frame.naturalWidth}
                      height={frame.naturalHeight}
                      className="h-24 w-full object-cover"
                      ref={(el) => {
                        if (el) {
                          const ctx = el.getContext("2d");
                          if (ctx) {
                            ctx.clearRect(0, 0, el.width, el.height);
                            ctx.drawImage(
                              frame.source,
                              0,
                              0,
                              el.width,
                              el.height,
                            );
                          }
                        }
                      }}
                    />
                    <div className="flex items-center justify-between px-1 py-1">
                      <span className="text-[10px] text-zinc-500">{i + 1}</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => moveFrame(i, -1)}
                          disabled={i === 0}
                          aria-label="up"
                          className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-300 hover:bg-zinc-700 disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveFrame(i, 1)}
                          disabled={i === frames.length - 1}
                          aria-label="down"
                          className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-300 hover:bg-zinc-700 disabled:opacity-30"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => removeFrame(frame.id)}
                          aria-label="delete"
                          className="rounded bg-red-900/50 px-1.5 py-0.5 text-xs text-red-300 hover:bg-red-900"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Settings: delay, size */}
            <div className="grid gap-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">
                  {t("labels.delay")}: {delayMs}ms
                </label>
                <input
                  type="range"
                  min={20}
                  max={2000}
                  step={10}
                  value={delayMs}
                  onChange={(e) => setDelayMs(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <input
                  type="number"
                  min={20}
                  max={10000}
                  value={delayMs}
                  onChange={(e) => setDelayMs(Number(e.target.value) || 200)}
                  className={`${inputCls} mt-2`}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">
                  {t("labels.width")}
                </label>
                <input
                  type="number"
                  min={16}
                  max={2048}
                  value={width}
                  onChange={(e) => onWidthChange(Number(e.target.value) || 1)}
                  className={inputCls}
                />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-sm font-medium text-zinc-300">
                    {t("labels.height")}
                  </label>
                  <label className="flex cursor-pointer items-center gap-1 text-xs text-zinc-500">
                    <input
                      type="checkbox"
                      checked={lockAspect}
                      onChange={(e) => setLockAspect(e.target.checked)}
                      className="accent-blue-500"
                    />
                    {t("labels.lockAspect")}
                  </label>
                </div>
                <input
                  type="number"
                  min={16}
                  max={2048}
                  value={height}
                  onChange={(e) => onHeightChange(Number(e.target.value) || 1)}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Preview + generate */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-sm font-medium text-zinc-300">
                  {t("labels.preview")}
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPlaying((p) => !p)}
                    disabled={frames.length === 0}
                    className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                  >
                    {playing ? t("buttons.pause") : t("buttons.play")}
                  </button>
                  <button
                    onClick={generateGif}
                    disabled={processing}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
                  >
                    {processing ? t("buttons.processing") : t("buttons.generate")}
                  </button>
                </div>
              </div>
              <div className="overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                <canvas
                  ref={previewCanvasRef}
                  width={width}
                  height={height}
                  className="mx-auto max-w-full border border-zinc-800"
                  style={{ width: "min(100%, 480px)", height: "auto" }}
                />
              </div>
            </div>

            {/* Result */}
            {gifUrl && (
              <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={gifUrl}
                  alt={t("result.alt")}
                  className="mx-auto max-h-80"
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">
                    {t("result.size", { size: (gifSize / 1024).toFixed(1) })}
                  </span>
                  <button
                    onClick={download}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
                  >
                    {t("buttons.download")}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
}

function drawFrameToCanvas(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  frame: FrameItem,
  width: number,
  height: number,
) {
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(frame.source, 0, 0, width, height);
}
