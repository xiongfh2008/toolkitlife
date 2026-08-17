"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { loadFFmpeg, readFFmpegOutput } from "@/lib/ffmpeg";

type Step = "upload" | "ready" | "processing" | "done";

const PRESETS = [0.25, 0.5, 0.75, 1.5, 2, 3, 4];

/** Build an atempo chain covering 0.25x–4x (each instance supports 0.5–2.0). */
function atempoFilters(speed: number): string[] {
  const factors: number[] = [];
  let s = speed;
  while (s > 2) {
    factors.push(2);
    s /= 2;
  }
  while (s < 0.5) {
    factors.push(0.5);
    s /= 0.5;
  }
  if (s < 0.9999 || s > 1.0001) factors.push(s);
  return factors.map((f) => `atempo=${f.toFixed(4)}`);
}

export default function VideoSpeedChangerPage() {
  const t = useTranslations("tools.video-speed-changer");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [step, setStep] = useState<Step>("upload");
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [speed, setSpeed] = useState(1.5);
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
    if (!video || Math.abs(speed - 1) < 0.001) return;
    setStep("processing");
    setProgress(0);
    setError("");
    try {
      const { fetchFile } = await import("@ffmpeg/util");
      const ffmpeg = await loadFFmpeg((p) =>
        setProgress(Math.min(95, Math.round(p * 95)))
      );
      await ffmpeg.writeFile("input.mp4", await fetchFile(video.src));

      const vf = `setpts=${(1 / speed).toFixed(4)}*PTS`;
      const afs = atempoFilters(speed);
      const run = (withAudio: boolean) => {
        const args: string[] = ["-i", "input.mp4", "-vf", vf];
        if (withAudio && afs.length > 0) {
          args.push("-af", afs.join(","));
        } else if (!withAudio) {
          args.push("-an");
        }
        args.push(
          "-c:v",
          "libx264",
          "-preset",
          "ultrafast",
          "-crf",
          "20",
          "-movflags",
          "+faststart",
          "-y",
          "output.mp4"
        );
        if (withAudio) args.push("-c:a", "aac", "-b:a", "128k");
        return ffmpeg.exec(args);
      };

      try {
        await run(true);
      } catch {
        // Input has no audio track — retry video-only.
        await run(false);
      }

      const blob = await readFFmpegOutput(ffmpeg, "output.mp4", "video/mp4");
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
    a.download = `speed-${speed}x.mp4`;
    a.click();
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      category={t("category")}
      slug="video-speed-changer"
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
            <div className="mb-4 text-4xl">⏩</div>
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

            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <label className="mb-3 block text-center text-sm font-medium text-zinc-300">
                {t("labels.speed")}: <span className="text-blue-400">{speed}x</span>
              </label>
              <input
                type="range"
                min={0.25}
                max={4}
                step={0.05}
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setSpeed(p)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      Math.abs(speed - p) < 0.001
                        ? "bg-blue-600 text-white"
                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    }`}
                  >
                    {p}x
                  </button>
                ))}
              </div>
              <p className="mt-3 text-center text-xs text-zinc-500">
                {speed > 1
                  ? t("labels.fasterHint")
                  : t("labels.slowerHint")}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={generate}
                disabled={Math.abs(speed - 1) < 0.001}
                className={`${btn} bg-blue-600 px-6 text-white hover:bg-blue-500`}
              >
                {t("buttons.change")}
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
              {t("labels.resultSize", { size: fmtSize(resultSize) })}
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

function fmtSize(bytes: number): string {
  if (!bytes) return "0 KB";
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(2)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
