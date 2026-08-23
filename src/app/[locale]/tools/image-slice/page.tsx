"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

const MAX_DIM = 3000;

export default function ImageSlicePage() {
  const t = useTranslations("tools.image-slice");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [direction, setDirection] = useState<"horizontal" | "vertical">("horizontal");
  const [count, setCount] = useState(2);
  const [slices, setSlices] = useState<string[]>([]);
  const [error, setError] = useState("");

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => setImg(image);
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

  const generate = useCallback(() => {
    if (!img) return;
    const scale = Math.min(1, MAX_DIM / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.round(img.naturalWidth * scale);
    const h = Math.round(img.naturalHeight * scale);
    const n = Math.min(Math.max(count, 2), 12);
    const urls: string[] = [];
    for (let i = 0; i < n; i++) {
      const cw = direction === "horizontal" ? Math.round(w / n) : w;
      const ch = direction === "vertical" ? Math.round(h / n) : h;
      const canvas = document.createElement("canvas");
      canvas.width = cw;
      canvas.height = ch;
      const ctx = canvas.getContext("2d");
      if (!ctx) continue;
      ctx.drawImage(img, direction === "horizontal" ? -i * cw : 0, direction === "vertical" ? -i * ch : 0, w, h);
      urls.push(canvas.toDataURL("image/png"));
    }
    setSlices(urls);
  }, [img, direction, count]);

  useEffect(() => {
    if (img) generate();
  }, [img, direction, count, generate]);

  const handleNewImage = () => {
    setImg(null);
    setSlices([]);
  };

  const handleDownload = (dataUrl: string, i: number) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `slice-${i + 1}.png`;
    a.click();
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      slug="image-slice"
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
            onClick={() => document.getElementById("slice-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">🔪</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input id="slice-in" type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleNewImage}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {t("buttons.newImage")}
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.direction")}</label>
                <div className="flex gap-2">
                  {(["horizontal", "vertical"] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDirection(d)}
                      className={`${btn} ${direction === d ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}
                    >
                      {d === "horizontal" ? t("labels.horizontal") : t("labels.vertical")}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">
                  {t("labels.count")} · {count}
                </label>
                <input
                  type="range"
                  min={2}
                  max={12}
                  step={1}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            {slices.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-zinc-300">
                  {t("labels.pieces")} · {slices.length}
                </p>
                <div
                  className={`grid gap-3 ${direction === "horizontal" ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}
                >
                  {slices.map((s, i) => (
                    <div key={i} className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s} alt={`slice ${i + 1}`} className="w-full" />
                      <button
                        onClick={() => handleDownload(s, i)}
                        className="w-full bg-zinc-800 px-3 py-2 text-sm text-zinc-300 hover:bg-blue-600 hover:text-white"
                      >
                        {t("buttons.download")} #{i + 1}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
