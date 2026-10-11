"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import { packIco, canvasToBmpDib, parseIco, dibToImageData, type IcoFrameInput } from "@/lib/ico";

const ALL_SIZES = [16, 24, 32, 48, 64, 128, 256];
const WEBSITE_SIZES = [16, 32, 48];

type Tab = "toIco" | "toImages";
type ScaleMode = "fit" | "fill";
type BgMode = "transparent" | "white" | "black";
type EncMode = "auto" | "png" | "bmp";

interface IcoResult {
  name: string;
  url: string;
  sizeBytes: number;
  frames: number[];
  previews: { size: number; url: string }[];
}

interface ExtractedFrame {
  width: number;
  height: number;
  bitCount: number;
  isPng: boolean;
  url: string;
  blob: Blob;
  raw: Uint8Array;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("decode"));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("read"));
    reader.readAsDataURL(file);
  });
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("encode"))), "image/png");
  });
}

function drawScaled(
  img: HTMLImageElement,
  size: number,
  scale: ScaleMode,
  bg: BgMode
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  if (scale === "fit" && bg !== "transparent") {
    ctx.fillStyle = bg === "white" ? "#ffffff" : "#000000";
    ctx.fillRect(0, 0, size, size);
  }
  const s = scale === "fit" ? Math.min(size / img.width, size / img.height) : Math.max(size / img.width, size / img.height);
  const w = img.width * s;
  const h = img.height * s;
  ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
  return canvas;
}

async function frameData(
  canvas: HTMLCanvasElement,
  enc: EncMode
): Promise<Uint8Array> {
  if (enc === "bmp") return canvasToBmpDib(canvas);
  if (enc === "png" || canvas.width >= 256) {
    const blob = await canvasToBlob(canvas);
    return new Uint8Array(await blob.arrayBuffer());
  }
  return canvasToBmpDib(canvas);
}

function triggerDownload(url: string, name: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function IcoConverterPage() {
  const t = useTranslations("tools.ico-converter");
  const [tab, setTab] = useState<Tab>("toIco");
  const [selected, setSelected] = useState<number[]>(WEBSITE_SIZES);
  const [scale, setScale] = useState<ScaleMode>("fit");
  const [bg, setBg] = useState<BgMode>("transparent");
  const [enc, setEnc] = useState<EncMode>("auto");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<IcoResult[]>([]);
  const [frames, setFrames] = useState<ExtractedFrame[]>([]);
  const [icoName, setIcoName] = useState("favicon.ico");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const icoInputRef = useRef<HTMLInputElement>(null);

  const toggleSize = (size: number) => {
    setSelected((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size].sort((a, b) => a - b)));
  };

  const generate = useCallback(
    async (files: FileList | File[]) => {
      setError("");
      if (selected.length === 0) {
        setError(t("errors.noSize"));
        return;
      }
      setBusy(true);
      const next: IcoResult[] = [];
      try {
        for (const file of Array.from(files)) {
          if (!file.type.startsWith("image/")) {
            setError(t("errors.invalidImage"));
            continue;
          }
          const img = await loadImage(file);
          const frames: IcoFrameInput[] = [];
          const previews: { size: number; url: string }[] = [];
          for (const size of selected) {
            const canvas = drawScaled(img, size, scale, bg);
            frames.push({ width: size, height: size, data: await frameData(canvas, enc) });
            previews.push({ size, url: URL.createObjectURL(await canvasToBlob(canvas)) });
          }
          const ico = packIco(frames);
          const base = file.name.replace(/\.[^.]+$/, "") || "icon";
          next.push({
            name: `${base}.ico`,
            url: URL.createObjectURL(new Blob([ico as BlobPart], { type: "image/x-icon" })),
            sizeBytes: ico.length,
            frames: selected.slice(),
            previews,
          });
        }
        if (next.length > 0) setResults((prev) => [...prev, ...next]);
      } catch {
        setError(t("errors.convertFailed"));
      } finally {
        setBusy(false);
      }
    },
    [selected, scale, bg, enc, t]
  );

  const extract = useCallback(
    async (file: File) => {
      setError("");
      setBusy(true);
      try {
        const buffer = await file.arrayBuffer();
        const entries = parseIco(buffer);
        setIcoName(file.name);
        const decoded: ExtractedFrame[] = [];
        for (const e of entries) {
          if (e.isPng) {
            const blob = new Blob([e.data.slice()], { type: "image/png" });
            decoded.push({
              width: e.width,
              height: e.height,
              bitCount: e.bitCount,
              isPng: true,
              url: URL.createObjectURL(blob),
              blob,
              raw: e.data,
            });
          } else {
            const imgData = dibToImageData(e.data);
            const canvas = document.createElement("canvas");
            canvas.width = e.width;
            canvas.height = e.height;
            canvas.getContext("2d")?.putImageData(imgData, 0, 0);
            const blob = await canvasToBlob(canvas);
            decoded.push({
              width: e.width,
              height: e.height,
              bitCount: e.bitCount,
              isPng: false,
              url: URL.createObjectURL(blob),
              blob,
              raw: e.data,
            });
          }
        }
        setFrames(decoded);
      } catch {
        setFrames([]);
        setError(t("errors.invalidIco"));
      } finally {
        setBusy(false);
      }
    },
    [t]
  );

  const repackIco = useCallback(async () => {
    if (frames.length === 0) return;
    try {
      const packed = packIco(
        frames.map((f) => {
          if (f.isPng) return { width: f.width, height: f.height, data: f.raw };
          const canvas = document.createElement("canvas");
          canvas.width = f.width;
          canvas.height = f.height;
          canvas.getContext("2d")?.putImageData(dibToImageData(f.raw), 0, 0);
          return { width: f.width, height: f.height, data: canvasToBmpDib(canvas) };
        })
      );
      const base = icoName.replace(/\.ico$/i, "") || "frames";
      triggerDownload(URL.createObjectURL(new Blob([packed as BlobPart], { type: "image/x-icon" })), `${base}-repacked.ico`);
    } catch {
      setError(t("errors.convertFailed"));
    }
  }, [frames, icoName, t]);

  // Ctrl+V paste support on the image tab.
  useEffect(() => {
    if (tab !== "toIco") return;
    const onPaste = (e: ClipboardEvent) => {
      const files = Array.from(e.clipboardData?.files ?? []).filter((f) => f.type.startsWith("image/"));
      if (files.length > 0) void generate(files);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [tab, generate]);

  const switchTab = (next: Tab) => {
    setTab(next);
    setError("");
  };

  const handleDrop = (e: React.DragEvent, kind: "image" | "ico") => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (kind === "image") {
      const imgs = files.filter((f) => f.type.startsWith("image/"));
      if (imgs.length > 0) void generate(imgs);
      else setError(t("errors.invalidImage"));
    } else {
      const ico = files.find((f) => /\.ico$/i.test(f.name) || f.type.includes("icon"));
      if (ico) void extract(ico);
      else setError(t("errors.invalidIco"));
    }
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="ico-converter"
    >
      <div className="max-w-3xl space-y-4">
        <div className="flex flex-wrap gap-2">
          {(["toIco", "toImages"] as const).map((m) => (
            <button
              key={m}
              onClick={() => switchTab(m)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                tab === m ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {t(`tabs.${m}`)}
            </button>
          ))}
        </div>

        {tab === "toIco" ? (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.upload")}</label>
              <div
                onDrop={(e) => handleDrop(e, "image")}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-10 text-center transition-colors hover:border-zinc-500"
              >
                <div className="mb-3 text-4xl">🖼️</div>
                <p className="font-medium text-zinc-300">{t("labels.dropHint")}</p>
                <p className="mt-1 text-sm text-zinc-500">{t("labels.pasteHint")}</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    if (e.target.files?.length) void generate(e.target.files);
                    e.target.value = "";
                  }}
                  className="hidden"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.sizes")}</label>
              <div className="mb-2 flex flex-wrap gap-2">
                <button
                  onClick={() => setSelected(WEBSITE_SIZES)}
                  className="rounded-lg bg-zinc-800 px-3 py-1 text-xs text-zinc-300 hover:bg-zinc-700"
                >
                  {t("labels.presetWebsite")}
                </button>
                <button
                  onClick={() => setSelected(ALL_SIZES)}
                  className="rounded-lg bg-zinc-800 px-3 py-1 text-xs text-zinc-300 hover:bg-zinc-700"
                >
                  {t("labels.presetWindows")}
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {ALL_SIZES.map((size) => (
                  <label key={size} className="flex cursor-pointer items-center gap-1.5 text-sm text-zinc-300">
                    <input
                      type="checkbox"
                      checked={selected.includes(size)}
                      onChange={() => toggleSize(size)}
                      className="h-4 w-4 accent-blue-600"
                    />
                    {size}
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-zinc-500">{t("labels.sizeHint")}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.scale")}</label>
                <select
                  value={scale}
                  onChange={(e) => setScale(e.target.value as ScaleMode)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100"
                >
                  <option value="fit">{t("labels.scaleFit")}</option>
                  <option value="fill">{t("labels.scaleFill")}</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.background")}</label>
                <select
                  value={bg}
                  onChange={(e) => setBg(e.target.value as BgMode)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100"
                >
                  <option value="transparent">{t("labels.bgTransparent")}</option>
                  <option value="white">{t("labels.bgWhite")}</option>
                  <option value="black">{t("labels.bgBlack")}</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.encoding")}</label>
                <select
                  value={enc}
                  onChange={(e) => setEnc(e.target.value as EncMode)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100"
                >
                  <option value="auto">{t("labels.encAuto")}</option>
                  <option value="png">{t("labels.encPng")}</option>
                  <option value="bmp">{t("labels.encBmp")}</option>
                </select>
              </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            {results.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-zinc-300">{t("labels.result")}</p>
                {results.map((r, i) => (
                  <div key={`${r.name}-${i}`} className="space-y-3 rounded-lg border border-zinc-700 bg-zinc-800/60 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-zinc-100">{r.name}</p>
                        <p className="text-xs text-zinc-500">
                          {r.frames.join(", ")} · {(r.sizeBytes / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button
                        onClick={() => triggerDownload(r.url, r.name)}
                        className="rounded-lg bg-green-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-500"
                      >
                        {t("buttons.downloadIco")}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {r.previews.map((p) => (
                        <div key={p.size} className="text-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.url}
                            alt={`${p.size}x${p.size}`}
                            className="mx-auto rounded"
                            style={{
                              width: Math.min(64, p.size),
                              height: Math.min(64, p.size),
                              backgroundImage: "conic-gradient(#3f3f46 25%, #52525b 0 50%, #3f3f46 0 75%, #52525b 0)",
                              backgroundSize: "8px 8px",
                            }}
                          />
                          <p className="mt-1 text-[10px] text-zinc-500">{p.size}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    results.forEach((r, i) => setTimeout(() => triggerDownload(r.url, r.name), i * 150));
                  }}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
                >
                  {t("buttons.downloadAll")}
                </button>
                <button
                  onClick={() => setResults([])}
                  className="ml-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
                >
                  {t("buttons.clear")}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.uploadIco")}</label>
              <div
                onDrop={(e) => handleDrop(e, "ico")}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => icoInputRef.current?.click()}
                className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-10 text-center transition-colors hover:border-zinc-500"
              >
                <div className="mb-3 text-4xl">🧩</div>
                <p className="font-medium text-zinc-300">{t("labels.dropHintIco")}</p>
                <input
                  ref={icoInputRef}
                  type="file"
                  accept=".ico,image/x-icon,image/vnd.microsoft.icon"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void extract(f);
                    e.target.value = "";
                  }}
                  className="hidden"
                />
              </div>
              <p className="mt-1 text-xs text-zinc-500">{t("labels.extractHint")}</p>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            {frames.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-zinc-300">
                  {t("labels.frames", { count: frames.length })}
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {frames.map((f, i) => (
                    <div key={`${f.width}-${f.height}-${i}`} className="rounded-lg border border-zinc-700 bg-zinc-800/60 p-3 text-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={f.url}
                        alt={`${f.width}x${f.height}`}
                        className="mx-auto rounded"
                        style={{ width: Math.min(64, f.width), height: Math.min(64, f.height) }}
                      />
                      <p className="mt-2 text-xs text-zinc-300">
                        {f.width}×{f.height} · {f.isPng ? "PNG" : `BMP ${f.bitCount}bpp`}
                      </p>
                      <button
                        onClick={() => triggerDownload(f.url, `${icoName.replace(/\.ico$/i, "")}-${f.width}x${f.height}.png`)}
                        className="mt-2 w-full rounded-lg bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-500"
                      >
                        {t("buttons.downloadPng")}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      frames.forEach((f, i) =>
                        setTimeout(() => triggerDownload(f.url, `${icoName.replace(/\.ico$/i, "")}-${f.width}x${f.height}.png`), i * 150)
                      )
                    }
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
                  >
                    {t("buttons.downloadAllFrames")}
                  </button>
                  <button
                    onClick={() => void repackIco()}
                    className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
                  >
                    {t("buttons.repackIco")}
                  </button>
                  <button
                    onClick={() => setFrames([])}
                    className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
                  >
                    {t("buttons.clear")}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {busy && <p className="text-sm text-zinc-400">{t("labels.working")}</p>}
      </div>
    </ToolLayout>
  );
}
