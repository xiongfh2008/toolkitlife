"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { autoContrast } from "@/lib/image-enhance";

const MAX_DIM = 3000;

export default function AutoContrastPage() {
  const t = useTranslations("tools.auto-contrast");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [clip, setClip] = useState(0.5);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resultUrlRef = useRef("");

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        setImg(image);
        setResult("");
        setError("");
      };
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

  const process = useCallback(async () => {
    if (!img || processing) return;
    setProcessing(true);
    setError("");
    try {
      const scale = Math.min(1, MAX_DIM / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.round(img.naturalWidth * scale);
      const h = Math.round(img.naturalHeight * scale);
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, w, h);
      const src = ctx.getImageData(0, 0, w, h);
      const out = autoContrast(src, clip);
      ctx.putImageData(out, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
        resultUrlRef.current = URL.createObjectURL(blob);
        setResult(resultUrlRef.current);
        setProcessing(false);
      }, "image/png");
    } catch (err) {
      console.error(err);
      setError(t("errors.process"));
      setProcessing(false);
    }
  }, [img, processing, clip, t]);

  const handleNewImage = () => {
    setImg(null);
    setResult("");
    setError("");
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = "";
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result;
    a.download = "auto-contrast.png";
    a.click();
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      slug="auto-contrast"
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
            onClick={() => document.getElementById("ac-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">🎚️</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input
              id="ac-in"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-zinc-400">
                {t("labels.clip")}: {clip}%
              </label>
              <input
                type="range"
                min={0}
                max={5}
                step={0.1}
                value={clip}
                onChange={(e) => setClip(parseFloat(e.target.value))}
                className="w-full max-w-xs accent-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => void process()}
                disabled={processing}
                className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
              >
                {processing ? t("status.processing") : t("buttons.enhance")}
              </button>
              <button
                onClick={handleNewImage}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {t("buttons.newImage")}
              </button>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            {!result && (
              <div className="overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt="Original"
                  className="max-w-full rounded border border-zinc-800"
                />
              </div>
            )}

            {result && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-zinc-300">
                    {t("labels.original")} / {t("labels.result")}
                  </p>
                  <button
                    onClick={handleDownload}
                    className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
                  >
                    {t("buttons.download")}
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.src}
                      alt="Original"
                      className="w-full rounded-lg border border-zinc-800"
                    />
                  </div>
                  <div className="overflow-hidden rounded-lg border border-zinc-800">
                    <canvas ref={canvasRef} className="w-full" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
