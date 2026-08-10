"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

interface StitchItem {
  id: number;
  name: string;
  url: string;
  width: number;
  height: number;
}

type Direction = "vertical" | "horizontal";
type Align = "center" | "stretch";
type Bg = "white" | "black" | "transparent";

const MAX_ITEMS = 20;
const MAX_SIDE = 16000;
const MAX_PIXELS = 80_000_000;

export default function ImageStitcherPage() {
  const t = useTranslations("tools.image-stitcher");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [items, setItems] = useState<StitchItem[]>([]);
  const [direction, setDirection] = useState<Direction>("vertical");
  const [align, setAlign] = useState<Align>("center");
  const [bg, setBg] = useState<Bg>("white");
  const [scale, setScale] = useState(100);
  const [format, setFormat] = useState<"png" | "jpg">("png");
  const [resultUrl, setResultUrl] = useState("");
  const [resultSize, setResultSize] = useState(0);
  const [resultDim, setResultDim] = useState({ width: 0, height: 0 });
  const [ready, setReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const nextIdRef = useRef(1);
  const resultUrlRef = useRef("");
  const countRef = useRef(0);

  const clearResult = useCallback(() => {
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = "";
    setResultUrl("");
    setReady(false);
  }, []);

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) return;
    setError("");
    const newItems: StitchItem[] = [];
    for (const f of list) {
      if (countRef.current >= MAX_ITEMS) break;
      try {
        const url = URL.createObjectURL(f);
        const img = new Image();
        img.src = url;
        await img.decode();
        newItems.push({
          id: nextIdRef.current++,
          name: f.name,
          url,
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
        countRef.current += 1;
      } catch {
        // skip unreadable images
      }
    }
    if (newItems.length > 0) {
      setItems((prev) => [...prev, ...newItems]);
      clearResult();
    }
  }, [clearResult]);

  const removeItem = useCallback(
    (id: number) => {
      const target = items.find((it) => it.id === id);
      if (target) {
        URL.revokeObjectURL(target.url);
        countRef.current = Math.max(0, countRef.current - 1);
      }
      setItems((prev) => prev.filter((it) => it.id !== id));
      clearResult();
    },
    [items, clearResult]
  );

  const moveItem = useCallback(
    (id: number, dir: -1 | 1) => {
      setItems((prev) => {
        const idx = prev.findIndex((it) => it.id === id);
        const next = idx + dir;
        if (idx < 0 || next < 0 || next >= prev.length) return prev;
        const copy = [...prev];
        const [item] = copy.splice(idx, 1);
        copy.splice(next, 0, item);
        return copy;
      });
      clearResult();
    },
    [clearResult]
  );

  const reset = useCallback(() => {
    items.forEach((it) => URL.revokeObjectURL(it.url));
    clearResult();
    countRef.current = 0;
    setItems([]);
    setError("");
  }, [items, clearResult]);

  const stitch = useCallback(async () => {
    if (items.length < 2) {
      setError(t("errors.minimum"));
      return;
    }
    setProcessing(true);
    setError("");
    try {
      const imgs = await Promise.all(
        items.map(
          (it) =>
            new Promise<HTMLImageElement>((resolve, reject) => {
              const img = new Image();
              img.onload = () => resolve(img);
              img.onerror = () => reject(new Error("LOAD"));
              img.src = it.url;
            })
        )
      );
      const ratio = scale / 100;
      const dims = imgs.map((img) => ({
        w: Math.max(1, Math.round(img.naturalWidth * ratio)),
        h: Math.max(1, Math.round(img.naturalHeight * ratio)),
      }));
      const isVertical = direction === "vertical";
      const canvasW = isVertical
        ? Math.max(...dims.map((d) => d.w))
        : dims.reduce((s, d) => s + d.w, 0);
      const canvasH = isVertical
        ? dims.reduce((s, d) => s + d.h, 0)
        : Math.max(...dims.map((d) => d.h));
      if (canvasW > MAX_SIDE || canvasH > MAX_SIDE) {
        throw new Error("TOO_SIDE");
      }
      if (canvasW * canvasH > MAX_PIXELS) {
        throw new Error("TOO_LARGE");
      }

      const canvas = document.createElement("canvas");
      canvas.width = canvasW;
      canvas.height = canvasH;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas 2D is unavailable");
      if (bg !== "transparent") {
        ctx.fillStyle = bg === "white" ? "#ffffff" : "#000000";
        ctx.fillRect(0, 0, canvasW, canvasH);
      }

      let pos = 0;
      for (let i = 0; i < imgs.length; i++) {
        const d = dims[i];
        if (isVertical) {
          const x = align === "stretch" ? 0 : Math.round((canvasW - d.w) / 2);
          const dw = align === "stretch" ? canvasW : d.w;
          ctx.drawImage(imgs[i], x, pos, dw, d.h);
          pos += d.h;
        } else {
          const y = align === "stretch" ? 0 : Math.round((canvasH - d.h) / 2);
          const dh = align === "stretch" ? canvasH : d.h;
          ctx.drawImage(imgs[i], pos, y, d.w, dh);
          pos += d.w;
        }
      }

      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("FAIL"))),
          format === "png" ? "image/png" : "image/jpeg",
          0.92
        )
      );
      if (blob.size < 100) throw new Error("FAIL");
      clearResult();
      const url = URL.createObjectURL(blob);
      resultUrlRef.current = url;
      setResultUrl(url);
      setResultSize(blob.size);
      setResultDim({ width: canvasW, height: canvasH });
      setReady(true);
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === "TOO_SIDE") setError(t("errors.tooSide"));
      else if (msg === "TOO_LARGE") setError(t("errors.tooLarge"));
      else setError(t("errors.process"));
    } finally {
      setProcessing(false);
    }
  }, [items, direction, align, bg, scale, format, t, clearResult]);

  const download = useCallback(() => {
    if (!resultUrl || items.length === 0) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `stitched-${format === "png" ? "image.png" : "image.jpg"}`;
    a.click();
  }, [resultUrl, format, items.length]);

  const fmtSize = (b: number) =>
    b < 1024 * 1024
      ? t("units.kb", { size: (b / 1024).toFixed(1) })
      : t("units.mb", { size: (b / (1024 * 1024)).toFixed(1) });

  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none";

  return (
    <ToolLayout
      title={t("title")}
      slug="image-stitcher"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-5">
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <div
          role="button"
          tabIndex={0}
          onClick={() => document.getElementById("stitcher-input")?.click()}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") &&
            document.getElementById("stitcher-input")?.click()
          }
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            void addFiles(e.dataTransfer.files);
          }}
          className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-800/50 p-10 text-center transition-colors hover:border-zinc-500"
        >
          <span className="text-4xl">🧩</span>
          <span className="text-sm text-zinc-400">{t("upload.drop")}</span>
          <span className="text-xs text-zinc-500">{t("upload.formats")}</span>
          <input
            id="stitcher-input"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) void addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        {items.length > 0 && (
          <div className="space-y-4">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-zinc-300">
                  {t("info.count", { count: items.length })}
                </span>
                <button
                  onClick={reset}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
                >
                  {t("buttons.clear")}
                </button>
              </div>
              <div className="space-y-2">
                {items.map((it, idx) => (
                  <div
                    key={it.id}
                    className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-2"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={it.url}
                      alt={it.name}
                      className="h-12 w-12 shrink-0 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-zinc-200">{it.name}</p>
                      <p className="text-xs text-zinc-500">
                        {it.width}×{it.height} · {idx + 1}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button
                        onClick={() => moveItem(it.id, -1)}
                        disabled={idx === 0}
                        className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-700 disabled:opacity-30"
                        aria-label="up"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveItem(it.id, 1)}
                        disabled={idx === items.length - 1}
                        className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-700 disabled:opacity-30"
                        aria-label="down"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => removeItem(it.id)}
                        className="rounded bg-zinc-800 px-2 py-1 text-xs text-red-400 hover:bg-zinc-700"
                        aria-label="remove"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  {t("labels.direction")}
                </label>
                <div className="flex gap-2">
                  {(["vertical", "horizontal"] as Direction[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        setDirection(d);
                        clearResult();
                      }}
                      className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                        direction === d
                          ? "bg-blue-600 text-white"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      {t(`directions.${d}`)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  {t("labels.align")}
                </label>
                <div className="flex gap-2">
                  {(["center", "stretch"] as Align[]).map((a) => (
                    <button
                      key={a}
                      onClick={() => {
                        setAlign(a);
                        clearResult();
                      }}
                      className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                        align === a
                          ? "bg-blue-600 text-white"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      {t(`aligns.${a}`)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  {t("labels.bg")}
                </label>
                <div className="flex gap-2">
                  {(["white", "black", "transparent"] as Bg[]).map((b) => (
                    <button
                      key={b}
                      onClick={() => {
                        setBg(b);
                        clearResult();
                      }}
                      className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                        bg === b
                          ? "bg-blue-600 text-white"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      {t(`backgrounds.${b}`)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  {t("labels.scale")}
                </label>
                <select
                  value={scale}
                  onChange={(e) => {
                    setScale(Number(e.target.value));
                    clearResult();
                  }}
                  className={inputCls}
                >
                  {[100, 75, 50, 25].map((s) => (
                    <option key={s} value={s}>
                      {s}%
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  {t("labels.format")}
                </label>
                <select
                  value={format}
                  onChange={(e) => {
                    setFormat(e.target.value as "png" | "jpg");
                    clearResult();
                  }}
                  className={inputCls}
                >
                  <option value="png">PNG</option>
                  <option value="jpg">JPEG</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => void stitch()}
                  disabled={processing}
                  className="w-full rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
                >
                  {processing ? t("buttons.processing") : t("buttons.stitch")}
                </button>
              </div>
            </div>
          </div>
        )}

        {ready && resultUrl && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-zinc-300">
                <span className="mr-4">
                  {t("info.dimensions", {
                    width: resultDim.width,
                    height: resultDim.height,
                  })}
                </span>
                <span>{fmtSize(resultSize)}</span>
              </div>
              <button
                onClick={download}
                className="rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500"
              >
                {t("buttons.download")}
              </button>
            </div>
            <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resultUrl}
                alt={t("title")}
                className="mx-auto max-h-[480px] w-auto max-w-full object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
