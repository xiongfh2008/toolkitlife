"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

type OutputFormat = "jpg" | "png";
type InputKind = "pdf" | "docx";

interface PageImage {
  url: string;
  blob: Blob;
  width: number;
  height: number;
}

interface RenderResult {
  name: string;
  images: PageImage[];
}

const MIME: Record<OutputFormat, string> = { jpg: "image/jpeg", png: "image/png" };
const EXT: Record<OutputFormat, string> = { jpg: "jpg", png: "png" };

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

async function pdfToImages(
  file: File,
  format: OutputFormat,
  scale: number,
  onProgress: (done: number, total: number) => void
): Promise<RenderResult> {
  const pdfjsLib = await loadPdfJs();
  const data = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const total = pdf.numPages;
  const images: PageImage[] = [];

  for (let i = 1; i <= total; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D is unavailable");
    await page.render({ canvasContext: ctx, viewport, canvas }).promise;
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Failed to encode page"))),
        MIME[format],
        0.92
      )
    );
    images.push({ url: "", blob, width: canvas.width, height: canvas.height });
    onProgress(i, total);
  }

  return { name: file.name.replace(/\.pdf$/i, ""), images };
}

async function docxToImages(
  file: File,
  format: OutputFormat,
  ratio: number,
  onProgress: (done: number, total: number) => void
): Promise<RenderResult> {
  const { renderAsync } = await import("docx-preview");
  const { toJpeg, toPng } = await import("html-to-image");

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-10000px";
  container.style.top = "0";
  container.style.zIndex = "-1";
  document.body.appendChild(container);

  try {
    await renderAsync(file, container, undefined, {
      inWrapper: true,
      breakPages: true,
      useBase64URL: true,
    });
    // Let the browser settle layout and inline images before capturing.
    await new Promise((r) => setTimeout(r, 200));

    const pages = Array.from(container.querySelectorAll("section.docx")) as HTMLElement[];
    if (pages.length === 0) throw new Error("No pages rendered");
    const images: PageImage[] = [];

    for (let i = 0; i < pages.length; i++) {
      const el = pages[i];
      const dataUrl =
        format === "jpg"
          ? await toJpeg(el, {
              quality: 0.92,
              pixelRatio: ratio,
              backgroundColor: "#ffffff",
              style: { margin: "0", boxShadow: "none" },
            })
          : await toPng(el, {
              pixelRatio: ratio,
              backgroundColor: "#ffffff",
              style: { margin: "0", boxShadow: "none" },
            });
      const blob = await (await fetch(dataUrl)).blob();
      const rect = el.getBoundingClientRect();
      images.push({
        url: "",
        blob,
        width: Math.round(rect.width * ratio),
        height: Math.round(rect.height * ratio),
      });
      onProgress(i + 1, pages.length);
    }

    return { name: file.name.replace(/\.docx$/i, ""), images };
  } finally {
    container.remove();
  }
}

interface Props {
  slug: string;
  kind: InputKind;
  format: OutputFormat;
}

export default function DocumentImageTool({ slug, kind, format }: Props) {
  const t = useTranslations(`tools.${slug}`);
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<"upload" | "processing" | "done">("upload");
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [images, setImages] = useState<PageImage[]>([]);
  const [baseName, setBaseName] = useState("document");
  const [scale, setScale] = useState(2);
  const [error, setError] = useState("");
  const urlRef = useRef<string[]>([]);

  const accept =
    kind === "pdf"
      ? ".pdf,application/pdf"
      : ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  const isMatch = useCallback(
    (f: File) =>
      kind === "pdf"
        ? f.type === "application/pdf" || /\.pdf$/i.test(f.name)
        : f.type.includes("wordprocessingml") || /\.docx$/i.test(f.name),
    [kind]
  );

  const handleFile = useCallback(
    (f: File) => {
      if (!isMatch(f)) return;
      urlRef.current.forEach((u) => URL.revokeObjectURL(u));
      urlRef.current = [];
      setFile(f);
      setImages([]);
      setError("");
    },
    [isMatch]
  );

  const convert = useCallback(async () => {
    if (!file) return;
    setStep("processing");
    setProgress(0);
    setError("");
    try {
      const onProgress = (done: number, total: number) => {
        setProgress(Math.round((done / total) * 90));
        setStatusMsg(t("status.converting", { current: done, total }));
      };
      const result =
        kind === "pdf"
          ? await pdfToImages(file, format, scale, onProgress)
          : await docxToImages(file, format, scale, onProgress);

      setStatusMsg(t("status.finishing"));
      const urls = result.images.map((img) => URL.createObjectURL(img.blob));
      urlRef.current = urls;
      setImages(
        result.images.map((img, i) => ({ ...img, url: urls[i] }))
      );
      setBaseName(result.name);
      setProgress(100);
      setStep("done");
    } catch (err) {
      console.error(err);
      setError(
        t("errors.generic", {
          message: err instanceof Error ? err.message : String(err),
        })
      );
      setStep("upload");
    }
  }, [file, kind, format, scale, t]);

  const downloadOne = useCallback(
    (img: PageImage, i: number) => {
      const a = document.createElement("a");
      a.href = img.url;
      a.download = `${baseName}-page-${String(i + 1).padStart(2, "0")}.${EXT[format]}`;
      a.click();
    },
    [baseName, format]
  );

  const downloadAll = useCallback(async () => {
    if (images.length === 0) return;
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    images.forEach((img, i) => {
      zip.file(
        `${baseName}-page-${String(i + 1).padStart(2, "0")}.${EXT[format]}`,
        img.blob
      );
    });
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${baseName}-pages.zip`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }, [images, baseName, format]);

  const reset = useCallback(() => {
    urlRef.current.forEach((u) => URL.revokeObjectURL(u));
    urlRef.current = [];
    setFile(null);
    setImages([]);
    setStep("upload");
    setProgress(0);
    setError("");
  }, []);

  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none";

  return (
    <ToolLayout
      title={t("title")}
      slug={slug}
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
            onClick={() => document.getElementById("doc-image-input")?.click()}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") &&
              document.getElementById("doc-image-input")?.click()
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
            <span className="text-4xl">{kind === "pdf" ? "📄" : "📝"}</span>
            <span className="text-sm text-zinc-400">{t("upload.drop")}</span>
            <span className="text-xs text-zinc-500">{t("upload.formats")}</span>
            <input
              id="doc-image-input"
              type="file"
              accept={accept}
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
              <div className="flex items-center gap-3">
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

        {step === "done" && images.length > 0 && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <span className="text-sm text-zinc-300">
                {t("info.pages", { count: images.length })}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => void downloadAll()}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
                >
                  {t("buttons.downloadAll")}
                </button>
                <button
                  onClick={reset}
                  className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                >
                  {t("buttons.clear")}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
                >
                  <div className="flex items-center justify-center bg-zinc-950 p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={`${baseName} ${i + 1}`}
                      className="max-h-28 w-auto max-w-full"
                    />
                  </div>
                  <div className="space-y-1 p-2">
                    <div className="flex items-center justify-between text-[11px] text-zinc-500">
                      <span>
                        {i + 1} / {images.length}
                      </span>
                      <span>
                        {img.width}×{img.height}
                      </span>
                    </div>
                    <button
                      onClick={() => downloadOne(img, i)}
                      className="w-full rounded bg-zinc-800 py-1.5 text-xs text-zinc-200 hover:bg-zinc-700"
                    >
                      {t("buttons.download")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
