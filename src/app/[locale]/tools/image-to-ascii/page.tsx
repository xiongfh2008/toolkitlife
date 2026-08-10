"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

const MAX_DIM = 1600;

export default function ImageToAsciiPage() {
  const t = useTranslations("tools.image-to-ascii");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [cols, setCols] = useState(100);
  const [invert, setInvert] = useState(false);
  const [ascii, setAscii] = useState("");
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        setImg(image);
        setAscii("");
        setCopied(false);
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
      const w = Math.max(1, Math.round(img.naturalWidth * scale));
      const h = Math.max(1, Math.round(img.naturalHeight * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;

      const c = Math.max(20, Math.min(240, cols));
      // Characters are roughly twice as tall as wide.
      const rows = Math.max(1, Math.round((h / w) * c * 0.5));
      const stepX = Math.max(1, Math.floor(w / c));
      const stepY = Math.max(1, Math.floor(h / rows));
      const ramp = "@%#*+=-:. ";
      const chars = invert ? [...ramp].reverse().join("") : ramp;

      const lines: string[] = [];
      for (let y = 0; y < h; y += stepY) {
        let line = "";
        for (let x = 0; x < w; x += stepX) {
          const i = (y * w + x) * 4;
          const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          const idx = Math.min(chars.length - 1, Math.floor((lum / 256) * chars.length));
          line += chars[idx];
        }
        lines.push(line);
      }
      setAscii(lines.join("\n"));
      setCopied(false);
    } catch (err) {
      console.error(err);
      setError(t("errors.process"));
    } finally {
      setProcessing(false);
    }
  }, [img, processing, cols, invert, t]);

  const copyAscii = async () => {
    if (!ascii) return;
    try {
      await navigator.clipboard.writeText(ascii);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  };

  const downloadTxt = () => {
    if (!ascii) return;
    const blob = new Blob([ascii], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ascii-art.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const handleNewImage = () => {
    setImg(null);
    setAscii("");
    setCopied(false);
    setError("");
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      slug="image-to-ascii"
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
            onClick={() => document.getElementById("ascii-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">🔤</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input
              id="ascii-in"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-end gap-6">
              <div>
                <label className="mb-1 block text-sm text-zinc-400">
                  {t("labels.width")}: {cols}
                </label>
                <input
                  type="range"
                  min={40}
                  max={200}
                  value={cols}
                  onChange={(e) => setCols(parseInt(e.target.value, 10))}
                  className="w-56 accent-blue-500"
                />
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={invert}
                  onChange={(e) => setInvert(e.target.checked)}
                  className="accent-blue-500"
                />
                {t("labels.invert")}
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => void process()}
                disabled={processing}
                className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
              >
                {processing ? t("status.processing") : t("buttons.generate")}
              </button>
              <button
                onClick={() => void copyAscii()}
                disabled={!ascii}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {copied ? t("labels.copied") : t("buttons.copy")}
              </button>
              <button
                onClick={downloadTxt}
                disabled={!ascii}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {t("buttons.download")}
              </button>
              <button
                onClick={handleNewImage}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {t("buttons.newImage")}
              </button>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt="Original"
                className="mx-auto max-h-72 rounded border border-zinc-800"
              />
            </div>

            {ascii && (
              <div className="overflow-auto rounded-lg border border-zinc-800 bg-black p-4">
                <pre className="whitespace-pre font-mono text-[10px] leading-[1.15] text-emerald-400">
                  {ascii}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
