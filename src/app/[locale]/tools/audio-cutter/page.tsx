"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { loadFFmpeg, readFFmpegOutput } from "@/lib/ffmpeg";
import { computePeaks, decodeAudioFile, drawWaveform, formatTime } from "@/lib/audio";

const FORMATS = [
  { ext: "mp3", mime: "audio/mpeg", label: "MP3" },
  { ext: "wav", mime: "audio/wav", label: "WAV" },
] as const;

type Step = "upload" | "ready" | "processing" | "done";

function extOf(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return /^[a-z0-9]{1,5}$/.test(ext) ? ext : "audio";
}

export default function AudioCutterPage() {
  const t = useTranslations("tools.audio-cutter");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [peaks, setPeaks] = useState<number[]>([]);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [format, setFormat] = useState<(typeof FORMATS)[number]["ext"]>("mp3");
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState("");
  const [resultSize, setResultSize] = useState(0);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadFile = useCallback(
    async (f: File) => {
      if (!f.type.startsWith("audio/")) return;
      setError("");
      setResultUrl("");
      try {
        const buf = await decodeAudioFile(f);
        setFile(f);
        setPeaks(computePeaks(buf.getChannelData(0), 1200));
        setDuration(buf.duration);
        setStart(0);
        setEnd(buf.duration);
        setStep("ready");
      } catch {
        setError(t("errors.decode"));
      }
    },
    [t]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) void loadFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) void loadFile(f);
  };

  useEffect(() => {
    if (canvasRef.current && peaks.length > 0) {
      drawWaveform(canvasRef.current, peaks, {
        selectionStart: start / Math.max(0.001, duration),
        selectionEnd: end / Math.max(0.001, duration),
      });
    }
  }, [peaks, start, end, duration]);

  const trim = async () => {
    if (!file || end <= start) return;
    setStep("processing");
    setProgress(0);
    setError("");
    try {
      const { fetchFile } = await import("@ffmpeg/util");
      const ffmpeg = await loadFFmpeg((p) => setProgress(Math.min(95, Math.round(p * 95))));
      const ext = extOf(file.name);
      await ffmpeg.writeFile(`input.${ext}`, await fetchFile(file));
      const args = ["-ss", start.toFixed(3), "-i", `input.${ext}`, "-t", (end - start).toFixed(3)];
      if (format === "mp3") args.push("-c:a", "libmp3lame", "-b:a", "192k");
      else args.push("-c:a", "pcm_s16le");
      args.push("-y", `output.${format}`);
      await ffmpeg.exec(args);
      const out = FORMATS.find((f) => f.ext === format)!;
      const blob = await readFFmpegOutput(ffmpeg, `output.${format}`, out.mime);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setResultSize(blob.size);
      setStep("done");
    } catch {
      setError(t("errors.failed"));
      setStep("ready");
    }
  };

  const reset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl("");
    setResultSize(0);
    setError("");
    setProgress(0);
    setFile(null);
    setPeaks([]);
    setDuration(0);
    setStep("upload");
  };

  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none";

  return (
    <ToolLayout
      title={t("title")}
      slug="audio-cutter"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-6">
        {step === "upload" && (
          <label
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 px-6 py-10 text-center transition-colors hover:border-blue-500"
          >
            <input type="file" accept="audio/*" onChange={handleChange} className="hidden" />
            <span className="text-3xl">✂️</span>
            <span className="mt-2 text-sm text-zinc-300">{t("upload.drop")}</span>
            <span className="mt-1 text-xs text-zinc-500">{t("upload.formats")}</span>
          </label>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}

        {(step === "ready" || step === "processing" || step === "done") && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="max-w-[220px] truncate font-medium text-zinc-200">{file?.name}</span>
              <span className="text-zinc-400">{t("labels.totalDuration")}: {formatTime(duration)}</span>
            </div>

            <canvas ref={canvasRef} className="h-32 w-full rounded-lg" />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">
                  {t("labels.start")}: {formatTime(start)}
                </label>
                <input
                  type="range"
                  min={0}
                  max={Math.max(0, duration - 0.1)}
                  step={0.1}
                  value={Math.min(start, Math.max(0, duration - 0.1))}
                  onChange={(e) => setStart(Math.min(Number(e.target.value), end - 0.1))}
                  className="w-full accent-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">
                  {t("labels.end")}: {formatTime(end)}
                </label>
                <input
                  type="range"
                  min={0}
                  max={duration}
                  step={0.1}
                  value={end}
                  onChange={(e) => setEnd(Math.max(Number(e.target.value), start + 0.1))}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.outputFormat")}</label>
              <select value={format} onChange={(e) => setFormat(e.target.value as (typeof FORMATS)[number]["ext"])} className={inputCls}>
                {FORMATS.map((f) => (
                  <option key={f.ext} value={f.ext}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {step === "processing" && (
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                <div className="h-full bg-blue-500 transition-all" style={{ width: `${progress}%` }} />
              </div>
            )}

            {step === "done" && resultUrl && (
              <div className="space-y-3 rounded-lg border border-zinc-800 p-4">
                <audio controls src={resultUrl} className="w-full" />
                <div className="flex flex-wrap gap-2">
                  <a
                    href={resultUrl}
                    download={`cut-${start.toFixed(0)}-${end.toFixed(0)}.${format}`}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                  >
                    {t("buttons.download")}
                  </a>
                  <button onClick={reset} className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:border-zinc-500">
                    {t("buttons.reset")}
                  </button>
                </div>
                <p className="text-xs text-zinc-500">
                  {t("labels.resultSize")}: {(resultSize / 1024).toFixed(0)} KB
                </p>
              </div>
            )}

            {step !== "done" && (
              <button
                onClick={trim}
                disabled={end <= start}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
              >
                {t("buttons.cut")}
              </button>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
