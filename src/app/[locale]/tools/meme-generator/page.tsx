"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

interface FontOption {
  value: string;
  label: string;
}

export default function MemeGeneratorPage() {
  const t = useTranslations("tools.meme-generator");

  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];
  const fontOptions = t.raw("fontOptions") as FontOption[];
  const defaultTopText = t("defaults.topText");
  const defaultBottomText = t("defaults.bottomText");

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [topText, setTopText] = useState(defaultTopText);
  const [bottomText, setBottomText] = useState(defaultBottomText);
  const [fontSize, setFontSize] = useState(48);
  const [textColor, setTextColor] = useState("#ffffff");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [font, setFont] = useState("Impact");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        imageRef.current = img;
        setImageSrc(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const renderMeme = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    // Size canvas to image
    const maxW = 800;
    const scale = Math.min(maxW / img.width, 1);
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Text settings
    ctx.textAlign = "center";
    ctx.fillStyle = textColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = fontSize / 8;
    ctx.lineJoin = "round";
    ctx.font = `bold ${fontSize * scale}px ${font}, sans-serif`;

    const wrapText = (text: string, y: number, maxWidth: number, lineHeight: number, fromBottom: boolean) => {
      const words = text.split(" ");
      const lines: string[] = [];
      let line = "";

      for (const word of words) {
        const test = line + (line ? " " : "") + word;
        if (ctx.measureText(test).width > maxWidth && line) {
          lines.push(line);
          line = word;
        } else {
          line = test;
        }
      }
      if (line) lines.push(line);

      if (fromBottom) lines.reverse();

      lines.forEach((l, i) => {
        const yPos = fromBottom ? y - i * lineHeight : y + i * lineHeight;
        ctx.strokeText(l, canvas.width / 2, yPos);
        ctx.fillText(l, canvas.width / 2, yPos);
      });
    };

    const maxWidth = canvas.width * 0.9;
    const lineHeight = fontSize * scale * 1.2;
    const padding = fontSize * scale * 0.6;

    if (topText.trim()) {
      wrapText(topText.toUpperCase(), padding + lineHeight * 0.5, maxWidth, lineHeight, false);
    }
    if (bottomText.trim()) {
      wrapText(bottomText.toUpperCase(), canvas.height - padding, maxWidth, lineHeight, true);
    }
  }, [topText, bottomText, fontSize, textColor, strokeColor, font]);

  useEffect(() => {
    if (imageSrc) renderMeme();
  }, [imageSrc, topText, bottomText, fontSize, textColor, strokeColor, font, renderMeme]);

  const download = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = "meme.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  }, []);

  const copyToClipboard = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      } catch { /* clipboard not available */ }
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const reset = () => {
    setImageSrc(null);
    imageRef.current = null;
    setTopText(defaultTopText);
    setBottomText(defaultBottomText);
  };

  return (
    <ToolLayout
      title={t("title")}
      slug="meme-generator"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-5">
        {!imageSrc ? (
          <label
            className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-800/50 p-12 cursor-pointer hover:border-zinc-500 transition-colors"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <span className="text-4xl">😂</span>
            <span className="text-sm text-zinc-400">{t("upload.drop")}</span>
            <span className="text-xs text-zinc-500">{t("upload.formats")}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </label>
        ) : (
          <>
            <canvas ref={canvasRef} className="w-full rounded-lg" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">{t("labels.topText")}</label>
                <input
                  type="text"
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">{t("labels.bottomText")}</label>
                <input
                  type="text"
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">{t("labels.font")}</label>
                <select
                  value={font}
                  onChange={(e) => setFont(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
                >
                  {fontOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  {t("labels.size", { size: fontSize })}
                </label>
                <input
                  type="range"
                  min={20}
                  max={100}
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">{t("labels.textColor")}</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full h-9 rounded-lg border border-zinc-700 bg-zinc-800 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">{t("labels.outline")}</label>
                <input
                  type="color"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  className="w-full h-9 rounded-lg border border-zinc-700 bg-zinc-800 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={reset}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm font-medium text-zinc-300 transition-colors"
              >
                {t("buttons.newImage")}
              </button>
              <div className="flex-1" />
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-sm font-medium text-zinc-200 transition-colors"
              >
                {t("buttons.copy")}
              </button>
              <button
                onClick={download}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium text-white transition-colors"
              >
                {t("buttons.download")}
              </button>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
