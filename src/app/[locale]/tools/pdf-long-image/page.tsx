"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

type OutputFormat = "png" | "jpg";
type Step = "upload" | "processing" | "done";

const MIME: Record<OutputFormat, string> = { png: "image/png", jpg: "image/jpeg" };
const MAX_PIXELS = 80_000_000; // guard total canvas pixels (~80MP)
const MAX_SIDE = 32000; // browser canvas dimension limit

/**
 * Loads pdf.js from CDN at runtime (not bundled), matching the pattern
 * already used by pdf-to-word in this project.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadPdfJs(): Promise<any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mod = (await import(/* webpackIgnore: true */ "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs" as string)) as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfjsLib = (mod as any).default ?? mod;
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs";
  return pdfjsLib;
}

async function pdfToLongImage(
  file: File,
  format: OutputFormat,
  scale: number,
  onProgress: (done: number, total: number) => void
): Promise<{ blob: Blob; width: number; height: number }> {
  const pdfjsLib = await loadPdfJs();
  const data = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const total = pdf.numPages;

  const dims: { width: number; height: number }[] = [];
  let maxW = 0;
  let totalH = 0;
  for (let i = 1; i <= total; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const w = Math.max(1, Math.floor(viewport.width));
    const h = Math.max(1, Math.floor(viewport.height));
    dims.push({ width: w, height: h });
    maxW = Math.max(maxW, w);
    totalH += h;
  }
  if (maxW * totalH > MAX_PIXELS) {
    throw new Error("TOO_LARGE");
  }
  if (maxW > MAX_SIDE || totalH > MAX_SIDE) {
    throw new Error("TOO_SIDE");
  }

  const canvas = document.createElement("canvas");
  canvas.width = maxW;
  canvas.height = totalH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D is unavailable");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, maxW, totalH);

  let y = 0;
  for (let i = 1; i <= total; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const temp = document.createElement("canvas");
    temp.width = dims[i - 1].width;
    temp.height = dims[i - 1].height;
    const tctx = temp.getContext("2d");
    if (!tctx) throw new Error("Canvas 2D is unavailable");
    await page.render({ canvasContext: tctx, viewport, canvas: temp }).promise;
    ctx.drawImage(temp, 0, y);
    y += dims[i - 1].height;
    temp.width = 0;
    temp.height = 0;
    onProgress(i, total);
  }

  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Failed to encode image"))),
      MIME[format],
      0.92
    )
  );
  return { blob, width: maxW, height: totalH };
}

export default function PdfLongImagePage() {
  const t = useTranslations("tools.pdf-long-image");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<Step>("upload");
  const [scale, setScale] = useState(2);
  const [format, setFormat] = useState<OutputFormat>("png");
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [resultName, setResultName] = useState("");
  const [resultSize, setResultSize] = useState(0);
  const [resultDim, setResultDim] = useState({ width: 0, height: 0 });
  const [error, setError] = useState("");
  const urlRef = useRef("");

  const isPdf = useCallback((f: File) => {
    return f.type === "application/pdf" || /\.pdf$/i.test(f.name);
  }, []);

  const handleFile = useCallback(
    (f: File) => {
      if (!isPdf(f)) return;
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      urlRef.current = "";
      setFile(f);
      setResultUrl("");
      setResultSize(0);
      setError("");
    },
    [isPdf]
  );

  const convert = useCallback(async () => {
    if (!file) return;
    setStep("processing");
    setProgress(0);
    setError("");
    try {
      const onProgress = (done: number, total: number) => {
        setProgress(Math.round((done / total) * 92));
        setStatusMsg(t("status.rendering", { current: done, total }));
      };
      const result = await pdfToLongImage(file, format, scale, onProgress);
      if (result.blob.size < 100) throw new Error("EMPTY");
      setStatusMsg(t("status.finishing"));
      const url = URL.createObjectURL(result.blob);
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      urlRef.current = url;
      setResultUrl(url);
      setResultName(`${file.name.replace(/\.pdf$/i, "")}-long.${format}`);
      setResultSize(result.blob.size);
      setResultDim({ width: result.width, height: result.height });
      setProgress(100);
      setStep("done");
    } catch (err) {
      console.error(err);
      let msg = err instanceof Error ? err.message : String(err);
      if (msg === "TOO_LARGE") msg = t("errors.tooLarge");
      else if (msg === "TOO_SIDE") msg = t("errors.tooSide");
      else if (msg === "EMPTY") msg = t("errors.empty");
      setError(msg);
      setStep("upload");
    }
  }, [file, format, scale, t]);

  const reset = useCallback(() => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = "";
    setFile(null);
    setResultUrl("");
    setResultSize(0);
    setStep("upload");
    setProgress(0);
    setError("");
  }, []);

  const fmtSize = (b: number) =>
    b < 1024 * 1024
      ? t("units.kb", { size: (b / 1024).toFixed(1) })
      : t("units.mb", { size: (b / (1024 * 1024)).toFixed(1) });

  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none";

  return (
    <ToolLayout
      title={t("title")}
      slug="pdf-long-image"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-5">
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {step !== "processing" && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => document.getElementById("pdf-long-input")?.click()}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") &&
              document.getElementById("pdf-long-input")?.click()
            }
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files?.[0];
              if (f) handleFile(f);
            }}
            className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
              step === "upload"
                ? "border-zinc-700 bg-zinc-800/50 hover:border-zinc-500"
                : "border-zinc-800 bg-zinc-900/50"
            }`}
          >
            <span className="text-4xl">📄</span>
            <span className="text-sm text-zinc-400">{t("upload.drop")}</span>
            <span className="text-xs text-zinc-500">{t("upload.formats")}</span>
            <input
              id="pdf-long-input"
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = "";
              }}
            />
          </div>
        )}

        {step === "upload" && file && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm text-zinc-200">{file.name}</p>
                <p className="text-xs text-zinc-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-zinc-300">
                  {t("labels.format")}
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as OutputFormat)}
                    className={inputCls}
                    style={{ width: "auto" }}
                  >
                    <option value="png">PNG</option>
                    <option value="jpg">JPEG</option>
                  </select>
                </label>
                <label className="flex items-center gap-2 text-sm text-zinc-300">
                  {t("labels.scale")}
                  <select
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    className={inputCls}
                    style={{ width: "auto" }}
                  >
                    <option value={1}>1x</option>
                    <option value={2}>2x</option>
                    <option value={3}>3x</option>
                  </select>
                </label>
                <button
                  onClick={() => void convert()}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
                >
                  {t("buttons.convert")}
                </button>
                <button
                  onClick={reset}
                  className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                >
                  {t("buttons.clear")}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-10 text-center">
            <div className="mb-4 text-5xl">⚙️</div>
            <h3 className="mb-2 text-xl font-semibold text-zinc-100">
              {t("status.title")}
            </h3>
            <p className="mb-6 text-sm text-zinc-400">{statusMsg}</p>
            <div className="mx-auto max-w-md">
              <div className="mb-1 flex justify-between text-sm text-zinc-400">
                <span>{t("status.progress")}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <p className="mt-4 text-xs text-zinc-500">{t("status.keepOpen")}</p>
          </div>
        )}

        {step === "done" && resultUrl && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-zinc-300">
                <span className="mr-4">
                  {t("info.dimensions", {
                    width: resultDim.width,
                    height: resultDim.height,
                  })}
                </span>
                <span>{fmtSize(resultSize)}</span>
              </div>
              <div className="flex gap-2">
                <a
                  href={resultUrl}
                  download={resultName}
                  className="rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500"
                >
                  {t("buttons.download")}
                </a>
                <button
                  onClick={reset}
                  className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                >
                  {t("buttons.newFile")}
                </button>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resultUrl}
                alt={resultName}
                className="mx-auto max-h-[480px] w-auto max-w-full object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
