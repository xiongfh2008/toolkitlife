"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import JSZip from "jszip";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

interface Item {
  id: string;
  src: string;
  dateText: string;
}

const FORMATS = ["YYYY-MM-DD", "YYYY/MM/DD", "MM/DD/YYYY", "DD/MM/YYYY", "YYYY年MM月DD日"] as const;
const POSITIONS = ["topLeft", "topRight", "bottomLeft", "bottomRight", "center"] as const;

function formatDate(date: Date, fmt: string) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return fmt
    .replace("YYYY", String(y))
    .replace("MM", m)
    .replace("DD", d);
}

export default function ImageDateWatermarkPage() {
  const t = useTranslations("tools.image-date-watermark");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [items, setItems] = useState<Item[]>([]);
  const [format, setFormat] = useState<(typeof FORMATS)[number]>("YYYY-MM-DD");
  const [useFileDate, setUseFileDate] = useState(true);
  const [position, setPosition] = useState<(typeof POSITIONS)[number]>("bottomRight");
  const [fontSize, setFontSize] = useState(36);
  const [color, setColor] = useState("#ffffff");
  const [shadow, setShadow] = useState(true);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const dateText = formatDate(useFileDate ? file.lastModified ? new Date(file.lastModified) : new Date() : new Date(), format);
        setItems((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, src: reader.result as string, dateText }]);
      };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }, [useFileDate, format]);

  const renderItem = (image: HTMLImageElement, dateText: string): string => {
    const w = image.naturalWidth;
    const h = image.naturalHeight;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return image.src;
    ctx.drawImage(image, 0, 0, w, h);
    const fs = Math.max(12, Math.min(fontSize, Math.round(h * 0.06)));
    ctx.font = `600 ${fs}px sans-serif`;
    ctx.textBaseline = "middle";
    const metrics = ctx.measureText(dateText);
    const pad = fs;
    const margin = pad;
    const x = position === "topLeft" || position === "bottomLeft" ? margin : position === "topRight" || position === "bottomRight" ? w - metrics.width - margin : (w - metrics.width) / 2;
    const y = position === "topLeft" || position === "topRight" ? pad : position === "bottomLeft" || position === "bottomRight" ? h - pad : h / 2;
    if (shadow) {
      ctx.shadowColor = "rgba(0,0,0,0.8)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;
    }
    ctx.fillStyle = color;
    ctx.fillText(dateText, x, y);
    return canvas.toDataURL("image/png");
  };

  const handleFiles = (files: FileList | File[]) => {
    for (const f of Array.from(files)) {
      if (f.type.startsWith("image/")) addFile(f);
    }
  };

  const downloadAll = async () => {
    if (items.length === 0) return;
    setProcessing(true);
    try {
      const zip = new JSZip();
      for (const [i, item] of items.entries()) {
        const img = await loadImage(item.src);
        const url = renderItem(img, item.dateText);
        zip.file(`date-${i + 1}.png`, url.split(",")[1], { base64: true });
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "date-watermark.zip";
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 5000);
    } finally {
      setProcessing(false);
    }
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      slug="image-date-watermark"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="max-w-4xl space-y-4">
        <div className="space-y-3">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.format")}</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as (typeof FORMATS)[number])}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100"
              >
                {FORMATS.map((f) => (
                  <option key={f} value={f}>{formatDate(new Date(), f)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.position")}</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as (typeof POSITIONS)[number])}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100"
              >
                {POSITIONS.map((p) => (
                  <option key={p} value={p}>{t(`positions.${p}`)}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.fontSize")} · {fontSize}px</label>
              <input type="range" min={14} max={120} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-blue-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.color")}</label>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-full cursor-pointer rounded border border-zinc-700 bg-transparent" />
            </div>
            <label className="flex cursor-pointer items-center gap-2 pt-6 text-sm text-zinc-300">
              <input type="checkbox" checked={shadow} onChange={(e) => setShadow(e.target.checked)} className="accent-blue-500" />
              {t("labels.shadow")}
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => fileInputRef.current?.click()} className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}>
              {t("buttons.addImages")}
            </button>
            <button onClick={() => void downloadAll()} disabled={items.length === 0 || processing} className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}>
              {processing ? t("buttons.processing") : t("buttons.downloadAll")}
            </button>
            <span className="text-sm text-zinc-500">{t("labels.count", { count: items.length })}</span>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
            <input type="checkbox" checked={useFileDate} onChange={(e) => setUseFileDate(e.target.checked)} className="accent-blue-500" />
            {t("labels.useFileDate")}
          </label>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files);
            e.target.value = "";
          }} />
        </div>

        {items.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {items.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt={item.dateText} className="w-full" />
                <div className="px-2 py-1.5 text-xs text-zinc-500">{item.dateText}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
