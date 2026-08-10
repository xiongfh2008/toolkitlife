"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { computeSimilarity, SimilarityMetrics } from "@/lib/image-analysis";

const MAX_DIM = 1600;

export default function ImageSimilarityPage() {
  const t = useTranslations("tools.image-similarity");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [imgA, setImgA] = useState<HTMLImageElement | null>(null);
  const [imgB, setImgB] = useState<HTMLImageElement | null>(null);
  const [tolerance, setTolerance] = useState(10);
  const [metrics, setMetrics] = useState<SimilarityMetrics | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const loadFile = useCallback(
    (file: File, which: "A" | "B") => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          if (which === "A") setImgA(image);
          else setImgB(image);
          setMetrics(null);
          setError("");
        };
        image.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const process = useCallback(async () => {
    if (!imgA || !imgB || processing) return;
    setProcessing(true);
    setError("");
    try {
      const scale = Math.min(1, MAX_DIM / Math.max(imgA.naturalWidth, imgA.naturalHeight));
      const w = Math.max(1, Math.round(imgA.naturalWidth * scale));
      const h = Math.max(1, Math.round(imgA.naturalHeight * scale));

      const makeData = (img: HTMLImageElement, width: number, height: number) => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return null;
        ctx.drawImage(img, 0, 0, width, height);
        return ctx.getImageData(0, 0, width, height);
      };

      const a = makeData(imgA, w, h);
      const b = makeData(imgB, w, h);
      if (!a || !b) return;
      setMetrics(computeSimilarity(a, b, tolerance));
    } catch (err) {
      console.error(err);
      setError(t("errors.process"));
    } finally {
      setProcessing(false);
    }
  }, [imgA, imgB, processing, tolerance, t]);

  const handleNewImage = () => {
    setImgA(null);
    setImgB(null);
    setMetrics(null);
    setError("");
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const dropZone = (
    which: "A" | "B",
    label: string,
    img: HTMLImageElement | null
  ) => (
    <div
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) loadFile(file, which);
      }}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => document.getElementById(`sim-${which.toLowerCase()}`)?.click()}
      className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
        img ? "border-zinc-700 bg-zinc-900" : "border-zinc-600 hover:border-zinc-500"
      }`}
    >
      {img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img.src}
          alt={label}
          className="mx-auto max-h-56 rounded border border-zinc-800"
        />
      ) : (
        <>
          <p className="font-medium text-zinc-300">{label}</p>
          <p className="mt-1 text-sm text-zinc-500">{t("upload.drop")}</p>
        </>
      )}
      <input
        id={`sim-${which.toLowerCase()}`}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) loadFile(file, which);
          e.target.value = "";
        }}
      />
    </div>
  );

  return (
    <ToolLayout
      title={t("title")}
      slug="image-similarity"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="max-w-4xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {dropZone("A", t("labels.imageA"), imgA)}
          {dropZone("B", t("labels.imageB"), imgB)}
        </div>

        {imgA && imgB && (
          <div>
            <label className="mb-1 block text-sm text-zinc-400">
              {t("labels.tolerance")}: {tolerance}
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={tolerance}
              onChange={(e) => setTolerance(parseInt(e.target.value, 10))}
              className="w-full accent-blue-500"
            />
          </div>
        )}

        {(imgA || imgB) && (
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => void process()}
              disabled={processing || !imgA || !imgB}
              className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
            >
              {processing ? t("status.processing") : t("buttons.compare")}
            </button>
            <button
              onClick={handleNewImage}
              className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
            >
              {t("buttons.newImage")}
            </button>
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        {metrics && (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-center">
              <p className="text-xs text-zinc-500">{t("labels.similarity")}</p>
              <p className="mt-1 text-2xl font-semibold text-blue-400">
                {metrics.similarity.toFixed(1)}%
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-center">
              <p className="text-xs text-zinc-500">{t("labels.mse")}</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-400">
                {metrics.mse === Infinity ? "∞" : metrics.mse.toFixed(2)}
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-center">
              <p className="text-xs text-zinc-500">{t("labels.psnr")}</p>
              <p className="mt-1 text-2xl font-semibold text-amber-400">
                {metrics.psnr === Infinity ? "∞" : `${metrics.psnr.toFixed(2)} dB`}
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
