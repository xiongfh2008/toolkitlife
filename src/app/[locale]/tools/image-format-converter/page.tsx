"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

const MAX_DIM = 3000;

interface Item {
  url: string;
  name: string;
}

export default function ImageFormatConverterPage() {
  const t = useTranslations("tools.image-format-converter");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState<"png" | "jpeg" | "webp">("png");
  const [quality, setQuality] = useState(0.92);
  const [items, setItems] = useState<Item[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const convertFile = useCallback(
    (file: File) =>
      new Promise<Item | null>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const image = new Image();
          image.onload = () => {
            const scale = Math.min(1, MAX_DIM / Math.max(image.naturalWidth, image.naturalHeight));
            const canvas = document.createElement("canvas");
            canvas.width = Math.round(image.naturalWidth * scale);
            canvas.height = Math.round(image.naturalHeight * scale);
            const ctx = canvas.getContext("2d");
            if (!ctx) return resolve(null);
            if (format === "jpeg") {
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(
              (blob) => {
                if (!blob) return resolve(null);
                const name = file.name.replace(/\.[^.]+$/, "") + "." + format;
                resolve({ url: URL.createObjectURL(blob), name });
              },
              `image/${format}`,
              quality
            );
          };
          image.onerror = () => resolve(null);
          image.src = reader.result as string;
        };
        reader.readAsDataURL(file);
      }),
    [format, quality]
  );

  const handleFiles = async (list: FileList | File[]) => {
    const arr = Array.from(list).filter((f) => f.type.startsWith("image/"));
    if (arr.length === 0) return;
    setFiles(arr);
    setProcessing(true);
    setError("");
    const results: Item[] = [];
    for (const f of arr) {
      const r = await convertFile(f);
      if (r) results.push(r);
    }
    setItems(results);
    setProcessing(false);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const handleDownload = (item: Item) => {
    const a = document.createElement("a");
    a.href = item.url;
    a.download = item.name;
    a.click();
  };

  const handleReset = () => {
    setFiles([]);
    setItems([]);
    setError("");
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      slug="image-format-converter"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="max-w-4xl space-y-4">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById("conv-in")?.click()}
          className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-12 text-center transition-colors hover:border-zinc-500"
        >
          <div className="mb-4 text-4xl">🔁</div>
          <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
          <p className="mt-1 text-sm text-zinc-500">{t("upload.multi")}</p>
          <input id="conv-in" type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.format")}</label>
            <div className="flex gap-2">
              {(["png", "jpeg", "webp"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`${btn} ${format === f ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.quality")} · {Math.round(quality * 100)}%
            </label>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.02}
              value={quality}
              disabled={format === "png"}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
        </div>

        {processing && <p className="text-sm text-zinc-500">{t("labels.processing")}</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {items.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-300">
                {t("labels.results")} · {items.length}
              </p>
              <button
                onClick={handleReset}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {t("buttons.reset")}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {items.map((item, i) => (
                <div key={i} className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt={item.name} className="max-h-40 w-full rounded object-contain" />
                  <span className="truncate text-xs text-zinc-500">{item.name}</span>
                  <button
                    onClick={() => handleDownload(item)}
                    className="w-full bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 hover:bg-blue-600 hover:text-white"
                  >
                    {t("buttons.download")}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
