"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { encodeGif } from "@/lib/gif-encoder";

// Some common video containers (mkv/ts/flv/m2ts/wmv...) are reported by the
// browser with an empty MIME type when dragged in, so match on the extension
// as well; otherwise drag-and-drop silently rejects them.
const VIDEO_EXT_RE =
  /\.(mp4|mkv|avi|mov|flv|webm|m2ts|mts|ts|ogv|ogg|ogx|oga|mxf|m4v|3gp|3g2|wmv|asf|f4v|ismv|vob|divx)$/i;
const isVideoFile = (f: File) => f.type.startsWith("video/") || VIDEO_EXT_RE.test(f.name);

export default function VideoToGifPage() {
  const t = useTranslations("tools.video-to-gif");
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [gifSize, setGifSize] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fps, setFps] = useState(10);
  const [width, setWidth] = useState(480);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(5);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const handleFile = useCallback((file: File) => {
    if (!isVideoFile(file)) return;
    setVideoFile(file);
    setGifUrl(null);
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
  }, []);

  const onVideoLoaded = useCallback(() => {
    if (!videoRef.current) return;
    const dur = videoRef.current.duration;
    setDuration(dur);
    setEndTime(Math.min(dur, 5));
  }, []);

  const convertToGif = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setProcessing(true);
    setProgress(0);
    setGifUrl(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;

    // Calculate dimensions
    const scale = width / video.videoWidth;
    const height = Math.round(video.videoHeight * scale);
    canvas.width = width;
    canvas.height = height;

    const totalFrames = Math.ceil((endTime - startTime) * fps);
    if (totalFrames <= 0) {
      setProcessing(false);
      setProgress(0);
      return;
    }

    const delay = 1000 / fps;
    const frames: ImageData[] = [];

    // Extract frames
    for (let i = 0; i < totalFrames; i++) {
      const time = startTime + i / fps;
      video.currentTime = time;
      await new Promise<void>((resolve) => {
        video.onseeked = () => resolve();
      });
      // High-quality downscale; resizing the canvas above resets the 2D
      // context state, so set smoothing before every draw.
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(video, 0, 0, width, height);
      frames.push(ctx.getImageData(0, 0, width, height));
      setProgress(Math.round(((i + 1) / totalFrames) * 50));
    }

    // Encode GIF using shared encoder
    const gif = encodeGif(frames.map((f) => ({ imageData: f, delayMs: delay })));
    const blob = new Blob([gif.buffer as ArrayBuffer], { type: "image/gif" });
    setGifUrl(URL.createObjectURL(blob));
    setGifSize(blob.size);
    setProgress(100);
    setProcessing(false);
  }, [width, fps, startTime, endTime]);

  const download = useCallback(() => {
    if (!gifUrl) return;
    const a = document.createElement("a");
    a.href = gifUrl;
    a.download = `${videoFile?.name?.replace(/\.[^.]+$/, "") || "video"}.gif`;
    a.click();
  }, [gifUrl, videoFile]);

  return (
    <ToolLayout
      title={t("title")}
      slug="video-to-gif"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-5">
        <canvas ref={canvasRef} className="hidden" />

        {!videoSrc ? (
          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files[0];
              if (f && isVideoFile(f)) handleFile(f);
            }}
            className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-800/50 p-12 cursor-pointer hover:border-zinc-500 transition-colors"
          >
            <span className="text-4xl">{t("upload.icon")}</span>
            <span className="text-sm text-zinc-400">{t("upload.drop")}</span>
            <span className="text-xs text-zinc-500">{t("upload.formats")}</span>
            <input
              type="file"
              accept="video/*,.mkv,.m2ts,.mts,.ts,.flv,.wmv,.avi,.mov,.m4v,.3gp,.ogv,.asf,.vob,.divx,.mxf,.f4v,.ismv,.ogg"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </label>
        ) : (
          <>
            <video
              ref={videoRef}
              src={videoSrc}
              onLoadedMetadata={onVideoLoaded}
              controls
              playsInline
              className="w-full rounded-lg bg-black aspect-video"
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">{t("labels.start")}</label>
                <input
                  type="number"
                  min={0}
                  max={endTime - 0.1}
                  step={0.1}
                  value={startTime}
                  onChange={(e) => setStartTime(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">{t("labels.end")}</label>
                <input
                  type="number"
                  min={startTime + 0.1}
                  max={duration}
                  step={0.1}
                  value={endTime}
                  onChange={(e) => setEndTime(parseFloat(e.target.value) || 5)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">{t("labels.width")}</label>
                <select
                  value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value))}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
                >
                  <option value={320}>320</option>
                  <option value={480}>480</option>
                  <option value={640}>640</option>
                  <option value={800}>800</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">{t("labels.fps")}</label>
                <select
                  value={fps}
                  onChange={(e) => setFps(parseInt(e.target.value))}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>

            <div className="text-xs text-zinc-500 text-center">
              {t("duration", { duration: (endTime - startTime).toFixed(1), frames: Math.ceil((endTime - startTime) * fps) })}
            </div>

            {processing ? (
              <div className="space-y-2">
                <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-zinc-400 text-center">
                  {t(progress < 50 ? "progress.extracting" : "progress.encoding")} {progress}%
                </p>
              </div>
            ) : (
              <button
                onClick={convertToGif}
                className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
              >
                {t("buttons.convert")}
              </button>
            )}

            {gifUrl && (
              <div className="space-y-4 border-t border-zinc-700 pt-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={gifUrl} alt={t("result.alt")} className="w-full rounded-lg" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">
                    {t("result.size", { size: (gifSize / (1024 * 1024)).toFixed(2) })}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setVideoSrc(null); setVideoFile(null); setGifUrl(null); }}
                      className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-sm font-medium text-zinc-200 transition-colors"
                    >
                      {t("buttons.newVideo")}
                    </button>
                    <button
                      onClick={download}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium text-white transition-colors"
                    >
                      {t("buttons.download")}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
}
