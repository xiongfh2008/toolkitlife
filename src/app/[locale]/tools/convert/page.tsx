"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { loadFFmpeg, readFFmpegOutput } from "@/lib/ffmpeg";

// Output formats backed by the encoders shipped in @ffmpeg/core@0.12.6.
// The available set is verified at runtime against `ffmpeg -encoders` so the
// UI never promises a format the engine cannot produce.
const FORMAT_CANDIDATES: { ext: string; mime: string; label: string; encoders: string[]; extra: string[] }[] = [
  { ext: "png", mime: "image/png", label: "PNG", encoders: ["png"], extra: [] },
  { ext: "jpg", mime: "image/jpeg", label: "JPEG", encoders: ["mjpeg"], extra: ["-pix_fmt", "yuvj420p"] },
  { ext: "webp", mime: "image/webp", label: "WebP", encoders: ["libwebp"], extra: [] },
  { ext: "gif", mime: "image/gif", label: "GIF", encoders: ["gif"], extra: [] },
  { ext: "bmp", mime: "image/bmp", label: "BMP", encoders: ["bmp"], extra: [] },
  { ext: "tiff", mime: "image/tiff", label: "TIFF", encoders: ["tiff"], extra: [] },
  { ext: "ico", mime: "image/x-icon", label: "ICO", encoders: ["png"], extra: ["-c:v", "png"] },
  { ext: "tga", mime: "image/x-targa", label: "TGA", encoders: ["targa"], extra: [] },
  { ext: "ppm", mime: "image/x-portable-pixmap", label: "PPM", encoders: ["ppm"], extra: [] },
  { ext: "pam", mime: "image/x-portable-arbitrarymap", label: "PAM", encoders: ["pam"], extra: [] },
  { ext: "sgi", mime: "image/sgi", label: "SGI", encoders: ["sgi"], extra: [] },
  { ext: "xbm", mime: "image/x-xbitmap", label: "XBM", encoders: ["xbm"], extra: [] },
  { ext: "xpm", mime: "image/x-xpixmap", label: "XPM", encoders: ["xpm"], extra: [] },
  { ext: "dpx", mime: "image/x-dpx", label: "DPX", encoders: ["dpx"], extra: [] },
];

type Step = "upload" | "settings" | "processing" | "done";

export default function ConvertPage() {
  const t = useTranslations("tools.convert");

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [formats, setFormats] = useState<typeof FORMAT_CANDIDATES>([]);
  const [format, setFormat] = useState<string>("");
  const [quality, setQuality] = useState(85);
  const [step, setStep] = useState<Step>("upload");
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [resultName, setResultName] = useState("");
  const [error, setError] = useState("");
  const loadedRef = useRef(false);

  const handleUpload = useCallback((f: File) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setStep("settings");
    setError("");
    setResultUrl("");
  }, [previewUrl, resultUrl]);

  const loadEngine = useCallback(async () => {
    if (loadedRef.current) return;
    setStatusMsg(t("status.downloading"));
    const ffmpeg = await loadFFmpeg((p) => setProgress(Math.min(90, Math.round(p * 90))));
    loadedRef.current = true;

    // Discover which encoders this build actually ships.
    const logs: string[] = [];
    ffmpeg.on("log", ({ message }) => logs.push(message));
    await ffmpeg.exec(["-encoders"]);
    const haystack = logs.join("\n");
    const available = FORMAT_CANDIDATES.filter((f) =>
      f.encoders.some((enc) => new RegExp(`\\b${enc}\\b`).test(haystack))
    );
    setFormats(available);
    setFormat((prev) => (prev && available.some((a) => a.ext === prev) ? prev : available[0]?.ext ?? ""));
    ffmpeg.terminate();
  }, [t]);

  // Warm up the engine (and discover available encoders) as soon as the user
  // picks a file, so the format buttons are ready before conversion starts.
  useEffect(() => {
    if (step === "settings") {
      loadEngine().catch((err) => console.error("Engine discovery failed:", err));
    }
  }, [step, loadEngine]);

  const convert = async () => {
    if (!file || !format) return;
    setStep("processing");
    setProgress(0);
    setError("");
    try {
      const { fetchFile } = await import("@ffmpeg/util");
      const ffmpeg = await loadFFmpeg((p) => setProgress(Math.min(95, Math.round(p * 95))));
      setStatusMsg(t("status.converting"));

      const cfg = FORMAT_CANDIDATES.find((f) => f.ext === format)!;
      let inputName = `input${file.name.match(/\.[^.]+$/)?.[0] ?? ".png"}`;

      // FFmpeg cannot rasterize SVG (no librsvg in the wasm build), so
      // render it to a PNG through the canvas first.
      if (inputName.toLowerCase().endsWith(".svg")) {
        setStatusMsg(t("status.rasterizing"));
        const svgBlob = await rasterizeSvg(file);
        await ffmpeg.writeFile("input.png", await fetchFile(new File([svgBlob], "input.png")));
        inputName = "input.png";
      } else {
        await ffmpeg.writeFile(inputName, await fetchFile(file));
      }

      const args: string[] = ["-i", inputName];
      if (cfg.ext === "jpg") args.push("-q:v", String(Math.round(2 + (100 - quality) * 0.29)));
      else if (cfg.ext === "webp") args.push("-quality", String(quality));
      else if (cfg.ext === "png") args.push("-compression_level", String(Math.max(1, Math.round((quality / 100) * 9))));
      args.push(...cfg.extra, "-y", `output.${cfg.ext}`);

      await ffmpeg.exec(args);
      setStatusMsg(t("status.finishing"));
      const blob = await readFFmpegOutput(ffmpeg, `output.${cfg.ext}`, cfg.mime);

      await ffmpeg.deleteFile(inputName).catch(() => {});
      await ffmpeg.deleteFile(`output.${cfg.ext}`).catch(() => {});
      ffmpeg.terminate();

      setResultUrl(URL.createObjectURL(blob));
      setResultName(`${file.name.replace(/\.[^.]+$/, "")}.${cfg.ext}`);
      setProgress(100);
      setStep("done");
    } catch (err) {
      console.error(err);
      setError(t("errors.prefix") + (err instanceof Error ? err.message : String(err)));
      setStep("settings");
    }
  };

  const rasterizeSvg = async (svgFile: File): Promise<Blob> => {
    const img = new Image();
    const url = URL.createObjectURL(svgFile);
    img.src = url;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(t("errors.svgFailed")));
      setTimeout(() => reject(new Error(t("errors.svgFailed"))), 5000);
    });
    URL.revokeObjectURL(url);
    const canvas = document.createElement("canvas");
    const width = img.naturalWidth || 1200;
    const height = img.naturalHeight || Math.round((width / 16) * 9);
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error(t("errors.svgFailed")))), "image/png");
    });
  };

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setPreviewUrl("");
    setResultUrl("");
    setStep("upload");
    setProgress(0);
    setError("");
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="convert"
      faqs={t.raw("faqs") as FAQ[]}
      relatedTools={t.raw("relatedTools") as RelatedTool[]}
      keywords={t.raw("keywords") as string[]}
      guide={
        <>
          <h2>{t("guide.intro.title")}</h2>
          {(t.raw("guide.intro.paragraphs") as string[]).map((p, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
          ))}
          {(t.raw("guide.sections") as { title: string; items?: string[]; paragraphs?: string[] }[]).map((sec, i) => (
            <div key={i}>
              <h3>{sec.title}</h3>
              {sec.items ? (
                <ul>
                  {(sec.items as string[]).map((item, j) => (
                    <li key={j} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ul>
              ) : (
                (sec.paragraphs as string[]).map((p, j) => <p key={j} dangerouslySetInnerHTML={{ __html: p }} />)
              )}
            </div>
          ))}
        </>
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
              if (f) handleUpload(f);
            }}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("img-input")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-700 p-16 text-center transition-all hover:border-blue-500 hover:bg-zinc-900/50"
          >
            <div className="mb-4 text-5xl">🖼️</div>
            <p className="mb-2 text-lg text-zinc-300">{t("upload.title")}</p>
            <p className="text-sm text-zinc-500">{t("upload.formats")}</p>
            <input
              id="img-input"
              type="file"
              accept="image/*,.heic,.heif"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            />
          </div>
        )}

        {step === "settings" && file && (
          <div className="space-y-6">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt={t("labels.preview")} className="mx-auto max-h-72 rounded-lg" />
              <p className="mt-3 text-center text-sm text-zinc-500">
                {file.name} · {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">{t("labels.format")}</label>
                <div className="flex flex-wrap gap-2">
                  {formats.map((f) => (
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
                  {formats.length === 0 && <p className="text-sm text-zinc-500">{t("status.downloading")}</p>}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">{t("labels.quality")}</label>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full"
                />
                <p className="mt-1 text-xs text-zinc-500">{quality}%</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={convert}
                disabled={!format}
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
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
          <div className="space-y-6">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
              <div className="mb-4 text-5xl">✅</div>
              <h3 className="mb-4 text-xl font-semibold text-zinc-100">{t("done.title")}</h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={resultUrl} alt={t("labels.preview")} className="mx-auto mb-6 max-h-72 rounded-lg" />
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
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
