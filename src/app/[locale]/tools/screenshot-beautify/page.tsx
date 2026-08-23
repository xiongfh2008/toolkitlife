"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

export default function ScreenshotBeautifyPage() {
  const t = useTranslations("tools.screenshot-beautify");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [bgColor, setBgColor] = useState("#e2e8f0");
  const [padding, setPadding] = useState(48);
  const [radius, setRadius] = useState(24);
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderColor, setBorderColor] = useState("#ffffff");
  const [shadow, setShadow] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [resultUrl, setResultUrl] = useState("");

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => setImg(image);
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const maxScale = 1600 / Math.max(iw, ih);
    const scale = Math.min(1, maxScale);
    const w = Math.max(1, Math.round(iw * scale));
    const h = Math.max(1, Math.round(ih * scale));
    const pad = Math.max(0, padding);
    const rad = Math.max(0, radius);
    const bw = Math.max(0, borderWidth);
    canvas.width = w + pad * 2;
    canvas.height = h + pad * 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    // background (checkerboard for transparent bg)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (shadow) {
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = 32;
      ctx.shadowOffsetY = 16;
      ctx.beginPath();
      ctx.roundRect(pad - bw / 2, pad - bw / 2, w + bw, h + bw, rad);
      ctx.fillStyle = bgColor;
      ctx.fill();
      ctx.restore();
    }

    const x = pad - bw / 2;
    const y = pad - bw / 2;
    const drawW = w + bw;
    const drawH = h + bw;
    ctx.beginPath();
    ctx.roundRect(x, y, drawW, drawH, rad);
    ctx.fillStyle = borderColor;
    ctx.fill();
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, drawW, drawH, Math.max(0, rad - bw / 2));
    ctx.clip();
    ctx.drawImage(img, pad, pad, w, h);
    ctx.restore();

    setResultUrl(canvas.toDataURL("image/png"));
  }, [img, bgColor, padding, radius, borderWidth, borderColor, shadow]);

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "beautified.png";
    a.click();
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      slug="screenshot-beautify"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="max-w-4xl space-y-4">
        {!img ? (
          <div
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files?.[0];
              if (f) loadFile(f);
            }}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("beautify-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">🖼️</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input id="beautify-in" type="file" accept="image/*" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) loadFile(f);
              e.target.value = "";
            }} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => { setImg(null); setResultUrl(""); }} className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}>
                {t("buttons.newImage")}
              </button>
              <button onClick={handleDownload} className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}>
                {t("buttons.download")}
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.background")}</label>
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-10 w-full cursor-pointer rounded border border-zinc-700 bg-transparent" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.padding")} · {padding}px</label>
                <input type="range" min={0} max={200} value={padding} onChange={(e) => setPadding(Number(e.target.value))} className="w-full accent-blue-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.radius")} · {radius}px</label>
                <input type="range" min={0} max={120} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-full accent-blue-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.borderWidth")} · {borderWidth}px</label>
                <input type="range" min={0} max={24} value={borderWidth} onChange={(e) => setBorderWidth(Number(e.target.value))} className="w-full accent-blue-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.borderColor")}</label>
                <input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="h-10 w-full cursor-pointer rounded border border-zinc-700 bg-transparent" />
              </div>
              <label className="flex cursor-pointer items-center gap-2 pt-6 text-sm text-zinc-300">
                <input type="checkbox" checked={shadow} onChange={(e) => setShadow(e.target.checked)} className="accent-blue-500" />
                {t("labels.shadow")}
              </label>
            </div>

            <div className="overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4">
              <canvas ref={canvasRef} className="mx-auto max-w-full" style={{ width: "auto", maxHeight: "60vh" }} />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
