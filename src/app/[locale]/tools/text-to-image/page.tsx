"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

export default function TextToImagePage() {
  const t = useTranslations("tools.text-to-image");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(32);
  const [color, setColor] = useState("#fafafa");
  const [bgColor, setBgColor] = useState("#18181b");
  const [padding, setPadding] = useState(48);
  const [maxWidth, setMaxWidth] = useState(600);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas || !text.trim()) return;
    const lines: string[] = [];
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.font = `${fontSize}px Arial, sans-serif`;
    for (const rawLine of text.split("\n")) {
      const words = rawLine.split(" ");
      let line = "";
      for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width > maxWidth && line) {
          lines.push(line);
          line = word;
        } else {
          line = test;
        }
      }
      if (line) lines.push(line);
    }
    const lineHeight = fontSize * 1.4;
    const W = Math.max(maxWidth, ...lines.map((l) => Math.ceil(ctx.measureText(l).width))) + padding * 2;
    const H = Math.ceil(lines.length * lineHeight) + padding * 2;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const c2 = canvas.getContext("2d");
    if (!c2) return;
    c2.scale(dpr, dpr);
    c2.fillStyle = bgColor;
    c2.fillRect(0, 0, W, H);
    c2.fillStyle = color;
    c2.font = `${fontSize}px Arial, sans-serif`;
    c2.textAlign = "left";
    c2.textBaseline = "top";
    lines.forEach((line, i) => {
      c2.fillText(line, padding, padding + i * lineHeight);
    });
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "text-image.png";
    a.click();
  };

  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none";

  return (
    <ToolLayout
      title={t("title")}
      slug="text-to-image"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder={t("labels.placeholder")}
          className={inputCls}
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-sm text-zinc-300">
            {t("labels.fontSize")}: {fontSize}px
            <input type="range" min={12} max={120} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-blue-500" />
          </label>
          <label className="text-sm text-zinc-300">
            {t("labels.maxWidth")}: {maxWidth}px
            <input type="range" min={200} max={1200} step={20} value={maxWidth} onChange={(e) => setMaxWidth(Number(e.target.value))} className="w-full accent-blue-500" />
          </label>
          <label className="text-sm text-zinc-300">
            {t("labels.padding")}: {padding}px
            <input type="range" min={0} max={200} value={padding} onChange={(e) => setPadding(Number(e.target.value))} className="w-full accent-blue-500" />
          </label>
          <label className="text-sm text-zinc-300">
            {t("labels.color")}
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="mt-1 h-9 w-full cursor-pointer rounded border border-zinc-700 bg-zinc-800" />
          </label>
          <label className="text-sm text-zinc-300">
            {t("labels.bgColor")}
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="mt-1 h-9 w-full cursor-pointer rounded border border-zinc-700 bg-zinc-800" />
          </label>
        </div>
        <div className="flex gap-3">
          <button
            onClick={render}
            disabled={!text.trim()}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {t("buttons.render")}
          </button>
          <button onClick={download} disabled={!text.trim()} className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50">
            {t("buttons.download")}
          </button>
        </div>
        <div className="flex justify-center overflow-auto rounded-lg">
          <canvas ref={canvasRef} className="max-w-full" />
        </div>
      </div>
    </ToolLayout>
  );
}
