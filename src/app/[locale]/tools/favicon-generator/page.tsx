"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import NextImage from "next/image";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

const sizes = [32, 64, 128, 256];

function drawTextFavicon(
  canvas: HTMLCanvasElement,
  text: string,
  size: number,
  bg: string,
  fg: string
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = size;
  canvas.height = size;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = fg;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${Math.round(size * 0.55)}px sans-serif`;
  ctx.fillText(text.slice(0, 2), size / 2, size / 2 + size * 0.05);
}

function drawImageFavicon(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  size: number,
  bg: string
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = size;
  canvas.height = size;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);
  const scale = Math.min(size / img.width, size / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  const x = (size - w) / 2;
  const y = (size - h) / 2;
  ctx.drawImage(img, x, y, w, h);
}

export default function FaviconGeneratorPage() {
  const t = useTranslations("tools.favicon-generator");
  const [mode, setMode] = useState<"text" | "image">("text");
  const [text, setText] = useState("T");
  const [size, setSize] = useState<number>(128);
  const [bg, setBg] = useState("#2563eb");
  const [fg, setFg] = useState("#ffffff");
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = useCallback(() => {
    setError("");
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (mode === "text") {
      drawTextFavicon(canvas, text || "T", size, bg, fg);
      const url = canvas.toDataURL("image/png");
      setDataUrl(url);
      const encodedText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      setSvg(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="${bg}"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="${fg}" font-family="sans-serif" font-size="${Math.round(size * 0.55)}">${encodedText}</text></svg>`
      );
    }
  }, [mode, text, size, bg, fg]);

  useEffect(() => {
    if (mode === "text") {
      // Draw the initial text favicon and derive the PNG/SVG outputs after mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      generate();
    }
  }, [generate, mode]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError(t("errors.invalidImage"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        drawImageFavicon(canvas, img, size, bg);
        const url = canvas.toDataURL("image/png");
        setDataUrl(url);
        setSvg(null);
        setError("");
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="favicon-generator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="flex flex-wrap gap-2">
          {(["text", "image"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setDataUrl(null);
                setSvg(null);
                setError("");
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                mode === m
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {t(`options.${m}`)}
            </button>
          ))}
        </div>

        {mode === "text" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.text")}
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="T"
                maxLength={2}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.size")}
              </label>
              <select
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              >
                {sizes.map((s) => (
                  <option key={s} value={s}>
                    {s}x{s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.background")}
              </label>
              <input
                type="color"
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.foreground")}
              </label>
              <input
                type="color"
                value={fg}
                onChange={(e) => setFg(e.target.value)}
                className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.upload")}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-3 file:py-1 file:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.size")}
              </label>
              <select
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              >
                {sizes.map((s) => (
                  <option key={s} value={s}>
                    {s}x{s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.background")}
              </label>
              <input
                type="color"
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1"
              />
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}

        {mode === "text" && (
          <button
            onClick={generate}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
          >
            {t("buttons.generate")}
          </button>
        )}

        <canvas ref={canvasRef} className="hidden" />

        {dataUrl && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="flex items-center gap-4">
              <NextImage
                src={dataUrl}
                alt="Favicon preview"
                className="rounded-lg border border-zinc-700"
                width={64}
                height={64}
                unoptimized
              />
              <div>
                <p className="text-sm font-medium text-zinc-300">{t("labels.preview")}</p>
                <p className="text-xs text-zinc-500">
                  {size}x{size} PNG
                </p>
              </div>
            </div>
            <a
              href={dataUrl}
              download={`favicon-${size}x${size}.png`}
              className="inline-block rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500 transition-colors"
            >
              {t("buttons.downloadPng")}
            </a>
          </div>
        )}

        {svg && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <h3 className="text-sm font-medium text-zinc-300">{t("labels.svgFavicon")}</h3>
            <textarea
              readOnly
              value={svg}
              rows={4}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-mono text-zinc-300 outline-none"
            />
            <a
              href={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`}
              download="favicon.svg"
              className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
            >
              {t("buttons.downloadSvg")}
            </a>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
