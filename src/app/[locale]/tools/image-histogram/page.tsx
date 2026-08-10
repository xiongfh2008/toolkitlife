"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { computeHistogram, type Histogram } from "@/lib/image-analysis";

const MAX_DIM = 2500;

interface FileInfo {
  name: string;
  size: number;
  width: number;
  height: number;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImageHistogramPage() {
  const t = useTranslations("tools.image-histogram");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [info, setInfo] = useState<FileInfo | null>(null);
  const [histogram, setHistogram] = useState<Histogram | null>(null);
  const [mode, setMode] = useState<"rgb" | "luma">("rgb");
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const analyze = useCallback(
    async (image: HTMLImageElement) => {
      try {
        const scale = Math.min(1, MAX_DIM / Math.max(image.naturalWidth, image.naturalHeight));
        const w = Math.max(1, Math.round(image.naturalWidth * scale));
        const h = Math.max(1, Math.round(image.naturalHeight * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(image, 0, 0, w, h);
        const src = ctx.getImageData(0, 0, w, h);
        setHistogram(computeHistogram(src));
        setError("");
      } catch (err) {
        console.error(err);
        setError(t("errors.process"));
      }
    },
    [t]
  );

  const loadFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          setImg(image);
          setInfo({
            name: file.name,
            size: file.size,
            width: image.naturalWidth,
            height: image.naturalHeight,
          });
          setHistogram(null);
          setError("");
          void analyze(image);
        };
        image.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    },
    [analyze]
  );

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

  const drawHistogram = useCallback(
    (canvas: HTMLCanvasElement, hist: Histogram, m: "rgb" | "luma") => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const W = 512;
      const H = 170;
      canvas.width = W;
      canvas.height = H;
      ctx.clearRect(0, 0, W, H);
      const series = m === "rgb" ? [hist.r, hist.g, hist.b] : [hist.luma];
      const colors =
        m === "rgb"
          ? ["rgba(239,68,68,0.55)", "rgba(34,197,94,0.55)", "rgba(59,130,246,0.55)"]
          : ["rgba(226,232,240,0.9)"];
      let max = 0;
      for (const arr of series) {
        for (const v of arr) if (v > max) max = v;
      }
      if (!max) return;
      const barW = W / 256;
      for (let i = 0; i < 256; i++) {
        for (let ci = 0; ci < series.length; ci++) {
          const barH = (series[ci][i] / max) * (H - 12);
          ctx.fillStyle = colors[ci];
          ctx.fillRect(i * barW, H - 12 - barH, Math.max(1, barW + 0.5), barH);
        }
      }
      // Baseline axis
      ctx.fillStyle = "rgba(148,163,184,0.5)";
      ctx.fillRect(0, H - 12, W, 1);
    },
    []
  );

  useEffect(() => {
    if (histogram && canvasRef.current) {
      drawHistogram(canvasRef.current, histogram, mode);
    }
  }, [histogram, mode, drawHistogram]);

  const handleNewImage = () => {
    setImg(null);
    setInfo(null);
    setHistogram(null);
    setError("");
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      slug="image-histogram"
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
            onClick={() => document.getElementById("hist-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">📊</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input
              id="hist-in"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300">
                {info && (
                  <span>
                    {info.name} · {info.width}×{info.height}px · {formatSize(info.size)}
                  </span>
                )}
              </div>
              <button
                onClick={handleNewImage}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {t("buttons.newImage")}
              </button>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt="Original"
                  className="max-w-full rounded border border-zinc-800"
                />
              </div>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setMode("rgb")}
                    className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                      mode === "rgb"
                        ? "border-blue-600 bg-blue-600/10 text-blue-600"
                        : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-blue-500/40"
                    }`}
                  >
                    {t("labels.rgb")}
                  </button>
                  <button
                    onClick={() => setMode("luma")}
                    className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                      mode === "luma"
                        ? "border-blue-600 bg-blue-600/10 text-blue-600"
                        : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-blue-500/40"
                    }`}
                  >
                    {t("labels.luma")}
                  </button>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                  <canvas ref={canvasRef} className="w-full" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
