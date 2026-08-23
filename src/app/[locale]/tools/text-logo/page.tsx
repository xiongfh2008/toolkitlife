"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

export default function TextLogoPage() {
  const t = useTranslations("tools.text-logo");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [text, setText] = useState("LOGO");
  const [fontSize, setFontSize] = useState(160);
  const [color, setColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#111827");
  const [transparentBg, setTransparentBg] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const size = Math.min(Math.max(fontSize, 12), 500);
    ctx.font = `bold ${size}px system-ui, -apple-system, "Segoe UI", sans-serif`;
    const width = Math.max(120, Math.ceil(ctx.measureText(text || " ").width) + size);
    const height = Math.ceil(size * 1.6);
    canvas.width = width;
    canvas.height = height;
    const c2 = canvas.getContext("2d");
    if (!c2) return;
    if (!transparentBg) {
      c2.fillStyle = bgColor;
      c2.fillRect(0, 0, width, height);
    }
    c2.fillStyle = color;
    c2.textBaseline = "middle";
    c2.textAlign = "center";
    c2.font = `bold ${size}px system-ui, -apple-system, "Segoe UI", sans-serif`;
    c2.fillText(text || " ", width / 2, height / 2);
  }, [text, fontSize, color, bgColor, transparentBg]);

  useEffect(() => {
    render();
  }, [render]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "text-logo.png";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }, "image/png");
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const inputCls = "w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200";

  return (
    <ToolLayout
      title={t("title")}
      slug="text-logo"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="max-w-4xl space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.text")}</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={inputCls}
            placeholder="LOGO"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.fontSize")} · {fontSize}px
            </label>
            <input
              type="range"
              min={12}
              max={400}
              step={4}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
          <div className="flex items-end gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.color")}</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-9 w-14 cursor-pointer rounded border border-zinc-700 bg-transparent"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.bgColor")}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  disabled={transparentBg}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-9 w-14 cursor-pointer rounded border border-zinc-700 bg-transparent disabled:opacity-30"
                />
                <label className="flex cursor-pointer items-center gap-1.5 text-xs text-zinc-400">
                  <input
                    type="checkbox"
                    checked={transparentBg}
                    onChange={(e) => setTransparentBg(e.target.checked)}
                    className="h-3.5 w-3.5 accent-blue-600"
                  />
                  {t("labels.transparentBg")}
                </label>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleDownload}
          className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
        >
          {t("buttons.download")}
        </button>

        <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
          <canvas ref={canvasRef} className="w-full" />
        </div>
      </div>
    </ToolLayout>
  );
}
