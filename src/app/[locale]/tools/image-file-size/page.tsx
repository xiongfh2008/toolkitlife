"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

const MAX_DIM = 3000;

export default function ImageFileSizePage() {
  const t = useTranslations("tools.image-file-size");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [target, setTarget] = useState(200); // KB
  const [result, setResult] = useState("");
  const [resultSize, setResultSize] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [note, setNote] = useState("");

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

  const fmt = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const convert = useCallback(async () => {
    if (!img) return;
    setProcessing(true);
    const scale = Math.min(1, MAX_DIM / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const targetBytes = Math.max(target, 10) * 1024;
    const toBlob = (quality: number) =>
      new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));

    let best: Blob | null = null;
    let bestDelta = Infinity;
    // Scan a range of qualities and pick the closest to the target.
    for (let q = 0.1; q <= 1.001; q += 0.05) {
      const blob = await toBlob(q);
      if (!blob) continue;
      const delta = Math.abs(blob.size - targetBytes);
      if (blob.size <= targetBytes && blob.size >= Math.min(targetBytes, 30 * 1024) && delta < bestDelta) {
        best = blob;
        bestDelta = delta;
      }
    }
    if (!best) best = await toBlob(0.1);
    if (!best) {
      setProcessing(false);
      return;
    }

    setResultSize(best.size);
    setResult(URL.createObjectURL(best));
    setNote(best.size <= targetBytes ? "" : t("labels.cannotReach"));
    setProcessing(false);
  }, [img, target, t]);

  const handleNewImage = () => {
    setImg(null);
    setResult("");
    setResultSize(0);
    setNote("");
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result;
    a.download = "compressed.jpg";
    a.click();
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      slug="image-file-size"
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
            onClick={() => document.getElementById("fsz-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">⚖️</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input id="fsz-in" type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={convert}
                disabled={processing}
                className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
              >
                {processing ? t("labels.processing") : t("buttons.convert")}
              </button>
              <button
                onClick={handleNewImage}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {t("buttons.newImage")}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-zinc-300">{t("labels.target")}</label>
              <input
                type="number"
                min={10}
                max={10000}
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="w-32 rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200"
              />
              <span className="text-sm text-zinc-500">KB</span>
            </div>

            {resultSize > 0 && !processing && (
              <p className="text-sm text-zinc-400">
                {t("labels.resultSize")}: {fmt(resultSize)}
                {note && <span className="ml-2 text-yellow-500">{note}</span>}
              </p>
            )}

            {result && !processing && (
              <>
                <button
                  onClick={handleDownload}
                  className={`${btn} bg-emerald-600 text-white hover:bg-emerald-500`}
                >
                  {t("buttons.download")}
                </button>
                <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={result} alt="Result" className="w-full" />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
