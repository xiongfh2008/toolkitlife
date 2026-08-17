"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { loadFFmpeg, readFFmpegOutput } from "@/lib/ffmpeg";

type Step = "upload" | "settings" | "processing" | "done";

export default function AnimatedWebpPage() {
  const t = useTranslations("tools.animated-webp");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [fps, setFps] = useState(15);
  const [quality, setQuality] = useState(80);
  const [width, setWidth] = useState(480);
  const [lossless, setLossless] = useState(false);
  const [naturalWidth, setNaturalWidth] = useState(0);
  const [step, setStep] = useState<Step>("upload");
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [resultName, setResultName] = useState("animated.webp");
  const [resultSize, setResultSize] = useState(0);
  const [error, setError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleUpload = useCallback(
    (f: File) => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setFile(f);
      setVideoUrl(URL.createObjectURL(f));
      setNaturalWidth(0);
      setResultUrl("");
      setError("");
      setStep("settings");
    },
    [videoUrl, resultUrl]
  );

  const convert = async () => {
    if (!file) return;
    setStep("processing");
    setProgress(0);
    setError("");
    try {
      const { fetchFile } = await import("@ffmpeg/util");
      const ffmpeg = await loadFFmpeg((p) => setProgress(Math.min(92, Math.round(p * 92))));
      setStatusMsg(t("status.converting"));

      const inputName = `input${file.name.match(/\.[^.]+$/)?.[0] ?? ".mp4"}`;
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      const vf = [`fps=${fps}`];
      if (naturalWidth > width) vf.push(`scale=${width}:-2`);
      const args: string[] = ["-i", inputName, "-vf", vf.join(","), "-an"];
      if (lossless) {
        args.push("-lossless", "1");
      } else {
        args.push("-q:v", String(quality));
      }
      args.push("-loop", "0", "-c:v", "libwebp", "-y", "output.webp");
      await ffmpeg.exec(args);

      setStatusMsg(t("status.finishing"));
      const blob = await readFFmpegOutput(ffmpeg, "output.webp", "image/webp");
      await ffmpeg.deleteFile(inputName).catch(() => {});
      await ffmpeg.deleteFile("output.webp").catch(() => {});

      if (blob.size < 100) throw new Error(t("errors.empty"));
      setResultSize(blob.size);
      setResultUrl(URL.createObjectURL(blob));
      setResultName(`${file.name.replace(/\.[^.]+$/, "")}.webp`);
      setProgress(100);
      setStep("done");
    } catch (err) {
      console.error(err);
      setError(t("errors.prefix") + (err instanceof Error ? err.message : String(err)));
      setStep("settings");
    }
  };

  const reset = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setVideoUrl("");
    setResultUrl("");
    setStep("upload");
    setProgress(0);
    setError("");
  };

  const fmtSize = (b: number) =>
    b < 1024 * 1024
      ? `${(b / 1024).toFixed(1)} KB`
      : `${(b / (1024 * 1024)).toFixed(1)} MB`;

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none";

  return (
    <ToolLayout
      title={t("title")}
      slug="animated-webp"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="max-w-4xl space-y-4">
        {error && (
          <div className="rounded-lg border border-red-800 bg-red-950 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {step === "upload" && (
          <div
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files?.[0];
              if (f?.type.startsWith("video/")) handleUpload(f);
            }}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("aw-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">🖼️</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input
              id="aw-in"
              type="file"
              accept="video/*"
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
            <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                playsInline
                preload="metadata"
                className="max-h-72 w-full"
                onLoadedMetadata={() =>
                  setNaturalWidth(videoRef.current?.videoWidth || 0)
                }
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm text-zinc-400">
                  {t("labels.fps")}: {fps}
                </label>
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={fps}
                  onChange={(e) => setFps(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-zinc-400">
                  {t("labels.quality")}: {quality}
                </label>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                  disabled={lossless}
                  className="w-full accent-blue-500 disabled:opacity-40"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-zinc-400">{t("labels.width")}</label>
                <select
                  value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value, 10))}
                  className={inputCls}
                >
                  <option value={320}>320px</option>
                  <option value={480}>480px</option>
                  <option value={640}>640px</option>
                  <option value={800}>800px</option>
                </select>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={lossless}
                onChange={(e) => setLossless(e.target.checked)}
                className="h-4 w-4 accent-blue-500"
              />
              {t("labels.lossless")}
            </label>

            <div className="flex gap-3">
              <button
                onClick={() => void convert()}
                className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
              >
                {t("buttons.convert")}
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
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center">
            <div className="mb-3 text-4xl">⚙️</div>
            <h3 className="mb-2 text-lg font-semibold text-zinc-100">{t("status.processing")}</h3>
            <p className="mb-4 text-sm text-zinc-400">{statusMsg}</p>
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

        {step === "done" && file && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-center">
            <div className="mb-4 flex items-center justify-center gap-6">
              <div>
                <p className="text-xs text-zinc-500">{t("result.original")}</p>
                <p className="font-mono text-lg text-zinc-300">{fmtSize(file.size)}</p>
              </div>
              <div className="text-2xl text-zinc-600">→</div>
              <div>
                <p className="text-xs text-zinc-500">{t("result.converted")}</p>
                <p className="font-mono text-lg text-green-400">{fmtSize(resultSize)}</p>
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={resultUrl} alt="Animated WebP" className="mx-auto mb-6 max-h-80 rounded-lg" />
            <div className="flex justify-center gap-3">
              <a
                href={resultUrl}
                download={resultName}
                className={`${btn} bg-green-600 text-white hover:bg-green-500`}
              >
                {t("buttons.download")}
              </a>
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
