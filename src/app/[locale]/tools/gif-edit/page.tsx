"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { decodeGif } from "@/lib/gif-decoder";
import { encodeGif } from "@/lib/gif-encoder";

interface Frame {
  id: string;
  imageData: ImageData;
  delayMs: number;
}

export default function GifEditPage() {
  const t = useTranslations("tools.gif-edit");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [frames, setFrames] = useState<Frame[]>([]);
  const [fileName, setFileName] = useState("animation");
  const [delayMs, setDelayMs] = useState(100);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [gifSize, setGifSize] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [playing, setPlaying] = useState(false);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(
    async (file: File) => {
      setError("");
      if (!/\.gif$/i.test(file.name) && file.type !== "image/gif") {
        setError(t("errors.type"));
        return;
      }
      try {
        const buf = await file.arrayBuffer();
        const decoded = decodeGif(buf);
        const list: Frame[] = decoded.frames.map((f, i) => ({
          id: `${Date.now()}-${i}`,
          imageData: f.imageData,
          delayMs: f.delayMs > 0 ? f.delayMs : 100,
        }));
        setFrames(list);
        setDelayMs(list[0]?.delayMs ?? 100);
        setFileName(file.name.replace(/\.gif$/i, "") || "animation");
        setGifUrl(null);
        setPlaying(false);
      } catch (e) {
        console.error(e);
        setError(t("errors.parse"));
      }
    },
    [t],
  );

  // animated preview
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
        const f = frames[idx];
        if (f) {
          canvas.width = f.imageData.width;
          canvas.height = f.imageData.height;
          ctx.putImageData(f.imageData, 0, 0);
        }
        idx = (idx + 1) % frames.length;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing, frames, delayMs]);

  // static preview of first frame
  useEffect(() => {
    if (playing || frames.length === 0) return;
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const f = frames[0];
    canvas.width = f.imageData.width;
    canvas.height = f.imageData.height;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.putImageData(f.imageData, 0, 0);
  }, [playing, frames]);

  const move = (index: number, dir: -1 | 1) => {
    setFrames((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const remove = (id: string) => setFrames((prev) => prev.filter((f) => f.id !== id));

  const duplicate = (index: number) => {
    setFrames((prev) => {
      const next = [...prev];
      next.splice(index + 1, 0, { ...prev[index], id: `${Date.now()}-${Math.random()}` });
      return next;
    });
  };

  const generate = useCallback(async () => {
    if (frames.length === 0) return;
    setProcessing(true);
    setError("");
    try {
      const bytes = encodeGif(frames.map((f) => ({ imageData: f.imageData, delayMs })));
      const blob = new Blob([new Uint8Array(bytes)], { type: "image/gif" });
      if (gifUrl) URL.revokeObjectURL(gifUrl);
      setGifUrl(URL.createObjectURL(blob));
      setGifSize(blob.size);
      setPlaying(false);
    } catch (e) {
      console.error(e);
      setError(t("errors.encode"));
    } finally {
      setProcessing(false);
    }
  }, [frames, delayMs, gifUrl, t]);

  const download = () => {
    if (!gifUrl) return;
    const a = document.createElement("a");
    a.href = gifUrl;
    a.download = `${fileName}-edited.gif`;
    a.click();
  };

  const reset = () => {
    setFrames([]);
    setGifUrl(null);
    setGifSize(0);
    setPlaying(false);
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      slug="gif-edit"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="max-w-4xl space-y-4">
        {frames.length === 0 ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files?.[0];
              if (f) void loadFile(f);
            }}
            onDragOver={(e) => e.preventDefault()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">🎞️</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input ref={fileInputRef} type="file" accept=".gif,image/gif" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void loadFile(f);
              e.target.value = "";
            }} />
          </div>
        ) : (
          <div className="space-y-4">
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => fileInputRef.current?.click()} className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}>
                {t("buttons.changeFile")}
              </button>
              <button onClick={reset} className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}>
                {t("buttons.clear")}
              </button>
              <label className="flex items-center gap-2 text-sm text-zinc-300">
                {t("labels.delay")}
                <input type="number" min={20} max={2000} value={delayMs} onChange={(e) => setDelayMs(Number(e.target.value) || 20)} className="w-20 rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-sm" />
                ms
              </label>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                {t("labels.frames")} · {frames.length}
              </label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                {frames.map((f, i) => (
                  <div key={f.id} className="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900">
                    <canvas
                      width={f.imageData.width}
                      height={f.imageData.height}
                      className="h-24 w-full object-cover"
                      ref={(el) => {
                        if (el) {
                          const ctx = el.getContext("2d");
                          if (ctx) ctx.putImageData(f.imageData, 0, 0);
                        }
                      }}
                    />
                    <div className="flex items-center justify-between px-1 py-1">
                      <span className="text-[10px] text-zinc-500">{i + 1}</span>
                      <div className="flex gap-1">
                        <button onClick={() => move(i, -1)} disabled={i === 0} className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-300 hover:bg-zinc-700 disabled:opacity-30">↑</button>
                        <button onClick={() => move(i, 1)} disabled={i === frames.length - 1} className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-300 hover:bg-zinc-700 disabled:opacity-30">↓</button>
                        <button onClick={() => duplicate(i)} className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-300 hover:bg-zinc-700">⧉</button>
                        <button onClick={() => remove(f.id)} className="rounded bg-red-900/50 px-1.5 py-0.5 text-xs text-red-300 hover:bg-red-900">×</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-300">{t("labels.preview")}</label>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPlaying((p) => !p)} className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}>
                    {playing ? t("buttons.pause") : t("buttons.play")}
                  </button>
                  <button onClick={() => void generate()} disabled={processing} className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}>
                    {processing ? t("buttons.processing") : t("buttons.generate")}
                  </button>
                </div>
              </div>
              <div className="overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                <canvas ref={previewCanvasRef} className="mx-auto max-h-72 max-w-full" />
              </div>
            </div>

            {gifUrl && (
              <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">{t("labels.resultSize", { size: (gifSize / 1024).toFixed(1) })}</span>
                  <button onClick={download} className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}>
                    {t("buttons.download")}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
