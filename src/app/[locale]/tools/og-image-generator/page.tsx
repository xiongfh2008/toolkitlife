"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

const WIDTH = 1200;
const HEIGHT = 630;

export default function OgImageGeneratorPage() {
  const t = useTranslations("tools.og-image-generator");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [siteName, setSiteName] = useState("");
  const [bgColor, setBgColor] = useState("#0f172a");
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState(52);
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [logo, setLogo] = useState<HTMLImageElement | null>(null);
  const [ready, setReady] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resultUrlRef = useRef("");

  const loadImageFile = useCallback((file: File, which: "bg" | "logo") => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        if (which === "bg") setBgImage(image);
        else setLogo(image);
        setReady(false);
      };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = (e: React.DragEvent, which: "bg" | "logo") => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) loadImageFile(file, which);
  };

  const generate = useCallback(() => {
    if (generating) return;
    setGenerating(true);
    setError("");
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = WIDTH;
      canvas.height = HEIGHT;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Background
      if (bgImage) {
        const scale = Math.max(WIDTH / bgImage.naturalWidth, HEIGHT / bgImage.naturalHeight);
        const w = bgImage.naturalWidth * scale;
        const h = bgImage.naturalHeight * scale;
        ctx.drawImage(bgImage, (WIDTH - w) / 2, (HEIGHT - h) / 2, w, h);
      } else {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
      }

      // Semi-transparent overlay when a background image is used
      if (bgImage) {
        ctx.fillStyle = "rgba(0,0,0,0.45)";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
      }

      const pad = 80;
      const maxW = WIDTH - pad * 2;

      // Logo
      if (logo) {
        const logoH = 72;
        const logoW = Math.min(160, (logo.naturalWidth / logo.naturalHeight) * logoH);
        ctx.drawImage(logo, pad, pad, logoW, logoH);
      }

      // Title
      const titleText = title.trim() || t("labels.placeholder");
      const titleSize = Math.max(28, fontSize);
      ctx.fillStyle = textColor;
      ctx.textBaseline = "top";
      ctx.textAlign = "left";

      const measureLines = (text: string, size: number) => {
        ctx.font = `bold ${size}px system-ui, -apple-system, "Segoe UI", sans-serif`;
        const words = text.split(/\s+/);
        const lines: string[] = [];
        let current = "";
        for (const word of words) {
          const test = current ? `${current} ${word}` : word;
          if (ctx.measureText(test).width > maxW && current) {
            lines.push(current);
            current = word;
          } else {
            current = test;
          }
        }
        if (current) lines.push(current);
        return lines;
      };

      const fitTitle = () => {
        let size = titleSize;
        while (size > 24) {
          const lines = measureLines(titleText, size);
          const lineH = size * 1.25;
          const descLines = description ? Math.ceil(ctx.measureText(description).width / maxW) : 0;
          const total = lineH * lines.length + 24 + lineH * 0.8 * descLines + 40;
          if (total <= HEIGHT - pad * 2 - 40) break;
          size -= 2;
        }
        return size;
      };

      const finalSize = fitTitle();
      const lines = measureLines(titleText, finalSize);
      let y = logo ? pad + 72 + 32 : pad;
      ctx.font = `bold ${finalSize}px system-ui, -apple-system, "Segoe UI", sans-serif`;
      for (const line of lines) {
        ctx.fillText(line, pad, y);
        y += finalSize * 1.25;
      }

      // Description
      if (description) {
        y += 12;
        const descSize = Math.max(20, Math.round(finalSize * 0.4));
        ctx.font = `normal ${descSize}px system-ui, -apple-system, "Segoe UI", sans-serif`;
        ctx.globalAlpha = 0.85;
        const descWords = description.split(/\s+/);
        let line = "";
        for (const word of descWords) {
          const test = line ? `${line} ${word}` : word;
          if (ctx.measureText(test).width > maxW && line) {
            ctx.fillText(line, pad, y);
            y += descSize * 1.4;
            line = word;
          } else {
            line = test;
          }
        }
        if (line) ctx.fillText(line, pad, y);
        ctx.globalAlpha = 1;
      }

      // Site name at the bottom
      if (siteName) {
        ctx.fillStyle = textColor;
        ctx.globalAlpha = 0.7;
        ctx.font = `600 22px system-ui, -apple-system, "Segoe UI", sans-serif`;
        ctx.textBaseline = "alphabetic";
        ctx.fillText(siteName, pad, HEIGHT - 48);
        ctx.globalAlpha = 1;
      }

      canvas.toBlob((blob) => {
        if (!blob) return;
        if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
        resultUrlRef.current = URL.createObjectURL(blob);
        setReady(true);
        setGenerating(false);
      }, "image/png");
    } catch (err) {
      console.error(err);
      setError(t("errors.process"));
      setGenerating(false);
    }
  }, [title, description, siteName, bgColor, textColor, fontSize, bgImage, logo, generating, t]);

  const download = () => {
    if (!resultUrlRef.current) return;
    const a = document.createElement("a");
    a.href = resultUrlRef.current;
    a.download = "og-image.png";
    a.click();
  };

  const handleNewImage = () => {
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = "";
    setTitle("");
    setDescription("");
    setSiteName("");
    setBgImage(null);
    setLogo(null);
    setReady(false);
    setError("");
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 focus:border-blue-500 focus:outline-none";

  const fileDrop = (which: "bg" | "logo", id: string) => (
    <div
      onDrop={(e) => handleDrop(e, which)}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => document.getElementById(id)?.click()}
      className="cursor-pointer rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-900 p-4 text-center transition-colors hover:border-zinc-600"
    >
      {which === "bg" && bgImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={bgImage.src} alt="bg" className="mx-auto max-h-24 rounded" />
      ) : which === "logo" && logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo.src} alt="logo" className="mx-auto max-h-12" />
      ) : (
        <p className="text-xs text-zinc-500">{t("upload.drop")}</p>
      )}
      <input
        id={id}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) loadImageFile(file, which);
          e.target.value = "";
        }}
      />
    </div>
  );

  return (
    <ToolLayout
      title={t("title")}
      slug="og-image-generator"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="max-w-4xl space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-zinc-400">{t("labels.title")}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setReady(false); }}
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-zinc-400">{t("labels.description")}</label>
              <textarea
                value={description}
                onChange={(e) => { setDescription(e.target.value); setReady(false); }}
                rows={2}
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-zinc-400">{t("labels.siteName")}</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => { setSiteName(e.target.value); setReady(false); }}
                className={inputCls}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm text-zinc-400">{t("labels.bgColor")}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => { setBgColor(e.target.value); setReady(false); }}
                    className="h-9 w-12 cursor-pointer rounded border border-zinc-700 bg-zinc-800"
                  />
                  <span className="font-mono text-xs text-zinc-500">{bgColor}</span>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm text-zinc-400">{t("labels.textColor")}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => { setTextColor(e.target.value); setReady(false); }}
                    className="h-9 w-12 cursor-pointer rounded border border-zinc-700 bg-zinc-800"
                  />
                  <span className="font-mono text-xs text-zinc-500">{textColor}</span>
                </div>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm text-zinc-400">
                {t("labels.fontSize")}: {fontSize}px
              </label>
              <input
                type="range"
                min={28}
                max={80}
                value={fontSize}
                onChange={(e) => { setFontSize(parseInt(e.target.value, 10)); setReady(false); }}
                className="w-full accent-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="mb-1 block text-sm text-zinc-400">{t("labels.bgImage")}</p>
                {fileDrop("bg", "og-bg")}
              </div>
              <div>
                <p className="mb-1 block text-sm text-zinc-400">{t("labels.logo")}</p>
                {fileDrop("logo", "og-logo")}
              </div>
            </div>
            {(bgImage || logo) && (
              <div className="flex gap-3">
                {bgImage && (
                  <button
                    onClick={() => { setBgImage(null); setReady(false); }}
                    className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
                  >
                    {t("buttons.removeBg")}
                  </button>
                )}
                {logo && (
                  <button
                    onClick={() => { setLogo(null); setReady(false); }}
                    className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
                  >
                    {t("buttons.removeLogo")}
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium text-zinc-300">{t("labels.preview")}</p>
            <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
              <canvas ref={canvasRef} className="w-full" />
            </div>
            <p className="text-xs text-zinc-500">
              1200 × 630 px
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => void generate()}
            disabled={generating}
            className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
          >
            {generating ? t("status.processing") : t("buttons.generate")}
          </button>
          <button
            onClick={download}
            disabled={!ready}
            className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
          >
            {t("buttons.download")}
          </button>
          <button
            onClick={handleNewImage}
            className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
          >
            {t("buttons.newImage")}
          </button>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </ToolLayout>
  );
}
