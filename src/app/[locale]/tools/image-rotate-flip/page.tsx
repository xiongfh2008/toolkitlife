"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

export default function ImageRotateFlipPage() {
  const t = useTranslations("tools.image-rotate-flip");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [rotate, setRotate] = useState(0); // degrees
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
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
        setRotate(0);
        setFlipH(false);
        setFlipV(false);
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
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rad = (rotate * Math.PI) / 180;
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const cos = Math.abs(Math.cos(rad));
      const sin = Math.abs(Math.sin(rad));
      const outW = Math.round(w * cos + h * sin);
      const outH = Math.round(w * sin + h * cos);
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, outW, outH);
      ctx.translate(outW / 2, outH / 2);
      ctx.rotate(rad);
      if (flipH) ctx.scale(-1, 1);
      if (flipV) ctx.scale(1, -1);
      ctx.drawImage(img, -w / 2, -h / 2);
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
  }, [img, processing, rotate, flipH, flipV, t]);

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
    a.download = "rotated.png";
    a.click();
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const rotateBtn =
    "rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700";

  return (
    <ToolLayout
      title={t("title")}
      slug="image-rotate-flip"
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
            onClick={() => document.getElementById("rf-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">🔄</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input
              id="rf-in"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setRotate((r) => (r - 90 + 360) % 360)}
                className={rotateBtn}
              >
                ⟲ {t("buttons.rotateLeft")}
              </button>
              <button
                onClick={() => setRotate((r) => (r + 90) % 360)}
                className={rotateBtn}
              >
                ⟳ {t("buttons.rotateRight")}
              </button>
              <button
                onClick={() => setFlipH((v) => !v)}
                className={`${rotateBtn} ${flipH ? "bg-blue-600 text-white hover:bg-blue-500" : ""}`}
              >
                ⇋ {t("buttons.flipH")}
              </button>
              <button
                onClick={() => setFlipV((v) => !v)}
                className={`${rotateBtn} ${flipV ? "bg-blue-600 text-white hover:bg-blue-500" : ""}`}
              >
                ⇵ {t("buttons.flipV")}
              </button>
            </div>

            <div>
              <label className="mb-1 block text-sm text-zinc-400">
                {t("labels.angle")}: {rotate}°
              </label>
              <input
                type="range"
                min={-180}
                max={180}
                step={1}
                value={rotate}
                onChange={(e) => setRotate(parseInt(e.target.value, 10))}
                className="w-full max-w-xs accent-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => void process()}
                disabled={processing}
                className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
              >
                {processing ? t("status.processing") : t("buttons.apply")}
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
