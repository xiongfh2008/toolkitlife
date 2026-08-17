"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { loadFFmpeg, readFFmpegOutput } from "@/lib/ffmpeg";

const VIDEO_FORMATS: { ext: string; mime: string; label: string; gif: boolean; args: (crf: number) => string[] }[] = [
  {
    ext: "mp4", mime: "video/mp4", label: "MP4", gif: false,
    args: (crf) => ["-c:v", "libx264", "-preset", "ultrafast", "-crf", String(crf), "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart"],
  },
  {
    ext: "webm", mime: "video/webm", label: "WebM", gif: false,
    args: (crf) => ["-c:v", "libvpx", "-crf", String(crf), "-b:v", "0", "-c:a", "libvorbis"],
  },
  {
    ext: "avi", mime: "video/x-msvideo", label: "AVI", gif: false,
    args: () => ["-c:v", "mpeg4", "-q:v", "5", "-c:a", "libmp3lame", "-b:a", "128k"],
  },
  {
    ext: "mov", mime: "video/quicktime", label: "MOV", gif: false,
    args: (crf) => ["-c:v", "libx264", "-preset", "ultrafast", "-crf", String(crf), "-c:a", "aac", "-b:a", "128k"],
  },
  {
    ext: "gif", mime: "image/gif", label: "GIF", gif: true,
    args: () => [],
  },
];

type Resolution = "original" | "1080" | "720" | "480";
type Step = "upload" | "settings" | "processing" | "done";

// Some common video containers (mkv/ts/flv/m2ts/wmv...) are reported by the
// browser with an empty MIME type when dragged in, so match on the extension
// as well; otherwise drag-and-drop silently rejects them.
const VIDEO_EXT_RE =
  /\.(mp4|mkv|avi|mov|flv|webm|m2ts|mts|ts|ogv|ogg|ogx|oga|mxf|m4v|3gp|3g2|wmv|asf|f4v|ismv|vob|divx)$/i;
const isVideoFile = (f: File) => f.type.startsWith("video/") || VIDEO_EXT_RE.test(f.name);

export default function VideoConverter() {
  const t = useTranslations("tools.video-converter");

  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [format, setFormat] = useState("mp4");
  const [crf, setCrf] = useState(28);
  const [resolution, setResolution] = useState<Resolution>("original");
  const [step, setStep] = useState<Step>("upload");
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [resultName, setResultName] = useState("");
  const [resultSize, setResultSize] = useState(0);
  const [info, setInfo] = useState({ duration: 0, width: 0, height: 0 });
  const [error, setError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleUpload = useCallback((f: File) => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(f);
    setVideoUrl(URL.createObjectURL(f));
    setStep("settings");
    setError("");
    setResultUrl("");
    setInfo({ duration: 0, width: 0, height: 0 });
  }, [videoUrl, resultUrl]);

  const selected = VIDEO_FORMATS.find((f) => f.ext === format)!;

  const convert = async () => {
    if (!file) return;
    setStep("processing");
    setProgress(0);
    setError("");
    let lastLog = "";
    try {
      const { fetchFile } = await import("@ffmpeg/util");
      setStatusMsg(t("processing.statusLoading"));
      const ffmpeg = await loadFFmpeg((p) => setProgress(Math.min(92, Math.round(p * 92))));
      ffmpeg.on("log", ({ message }) => {
        lastLog = message;
      });
      setStatusMsg(t("processing.statusConverting"));

      const ext = file.name.match(/\.[^.]+$/)?.[0] ?? ".mp4";
      const inputName = `input${ext}`;
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      const vf: string[] = [];
      if (resolution !== "original") vf.push(`scale=-2:${resolution}`);
      if (selected.gif) vf.push("fps=10");

      // Fast path: when the output container can hold the input video codec
      // (e.g. webm VP9 -> mp4, or VP9 mp4 -> webm), copy the video stream
      // instead of re-encoding it. MP4/MOV accept most codecs, so they always
      // try copying; WebM only accepts VP8/VP9/AV1, so probe the input codec
      // first. Re-encoding only happens for incompatible targets (GIF/AVI, or
      // H.264 video -> WebM). Falls back to a normal encode if the muxer
      // rejects the copy.
      const MUXABLE_WEBM = ["vp8", "vp9", "av1"];
      let inputVideoCodec = "";
      if (selected.ext === "webm") {
        const probeLogs: string[] = [];
        ffmpeg.on("log", ({ message }) => probeLogs.push(message));
        await ffmpeg.exec(["-i", inputName]).catch(() => {});
        inputVideoCodec = (probeLogs.join("\n").match(/Video:\s*([a-z0-9_]+)/i)?.[1] ?? "").toLowerCase();
      }
      const canFastCopy =
        resolution === "original" &&
        crf === 28 &&
        !selected.gif &&
        (selected.ext === "mp4" ||
          selected.ext === "mov" ||
          (selected.ext === "webm" && MUXABLE_WEBM.includes(inputVideoCodec)));

      const buildArgs = (fast: boolean): string[] => {
        const args: string[] = ["-i", inputName];
        if (selected.gif) {
          if (vf.length) args.push("-vf", vf.join(","));
          args.push("-y", "output.gif");
        } else if (fast) {
          // "?" makes the maps optional so inputs without a video/audio track
          // fail cleanly (ret != 0) instead of aborting on the stream map.
          args.push("-map", "0:v:0?", "-map", "0:a?", "-c:v", "copy", "-c:a", selected.ext === "webm" ? "libvorbis" : "aac", "-b:a", "128k");
          if (selected.ext === "mp4") args.push("-movflags", "+faststart");
          args.push("-y", `output.${selected.ext}`);
        } else {
          args.push(...selected.args(crf));
          if (vf.length) args.push("-vf", vf.join(","));
          args.push("-y", `output.${selected.ext}`);
        }
        return args;
      };

      if (selected.gif) {
        // Two-pass GIF encoding: build a dedicated 256-color palette first,
        // then apply it with dithering. This greatly reduces color banding
        // compared to ffmpeg's single-pass default palette.
        const chain = vf.join(",");
        const palRet = await ffmpeg.exec([
          "-i", inputName,
          "-vf", chain ? `${chain},palettegen=max_colors=256` : "palettegen=max_colors=256",
          "-y", "palette.png",
        ]);
        if (palRet !== 0) throw new Error(lastLog || "FFmpeg exited with an error");
        // sierra2_4a dithering spreads quantization error more evenly than
        // ffmpeg's default bayer pattern, producing smoother gradients.
        const gifRet = await ffmpeg.exec([
          "-i", inputName,
          "-i", "palette.png",
          "-lavfi", chain ? `${chain}[x];[x][1:v]paletteuse=dither=sierra2_4a` : "[0:v][1:v]paletteuse=dither=sierra2_4a",
          "-y", "output.gif",
        ]);
        if (gifRet !== 0) throw new Error(lastLog || "FFmpeg exited with an error");
      } else {
        let usedFast = false;
        if (canFastCopy) {
          const ret = await ffmpeg.exec(buildArgs(true));
          if (ret !== 0) {
            console.error("Fast copy failed, falling back to re-encode:", lastLog);
            await ffmpeg.deleteFile(`output.${selected.ext}`).catch(() => {});
          } else {
            usedFast = true;
          }
        }
        if (!usedFast) {
          const ret = await ffmpeg.exec(buildArgs(false));
          if (ret !== 0) throw new Error(lastLog || "FFmpeg exited with an error");
        }
      }

      setStatusMsg(t("processing.statusFinishing"));
      const blob = await readFFmpegOutput(ffmpeg, `output.${selected.ext}`, selected.mime);

      await ffmpeg.deleteFile(inputName).catch(() => {});
      await ffmpeg.deleteFile(`output.${selected.ext}`).catch(() => {});
      await ffmpeg.deleteFile("palette.png").catch(() => {});
      // Note: the shared engine is intentionally NOT terminated here — it is
      // cached in lib/ffmpeg.ts and reused by the next conversion for speed.

      if (blob.size < 100) throw new Error(t("errors.outputEmpty"));
      setResultSize(blob.size);
      setResultUrl(URL.createObjectURL(blob));
      setResultName(`${file.name.replace(/\.[^.]+$/, "")}.${selected.ext}`);
      setProgress(100);
      setStep("done");
    } catch (err) {
      console.error(err);
      const detail = lastLog ? `\n${t("errors.ffmpegDetail")}: ${lastLog.slice(-300)}` : "";
      setError(t("errors.prefix") + (err instanceof Error ? err.message : String(err)) + detail);
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
    b < 1024 * 1024 ? t("units.kb", { size: (b / 1024).toFixed(1) }) : t("units.mb", { size: (b / (1024 * 1024)).toFixed(1) });
  const fmtDur = (s: number) => {
    if (!s || !isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  };

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      category={t("category")}
      slug="video-converter"
      faqs={t.raw("faqs") as FAQ[]}
      relatedTools={t.raw("relatedTools") as RelatedTool[]}
      keywords={t.raw("keywords") as string[]}
      guide={
        <div className="space-y-4 text-sm text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-100">{t("guide.heading")}</h2>
          <ol className="list-inside list-decimal space-y-2">
            {(t.raw("guide.steps") as string[]).map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
      }
    >
      <div className="space-y-6">
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">{error}</div>
        )}

        {step === "upload" && (
          <div
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files[0];
              if (f && isVideoFile(f)) handleUpload(f);
            }}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("video-input")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-700 p-16 text-center transition-all hover:border-blue-500 hover:bg-zinc-900/50"
          >
            <div className="mb-4 text-5xl">🎬</div>
            <p className="mb-2 text-lg text-zinc-300">{t("upload.title")}</p>
            <p className="text-sm text-zinc-500">{t("upload.subtitle")}</p>
            <p className="mt-3 text-xs text-zinc-600">{t("upload.note")}</p>
            <input
              id="video-input"
              type="file"
              accept="video/*,.mkv,.m2ts,.mts,.ts,.flv,.wmv,.avi,.mov,.m4v,.3gp,.ogv,.asf,.vob,.divx,.mxf,.f4v,.ismv,.ogg"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            />
          </div>
        )}

        {step === "settings" && file && (
          <div className="space-y-6">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <video
                ref={videoRef}
                src={videoUrl}
                className="mx-auto max-h-72 w-full rounded-lg"
                controls
                preload="metadata"
                onLoadedMetadata={() =>
                  setInfo({
                    duration: videoRef.current?.duration || 0,
                    width: videoRef.current?.videoWidth || 0,
                    height: videoRef.current?.videoHeight || 0,
                  })
                }
              />
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-zinc-400">
                <span>{t("videoInfo.size")}: <strong className="text-zinc-200">{fmtSize(file.size)}</strong></span>
                <span>{t("videoInfo.duration")}: <strong className="text-zinc-200">{fmtDur(info.duration)}</strong></span>
                {info.width > 0 && <span>{t("videoInfo.resolution")}: <strong className="text-zinc-200">{info.width}×{info.height}</strong></span>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">{t("labels.outputFormat")}</label>
                <div className="flex flex-wrap gap-2">
                  {VIDEO_FORMATS.map((f) => (
                    <button
                      key={f.ext}
                      onClick={() => setFormat(f.ext)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                        format === f.ext ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">{t("resolution.label")}</label>
                <div className="flex flex-wrap gap-2">
                  {(["original", "1080", "720", "480"] as Resolution[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => setResolution(r)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                        resolution === r ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      {t(`resolution.options.${r}`)}
                    </button>
                  ))}
                </div>
              </div>
              {!selected.gif && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">{t("quality.label")}</label>
                  <input
                    type="range"
                    min={18}
                    max={40}
                    value={crf}
                    onChange={(e) => setCrf(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="mt-1 text-xs text-zinc-500">{t("quality.crfLabel", { crf })}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={convert}
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-500"
              >
                {t("buttons.convert")}
              </button>
              <button onClick={reset} className="rounded-lg bg-zinc-800 px-4 py-3 text-sm text-zinc-300 transition-colors hover:bg-zinc-700">
                {t("buttons.newFile")}
              </button>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-10 text-center">
            <div className="mb-4 text-5xl">⚙️</div>
            <h3 className="mb-2 text-xl font-semibold text-zinc-100">{t("processing.title")}</h3>
            <p className="mb-6 text-sm text-zinc-400">{statusMsg}</p>
            <div className="mx-auto max-w-md">
              <div className="mb-1 flex justify-between text-sm text-zinc-400">
                <span>{t("processing.label")}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
                <div className="h-full rounded-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <p className="mt-4 text-xs text-zinc-500">{t("processing.keepOpen")}</p>
          </div>
        )}

        {step === "done" && file && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
            <div className="mb-4 text-5xl">✅</div>
            <h3 className="mb-4 text-xl font-semibold text-zinc-100">{t("done.title")}</h3>
            <div className="mb-6 flex justify-center gap-8">
              <div>
                <p className="text-xs text-zinc-500">{t("done.original")}</p>
                <p className="text-lg font-mono text-zinc-300">{fmtSize(file.size)}</p>
              </div>
              <div className="text-2xl text-zinc-600">→</div>
              <div>
                <p className="text-xs text-zinc-500">{t("done.converted")}</p>
                <p className="text-lg font-mono text-green-400">{fmtSize(resultSize)}</p>
              </div>
            </div>
            {selected.gif ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={resultUrl} alt={t("done.previewNote")} className="mx-auto mb-6 max-h-72 rounded-lg" />
            ) : (
              <video src={resultUrl} controls className="mx-auto mb-6 max-h-72 w-full max-w-lg rounded-lg" />
            )}
            <div className="flex justify-center gap-3">
              <a
                href={resultUrl}
                download={resultName}
                className="inline-block rounded-lg bg-green-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-green-500"
              >
                {t("buttons.download")}
              </a>
              <button onClick={() => { setStep("settings"); setResultUrl(""); setError(""); }} className="rounded-lg bg-zinc-800 px-6 py-3 text-sm text-zinc-300 transition-colors hover:bg-zinc-700">
                {t("buttons.adjust")}
              </button>
              <button onClick={reset} className="rounded-lg bg-zinc-800 px-6 py-3 text-sm text-zinc-300 transition-colors hover:bg-zinc-700">
                {t("buttons.newFile")}
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
