"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

export default function VideoThumbnailPage() {
  const t = useTranslations("tools.video-thumbnail");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [videoSrc, setVideoSrc] = useState("");
  const [videoName, setVideoName] = useState("video");
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(4);
  const [thumbWidth, setThumbWidth] = useState(240);
  const [showTime, setShowTime] = useState(true);
  const [ready, setReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resultUrlRef = useRef("");

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("video/")) return;
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = "";
    // Clear any previous thumbnail canvas so no stale content lingers.
    const canvas = canvasRef.current;
    if (canvas) canvas.width = canvas.width;
    setVideoName(file.name.replace(/\.[^.]+$/, ""));
    setVideoSrc(URL.createObjectURL(file));
    setReady(false);
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

  const generate = useCallback(async () => {
    if (!video) return;
    setProcessing(true);
    setError("");
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    try {
      const duration = video.duration || 0;
      const total = rows * cols;
      const th = Math.max(1, Math.round((thumbWidth * video.videoHeight) / Math.max(1, video.videoWidth)));
      const labelH = showTime ? 24 : 0;
      const cellH = th + labelH;
      canvas.width = thumbWidth * cols;
      canvas.height = cellH * rows;

      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < total; i++) {
        const time = duration * (i / (total - 1 || 1));
        await seekTo(video, time);
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = col * thumbWidth;
        const y = row * cellH;
        ctx.drawImage(video, x, y, thumbWidth, th);
        if (showTime) {
          ctx.fillStyle = "#18181b";
          ctx.fillRect(x, y + th, thumbWidth, labelH);
          ctx.fillStyle = "#a1a1aa";
          ctx.font = "12px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const m = Math.floor(time / 60);
          const s = String(Math.floor(time % 60)).padStart(2, "0");
          ctx.fillText(`${m}:${s}`, x + thumbWidth / 2, y + th + labelH / 2);
        }
      }

      canvas.toBlob((blob) => {
        if (!blob) return;
        if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
        resultUrlRef.current = URL.createObjectURL(blob);
        setReady(true);
        setProcessing(false);
      }, "image/png");
    } catch (err) {
      console.error(err);
      setError(t("errors.process"));
      setProcessing(false);
    }
  }, [video, rows, cols, thumbWidth, showTime, seekTo, t]);

  const download = () => {
    if (!resultUrlRef.current) return;
    const a = document.createElement("a");
    a.href = resultUrlRef.current;
    a.download = `${videoName}-thumbnails.png`;
    a.click();
  };

  const reset = () => {
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = "";
    setVideoSrc("");
    setReady(false);
    setError("");
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      slug="video-thumbnail"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="max-w-4xl space-y-4">
        {!videoSrc ? (
          <div
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files?.[0];
              if (f) handleFile(f);
            }}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("vt-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">🖼️</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input
              id="vt-in"
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

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm text-zinc-400">
                  {t("labels.rows")}: {rows}
                </label>
                <input
                  type="range"
                  min={1}
                  max={8}
                  value={rows}
                  onChange={(e) => { setRows(parseInt(e.target.value, 10)); setReady(false); }}
                  className="w-full accent-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-zinc-400">
                  {t("labels.cols")}: {cols}
                </label>
                <input
                  type="range"
                  min={1}
                  max={6}
                  value={cols}
                  onChange={(e) => { setCols(parseInt(e.target.value, 10)); setReady(false); }}
                  className="w-full accent-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-zinc-400">
                  {t("labels.thumbWidth")}: {thumbWidth}px
                </label>
                <input
                  type="range"
                  min={120}
                  max={400}
                  step={10}
                  value={thumbWidth}
                  onChange={(e) => { setThumbWidth(parseInt(e.target.value, 10)); setReady(false); }}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={showTime}
                onChange={(e) => { setShowTime(e.target.checked); setReady(false); }}
                className="h-4 w-4 accent-blue-500"
              />
              {t("labels.showTime")}
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => void generate()}
                disabled={processing}
                className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
              >
                {processing ? t("status.processing") : t("buttons.generate")}
              </button>
              <button
                onClick={download}
                disabled={!ready}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
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

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className={ready ? "overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4" : "hidden"}>
              <canvas ref={canvasRef} className="w-full" />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
