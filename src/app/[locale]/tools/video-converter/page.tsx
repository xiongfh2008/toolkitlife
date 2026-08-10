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
    try {
      const { fetchFile } = await import("@ffmpeg/util");
      const ffmpeg = await loadFFmpeg((p) => setProgress(Math.min(92, Math.round(p * 92))));
      setStatusMsg(t("processing.statusConverting"));

      const ext = file.name.match(/\.[^.]+$/)?.[0] ?? ".mp4";
      const inputName = `input${ext}`;
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      const vf: string[] = [];
      if (resolution !== "original") vf.push(`scale=-2:${resolution}`);
      if (selected.gif) vf.push("fps=10");

      const args: string[] = ["-i", inputName];
      if (selected.gif) {
        if (vf.length) args.push("-vf", vf.join(","));
        args.push("-y", "output.gif");
      } else {
        args.push(...selected.args(crf));
        if (vf.length) args.push("-vf", vf.join(","));
        args.push("-y", `output.${selected.ext}`);
      }
      await ffmpeg.exec(args);

      setStatusMsg(t("processing.statusFinishing"));
      const blob = await readFFmpegOutput(ffmpeg, `output.${selected.ext}`, selected.mime);

      await ffmpeg.deleteFile(inputName).catch(() => {});
      await ffmpeg.deleteFile(`output.${selected.ext}`).catch(() => {});
      ffmpeg.terminate();

      if (blob.size < 100) throw new Error(t("errors.outputEmpty"));
      setResultSize(blob.size);
      setResultUrl(URL.createObjectURL(blob));
      setResultName(`${file.name.replace(/\.[^.]+$/, "")}.${selected.ext}`);
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
    b < 1024 * 1024 ? t("units.kb", { size: (b / 1024).toFixed(1) }) : t("units.mb", { size: (b / (1024 * 1024)).toFixed(1) });
  const fmtDur = (s: number) => {
    if (!s) return "0:00";
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
              if (f && f.type.startsWith("video/")) handleUpload(f);
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
              accept="video/*"
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
