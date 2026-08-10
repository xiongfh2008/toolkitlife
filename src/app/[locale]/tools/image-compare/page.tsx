"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { diffRatio, diffVisualization } from "@/lib/image-analysis";

const MAX_DIM = 1600;

export default function ImageComparePage() {
  const t = useTranslations("tools.image-compare");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [imgA, setImgA] = useState<HTMLImageElement | null>(null);
  const [imgB, setImgB] = useState<HTMLImageElement | null>(null);
  const [ratio, setRatio] = useState<number | null>(null);
  const [diffUrl, setDiffUrl] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const diffRef = useRef<HTMLCanvasElement>(null);
  const resultUrlRef = useRef("");

  const loadFile = useCallback(
    (file: File, which: "A" | "B") => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          if (which === "A") setImgA(image);
          else setImgB(image);
          setRatio(null);
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
      const r = diffRatio(a, b);
      setRatio(r);

      const diffCanvas = diffRef.current;
      if (diffCanvas) {
        diffCanvas.width = w;
        diffCanvas.height = h;
        const ctx = diffCanvas.getContext("2d");
        if (ctx) {
          ctx.putImageData(diffVisualization(a, b), 0, 0);
          diffCanvas.toBlob((blob) => {
            if (!blob) return;
            if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
            resultUrlRef.current = URL.createObjectURL(blob);
            setDiffUrl(resultUrlRef.current);
          }, "image/png");
        }
      }
    } catch (err) {
      console.error(err);
      setError(t("errors.process"));
    } finally {
      setProcessing(false);
    }
  }, [imgA, imgB, processing, t]);

  const handleNewImage = () => {
    setImgA(null);
    setImgB(null);
    setRatio(null);
    setError("");
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = "";
    setDiffUrl("");
  };

  const handleDownload = () => {
    if (!diffUrl) return;
    const a = document.createElement("a");
    a.href = diffUrl;
    a.download = "image-diff.png";
    a.click();
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
      onClick={() => document.getElementById(`cmp-${which.toLowerCase()}`)?.click()}
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
        id={`cmp-${which.toLowerCase()}`}
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
      slug="image-compare"
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

        {ratio !== null && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-zinc-300">
                {t("labels.diffRate")}:{" "}
                <span className="text-blue-400">{(ratio * 100).toFixed(1)}%</span>
              </p>
              {diffUrl && (
                <button
                  onClick={handleDownload}
                  className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
                >
                  {t("buttons.download")}
                </button>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1">
                <p className="text-xs text-zinc-500">{t("labels.imageA")}</p>
                <div className="overflow-hidden rounded-lg border border-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imgA!.src} alt="A" className="w-full" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-zinc-500">{t("labels.imageB")}</p>
                <div className="overflow-hidden rounded-lg border border-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imgB!.src} alt="B" className="w-full" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-zinc-500">{t("labels.diff")}</p>
                <div className="overflow-hidden rounded-lg border border-zinc-800">
                  <canvas ref={diffRef} className="w-full" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
