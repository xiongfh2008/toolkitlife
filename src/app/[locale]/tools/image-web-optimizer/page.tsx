"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import JSZip from "jszip";

const MAX_FILES = 10;

interface Item {
  id: number;
  name: string;
  originalSize: number;
  url: string;
}

interface Result {
  id: number;
  name: string;
  size: number;
  url: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImageWebOptimizerPage() {
  const t = useTranslations("tools.image-web-optimizer");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [items, setItems] = useState<Item[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [maxWidth, setMaxWidth] = useState(2000);
  const [quality, setQuality] = useState(85);
  const [format, setFormat] = useState<"webp" | "jpeg" | "png">("webp");
  const [processing, setProcessing] = useState(false);
  const [zipping, setZipping] = useState(false);
  const [error, setError] = useState("");

  const addFiles = useCallback((files: FileList | File[]) => {
    setResults([]);
    setError("");
    setItems((prev) => {
      const next = [...prev];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        if (next.length >= MAX_FILES) break;
        next.push({
          id: Date.now() + Math.random(),
          name: file.name,
          originalSize: file.size,
          url: URL.createObjectURL(file),
        });
      }
      return next;
    });
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setResults([]);
  };

  const mimeType = (f: "webp" | "jpeg" | "png") =>
    f === "webp" ? "image/webp" : f === "jpeg" ? "image/jpeg" : "image/png";

  const extension = (f: "webp" | "jpeg" | "png") =>
    f === "jpeg" ? "jpg" : f;

  const optimizeOne = useCallback(
    (item: Item): Promise<Result> =>
      new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
          try {
            const scale = Math.min(1, maxWidth / image.naturalWidth);
            const w = Math.max(1, Math.round(image.naturalWidth * scale));
            const h = Math.max(1, Math.round(image.naturalHeight * scale));
            const canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("no ctx");
            ctx.drawImage(image, 0, 0, w, h);
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error("blob failed"));
                  return;
                }
                const url = URL.createObjectURL(blob);
                const name = item.name.replace(/\.[^.]+$/, "") + "." + extension(format);
                resolve({ id: item.id, name, size: blob.size, url });
              },
              mimeType(format),
              format === "png" ? undefined : quality / 100
            );
          } catch (err) {
            reject(err);
          }
        };
        image.onerror = () => reject(new Error("load failed"));
        image.src = item.url;
      }),
    [maxWidth, format, quality]
  );

  const process = useCallback(async () => {
    if (items.length === 0 || processing) return;
    setProcessing(true);
    setError("");
    try {
      const out: Result[] = [];
      for (const item of items) {
        out.push(await optimizeOne(item));
      }
      setResults(out);
    } catch (err) {
      console.error(err);
      setError(t("errors.process"));
    } finally {
      setProcessing(false);
    }
  }, [items, processing, optimizeOne, t]);

  const downloadOne = (r: Result) => {
    const a = document.createElement("a");
    a.href = r.url;
    a.download = r.name;
    a.click();
  };

  const downloadAll = useCallback(async () => {
    if (results.length === 0 || zipping) return;
    setZipping(true);
    try {
      const zip = new JSZip();
      for (const r of results) {
        const blob = await fetch(r.url).then((res) => res.blob());
        zip.file(r.name, blob);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "optimized-images.zip";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    } catch (err) {
      console.error(err);
      setError(t("errors.process"));
    } finally {
      setZipping(false);
    }
  }, [results, zipping, t]);

  const handleNewImage = () => {
    for (const item of items) URL.revokeObjectURL(item.url);
    for (const r of results) URL.revokeObjectURL(r.url);
    setItems([]);
    setResults([]);
    setError("");
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      slug="image-web-optimizer"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="max-w-4xl space-y-4">
        {items.length === 0 ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("opt-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">🚀</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input
              id="opt-in"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm text-zinc-400">
                  {t("labels.maxWidth")}: {maxWidth}px
                </label>
                <input
                  type="range"
                  min={400}
                  max={4000}
                  step={100}
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-zinc-400">
                  {t("labels.quality")}: {quality}%
                </label>
                <input
                  type="range"
                  min={50}
                  max={95}
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-zinc-400">{t("labels.format")}</label>
                <div className="flex flex-wrap gap-2">
                  {(["webp", "jpeg", "png"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                        format === f
                          ? "border-blue-600 bg-blue-600/10 text-blue-600"
                          : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-blue-500/40"
                      }`}
                    >
                      {f.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => void process()}
                disabled={processing}
                className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
              >
                {processing ? t("status.processing") : t("buttons.optimize")}
              </button>
              <button
                onClick={() => void downloadAll()}
                disabled={results.length === 0 || zipping}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {zipping ? t("status.zipping") : t("buttons.downloadAll")}
              </button>
              <button
                onClick={handleNewImage}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {t("buttons.newImage")}
              </button>
              <span className="text-xs text-zinc-500">
                {items.length} / {MAX_FILES}
              </span>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="space-y-2">
              {items.map((item) => {
                const result = results.find((r) => r.id === item.id);
                const saved = result
                  ? Math.max(0, 1 - result.size / item.originalSize)
                  : null;
                return (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-3"
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded border border-zinc-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-zinc-300">{item.name}</p>
                      <p className="text-xs text-zinc-500">
                        {formatSize(item.originalSize)}
                        {result && (
                          <>
                            {" → "}
                            <span className="text-emerald-400">{formatSize(result.size)}</span>
                            {saved !== null && saved > 0 && (
                              <span className="ml-1 text-emerald-400">
                                (-{Math.round(saved * 100)}%)
                              </span>
                            )}
                          </>
                        )}
                      </p>
                    </div>
                    {result && (
                      <button
                        onClick={() => downloadOne(result)}
                        className={`${btn} bg-blue-600/10 text-blue-500 hover:bg-blue-600/20`}
                      >
                        {t("buttons.download")}
                      </button>
                    )}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-zinc-500 transition-colors hover:text-red-400"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
