"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

export default function SolidColorImagePage() {
  const t = useTranslations("tools.solid-color-image");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [color, setColor] = useState("#4f46e5");
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = Math.min(Math.max(width, 16), 8192);
    const h = Math.min(Math.max(height, 16), 8192);
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
    setDone(true);
  }, [color, width, height]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `solid-${width}x${height}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }, "image/png");
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      slug="solid-color-image"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="max-w-4xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.color")}</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-10 w-full cursor-pointer rounded border border-zinc-700 bg-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.width")}</label>
              <input
                type="number"
                min={16}
                max={8192}
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.height")}</label>
              <input
                type="number"
                min={16}
                max={8192}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200"
              />
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
        {done && (
          <p className="text-sm text-zinc-500">
            {width} × {height} px
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
