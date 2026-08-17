"use client";

import { useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { loadFFmpeg, readFFmpegOutput } from "@/lib/ffmpeg";

const AUDIO_FORMATS: { ext: string; mime: string; label: string; lossless: boolean; codec: (bitrate: number) => string[] }[] = [
  { ext: "mp3", mime: "audio/mpeg", label: "MP3", lossless: false, codec: (b) => ["-c:a", "libmp3lame", "-b:a", `${b}k`] },
  { ext: "wav", mime: "audio/wav", label: "WAV", lossless: true, codec: () => ["-c:a", "pcm_s16le"] },
  { ext: "flac", mime: "audio/flac", label: "FLAC", lossless: true, codec: () => ["-c:a", "flac"] },
  { ext: "ogg", mime: "audio/ogg", label: "OGG", lossless: false, codec: (b) => ["-c:a", "libvorbis", "-b:a", `${b}k`] },
  { ext: "m4a", mime: "audio/mp4", label: "M4A", lossless: false, codec: (b) => ["-c:a", "aac", "-b:a", `${b}k`] },
  { ext: "opus", mime: "audio/ogg", label: "OPUS", lossless: false, codec: (b) => ["-c:a", "libopus", "-b:a", `${b}k`] },
  { ext: "aiff", mime: "audio/aiff", label: "AIFF", lossless: true, codec: () => ["-c:a", "pcm_s16be"] },
];

const BITRATES: Record<"low" | "medium" | "high" | "best", number> = { low: 96, medium: 160, high: 256, best: 320 };

type Quality = "low" | "medium" | "high" | "best";
type Step = "upload" | "settings" | "processing" | "done";

export default function AudioConverter() {
  const t = useTranslations("tools.audio-converter");

  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [format, setFormat] = useState("mp3");
  const [quality, setQuality] = useState<Quality>("medium");
  const [step, setStep] = useState<Step>("upload");
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [resultName, setResultName] = useState("");
  const [resultSize, setResultSize] = useState(0);
  const [info, setInfo] = useState({ duration: 0 });
  const [error, setError] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleUpload = useCallback((f: File) => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(f);
    setAudioUrl(URL.createObjectURL(f));
    setStep("settings");
    setError("");
    setResultUrl("");
    setInfo({ duration: 0 });
  }, [audioUrl, resultUrl]);

  const selected = AUDIO_FORMATS.find((f) => f.ext === format)!;

  const convert = async () => {
    if (!file) return;
    setStep("processing");
    setProgress(0);
    setError("");
    try {
      const { fetchFile } = await import("@ffmpeg/util");
      const ffmpeg = await loadFFmpeg((p) => setProgress(Math.min(92, Math.round(p * 92))));
      setStatusMsg(t("processing.statusConverting"));

      const ext = file.name.match(/\.[^.]+$/)?.[0] ?? ".mp3";
      const inputName = `input${ext}`;
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      const args: string[] = ["-i", inputName];
      args.push(...selected.codec(selected.lossless ? 0 : BITRATES[quality]));
      args.push("-y", `output.${selected.ext}`);
      await ffmpeg.exec(args);

      setStatusMsg(t("processing.statusFinishing"));
      const blob = await readFFmpegOutput(ffmpeg, `output.${selected.ext}`, selected.mime);

      await ffmpeg.deleteFile(inputName).catch(() => {});
      await ffmpeg.deleteFile(`output.${selected.ext}`).catch(() => {});

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
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setAudioUrl("");
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
      slug="audio-converter"
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
              if (f && f.type.startsWith("audio/")) handleUpload(f);
            }}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("audio-input")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-700 p-16 text-center transition-all hover:border-blue-500 hover:bg-zinc-900/50"
          >
            <div className="mb-4 text-5xl">🎵</div>
            <p className="mb-2 text-lg text-zinc-300">{t("upload.title")}</p>
            <p className="text-sm text-zinc-500">{t("upload.subtitle")}</p>
            <input
              id="audio-input"
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            />
          </div>
        )}

        {step === "settings" && file && (
          <div className="space-y-6">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <audio
                ref={audioRef}
                src={audioUrl}
                className="w-full"
                controls
                preload="metadata"
                onLoadedMetadata={() => setInfo({ duration: audioRef.current?.duration || 0 })}
              />
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-zinc-400">
                <span>{t("audioInfo.size")}: <strong className="text-zinc-200">{fmtSize(file.size)}</strong></span>
                <span>{t("audioInfo.duration")}: <strong className="text-zinc-200">{fmtDur(info.duration)}</strong></span>
                <span>{t("audioInfo.format")}: <strong className="text-zinc-200">{file.name.split(".").pop()?.toUpperCase()}</strong></span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">{t("labels.outputFormat")}</label>
                <div className="flex flex-wrap gap-2">
                  {AUDIO_FORMATS.map((f) => (
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
                <label className="mb-2 block text-sm font-medium text-zinc-300">{t("quality.label")}</label>
                {selected.lossless ? (
                  <p className="text-sm text-zinc-500">{t("quality.losslessNote")}</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {(["low", "medium", "high", "best"] as Quality[]).map((q) => (
                      <button
                        key={q}
                        onClick={() => setQuality(q)}
                        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                          quality === q ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        }`}
                      >
                        {t(`quality.options.${q}`)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
            <audio src={resultUrl} controls className="mx-auto mb-6 w-full max-w-lg" />
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
