"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { decodeGif, GifDecodedFrame } from "@/lib/gif-decoder";

type ExportFormat = "png" | "webp" | "jpeg";

export default function GifToImagesPage() {
  const t = useTranslations("tools.gif-to-images");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [frames, setFrames] = useState<GifDecodedFrame[]>([]);
  const [gifWidth, setGifWidth] = useState(0);
  const [gifHeight, setGifHeight] = useState(0);
  const [gifName, setGifName] = useState("gif");
  const [format, setFormat] = useState<ExportFormat>("png");
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (file.type !== "image/gif" && !/\.gif$/i.test(file.name)) return;
      setError("");
      try {
        const buf = await file.arrayBuffer();
        const decoded = decodeGif(buf);
        setFrames(decoded.frames);
        setGifWidth(decoded.width);
        setGifHeight(decoded.height);
        setGifName(file.name.replace(/\.gif$/i, ""));
      } catch (err) {
        console.error(err);
        setError(t("errors.decode"));
      }
    },
    [t]
  );

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
    e.target.value = "";
  };

  const mimeFor = (fmt: ExportFormat) =>
    fmt === "png" ? "image/png" : fmt === "webp" ? "image/webp" : "image/jpeg";

  const renderFrame = useCallback((frame: GifDecodedFrame) => {
    const canvas = new OffscreenCanvas(frame.width, frame.height);
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.putImageData(frame.imageData, 0, 0);
    return canvas;
  }, []);

  const frameBlob = useCallback(
    async (frame: GifDecodedFrame, fmt: ExportFormat): Promise<Blob> => {
      const canvas = renderFrame(frame);
      // Blob parts need to be awaitable in all browsers.
      const blob: Blob = await new Promise((resolve, reject) => {
        canvas.convertToBlob({ type: mimeFor(fmt), quality: 0.92 }).then(resolve, reject);
      });
      return blob;
    },
    [renderFrame]
  );

  const downloadFrame = useCallback(
    async (frame: GifDecodedFrame, i: number) => {
      const blob = await frameBlob(frame, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${gifName}-frame-${String(i + 1).padStart(2, "0")}.${format}`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    },
    [frameBlob, format, gifName]
  );

  const downloadAll = useCallback(async () => {
    if (frames.length === 0) return;
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    for (let i = 0; i < frames.length; i++) {
      const blob = await frameBlob(frames[i], format);
      zip.file(`${gifName}-frame-${String(i + 1).padStart(2, "0")}.${format}`, blob);
    }
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${gifName}-frames.zip`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }, [frames, frameBlob, format, gifName]);

  const reset = () => {
    setFrames([]);
    setGifWidth(0);
    setGifHeight(0);
    setError("");
  };

  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none";

  return (
    <ToolLayout
      title={t("title")}
      slug="gif-to-images"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-5">
        {/* Upload area */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && fileInputRef.current?.click()
          }
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) void handleFile(file);
          }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
            dragging
              ? "border-blue-600 bg-blue-600/10"
              : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-500"
          }`}
        >
          <span className="text-4xl">{t("upload.icon")}</span>
          <span className="text-sm text-zinc-400">{t("upload.drop")}</span>
          <span className="text-xs text-zinc-500">{t("upload.formats")}</span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".gif,image/gif"
            className="hidden"
            onChange={handleInput}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}

        {frames.length > 0 && (
          <>
            {/* Info bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <span className="text-sm text-zinc-300">
                {t("info.frames", {
                  count: frames.length,
                  width: gifWidth,
                  height: gifHeight,
                })}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as ExportFormat)}
                  className={inputCls}
                  style={{ width: "auto" }}
                >
                  <option value="png">PNG</option>
                  <option value="webp">WEBP</option>
                  <option value="jpeg">JPEG</option>
                </select>
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

            {/* Frame grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {frames.map((frame, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
                >
                  <div className="flex items-center justify-center bg-zinc-950 p-2">
                    <canvas
                      width={frame.width}
                      height={frame.height}
                      className="max-h-28 w-auto max-w-full"
                      ref={(el) => {
                        if (el) {
                          const ctx = el.getContext("2d");
                          if (ctx) ctx.putImageData(frame.imageData, 0, 0);
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-1 p-2">
                    <div className="flex items-center justify-between text-[11px] text-zinc-500">
                      <span>
                        {i + 1} / {frames.length}
                      </span>
                      <span>{(frame.delayMs / 1000).toFixed(2)}s</span>
                    </div>
                    <button
                      onClick={() => void downloadFrame(frame, i)}
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
