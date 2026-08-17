"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { loadFFmpeg } from "@/lib/ffmpeg";
import type { FFmpeg } from "@ffmpeg/ffmpeg";

const FORMATS = [
  { ext: "png", mime: "image/png", label: "PNG" },
  { ext: "jpg", mime: "image/jpeg", label: "JPEG" },
  { ext: "webp", mime: "image/webp", label: "WebP" },
  { ext: "bmp", mime: "image/bmp", label: "BMP" },
  { ext: "tiff", mime: "image/tiff", label: "TIFF" },
] as const;

type OutputFormat = (typeof FORMATS)[number]["ext"];
type ScaleOption = "original" | "1280" | "720";
type Step = "upload" | "settings" | "processing" | "done";

const MAX_FRAMES = 150;
const PREVIEW_FRAMES = 12;

export default function VideoToImagesPage() {
  const t = useTranslations("tools.video-to-images");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<Step>("upload");
  const [intervalSec, setIntervalSec] = useState(1);
  const [format, setFormat] = useState<OutputFormat>("png");
  const [scale, setScale] = useState<ScaleOption>("original");
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [preview, setPreview] = useState<{ url: string; name: string }[]>([]);
  const [totalFrames, setTotalFrames] = useState(0);
  const [error, setError] = useState("");

  const ffmpegRef = useRef<FFmpeg | null>(null);
  const blobsRef = useRef<Blob[]>([]);
  const urlRef = useRef<string[]>([]);

  const selected = FORMATS.find((f) => f.ext === format)!;

  const revokeAll = useCallback(() => {
    urlRef.current.forEach((u) => URL.revokeObjectURL(u));
    urlRef.current = [];
  }, []);

  const cleanupFfmpeg = useCallback(() => {
    // The shared engine is cached in lib/ffmpeg.ts and must not be
    // terminated here, otherwise every new upload pays the reload cost.
    ffmpegRef.current = null;
  }, []);

  const handleUpload = useCallback(
    (f: File) => {
      const isVideo =
        f.type.startsWith("video/") ||
        /\.(mp4|mkv|avi|mov|flv|webm|m2ts|mts|ts|ogv|ogg|ogx|oga|mxf|m4v|3gp|3g2|wmv|asf|f4v|ismv|vob|divx)$/i.test(
          f.name
        );
      if (!isVideo) return;
      revokeAll();
      cleanupFfmpeg();
      blobsRef.current = [];
      setFile(f);
      setPreview([]);
      setTotalFrames(0);
      setError("");
      setStep("settings");
    },
    [revokeAll, cleanupFfmpeg]
  );

  const convert = useCallback(async () => {
    if (!file) return;
    setStep("processing");
    setProgress(0);
    setError("");
    setStatusMsg(t("status.loading"));
    try {
      const { fetchFile } = await import("@ffmpeg/util");
      const ffmpeg = await loadFFmpeg((p) =>
        setProgress(Math.min(88, Math.round(p * 88)))
      );
      ffmpegRef.current = ffmpeg;

      const ext = file.name.match(/\.[^.]+$/)?.[0] ?? ".mp4";
      const inputName = `input${ext}`;
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      // Probe the duration first so we can bound the frame count.
      const logs: string[] = [];
      ffmpeg.on("log", ({ message }) => logs.push(message));
      await ffmpeg.exec(["-i", inputName]).catch(() => {});
      const durMatch = logs
        .join("\n")
        .match(/Duration:\s*(\d+):(\d+):(\d+\.?\d*)/);
      let duration = 0;
      if (durMatch) {
        duration =
          Number(durMatch[1]) * 3600 + Number(durMatch[2]) * 60 + Number(durMatch[3]);
      }
      if (duration > 0 && Math.ceil(duration / intervalSec) > MAX_FRAMES) {
        throw new Error(t("errors.tooManyFrames", { count: MAX_FRAMES }));
      }

      setStatusMsg(t("status.extracting"));
      setProgress(90);
      const vf = [`fps=1/${intervalSec}`];
      if (scale !== "original") vf.push(`scale=min(${scale},iw):-2`);
      await ffmpeg.exec([
        "-i",
        inputName,
        "-vf",
        vf.join(","),
        "-an",
        "-y",
        `frame_%04d.${selected.ext}`,
      ]);

      const dir = await ffmpeg.listDir("/");
      const files = dir
        .filter(
          (f) => f.name.startsWith("frame_") && f.name.endsWith(`.${selected.ext}`)
        )
        .map((f) => f.name)
        .sort();
      if (files.length === 0) throw new Error(t("errors.noFrames"));

      const blobs: Blob[] = [];
      for (let i = 0; i < files.length; i++) {
        const data = await ffmpeg.readFile(files[i]);
        const raw = data as Uint8Array;
        const buf = new ArrayBuffer(raw.byteLength);
        new Uint8Array(buf).set(raw);
        blobs.push(new Blob([buf], { type: selected.mime }));
        if (i % 10 === 0 || i === files.length - 1) {
          setProgress(90 + Math.round(((i + 1) / files.length) * 8));
        }
      }
      blobsRef.current = blobs;
      setTotalFrames(files.length);

      // Preview only the first few frames to keep memory low.
      const urls = blobs
        .slice(0, PREVIEW_FRAMES)
        .map((b, i) => ({
          url: URL.createObjectURL(b),
          name: `frame_${String(i + 1).padStart(4, "0")}.${selected.ext}`,
        }));
      urlRef.current = urls.map((u) => u.url);
      setPreview(urls);

      cleanupFfmpeg();
      setProgress(100);
      setStep("done");
    } catch (err) {
      console.error(err);
      cleanupFfmpeg();
      setError(
        t("errors.prefix") + (err instanceof Error ? err.message : String(err))
      );
      setStep("settings");
    }
  }, [file, intervalSec, scale, selected.ext, selected.mime, t, cleanupFfmpeg]);

  const downloadAll = useCallback(async () => {
    if (blobsRef.current.length === 0 || !file) return;
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    blobsRef.current.forEach((b, i) => {
      zip.file(
        `${file.name.replace(/\.[^.]+$/, "")}-frame-${String(i + 1).padStart(4, "0")}.${selected.ext}`,
        b
      );
    });
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file.name.replace(/\.[^.]+$/, "")}-frames.zip`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }, [file, selected.ext]);

  const downloadOne = useCallback(
    (name: string, i: number) => {
      if (!preview[i]) return;
      const a = document.createElement("a");
      a.href = preview[i].url;
      a.download = name;
      a.click();
    },
    [preview]
  );

  const reset = useCallback(() => {
    revokeAll();
    cleanupFfmpeg();
    blobsRef.current = [];
    setFile(null);
    setPreview([]);
    setTotalFrames(0);
    setStep("upload");
    setProgress(0);
    setError("");
  }, [revokeAll, cleanupFfmpeg]);

  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none";

  return (
    <ToolLayout
      title={t("title")}
      slug="video-to-images"
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
            onClick={() => document.getElementById("video-images-input")?.click()}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") &&
              document.getElementById("video-images-input")?.click()
            }
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files?.[0];
              if (f) handleUpload(f);
            }}
            className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
              step === "upload"
                ? "border-zinc-700 bg-zinc-800/50 hover:border-zinc-500"
                : "border-zinc-800 bg-zinc-900/50"
            }`}
          >
            <span className="text-4xl">🎞️</span>
            <span className="text-sm text-zinc-400">{t("upload.drop")}</span>
            <span className="text-xs text-zinc-500">{t("upload.formats")}</span>
            <input
              id="video-images-input"
              type="file"
              accept="video/*,.mkv,.flv,.m2ts,.mts,.ts,.mxf,.3gp,.3g2,.wmv,.asf,.f4v,.ismv,.vob,.divx"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUpload(f);
                e.target.value = "";
              }}
            />
          </div>
        )}

        {step === "settings" && file && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm text-zinc-200">{file.name}</p>
                <p className="text-xs text-zinc-500">
                  {(file.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
              <button
                onClick={reset}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                {t("buttons.newVideo")}
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  {t("labels.interval")}
                </label>
                <input
                  type="range"
                  min={0.2}
                  max={10}
                  step={0.1}
                  value={intervalSec}
                  onChange={(e) => setIntervalSec(Number(e.target.value))}
                  className="w-full"
                />
                <p className="mt-1 text-xs text-zinc-500">
                  {t("labels.intervalValue", { seconds: intervalSec.toFixed(1) })}
                </p>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  {t("labels.format")}
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as OutputFormat)}
                  className={inputCls}
                >
                  {FORMATS.map((f) => (
                    <option key={f.ext} value={f.ext}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  {t("labels.scale")}
                </label>
                <select
                  value={scale}
                  onChange={(e) => setScale(e.target.value as ScaleOption)}
                  className={inputCls}
                >
                  <option value="original">
                    {t("scaleOptions.original")}
                  </option>
                  <option value="1280">1280px</option>
                  <option value="720">720px</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => void convert()}
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-500"
              >
                {t("buttons.extract")}
              </button>
              <button
                onClick={reset}
                className="rounded-lg bg-zinc-800 px-4 py-3 text-sm text-zinc-300 transition-colors hover:bg-zinc-700"
              >
                {t("buttons.clear")}
              </button>
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

        {step === "done" && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <span className="text-sm text-zinc-300">
                {t("info.frames", { count: totalFrames })}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => void downloadAll()}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
                >
                  {t("buttons.downloadAll")}
                </button>
                <button
                  onClick={() => setStep("settings")}
                  className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                >
                  {t("buttons.back")}
                </button>
                <button
                  onClick={reset}
                  className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                >
                  {t("buttons.clear")}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {preview.map((frame, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
                >
                  <div className="flex items-center justify-center bg-zinc-950 p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={frame.url}
                      alt={frame.name}
                      className="max-h-28 w-auto max-w-full"
                    />
                  </div>
                  <div className="space-y-1 p-2">
                    <p className="truncate text-[11px] text-zinc-500">
                      {frame.name}
                    </p>
                    <button
                      onClick={() => void downloadOne(frame.name, i)}
                      className="w-full rounded bg-zinc-800 py-1.5 text-xs text-zinc-200 hover:bg-zinc-700"
                    >
                      {t("buttons.download")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-500">{t("info.previewNote")}</p>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
