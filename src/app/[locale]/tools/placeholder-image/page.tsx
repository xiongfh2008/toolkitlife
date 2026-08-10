"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function PlaceholderImagePage() {
  const t = useTranslations("tools.placeholder-image");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState("600");
  const [height, setHeight] = useState("400");
  const [bgColor, setBgColor] = useState("#3f3f46");
  const [textColor, setTextColor] = useState("#ffffff");
  const [text, setText] = useState("Placeholder");
  const [dataUrl, setDataUrl] = useState("");

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = Math.max(1, parseInt(width, 10) || 600);
    const h = Math.max(1, parseInt(height, 10) || 400);
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const displayText = text || `${w} x ${h}`;
    let fontSize = Math.min(w / 8, h / 4, 64);
    ctx.font = `bold ${fontSize}px sans-serif`;

    const metrics = ctx.measureText(displayText);
    if (metrics.width > w - 32 && fontSize > 12) {
      fontSize = Math.max(12, (fontSize * (w - 32)) / metrics.width);
      ctx.font = `bold ${fontSize}px sans-serif`;
    }

    ctx.fillText(displayText, w / 2, h / 2);

    const url = canvas.toDataURL("image/png");
    setDataUrl(url);
  };

  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const download = () => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `placeholder-${width}x${height}.png`;
    link.click();
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="placeholder-image"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.width")}
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.height")}
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.backgroundColor")}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-10 w-10 rounded-lg border border-zinc-700 bg-zinc-800"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.textColor")}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="h-10 w-10 rounded-lg border border-zinc-700 bg-zinc-800"
              />
              <input
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.text")}
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`${width} x ${height}`}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        <button
          onClick={draw}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
        >
          {t("buttons.generate")}
        </button>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
          <canvas
            ref={canvasRef}
            className="max-w-full rounded-lg border border-zinc-700"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={download}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500 transition-colors"
            >
              {t("buttons.download")}
            </button>
            <CopyButton
              text={dataUrl}
              label={t("buttons.copyDataUrl")}
              className="text-sm"
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
