"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import type { CompressOption, ProcessOutput } from "@/lib/imgcompress/ImageBase";
import type { CompressResponse } from "./worker";

type OutputFormat = "keep" | "jpg" | "png" | "webp" | "avif";
type ResizeMethod = "none" | "fitWidth" | "setLong";

interface UploadItem {
  key: number;
  name: string;
  blob: Blob;
  width: number;
  height: number;
  url: string;
  originalSize: number;
  status: "queued" | "compressing" | "done" | "error";
  compressed?: ProcessOutput;
  error?: string;
}

let uid = 1;

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

function mimeToExt(mime: string): string {
  return EXT_BY_MIME[mime] ?? "bin";
}

function baseName(name: string): string {
  return name.replace(/\.[^.]+$/, "");
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function getImageDimension(
  blob: Blob
): Promise<{ width: number; height: number }> {
  if (blob.type === "image/svg+xml") {
    const url = URL.createObjectURL(blob);
    try {
      return await new Promise((resolve) => {
        const img = new Image();
        img.onload = () =>
          resolve({ width: img.naturalWidth, height: img.naturalHeight });
        img.onerror = () => resolve({ width: 0, height: 0 });
        img.src = url;
      });
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  try {
    const bitmap = await createImageBitmap(blob);
    const dim = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return dim;
  } catch {
    return { width: 0, height: 0 };
  }
}

export default function ImageCompressorPage() {
  const t = useTranslations("tools.image-compressor");
  const [items, setItems] = useState<UploadItem[]>([]);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("keep");
  const [quality, setQuality] = useState(0.8);
  const [colors, setColors] = useState(256);
  const [dithering, setDithering] = useState(0.3);
  const [resizeMethod, setResizeMethod] = useState<ResizeMethod>("none");
  const [resizeValue, setResizeValue] = useState(1920);
  const [transparentFill, setTransparentFill] = useState("#ffffff");
  const [compressing, setCompressing] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const workerRef = useRef<Worker | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<UploadItem[]>([]);
  itemsRef.current = items;

  const buildOption = useCallback((): CompressOption => {
    const resize: CompressOption["resize"] = {};
    if (resizeMethod === "fitWidth") {
      resize.method = "fitWidth";
      resize.width = resizeValue;
    } else if (resizeMethod === "setLong") {
      resize.method = "setLong";
      resize.long = resizeValue;
    }
    return {
      preview: { maxSize: 4096 },
      resize,
      format: {
        target: outputFormat === "keep" ? undefined : outputFormat,
        transparentFill,
      },
      jpeg: { quality },
      png: { colors, dithering },
      gif: { colors, dithering: dithering > 0.5 },
      avif: { quality: Math.round(quality * 100), speed: 8 },
    };
  }, [
    outputFormat,
    quality,
    colors,
    dithering,
    resizeMethod,
    resizeValue,
    transparentFill,
  ]);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
      itemsRef.current.forEach((it) => {
        URL.revokeObjectURL(it.url);
        if (it.compressed?.src) URL.revokeObjectURL(it.compressed.src);
      });
    };
  }, []);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const list = Array.from(files);
    const newItems: UploadItem[] = [];
    for (const file of list) {
      const dim = await getImageDimension(file);
      newItems.push({
        key: uid++,
        name: file.name,
        blob: file,
        width: dim.width,
        height: dim.height,
        url: URL.createObjectURL(file),
        originalSize: file.size,
        status: "queued",
      });
    }
    setItems((prev) => [...prev, ...newItems]);
  }, []);

  const updateItem = useCallback(
    (key: number, patch: Partial<UploadItem>) => {
      setItems((prev) =>
        prev.map((it) => (it.key === key ? { ...it, ...patch } : it))
      );
    },
    []
  );

  const compressAll = useCallback(async () => {
    const all = itemsRef.current;
    if (all.length === 0 || compressing) return;
    setCompressing(true);
    setProgress({ done: 0, total: all.length });

    const option = buildOption();
    let doneCount = 0;
    const bump = () => {
      doneCount += 1;
      setProgress((p) => ({ ...p, done: doneCount }));
    };

    // SVG is compressed on the main thread (svgo), everything else in a worker.
    const svgItems = all.filter((it) => it.blob.type === "image/svg+xml");
    const otherItems = all.filter((it) => it.blob.type !== "image/svg+xml");

    // Main-thread SVG compression
    const svgPromise = (async () => {
      const { optimize } = await import("svgo/lib/svgo.js");
      for (const item of svgItems) {
        updateItem(item.key, { status: "compressing" });
        try {
          const text = await item.blob.text();
          const result = optimize(text, { multipass: true });
          const blob = new Blob([result.data], { type: "image/svg+xml" });
          const src = URL.createObjectURL(blob);
          updateItem(item.key, {
            status: "done",
            compressed: {
              width: item.width,
              height: item.height,
              blob,
              src,
            },
          });
        } catch (err) {
          updateItem(item.key, { status: "error", error: String(err) });
        }
        bump();
      }
    })();

    // Worker compression (PNG / GIF / AVIF / JPEG / WebP), processed serially
    const workerPromise = (async () => {
      if (otherItems.length === 0) return;
      const worker =
        workerRef.current ??
        (() => {
          const w = new Worker(new URL("./worker.ts", import.meta.url));
          workerRef.current = w;
          return w;
        })();

      for (const item of otherItems) {
        updateItem(item.key, { status: "compressing" });
        await new Promise<void>((resolve) => {
          const handler = (e: MessageEvent<CompressResponse>) => {
            if (e.data.id !== item.key) return;
            worker.removeEventListener("message", handler);
            if (e.data.error) {
              updateItem(item.key, { status: "error", error: e.data.error });
            } else if (e.data.result) {
              updateItem(item.key, { status: "done", compressed: e.data.result });
            }
            bump();
            resolve();
          };
          worker.addEventListener("message", handler);
          worker.postMessage({
            id: item.key,
            info: {
              key: item.key,
              name: item.name,
              blob: item.blob,
              width: item.width,
              height: item.height,
            },
            option,
          });
        });
      }
    })();

    await Promise.all([svgPromise, workerPromise]);
    setCompressing(false);
  }, [compressing, buildOption, updateItem]);

  const removeItem = useCallback(
    (key: number) => {
      setItems((prev) => {
        const target = prev.find((it) => it.key === key);
        if (target) {
          URL.revokeObjectURL(target.url);
          if (target.compressed?.src) URL.revokeObjectURL(target.compressed.src);
        }
        return prev.filter((it) => it.key !== key);
      });
    },
    []
  );

  const downloadOne = useCallback((item: UploadItem) => {
    if (!item.compressed) return;
    const a = document.createElement("a");
    a.href = item.compressed.src;
    a.download = `${baseName(item.name)}.${mimeToExt(item.compressed.blob.type)}`;
    a.click();
  }, []);

  const downloadAll = useCallback(async () => {
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    for (const item of itemsRef.current) {
      if (!item.compressed) continue;
      zip.file(
        `${baseName(item.name)}.${mimeToExt(item.compressed.blob.type)}`,
        item.compressed.blob
      );
    }
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "compressed-images.zip";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const doneCount = items.filter((it) => it.status === "done").length;
  const totalSaved =
    items.reduce((acc, it) => {
      if (!it.compressed) return acc;
      return acc + Math.max(0, it.originalSize - it.compressed.blob.size);
    }, 0);

  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500";
  const labelCls = "mb-1 block text-sm font-medium text-zinc-300";

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="image-compressor"
    >
      <div className="max-w-4xl space-y-4">
        {/* Upload zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-900 p-8 text-center transition-colors hover:border-blue-500"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files?.length) handleFiles(e.target.files);
              e.target.value = "";
            }}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-400 hover:text-blue-300"
          >
            {t("labels.upload")}
          </button>
          <p className="mt-2 text-sm text-zinc-400">{t("labels.drop")}</p>
          <p className="mt-1 text-xs text-zinc-500">{t("labels.formats")}</p>
        </div>

        {/* Options */}
        {items.length > 0 && (
          <div className="grid gap-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className={labelCls}>{t("labels.outputFormat")}</label>
              <select
                value={outputFormat}
                disabled={compressing}
                onChange={(e) =>
                  setOutputFormat(e.target.value as OutputFormat)
                }
                className={inputCls}
              >
                <option value="keep">{t("options.keep")}</option>
                <option value="jpg">JPEG</option>
                <option value="png">PNG</option>
                <option value="webp">WebP</option>
                <option value="avif">AVIF</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>
                {t("labels.quality")}: {Math.round(quality * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={quality}
                disabled={compressing}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <label className={labelCls}>
                {t("labels.colors")}: {colors}
              </label>
              <input
                type="range"
                min="2"
                max="256"
                step="1"
                value={colors}
                disabled={compressing}
                onChange={(e) => setColors(parseInt(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <label className={labelCls}>
                {t("labels.dithering")}: {Math.round(dithering * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={dithering}
                disabled={compressing}
                onChange={(e) => setDithering(parseFloat(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <label className={labelCls}>{t("labels.resize")}</label>
              <div className="flex gap-2">
                <select
                  value={resizeMethod}
                  disabled={compressing}
                  onChange={(e) =>
                    setResizeMethod(e.target.value as ResizeMethod)
                  }
                  className={inputCls}
                >
                  <option value="none">{t("options.none")}</option>
                  <option value="fitWidth">{t("options.fitWidth")}</option>
                  <option value="setLong">{t("options.setLong")}</option>
                </select>
                {resizeMethod !== "none" && (
                  <input
                    type="number"
                    min="1"
                    value={resizeValue}
                    disabled={compressing}
                    onChange={(e) => setResizeValue(parseInt(e.target.value) || 1)}
                    className={inputCls}
                  />
                )}
              </div>
            </div>

            <div>
              <label className={labelCls}>{t("labels.transparentFill")}</label>
              <input
                type="color"
                value={transparentFill}
                disabled={compressing}
                onChange={(e) => setTransparentFill(e.target.value)}
                className="h-10 w-full cursor-pointer rounded-lg border border-zinc-700 bg-zinc-800"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        {items.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={compressAll}
              disabled={compressing}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
            >
              {compressing
                ? `${t("status.compressing")} ${progress.done}/${progress.total}`
                : t("buttons.compressAll")}
            </button>
            {doneCount > 0 && (
              <button
                onClick={downloadAll}
                className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
              >
                {t("buttons.downloadAll")}
              </button>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
            >
              {t("buttons.addMore")}
            </button>
            <button
              onClick={() => setItems([])}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
            >
              {t("buttons.clear")}
            </button>
            {totalSaved > 0 && (
              <span className="text-sm text-emerald-400">
                {t("results.totalSaved", { size: formatBytes(totalSaved) })}
              </span>
            )}
          </div>
        )}

        {/* List */}
        {items.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const saved =
                item.compressed &&
                item.originalSize > 0 &&
                item.compressed.blob.size < item.originalSize
                  ? Math.round(
                      ((item.originalSize - item.compressed.blob.size) /
                        item.originalSize) *
                        100
                    )
                  : 0;
              return (
                <div
                  key={item.key}
                  className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
                >
                  <div className="relative h-40 bg-zinc-950">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="h-full w-full object-contain"
                    />
                    {item.status === "compressing" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm text-zinc-200">
                        {t("status.compressing")}
                      </div>
                    )}
                    {item.status === "error" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 p-2 text-center text-xs text-red-400">
                        {t("status.error")}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 p-3">
                    <p className="truncate text-xs text-zinc-300" title={item.name}>
                      {item.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {item.width > 0
                        ? `${item.width}×${item.height} · `
                        : ""}
                      {formatBytes(item.originalSize)}
                    </p>
                    {item.compressed && (
                      <p className="text-xs">
                        <span className="text-zinc-400">
                          {formatBytes(item.compressed.blob.size)}
                        </span>{" "}
                        {saved > 0 ? (
                          <span className="text-emerald-400">
                            · {t("results.saved", { percent: saved })}
                          </span>
                        ) : (
                          <span className="text-zinc-500">
                            · {t("results.noChange")}
                          </span>
                        )}
                      </p>
                    )}
                    <div className="flex gap-2 pt-1">
                      {item.compressed && (
                        <button
                          onClick={() => downloadOne(item)}
                          className="flex-1 rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-500"
                        >
                          {t("buttons.download")}
                        </button>
                      )}
                      <button
                        onClick={() => removeItem(item.key)}
                        className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-700"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
