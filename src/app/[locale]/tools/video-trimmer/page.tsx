"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { loadFFmpeg, readFFmpegOutput } from "@/lib/ffmpeg";

type Step = "upload" | "ready" | "processing" | "done";
type Mode = "fast" | "precise";

function formatTime(s: number): string {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export default function VideoTrimmerPage() {
  const t = useTranslations("tools.video-trimmer");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [step, setStep] = useState<Step>("upload");
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [mode, setMode] = useState<Mode>("fast");
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState("");
  const [resultSize, setResultSize] = useState(0);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("video/")) return;
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.preload = "metadata";
    v.onloadedmetadata = () => {
      const d = v.duration;
      setDuration(d);
      setStart(0);
      setEnd(d);
      setVideo(v);
      setStep("ready");
    };
    v.src = url;
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) loadFile(e.dataTransfer.files[0]);
  };

  const reset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl("");
    setResultSize(0);
    setError("");
    setProgress(0);
    setVideo(null);
    setStep("upload");
  };

  const generate = async () => {
    if (!video || end <= start) return;
    setStep("processing");
    setProgress(0);
    setError("");
    try {
      const { fetchFile } = await import("@ffmpeg/util");
      const ffmpeg = await loadFFmpeg((p) =>
        setProgress(Math.min(95, Math.round(p * 95)))
      );
      const dur = end - start;
      await ffmpeg.writeFile("input.mp4", await fetchFile(video.src));

      const args: string[] = [];
      if (mode === "fast") {
        // Stream copy — no re-encode, near instant.
        args.push(
          "-ss",
          start.toFixed(3),
          "-i",
          "input.mp4",
          "-t",
          dur.toFixed(3),
          "-c",
          "copy",
          "-avoid_negative_ts",
          "make_zero",
          "-movflags",
          "+faststart",
          "-y",
          "output.mp4"
        );
      } else {
        args.push(
          "-ss",
          start.toFixed(3),
          "-i",
          "input.mp4",
          "-t",
          dur.toFixed(3),
          "-c:v",
          "libx264",
          "-preset",
          "ultrafast",
          "-crf",
          "20",
          "-c:a",
          "aac",
          "-b:a",
          "128k",
          "-movflags",
          "+faststart",
          "-y",
          "output.mp4"
        );
      }
      await ffmpeg.exec(args);

      const blob = await readFFmpegOutput(ffmpeg, "output.mp4", "video/mp4");
      await ffmpeg.terminate();
      if (blob.size < 1000) throw new Error(t("errors.emptyOutput"));
      setResultSize(blob.size);
      setResultUrl(URL.createObjectURL(blob));
      setProgress(100);
      setStep("done");
    } catch (err) {
      console.error(err);
      setError(
        t("errors.failed") + (err instanceof Error ? ` ${err.message}` : "")
      );
      setStep("ready");
    }
  };

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "trimmed.mp4";
    a.click();
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      category={t("category")}
      slug="video-trimmer"
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-5">
        {error && (
          <div className="rounded-lg border border-red-800 bg-red-900/30 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {step === "upload" && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">✂️</div>
            <p className="font-medium text-zinc-300">{t("labels.dropPrompt")}</p>
            <p className="mt-1 text-sm text-zinc-500">MP4 · WebM · MOV</p>
            <input
              ref={inputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])}
            />
          </div>
        )}

        {step === "ready" && video && (
          <div className="space-y-4">
            <video
              src={video.src}
              controls
              playsInline
              className="mx-auto max-h-72 w-full max-w-2xl rounded-lg bg-black"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  {t("labels.start")}: {formatTime(start)}
                </label>
                <input
                  type="range"
                  min={0}
                  max={Math.max(0, duration - 0.2)}
                  step={0.1}
                  value={Math.min(start, end - 0.2)}
                  onChange={(e) =>
                    setStart(Math.min(parseFloat(e.target.value), end - 0.2))
                  }
                  className="w-full accent-blue-500"
                />
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  {t("labels.end")}: {formatTime(end)}
                </label>
                <input
                  type="range"
                  min={Math.min(duration, start + 0.2)}
                  max={duration}
                  step={0.1}
                  value={Math.max(end, start + 0.2)}
                  onChange={(e) =>
                    setEnd(Math.max(parseFloat(e.target.value), start + 0.2))
                  }
                  className="w-full accent-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                {t("labels.mode")}
              </label>
              <div className="flex gap-2">
                {(["fast", "precise"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      mode === m
                        ? "bg-blue-600 text-white"
                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    }`}
                  >
                    {t(`labels.mode${m === "fast" ? "Fast" : "Precise"}`)}
                  </button>
                ))}
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                {t(`labels.mode${mode === "fast" ? "FastHint" : "PreciseHint"}`)}
              </p>
            </div>

            <p className="text-sm text-zinc-400">
              {t("labels.selected", {
                start: formatTime(start),
                end: formatTime(end),
                duration: formatTime(end - start),
              })}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={generate}
                className={`${btn} bg-blue-600 px-6 text-white hover:bg-blue-500`}
              >
                {t("buttons.cut")}
              </button>
              <button
                onClick={reset}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {t("buttons.newVideo")}
              </button>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-10 text-center">
            <div className="mb-4 text-5xl">⚙️</div>
            <h3 className="mb-2 text-xl font-semibold text-zinc-100">
              {t("progress.title")}
            </h3>
            <div className="mx-auto max-w-md">
              <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <p className="mt-4 text-xs text-zinc-500">{t("progress.keepOpen")}</p>
          </div>
        )}

        {step === "done" && resultUrl && (
          <div className="space-y-4">
            <video
              src={resultUrl}
              controls
              playsInline
              className="mx-auto max-h-96 w-full max-w-2xl rounded-lg bg-black"
            />
            <p className="text-center text-sm text-zinc-400">
              {t("labels.resultSize", { size: formatSize(resultSize) })}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={download}
                className={`${btn} bg-green-600 px-6 text-white hover:bg-green-500`}
              >
                {t("buttons.download")}
              </button>
              <button
                onClick={reset}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {t("buttons.newVideo")}
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

function formatSize(bytes: number): string {
  if (!bytes) return "0 KB";
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(2)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
