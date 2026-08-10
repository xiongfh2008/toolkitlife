"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

type FrameFormat = "png" | "jpeg";

interface FrameItem {
  url: string;
  time: number;
}

const MAX_FRAMES = 100;

export default function VideoFrameExtractorPage() {
  const t = useTranslations("tools.video-frame-extractor");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [videoSrc, setVideoSrc] = useState("");
  const [videoName, setVideoName] = useState("video");
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [intervalSec, setIntervalSec] = useState(1);
  const [format, setFormat] = useState<FrameFormat>("png");
  const [frames, setFrames] = useState<FrameItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const urlRef = useRef<string[]>([]);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("video/")) return;
    for (const u of urlRef.current) URL.revokeObjectURL(u);
    urlRef.current = [];
    setVideoName(file.name.replace(/\.[^.]+$/, ""));
    setVideoSrc(URL.createObjectURL(file));
    setFrames([]);
    setError("");
  }, []);

  const seekTo = useCallback((el: HTMLVideoElement, time: number) => {
    el.currentTime = time;
    return new Promise<void>((resolve) => {
      const timer = setTimeout(() => {
        el.onseeked = null;
        resolve();
      }, 2500);
      el.onseeked = () => {
        clearTimeout(timer);
        resolve();
      };
    });
  }, []);

  const extract = useCallback(async () => {
    if (!video) return;
    setProcessing(true);
    setProgress(0);
    setError("");
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    try {
      const duration = video.duration || 0;
      const times: number[] = [];
      for (let ts = 0; ts <= duration; ts += intervalSec) times.push(ts);
      if (times.length > MAX_FRAMES) times.length = MAX_FRAMES;

      const scale = Math.min(1, 1280 / Math.max(1, video.videoWidth));
      const w = Math.max(1, Math.round(video.videoWidth * scale));
      const h = Math.max(1, Math.round(video.videoHeight * scale));
      canvas.width = w;
      canvas.height = h;

      const newFrames: FrameItem[] = [];
      const urls: string[] = [];
      for (let i = 0; i < times.length; i++) {
        await seekTo(video, times[i]);
        ctx.drawImage(video, 0, 0, w, h);
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, format === "png" ? "image/png" : "image/jpeg", 0.92)
        );
        if (blob) {
          const url = URL.createObjectURL(blob);
          urls.push(url);
          newFrames.push({ url, time: times[i] });
        }
        setProgress(Math.round(((i + 1) / times.length) * 100));
      }
      for (const u of urlRef.current) URL.revokeObjectURL(u);
      urlRef.current = urls;
      setFrames(newFrames);
    } catch (err) {
      console.error(err);
      setError(t("errors.process"));
    } finally {
      setProcessing(false);
    }
  }, [video, intervalSec, format, seekTo, t]);

  const downloadFrame = useCallback(
    (frame: FrameItem) => {
      const a = document.createElement("a");
      a.href = frame.url;
      a.download = `${videoName}-frame-${String(frames.indexOf(frame) + 1).padStart(2, "0")}.${format}`;
      a.click();
    },
    [frames, videoName, format]
  );

  const downloadAll = useCallback(async () => {
    if (frames.length === 0) return;
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    for (let i = 0; i < frames.length; i++) {
      const blob = await (await fetch(frames[i].url)).blob();
      zip.file(`${videoName}-frame-${String(i + 1).padStart(2, "0")}.${format}`, blob);
    }
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${videoName}-frames.zip`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }, [frames, videoName, format]);

  const reset = () => {
    for (const u of urlRef.current) URL.revokeObjectURL(u);
    urlRef.current = [];
    setVideoSrc("");
    setFrames([]);
    setError("");
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const fmtTime = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m}:${String(Math.round(s % 60)).padStart(2, "0")}`;
  };

  return (
    <ToolLayout
      title={t("title")}
      slug="video-frame-extractor"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="max-w-4xl space-y-4">
        <canvas ref={canvasRef} className="hidden" />
        {!videoSrc ? (
          <div
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files?.[0];
              if (f) handleFile(f);
            }}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("vfe-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">🎞️</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input
              id="vfe-in"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = "";
              }}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
              <video
                src={videoSrc}
                controls
                playsInline
                preload="metadata"
                className="max-h-72 w-full"
                onLoadedMetadata={(e) => setVideo(e.currentTarget)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-zinc-400">
                  {t("labels.interval")}: {intervalSec}s
                </label>
                <input
                  type="range"
                  min={0.1}
                  max={10}
                  step={0.1}
                  value={intervalSec}
                  onChange={(e) => setIntervalSec(parseFloat(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-zinc-400">{t("labels.format")}</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as FrameFormat)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
                >
                  <option value="png">PNG</option>
                  <option value="jpeg">JPEG</option>
                </select>
              </div>
            </div>

            {processing ? (
              <div className="space-y-2">
                <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-center text-sm text-zinc-400">{progress}%</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => void extract()}
                  className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
                >
                  {t("buttons.extract")}
                </button>
                <button
                  onClick={reset}
                  className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
                >
                  {t("buttons.newVideo")}
                </button>
              </div>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}

            {frames.length > 0 && (
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between">
                  <p className="text-sm font-medium text-zinc-300">
                    {t("info.frames", { count: frames.length })}
                  </p>
                  <button
                    onClick={() => void downloadAll()}
                    className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
                  >
                    {t("buttons.downloadAll")}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {frames.map((frame, i) => (
                    <div
                      key={i}
                      className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={frame.url} alt={`frame ${i + 1}`} className="max-h-32 w-full object-contain" />
                      <div className="space-y-1 p-2">
                        <p className="text-center font-mono text-[11px] text-zinc-500">
                          {fmtTime(frame.time)}
                        </p>
                        <button
                          onClick={() => downloadFrame(frame)}
                          className="w-full rounded bg-zinc-800 py-1.5 text-xs text-zinc-200 hover:bg-zinc-700"
                        >
                          {t("buttons.download")}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
