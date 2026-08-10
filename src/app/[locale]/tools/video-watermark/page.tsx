"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import { loadFFmpeg, readFFmpegOutput } from "@/lib/ffmpeg";

type WmType = "text" | "image";
type WmPosition = "tl" | "tr" | "bl" | "br" | "center";

const POSITIONS: WmPosition[] = ["tl", "tr", "bl", "br", "center"];

/** ffmpeg overlay expressions; W/H = main video, w/h = watermark. */
const POS_EXPR: Record<WmPosition, string> = {
  tl: "overlay=24:24",
  tr: "overlay=W-w-24:24",
  bl: "overlay=24:H-h-24",
  br: "overlay=W-w-24:H-h-24",
  center: "overlay=(W-w)/2:(H-h)/2",
};

export default function VideoWatermarkPage() {
  const t = useTranslations("tools.video-watermark");
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState({ width: 0, height: 0 });
  const videoRef = useRef<HTMLVideoElement>(null);

  const [wmType, setWmType] = useState<WmType>("text");
  const [text, setText] = useState("");
  const [fontPct, setFontPct] = useState(3);
  const [color, setColor] = useState("#ffffff");
  const [opacity, setOpacity] = useState(60);
  const [position, setPosition] = useState<WmPosition>("br");
  const [wmImage, setWmImage] = useState<HTMLImageElement | null>(null);
  const [wmImagePct, setWmImagePct] = useState(15);

  const [step, setStep] = useState<"upload" | "settings" | "processing" | "done">("upload");
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState("");

  const handleUpload = useCallback(
    (f: File) => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setFile(f);
      setVideoUrl(URL.createObjectURL(f));
      setResultUrl("");
      setError("");
      setStep("settings");
    },
    [videoUrl, resultUrl]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const f = e.dataTransfer.files[0];
      if (f && f.type.startsWith("video/")) handleUpload(f);
    },
    [handleUpload]
  );

  const onVideoMeta = () => {
    const v = videoRef.current;
    if (v) setVideoInfo({ width: v.videoWidth, height: v.videoHeight });
  };

  const loadWmImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const img = new Image();
    img.onload = () => setWmImage(img);
    img.src = URL.createObjectURL(f);
  };

  /** Renders the watermark (text or image) onto a transparent PNG at video resolution. */
  const renderWatermarkPng = (): Promise<Blob | null> =>
    new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(null);

      if (wmType === "text") {
        if (!text.trim()) {
          setError(t("labels.errorText"));
          return resolve(null);
        }
        const size = Math.max(12, Math.round((videoInfo.width * fontPct) / 100));
        const font = `600 ${size}px system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif`;
        ctx.font = font;
        const tw = ctx.measureText(text).width;
        canvas.width = Math.ceil(tw);
        canvas.height = Math.ceil(size * 1.4);
        const c2 = canvas.getContext("2d");
        if (!c2) return resolve(null);
        c2.font = font;
        c2.textBaseline = "middle";
        c2.globalAlpha = opacity / 100;
        c2.fillStyle = color;
        c2.fillText(text, 0, canvas.height / 2);
      } else {
        if (!wmImage) {
          setError(t("labels.errorImage"));
          return resolve(null);
        }
        const w = Math.max(8, Math.round((videoInfo.width * wmImagePct) / 100));
        const h = Math.max(
          8,
          Math.round((w * wmImage.naturalHeight) / wmImage.naturalWidth)
        );
        canvas.width = w;
        canvas.height = h;
        ctx.globalAlpha = opacity / 100;
        ctx.drawImage(wmImage, 0, 0, w, h);
      }
      canvas.toBlob(resolve, "image/png");
    });

  const process = async () => {
    if (!file) return;
    if (videoInfo.width === 0) {
      setError(t("labels.errorGeneric"));
      return;
    }
    const wmBlob = await renderWatermarkPng();
    if (!wmBlob) return;

    setStep("processing");
    setProgress(0);
    setError("");
    try {
      const ffmpeg = await loadFFmpeg((p) =>
        setProgress(Math.min(92, Math.round(p * 92)))
      );
      const { fetchFile } = await import("@ffmpeg/util");
      await ffmpeg.writeFile("input.mp4", await fetchFile(file));
      await ffmpeg.writeFile("wm.png", await fetchFile(new File([wmBlob], "wm.png")));

      // Watermark PNG already has final pixel size + alpha; overlay it.
      const filter =
        `[1:v]format=rgba[wm];[0:v][wm]${POS_EXPR[position]},format=yuv420p[v]`;
      await ffmpeg.exec([
        "-i", "input.mp4",
        "-i", "wm.png",
        "-filter_complex", filter,
        "-map", "[v]",
        "-map", "0:a?",
        "-c:v", "libx264", "-preset", "ultrafast", "-crf", "23",
        "-c:a", "aac", "-b:a", "128k",
        "-movflags", "+faststart",
        "-y", "output.mp4",
      ]);

      setProgress(96);
      const blob = await readFFmpegOutput(ffmpeg, "output.mp4", "video/mp4");
      await ffmpeg.deleteFile("input.mp4").catch(() => {});
      await ffmpeg.deleteFile("wm.png").catch(() => {});
      await ffmpeg.deleteFile("output.mp4").catch(() => {});
      ffmpeg.terminate();

      setResultUrl(URL.createObjectURL(blob));
      setProgress(100);
      setStep("done");
    } catch (err) {
      console.error(err);
      setError(t("labels.errorGeneric"));
      setStep("settings");
    }
  };

  const fmtDur = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  };
  const fmtSize = (b: number) =>
    b < 1024 * 1024
      ? t("units.kb", { size: (b / 1024).toFixed(1) })
      : t("units.mb", { size: (b / (1024 * 1024)).toFixed(1) });

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors";

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="video-watermark"
    >
      {step === "upload" && (
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById("wm-video-input")?.click()}
          className="border-2 border-dashed border-zinc-600 rounded-xl p-16 text-center cursor-pointer hover:border-zinc-500 transition-colors"
        >
          <div className="text-4xl mb-4">{t("upload.icon")}</div>
          <p className="text-zinc-300 font-medium">{t("upload.title")}</p>
          <p className="text-zinc-500 text-sm mt-1">{t("upload.subtitle")}</p>
          <input
            id="wm-video-input"
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
          />
        </div>
      )}

      {step === "settings" && file && (
        <div className="space-y-6">
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4">
            <video
              ref={videoRef}
              src={videoUrl}
              onLoadedMetadata={onVideoMeta}
              className="w-full max-h-64 rounded-lg mb-3"
              controls
            />
            <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
              <span>
                {t("videoInfo.size")}:{" "}
                <strong className="text-zinc-200">{fmtSize(file.size)}</strong>
              </span>
              {videoInfo.width > 0 && (
                <span>
                  {t("videoInfo.resolution")}:{" "}
                  <strong className="text-zinc-200">
                    {videoInfo.width}×{videoInfo.height}
                  </strong>
                </span>
              )}
            </div>
          </div>

          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 space-y-5">
            {/* Watermark type */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                {t("labels.watermarkType")}
              </label>
              <div className="grid grid-cols-2 gap-2 max-w-xs">
                {(["text", "image"] as WmType[]).map((wt) => (
                  <button
                    key={wt}
                    onClick={() => setWmType(wt)}
                    className={`${btn} ${wmType === wt ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}
                  >
                    {t(`labels.types.${wt}`)}
                  </button>
                ))}
              </div>
            </div>

            {wmType === "text" ? (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    {t("labels.textContent")}
                  </label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={t("labels.textPlaceholder")}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    {t("labels.fontSize")}
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={0.5}
                    value={fontPct}
                    onChange={(e) => setFontPct(Number(e.target.value))}
                    className="w-full mt-2"
                  />
                  <span className="text-xs text-zinc-500">{fontPct}%</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    {t("labels.color")}
                  </label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-9 w-full rounded-lg border border-zinc-700 bg-zinc-900 cursor-pointer"
                  />
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    {t("labels.uploadWm")}
                  </label>
                  <input
                    type="file"
                    accept="image/png,image/webp,image/svg+xml"
                    onChange={loadWmImage}
                    className="block w-full text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-500"
                  />
                  {wmImage && (
                    <p className="mt-2 text-xs text-zinc-500">
                      {wmImage.naturalWidth}×{wmImage.naturalHeight}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    {t("labels.size")}
                  </label>
                  <input
                    type="range"
                    min={5}
                    max={50}
                    step={1}
                    value={wmImagePct}
                    onChange={(e) => setWmImagePct(Number(e.target.value))}
                    className="w-full mt-2"
                  />
                  <span className="text-xs text-zinc-500">{wmImagePct}%</span>
                </div>
              </div>
            )}

            {/* Shared controls */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  {t("labels.opacity")}
                </label>
                <input
                  type="range"
                  min={5}
                  max={100}
                  step={1}
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full mt-2"
                />
                <span className="text-xs text-zinc-500">{opacity}%</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  {t("labels.position")}
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {POSITIONS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPosition(p)}
                      className={`rounded-lg text-xs py-1.5 transition-colors ${
                        position === p
                          ? "bg-blue-600 text-white"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      {t(`labels.positions.${p}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={process}
              className="px-6 py-3 rounded-lg font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              {t("buttons.process")}
            </button>
            <button
              onClick={() => {
                setStep("upload");
                setFile(null);
                setError("");
              }}
              className="px-4 py-3 rounded-lg font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
            >
              {t("buttons.newVideo")}
            </button>
          </div>
        </div>
      )}

      {step === "processing" && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🎬</div>
          <h3 className="text-xl font-semibold text-zinc-100 mb-2">
            {t("processing.title")}
          </h3>
          <p className="text-zinc-400 mb-6">{t("processing.subtitle")}</p>
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-zinc-400 mb-1">
              <span>{t("processing.label")}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <p className="text-zinc-500 text-sm mt-4">{t("processing.keepOpen")}</p>
        </div>
      )}

      {step === "done" && file && (
        <div className="text-center py-8">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-zinc-100 mb-4">
            {t("done.title")}
          </h3>
          <video src={resultUrl} className="max-w-lg mx-auto rounded-lg mb-6" controls />
          <div className="flex justify-center gap-3">
            <a
              href={resultUrl}
              download={`watermarked-${file.name}`}
              className="px-6 py-3 rounded-lg font-medium bg-green-600 hover:bg-green-500 text-white transition-colors inline-block"
            >
              {t("buttons.download")}
            </a>
            <button
              onClick={() => {
                setStep("settings");
                setResultUrl("");
              }}
              className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700 py-3`}
            >
              {t("buttons.adjust")}
            </button>
            <button
              onClick={() => {
                setStep("upload");
                setFile(null);
                setResultUrl("");
              }}
              className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700 py-3`}
            >
              {t("buttons.newVideo")}
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
