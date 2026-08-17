"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { loadFFmpeg, readFFmpegOutput } from "@/lib/ffmpeg";

type Step = "upload" | "ready" | "processing" | "done";

const FONT_URLS = [
  "https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans.ttf",
  "https://unpkg.com/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans.ttf",
];

function safeExt(name: string): string {
  const m = name.toLowerCase().match(/\.(srt|ass|vtt)$/);
  return m ? m[0] : ".srt";
}

export default function VideoSubtitleBurnerPage() {
  const t = useTranslations("tools.video-subtitle-burner");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [step, setStep] = useState<Step>("upload");
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [subtitle, setSubtitle] = useState<File | null>(null);
  const [font, setFont] = useState<File | null>(null);
  const [fontName, setFontName] = useState("");
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState("");
  const [resultSize, setResultSize] = useState(0);
  const [error, setError] = useState("");
  const videoInputRef = useRef<HTMLInputElement>(null);
  const subInputRef = useRef<HTMLInputElement>(null);
  const fontInputRef = useRef<HTMLInputElement>(null);

  const loadVideo = useCallback((file: File) => {
    if (!file.type.startsWith("video/")) return;
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.preload = "metadata";
    v.onloadedmetadata = () => {
      setVideo(v);
      setStep("ready");
    };
    v.src = url;
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) loadVideo(e.dataTransfer.files[0]);
  };

  const reset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl("");
    setResultSize(0);
    setError("");
    setProgress(0);
    setVideo(null);
    setSubtitle(null);
    setFont(null);
    setFontName("");
    setStep("upload");
  };

  const generate = async () => {
    if (!video || !subtitle) return;
    setStep("processing");
    setProgress(0);
    setError("");
    try {
      const { fetchFile } = await import("@ffmpeg/util");
      const ffmpeg = await loadFFmpeg((p) =>
        setProgress(Math.min(95, Math.round(p * 95)))
      );
      await ffmpeg.writeFile("input.mp4", await fetchFile(video.src));
      const subName = "sub" + safeExt(subtitle.name);
      await ffmpeg.writeFile(subName, await fetchFile(subtitle));

      // Font: use the user-supplied one, otherwise a bundled DejaVu default.
      // MEMFS has no parent dirs, so create "fonts/" before writing.
      await ffmpeg.createDir("fonts");
      let fontDir = "";
      if (font) {
        await ffmpeg.writeFile(
          "fonts/font" + (font.name.toLowerCase().match(/\.(ttf|otf)$/)?.[0] || ".ttf"),
          await fetchFile(font)
        );
        fontDir = "fontsdir=/fonts";
      } else {
        let ok = false;
        for (const url of FONT_URLS) {
          try {
            const res = await fetch(url);
            if (!res.ok) continue;
            const buf = new Uint8Array(await res.arrayBuffer());
            await ffmpeg.writeFile("fonts/DejaVuSans.ttf", buf);
            ok = true;
            break;
          } catch {
            // try next mirror
          }
        }
        if (!ok) throw new Error(t("errors.fontDownload"));
        fontDir = "fontsdir=/fonts";
      }

      await ffmpeg.exec([
        "-i",
        "input.mp4",
        "-vf",
        fontDir ? `subtitles=${subName}:${fontDir}` : `subtitles=${subName}`,
        "-c:v",
        "libx264",
        "-preset",
        "ultrafast",
        "-crf",
        "20",
        "-c:a",
        "copy",
        "-movflags",
        "+faststart",
        "-y",
        "output.mp4",
      ]);

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
    a.download = "subtitled.mp4";
    a.click();
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      category={t("category")}
      slug="video-subtitle-burner"
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-5">
        {error && (
          <div className="rounded-lg border border-red-800 bg-red-900/30 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {step === "upload" && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => videoInputRef.current?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">💬</div>
            <p className="font-medium text-zinc-300">{t("labels.dropPrompt")}</p>
            <p className="mt-1 text-sm text-zinc-500">MP4 · WebM · MOV</p>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && loadVideo(e.target.files[0])}
            />
          </div>
        )}

        {step === "ready" && video && (
          <div className="space-y-4">
            <video
              src={video.src}
              controls
              playsInline
              className="mx-auto max-h-72 w-full max-w-2xl rounded-lg bg-black"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  {t("labels.subtitle")}
                </label>
                {subtitle ? (
                  <div className="flex items-center gap-2">
                    <span className="min-w-0 flex-1 truncate text-sm text-zinc-300">
                      💬 {subtitle.name}
                    </span>
                    <button
                      onClick={() => setSubtitle(null)}
                      className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
                    >
                      {t("labels.remove")}
                    </button>
                  </div>
                ) : (
                  <label className="block cursor-pointer rounded-lg border border-dashed border-zinc-600 p-4 text-center text-sm text-zinc-400 transition-colors hover:border-zinc-500">
                    {t("labels.subtitleAdd")}
                    <input
                      ref={subInputRef}
                      type="file"
                      accept=".srt,.ass,.vtt"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] && setSubtitle(e.target.files[0])
                      }
                    />
                  </label>
                )}
                <p className="mt-2 text-xs text-zinc-500">
                  {t("labels.subtitleHint")}
                </p>
              </div>

              <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  {t("labels.font")}
                </label>
                {font ? (
                  <div className="flex items-center gap-2">
                    <span className="min-w-0 flex-1 truncate text-sm text-zinc-300">
                      🔤 {fontName}
                    </span>
                    <button
                      onClick={() => {
                        setFont(null);
                        setFontName("");
                      }}
                      className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
                    >
                      {t("labels.remove")}
                    </button>
                  </div>
                ) : (
                  <label className="block cursor-pointer rounded-lg border border-dashed border-zinc-600 p-4 text-center text-sm text-zinc-400 transition-colors hover:border-zinc-500">
                    {t("labels.fontAdd")}
                    <input
                      ref={fontInputRef}
                      type="file"
                      accept=".ttf,.otf"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setFont(f);
                          setFontName(f.name);
                        }
                      }}
                    />
                  </label>
                )}
                <p className="mt-2 text-xs text-zinc-500">{t("labels.fontHint")}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={generate}
                disabled={!subtitle}
                className={`${btn} bg-blue-600 px-6 text-white hover:bg-blue-500`}
              >
                {t("buttons.burn")}
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

        {step === "processing" && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-10 text-center">
            <div className="mb-4 text-5xl">⚙️</div>
            <h3 className="mb-2 text-xl font-semibold text-zinc-100">
              {t("progress.title")}
            </h3>
            <div className="mx-auto max-w-md">
              <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
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
