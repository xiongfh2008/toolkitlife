"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { loadFFmpeg, readFFmpegOutput } from "@/lib/ffmpeg";

const FORMATS = [
  { ext: "mp3", mime: "audio/mpeg", label: "MP3" },
  { ext: "wav", mime: "audio/wav", label: "WAV" },
] as const;

function extOf(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return /^[a-z0-9]{1,5}$/.test(ext) ? ext : "audio";
}

export default function AudioMergePage() {
  const t = useTranslations("tools.audio-merge");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState<(typeof FORMATS)[number]["ext"]>("mp3");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState("");
  const [resultSize, setResultSize] = useState(0);
  const [error, setError] = useState("");

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const audio = Array.from(list).filter((f) => f.type.startsWith("audio/"));
    if (audio.length === 0) return;
    setError("");
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl("");
    setFiles((prev) => [...prev, ...audio]);
  };

  const removeFile = (i: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  };

  const move = (i: number, dir: -1 | 1) => {
    setFiles((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const merge = async () => {
    if (files.length < 2) return;
    setProcessing(true);
    setProgress(0);
    setError("");
    try {
      const { fetchFile } = await import("@ffmpeg/util");
      const ffmpeg = await loadFFmpeg((p) => setProgress(Math.min(95, Math.round(p * 95))));

      const names = files.map((f, i) => `input${i}.${extOf(f.name)}`);
      const args: string[] = [];
      for (let i = 0; i < files.length; i++) {
        await ffmpeg.writeFile(names[i], await fetchFile(files[i]));
        args.push("-i", names[i]);
      }

      const n = files.length;
      const chains = files.map((_, i) => `[${i}:a]aresample=44100,aformat=sample_fmts=fltp:channel_layouts=stereo[a${i}]`);
      const concatIn = files.map((_, i) => `[a${i}]`).join("");
      chains.push(`${concatIn}concat=n=${n}:v=0:a=1[aout]`);
      args.push("-filter_complex", chains.join(";"), "-map", "[aout]");
      if (format === "mp3") args.push("-c:a", "libmp3lame", "-b:a", "192k");
      else args.push("-c:a", "pcm_s16le");
      args.push("-y", `output.${format}`);

      await ffmpeg.exec(args);
      const out = FORMATS.find((f) => f.ext === format)!;
      const blob = await readFFmpegOutput(ffmpeg, `output.${format}`, out.mime);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
      setResultSize(blob.size);
    } catch {
      setError(t("errors.failed"));
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl("");
    setResultSize(0);
    setError("");
    setProgress(0);
    setFiles([]);
  };

  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none";

  return (
    <ToolLayout
      title={t("title")}
      slug="audio-merge"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-6">
        <label
          onDrop={(e) => {
            e.preventDefault();
            addFiles(e.dataTransfer.files);
          }}
          onDragOver={(e) => e.preventDefault()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 px-6 py-10 text-center transition-colors hover:border-blue-500"
        >
          <input type="file" accept="audio/*" multiple onChange={(e) => addFiles(e.target.files)} className="hidden" />
          <span className="text-3xl">🎚️</span>
          <span className="mt-2 text-sm text-zinc-300">{t("upload.drop")}</span>
          <span className="mt-1 text-xs text-zinc-500">{t("upload.formats")}</span>
        </label>

        {error && <p className="text-sm text-red-400">{error}</p>}

        {files.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-zinc-400">
              {t("labels.count", { count: files.length })}
            </p>
            <ol className="space-y-2">
              {files.map((f, i) => (
                <li key={`${f.name}-${i}`} className="flex items-center gap-2 rounded-lg border border-zinc-800 px-3 py-2">
                  <span className="text-xs text-zinc-500">{i + 1}.</span>
                  <span className="min-w-0 flex-1 truncate text-sm text-zinc-200">{f.name}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:border-zinc-500 disabled:opacity-40"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => move(i, 1)}
                      disabled={i === files.length - 1}
                      className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:border-zinc-500 disabled:opacity-40"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => removeFile(i)}
                      className="rounded border border-red-900/60 px-2 py-1 text-xs text-red-400 hover:border-red-500"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ol>

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

            {processing && (
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                <div className="h-full bg-blue-500 transition-all" style={{ width: `${progress}%` }} />
              </div>
            )}

            {resultUrl ? (
              <div className="space-y-3 rounded-lg border border-zinc-800 p-4">
                <audio controls src={resultUrl} className="w-full" />
                <div className="flex flex-wrap gap-2">
                  <a
                    href={resultUrl}
                    download={`merged.${format}`}
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
            ) : (
              <button
                onClick={merge}
                disabled={files.length < 2 || processing}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
              >
                {t("buttons.merge")}
              </button>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
