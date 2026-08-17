"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { loadFFmpeg, readFFmpegOutput } from "@/lib/ffmpeg";

type Step = "upload" | "settings" | "processing" | "done";
type Transition = "none" | "fade";

interface SlideImage {
  id: string;
  name: string;
  url: string;
  img: HTMLImageElement;
}

const RESOLUTIONS = [480, 720, 1080] as const;
const FPS_OPTIONS = [24, 30] as const;

let uid = 0;
const nextId = () => `img-${Date.now()}-${uid++}`;

function formatSize(bytes: number): string {
  if (!bytes) return "0 KB";
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(2)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/** Cover-fit draw: scale + center-crop the source image into WxH. */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
  alpha: number
) {
  const ir = img.naturalWidth / img.naturalHeight;
  const cr = w / h;
  let sx = 0;
  let sy = 0;
  let sw = img.naturalWidth;
  let sh = img.naturalHeight;
  if (ir > cr) {
    sw = sh * cr;
    sx = (img.naturalWidth - sw) / 2;
  } else {
    sh = sw / cr;
    sy = (img.naturalHeight - sh) / 2;
  }
  ctx.globalAlpha = alpha;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
  ctx.globalAlpha = 1;
}

export default function SlideshowMakerPage() {
  const t = useTranslations("tools.slideshow-maker");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [step, setStep] = useState<Step>("upload");
  const [images, setImages] = useState<SlideImage[]>([]);
  const [duration, setDuration] = useState(3);
  const [transition, setTransition] = useState<Transition>("fade");
  const [resolution, setResolution] = useState<number>(720);
  const [fps, setFps] = useState<number>(30);
  const [audio, setAudio] = useState<File | null>(null);
  const [audioName, setAudioName] = useState("");

  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [resultSize, setResultSize] = useState(0);
  const [error, setError] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadImageFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          setImages((prev) => [
            ...prev,
            { id: nextId(), name: file.name, url: reader.result as string, img },
          ]);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      for (const f of Array.from(files)) loadImageFile(f);
    },
    [loadImageFile]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAudio(f);
    setAudioName(f.name);
  };

  const goSettings = () => {
    if (images.length === 0) return;
    setStep("settings");
    setError("");
  };

  const transitionSec =
    transition === "fade" && images.length > 1
      ? Math.min(1, Math.max(0.5, duration / 2))
      : 0;
  const totalDuration =
    images.length * duration - (images.length - 1) * transitionSec;

  const reset = () => {
    images.forEach((i) => URL.revokeObjectURL(i.url));
    setImages([]);
    setAudio(null);
    setAudioName("");
    setResultUrl("");
    setResultSize(0);
    setError("");
    setProgress(0);
    setStep("upload");
  };

  const generate = async () => {
    if (images.length === 0) {
      setError(t("errors.noImages"));
      return;
    }
    setStep("processing");
    setProgress(0);
    setError("");
    try {
      const { fetchFile } = await import("@ffmpeg/util");
      const ffmpeg = await loadFFmpeg((p) =>
        setProgress(Math.min(95, 45 + Math.round(p * 50)))
      );

      // H.264 + yuv420p requires even dimensions — nudge odd values down.
      let W = Math.round((resolution * 16) / 9);
      let H = resolution;
      if (W % 2 !== 0) W -= 1;
      if (H % 2 !== 0) H -= 1;
      const canvas = canvasRef.current;
      if (!canvas) throw new Error(t("errors.render"));
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error(t("errors.render"));

      // Phase 1 — render each frame to JPEG inside FFmpeg's virtual FS.
      setStatusMsg(t("progress.rendering"));
      const totalFrames = Math.max(1, Math.round(totalDuration * fps));
      const slot = duration - transitionSec;
      for (let k = 0; k < totalFrames; k++) {
        const tk = k / fps;
        const i = Math.min(images.length - 1, Math.floor(tk / slot));
        const local = tk - i * slot;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, W, H);
        if (
          transitionSec > 0 &&
          i < images.length - 1 &&
          local > duration - transitionSec
        ) {
          const alpha = (local - (duration - transitionSec)) / transitionSec;
          drawCover(ctx, images[i].img, W, H, 1 - alpha);
          drawCover(ctx, images[i + 1].img, W, H, alpha);
        } else {
          drawCover(ctx, images[i].img, W, H, 1);
        }
        const blob = await new Promise<Blob | null>((res) =>
          canvas.toBlob(res, "image/jpeg", 0.85)
        );
        if (!blob) throw new Error(t("errors.render"));
        await ffmpeg.writeFile(
          `f${String(k).padStart(4, "0")}.jpg`,
          await fetchFile(blob)
        );
        setProgress(Math.round(((k + 1) / totalFrames) * 45));
        // Let the UI breathe on long renders.
        if (k % 10 === 0) await new Promise((r) => setTimeout(r, 0));
      }

      // Phase 2 — encode the image sequence (optionally mux background audio).
      setStatusMsg(t("progress.encoding"));
      const args: string[] = [
        "-framerate",
        String(fps),
        "-start_number",
        "0",
        "-i",
        "f%04d.jpg",
      ];
      let looped = false;
      if (audio) {
        args.push("-stream_loop", "-1", "-i", "audio" + audioExt(audio.name));
        looped = true;
      }
      args.push(
        "-c:v",
        "libx264",
        "-preset",
        "ultrafast",
        "-crf",
        "20",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart"
      );
      if (audio) args.push("-c:a", "aac", "-b:a", "192k", "-shortest");
      args.push("-y", "output.mp4");

      if (audio) {
        await ffmpeg.writeFile("audio" + audioExt(audio.name), await fetchFile(audio));
      }

      try {
        await ffmpeg.exec(args);
      } catch (err) {
        if (!looped) throw err;
        // Fallback: without stream_loop (some FFmpeg wasm builds choke on it).
        if (!audio) throw err;
        const plain: string[] = [
          "-framerate",
          String(fps),
          "-start_number",
          "0",
          "-i",
          "f%04d.jpg",
          "-i",
          "audio" + audioExt(audio.name),
          "-c:v",
          "libx264",
          "-preset",
          "ultrafast",
          "-crf",
          "20",
          "-pix_fmt",
          "yuv420p",
          "-c:a",
          "aac",
          "-b:a",
          "192k",
          "-shortest",
          "-movflags",
          "+faststart",
          "-y",
          "output.mp4",
        ];
        await ffmpeg.exec(plain);
      }

      // Phase 3 — read the result out of the virtual FS.
      setStatusMsg(t("progress.finishing"));
      const blob = await readFFmpegOutput(ffmpeg, "output.mp4", "video/mp4");

      if (blob.size < 1000) throw new Error(t("errors.emptyOutput"));
      setResultSize(blob.size);
      setResultUrl(URL.createObjectURL(blob));
      setProgress(100);
      setStep("done");
    } catch (err) {
      console.error(err);
      setError(t("errors.failed") + (err instanceof Error ? ` ${err.message}` : ""));
      setStep("settings");
    }
  };

  const backToSettings = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl("");
    setResultSize(0);
    setProgress(0);
    setError("");
    setStep("settings");
  };

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "slideshow.mp4";
    a.click();
  };

  const fmtDur = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m}:${String(Math.round(s % 60)).padStart(2, "0")}`;
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      category={t("category")}
      slug="slideshow-maker"
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-5">
        <canvas ref={canvasRef} className="hidden" />

        {error && (
          <div className="rounded-lg border border-red-800 bg-red-900/30 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {step === "upload" && (
          <div className="space-y-4">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById("ssm-files")?.click()}
              className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-12 text-center transition-colors hover:border-zinc-500"
            >
              <div className="mb-4 text-4xl">🎞️</div>
              <p className="font-medium text-zinc-300">{t("labels.uploadTitle")}</p>
              <p className="mt-1 text-sm text-zinc-500">{t("labels.uploadSubtitle")}</p>
              <p className="mt-2 text-xs text-zinc-600">{t("labels.uploadFormats")}</p>
              <input
                id="ssm-files"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
              />
            </div>

            {images.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {images.map((img, idx) => (
                  <div
                    key={img.id}
                    className="group relative h-24 w-32 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.name}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute left-1 top-1 rounded bg-black/70 px-1.5 py-0.5 text-xs text-zinc-300">
                      {idx + 1}
                    </span>
                    <button
                      onClick={() => removeImage(img.id)}
                      className="absolute right-1 top-1 rounded bg-black/70 px-1.5 text-xs text-zinc-300 hover:text-red-400"
                      title={t("labels.remove")}
                      aria-label={t("labels.remove")}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {images.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={goSettings}
                  className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
                >
                  {t("labels.continue")} ({images.length})
                </button>
                <button
                  onClick={() => document.getElementById("ssm-files")?.click()}
                  className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
                >
                  {t("labels.addMore")}
                </button>
              </div>
            )}
          </div>
        )}

        {step === "settings" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  className="relative aspect-video overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.name}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-1 top-1 rounded bg-black/70 px-1.5 py-0.5 text-xs text-zinc-300">
                    {idx + 1}
                  </span>
                  <button
                    onClick={() => removeImage(img.id)}
                    className="absolute right-1 top-1 rounded bg-black/70 px-1.5 text-xs text-zinc-300 hover:text-red-400"
                    title={t("labels.remove")}
                    aria-label={t("labels.remove")}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  {t("labels.duration")}: {duration}s
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-500"
                />
                <p className="mt-1 text-xs text-zinc-500">{t("labels.durationHint")}</p>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  {t("labels.transition")}
                </label>
                <div className="flex gap-2">
                  {(["none", "fade"] as Transition[]).map((tr) => (
                    <button
                      key={tr}
                      onClick={() => setTransition(tr)}
                      className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        transition === tr
                          ? "bg-blue-600 text-white"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      {t(`labels.transition${tr === "none" ? "None" : "Fade"}`)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  {t("labels.resolution")}
                </label>
                <div className="flex gap-2">
                  {RESOLUTIONS.map((r) => (
                    <button
                      key={r}
                      onClick={() => setResolution(r)}
                      className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        resolution === r
                          ? "bg-blue-600 text-white"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      {r === 480 ? "480p" : r === 720 ? "720p" : "1080p"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  {t("labels.fps")}
                </label>
                <div className="flex gap-2">
                  {FPS_OPTIONS.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFps(f)}
                      className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        fps === f
                          ? "bg-blue-600 text-white"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      {f} FPS
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                {t("labels.audio")}
              </label>
              {audio ? (
                <div className="flex items-center gap-2">
                  <span className="flex-1 truncate text-sm text-zinc-300">🎵 {audioName}</span>
                  <button
                    onClick={() => {
                      setAudio(null);
                      setAudioName("");
                    }}
                    className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
                  >
                    {t("labels.audioRemove")}
                  </button>
                </div>
              ) : (
                <label className="block cursor-pointer rounded-lg border border-dashed border-zinc-600 p-4 text-center text-sm text-zinc-400 transition-colors hover:border-zinc-500">
                  {t("labels.audioAdd")}
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={handleAudio}
                  />
                </label>
              )}
              <p className="mt-2 text-xs text-zinc-500">{t("labels.audioHint")}</p>
            </div>

            <p className="text-sm text-zinc-400">
              {t("labels.totalDuration", {
                count: images.length,
                duration: fmtDur(totalDuration),
              })}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={generate}
                className={`${btn} bg-blue-600 px-6 text-white hover:bg-blue-500`}
              >
                {t("buttons.generate")}
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
            <p className="mb-6 text-sm text-zinc-400">{statusMsg}</p>
            <div className="mx-auto max-w-md">
              <div className="mb-1 flex justify-between text-sm text-zinc-400">
                <span>{progress}%</span>
              </div>
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
                onClick={backToSettings}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {t("buttons.adjust")}
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

function audioExt(name: string): string {
  const m = name.match(/\.[^.]+$/);
  return m ? m[0].toLowerCase() : ".mp3";
}
