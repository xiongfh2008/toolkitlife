"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { loadFFmpeg, readFFmpegOutput } from "@/lib/ffmpeg";

type Step = "upload" | "ready" | "processing" | "done";

interface Vid {
  id: string;
  name: string;
  url: string;
  duration: number;
}

let uid = 0;
const nextId = () => `vid-${Date.now()}-${uid++}`;

function fmt(s: number): string {
  if (!Number.isFinite(s)) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

export default function VideoJoinerPage() {
  const t = useTranslations("tools.video-joiner");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [step, setStep] = useState<Step>("upload");
  const [videos, setVideos] = useState<Vid[]>([]);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"load" | "merge">("load");
  const [resultUrl, setResultUrl] = useState("");
  const [resultSize, setResultSize] = useState(0);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("video/")) return;
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.preload = "metadata";
    v.onloadedmetadata = () => {
      setVideos((prev) => [
        ...prev,
        { id: nextId(), name: file.name, url, duration: v.duration },
      ]);
      setStep("ready");
    };
    v.src = url;
  }, []);

  const handleFiles = (files: FileList | File[]) => {
    for (const f of Array.from(files)) loadFile(f);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) handleFiles(e.target.files);
    // Reset so selecting the same file again still fires the change event.
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  const remove = (id: string) => {
    setVideos((prev) => {
      const target = prev.find((v) => v.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((v) => v.id !== id);
    });
  };

  const move = (idx: number, dir: -1 | 1) => {
    setVideos((prev) => {
      const next = [...prev];
      const j = idx + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
  };

  const reset = () => {
    videos.forEach((v) => URL.revokeObjectURL(v.url));
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setVideos([]);
    setResultUrl("");
    setResultSize(0);
    setError("");
    setProgress(0);
    setStep("upload");
  };

  const join = async () => {
    if (videos.length < 2) return;
    setStep("processing");
    setProgress(0);
    setPhase("load");
    setError("");
    try {
      const { fetchFile } = await import("@ffmpeg/util");
      const ffmpeg = await loadFFmpeg((p) =>
        setProgress(Math.min(95, Math.round(p * 95)))
      );
      for (let i = 0; i < videos.length; i++) {
        await ffmpeg.writeFile(`${i}.mp4`, await fetchFile(videos[i].url));
      }
      // No per-step progress callback from ffmpeg.exec, so switch to an
      // indeterminate "merging" indicator while the actual merge runs.
      setPhase("merge");

      let succeeded = false;
      // Attempt 1 — concat demuxer with stream copy (fast, lossless when the
      // inputs share the same codec/parameters). ffmpeg.exec() resolves with
      // the return code (0 = success) instead of rejecting on failure.
      try {
        const list = videos.map((_, i) => `file '${i}.mp4'`).join("\n");
        await ffmpeg.writeFile("list.txt", new TextEncoder().encode(list));
        const ret = await ffmpeg.exec([
          "-f",
          "concat",
          "-safe",
          "0",
          "-i",
          "list.txt",
          "-c",
          "copy",
          "-movflags",
          "+faststart",
          "-y",
          "output.mp4",
        ]);
        succeeded = ret === 0;
      } catch {
        succeeded = false;
      }

      if (!succeeded) {
        // Attempt 2 — concat filter with re-encode (works across formats).
        const n = videos.length;
        const inputs: string[] = [];
        for (let i = 0; i < n; i++) inputs.push("-i", `${i}.mp4`);
        const labels = videos
          .map((_, i) => `[${i}:v][${i}:a]`)
          .join("");
        const ret = await ffmpeg.exec([
          ...inputs,
          "-filter_complex",
          `${labels}concat=n=${n}:v=1:a=1[v][a]`,
          "-map",
          "[v]",
          "-map",
          "[a]",
          "-c:v",
          "libx264",
          "-preset",
          "ultrafast",
          "-crf",
          "20",
          "-c:a",
          "aac",
          "-b:a",
          "128k",
          "-movflags",
          "+faststart",
          "-y",
          "output.mp4",
        ]);
        if (ret !== 0) throw new Error(t("errors.failed"));
      }

      const blob = await readFFmpegOutput(ffmpeg, "output.mp4", "video/mp4");
      if (blob.size < 1000) throw new Error(t("errors.emptyOutput"));
      setResultSize(blob.size);
      setResultUrl(URL.createObjectURL(blob));
      setProgress(100);
      setStep("done");
    } catch (err) {
      console.error(err);
      setError(
        t("errors.failed") + (err instanceof Error ? ` ${err.message}` : "")
      );
      setStep("ready");
    }
  };

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "joined.mp4";
    a.click();
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      category={t("category")}
      slug="video-joiner"
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-5">
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          multiple
          className="hidden"
          onChange={handleInputChange}
        />
        {error && (
          <div className="rounded-lg border border-red-800 bg-red-900/30 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {step === "upload" && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">🎬</div>
            <p className="font-medium text-zinc-300">{t("labels.dropPrompt")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("labels.dropHint")}</p>
          </div>
        )}

        {step === "ready" && (
          <div className="space-y-4">
            {videos.length === 0 ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => inputRef.current?.click()}
                className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-12 text-center transition-colors hover:border-zinc-500"
              >
                <p className="text-sm text-zinc-400">{t("labels.dropPrompt")}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {videos.map((v, i) => (
                  <div
                    key={v.id}
                    className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-blue-600/20 text-xs font-medium text-blue-400">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm text-zinc-300">
                      {v.name}
                    </span>
                    <span className="shrink-0 text-xs text-zinc-500">
                      {fmt(v.duration)}
                    </span>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        onClick={() => move(i, -1)}
                        disabled={i === 0}
                        className="rounded px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30"
                        aria-label={t("labels.moveUp")}
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => move(i, 1)}
                        disabled={i === videos.length - 1}
                        className="rounded px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30"
                        aria-label={t("labels.moveDown")}
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => remove(v.id)}
                        className="rounded px-2 py-1 text-xs text-zinc-500 hover:text-red-400"
                        aria-label={t("labels.remove")}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => inputRef.current?.click()}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {t("labels.addMore")}
              </button>
              <button
                onClick={join}
                disabled={videos.length < 2}
                className={`${btn} bg-blue-600 px-6 text-white hover:bg-blue-500`}
              >
                {t("buttons.join")} ({videos.length})
              </button>
              <button
                onClick={reset}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {t("buttons.newVideo")}
              </button>
            </div>
            <p className="text-xs text-zinc-500">{t("labels.joinHint")}</p>
          </div>
        )}

        {step === "processing" && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-10 text-center">
            <div className="mb-4 text-5xl">{phase === "merge" ? "🔀" : "⚙️"}</div>
            <h3 className="mb-2 text-xl font-semibold text-zinc-100">
              {phase === "merge" ? t("progress.merging") : t("progress.title")}
            </h3>
            <div className="mx-auto max-w-md">
              <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
                {phase === "merge" ? (
                  <div className="relative h-full w-full overflow-hidden rounded-full bg-blue-600/20">
                    <div className="absolute inset-y-0 w-1/3 animate-indeterminate rounded-full bg-blue-600" />
                  </div>
                ) : (
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                )}
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
              {t("labels.resultSize", { size: fmtSize(resultSize) })}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={download}
                className={`${btn} bg-green-600 px-6 text-white hover:bg-green-500`}
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
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

function fmtSize(bytes: number): string {
  if (!bytes) return "0 KB";
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(2)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
