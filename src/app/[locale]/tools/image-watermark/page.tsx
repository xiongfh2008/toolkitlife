"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

type WmType = "text" | "image";
type WmPosition = "tl" | "tc" | "tr" | "ml" | "mc" | "mr" | "bl" | "bc" | "br";

const POSITIONS: WmPosition[] = ["tl", "tc", "tr", "ml", "mc", "mr", "bl", "bc", "br"];

interface Source {
  file: File;
  img: HTMLImageElement;
}

interface Result {
  name: string;
  url: string;
  blob: Blob;
}

/** Resolve the top-left corner of a w×h watermark within a W×H canvas. */
function posAt(
  W: number,
  H: number,
  w: number,
  h: number,
  pad: number,
  pos: WmPosition
): { x: number; y: number } {
  let x = pad;
  let y = pad;
  if (pos.includes("c")) x = (W - w) / 2;
  if (pos.includes("r")) x = W - w - pad;
  if (pos.includes("m")) y = (H - h) / 2;
  if (pos.includes("b")) y = H - h - pad;
  return { x, y };
}

const FONT =
  '600 16px system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';

export default function ImageWatermarkPage() {
  const t = useTranslations("tools.image-watermark");

  const [sources, setSources] = useState<Source[]>([]);
  const [wmType, setWmType] = useState<WmType>("text");
  const [text, setText] = useState("");
  const [fontPct, setFontPct] = useState(4);
  const [color, setColor] = useState("#ffffff");
  const [opacity, setOpacity] = useState(55);
  const [position, setPosition] = useState<WmPosition>("br");
  const [wmImage, setWmImage] = useState<HTMLImageElement | null>(null);
  const [wmImagePct, setWmImagePct] = useState(15);
  const [tile, setTile] = useState(false);
  const [gapPct, setGapPct] = useState(8);

  const [results, setResults] = useState<Result[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const loadFiles = useCallback((files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;
    const loaded: Source[] = [];
    let remaining = list.length;
    for (const file of list) {
      const img = new Image();
      img.onload = () => {
        loaded.push({ file, img });
        if (--remaining === 0) {
          setSources((prev) => [...prev, ...loaded]);
          setResults([]);
          setError("");
        }
      };
      img.src = URL.createObjectURL(file);
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files.length) loadFiles(e.dataTransfer.files);
    },
    [loadFiles]
  );

  const loadWmImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const img = new Image();
    img.onload = () => setWmImage(img);
    img.src = URL.createObjectURL(f);
  };

  const removeSource = (i: number) => {
    setSources((prev) => {
      const next = prev.filter((_, idx) => idx !== i);
      if (next.length === 0) setResults([]);
      return next;
    });
  };

  const drawWatermark = (
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number
  ) => {
    ctx.save();
    ctx.globalAlpha = opacity / 100;
    const pad = Math.max(12, Math.round(W * 0.02));

    if (wmType === "text") {
      const fontSize = Math.max(12, Math.round((W * fontPct) / 100));
      const font = `600 ${fontSize}px system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif`;
      ctx.font = font;
      ctx.fillStyle = color;
      const tw = ctx.measureText(text).width;
      const th = fontSize;
      if (tile) {
        const gap = Math.max(10, Math.round((W * gapPct) / 100));
        ctx.textBaseline = "top";
        for (let x = pad; x < W - tw; x += tw + gap) {
          for (let y = pad; y < H - th; y += th * 2 + gap) {
            ctx.fillText(text, x, y);
          }
        }
      } else {
        const { x, y } = posAt(W, H, tw, th, pad, position);
        ctx.textBaseline = "top";
        ctx.fillText(text, x, y);
      }
    } else {
      if (!wmImage) return;
      const w = Math.max(8, Math.round((W * wmImagePct) / 100));
      const h = Math.max(
        8,
        Math.round((w * wmImage.naturalHeight) / wmImage.naturalWidth)
      );
      if (tile) {
        const gap = Math.max(10, Math.round((W * gapPct) / 100));
        for (let x = pad; x < W; x += w + gap) {
          for (let y = pad; y < H; y += h + gap) {
            ctx.drawImage(wmImage, x, y, w, h);
          }
        }
      } else {
        const { x, y } = posAt(W, H, w, h, pad, position);
        ctx.drawImage(wmImage, x, y, w, h);
      }
    }
    ctx.restore();
  };

  const process = async () => {
    if (!sources.length) {
      setError(t("labels.errorNoImage"));
      return;
    }
    if (wmType === "text" && !text.trim()) {
      setError(t("labels.errorText"));
      return;
    }
    if (wmType === "image" && !wmImage) {
      setError(t("labels.errorImage"));
      return;
    }
    setProcessing(true);
    setError("");
    setResults([]);

    const out: Result[] = [];
    for (const s of sources) {
      const canvas = document.createElement("canvas");
      canvas.width = s.img.naturalWidth;
      canvas.height = s.img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) continue;
      ctx.drawImage(s.img, 0, 0);
      drawWatermark(ctx, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      if (!blob) continue;
      const base = s.file.name.replace(/\.[^.]+$/, "");
      out.push({ name: `${base}-watermarked.png`, url: URL.createObjectURL(blob), blob });
    }
    setResults(out);
    setProcessing(false);
  };

  const downloadAll = async () => {
    if (!results.length) return;
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    for (const r of results) zip.file(r.name, r.blob);
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "watermarked-images.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    for (const r of results) URL.revokeObjectURL(r.url);
    setSources([]);
    setResults([]);
    setError("");
  };

  const btn = "px-4 py-2 rounded-lg text-sm font-medium transition-colors";

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="image-watermark"
    >
      <div className="max-w-4xl space-y-4">
        {/* Upload */}
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-zinc-600 rounded-xl p-10 text-center cursor-pointer hover:border-zinc-500 transition-colors"
        >
          <div className="text-4xl mb-3">{t("upload.icon")}</div>
          <p className="text-zinc-300 font-medium">{t("upload.title")}</p>
          <p className="text-zinc-500 text-sm mt-1">{t("upload.subtitle")}</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && loadFiles(e.target.files)}
          />
        </div>

        {sources.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {sources.map((s, i) => (
              <div key={i} className="relative group">
                <img
                  src={s.img.src}
                  alt=""
                  className="h-16 w-16 rounded-lg border border-zinc-700 object-cover"
                />
                <button
                  onClick={() => removeSource(i)}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Watermark settings */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              {t("labels.watermarkType")}
            </label>
            <div className="grid grid-cols-2 gap-2 max-w-xs">
              {(["text", "image"] as WmType[]).map((wt) => (
                <button
                  key={wt}
                  onClick={() => setWmType(wt)}
                  className={`${btn} ${wmType === wt ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}
                >
                  {t(`labels.types.${wt}`)}
                </button>
              ))}
            </div>
          </div>

          {wmType === "text" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-zinc-300">
                  {t("labels.textContent")}
                </label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t("labels.textPlaceholder")}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">
                  {t("labels.fontSize")}
                </label>
                <input
                  type="range"
                  min={1}
                  max={15}
                  step={0.5}
                  value={fontPct}
                  onChange={(e) => setFontPct(Number(e.target.value))}
                  className="mt-3 w-full"
                />
                <span className="text-xs text-zinc-500">{fontPct}%</span>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">
                  {t("labels.color")}
                </label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-9 w-full cursor-pointer rounded-lg border border-zinc-700 bg-zinc-800"
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">
                  {t("labels.uploadWm")}
                </label>
                <input
                  type="file"
                  accept="image/png,image/webp,image/svg+xml"
                  onChange={loadWmImage}
                  className="block w-full text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">
                  {t("labels.size")}
                </label>
                <input
                  type="range"
                  min={3}
                  max={50}
                  step={1}
                  value={wmImagePct}
                  onChange={(e) => setWmImagePct(Number(e.target.value))}
                  className="mt-3 w-full"
                />
                <span className="text-xs text-zinc-500">{wmImagePct}%</span>
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.opacity")}
              </label>
              <input
                type="range"
                min={5}
                max={100}
                step={1}
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="mt-3 w-full"
              />
              <span className="text-xs text-zinc-500">{opacity}%</span>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.position")}
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {POSITIONS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPosition(p)}
                    className={`rounded-lg py-1.5 text-xs transition-colors ${
                      position === p
                        ? "bg-blue-600 text-white"
                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    }`}
                  >
                    {t(`labels.positions.${p}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={tile}
                onChange={(e) => setTile(e.target.checked)}
                className="rounded border-zinc-600 bg-zinc-700 text-blue-600 focus:ring-blue-500"
              />
              {t("labels.tile")}
            </label>
            {tile && (
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">
                  {t("labels.gap")}
                </label>
                <input
                  type="range"
                  min={2}
                  max={30}
                  step={1}
                  value={gapPct}
                  onChange={(e) => setGapPct(Number(e.target.value))}
                  className="mt-3 w-full"
                />
                <span className="text-xs text-zinc-500">{gapPct}%</span>
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-lg border border-red-800 bg-red-900/30 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={process}
              disabled={processing}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-60"
            >
              {processing ? t("labels.processing") : t("buttons.process")}
            </button>
            <button
              onClick={reset}
              className="rounded-lg bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
            >
              {t("buttons.reset")}
            </button>
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-medium text-zinc-300">
                {t("labels.results", { count: results.length })}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={downloadAll}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500"
                >
                  {t("buttons.downloadAll")}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {results.map((r, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
                >
                  <img
                    src={r.url}
                    alt={r.name}
                    className="aspect-square w-full object-contain"
                  />
                  <div className="border-t border-zinc-800 p-2">
                    <a
                      href={r.url}
                      download={r.name}
                      className="block w-full rounded-lg bg-zinc-800 px-3 py-1.5 text-center text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
                    >
                      {t("buttons.downloadOne")}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
