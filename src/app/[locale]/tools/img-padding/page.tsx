"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

export default function ImgPaddingPage() {
  const t = useTranslations("tools.img-padding");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [outW, setOutW] = useState(1920);
  const [outH, setOutH] = useState(1080);
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
    const w = Math.min(Math.max(Math.round(outW), 32), 8192);
    const h = Math.min(Math.max(Math.round(outH), 32), 8192);
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    // checkerboard for transparency preview
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
    for (let y = 0; y < h; y += img.naturalHeight) {
      for (let x = 0; x < w; x += img.naturalWidth) {
        ctx.drawImage(img, x, y, img.naturalWidth, img.naturalHeight);
      }
    }
    setResultUrl(canvas.toDataURL("image/png"));
  }, [img, outW, outH]);

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `tiled-${outW}x${outH}.png`;
    a.click();
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const inputCls =
    "w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200";

  return (
    <ToolLayout
      title={t("title")}
      slug="img-padding"
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
            onClick={() => document.getElementById("pad-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">🧱</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input id="pad-in" type="file" accept="image/*" className="hidden" onChange={(e) => {
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.width")}</label>
                  <input type="number" min={32} max={8192} value={outW} onChange={(e) => setOutW(Number(e.target.value))} className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.height")}</label>
                  <input type="number" min={32} max={8192} value={outH} onChange={(e) => setOutH(Number(e.target.value))} className={inputCls} />
                </div>
              </div>
              <button onClick={handleDownload} className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}>
                {t("buttons.download")}
              </button>
            </div>
            <p className="text-xs text-zinc-500">
              {t("labels.tileSize", { w: img.naturalWidth, h: img.naturalHeight })}
            </p>
            <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
              <canvas ref={canvasRef} className="w-full" />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
