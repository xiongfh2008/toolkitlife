"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface PickedColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

interface GuideSection {
  title: string;
  paragraphs?: string[];
  items?: string[];
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
}

export default function ImageColorPickerPage() {
  const t = useTranslations("tools.image-color-picker");
  const [imageSrc, setImageSrc] = useState("");
  const [currentColor, setCurrentColor] = useState<PickedColor | null>(null);
  const [recentColors, setRecentColors] = useState<PickedColor[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];
  const guideIntro = t.raw("guide.intro") as { title: string; paragraphs: string[] };
  const guideSections = t.raw("guide.sections") as GuideSection[];

  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImageSrc(dataUrl);
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        // Scale to fit canvas area while maintaining aspect ratio
        const maxW = 800;
        const maxH = 500;
        let w = img.width;
        let h = img.height;
        if (w > maxW) { h = (h * maxW) / w; w = maxW; }
        if (h > maxH) { w = (w * maxH) / h; h = maxH; }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const r = pixel[0], g = pixel[1], b = pixel[2];
    const color: PickedColor = {
      hex: rgbToHex(r, g, b),
      rgb: { r, g, b },
      hsl: rgbToHsl(r, g, b),
    };
    setCurrentColor(color);
    setRecentColors((prev) => {
      const next = [color, ...prev.filter((c) => c.hex !== color.hex)];
      return next.slice(0, 10);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) loadImage(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadImage(file);
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="image-color-picker"
      keywords={keywords}
      guide={
        <>
          <h2>{guideIntro.title}</h2>
          {guideIntro.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {guideSections.map((section, i) => (
            <section key={i}>
              <h3>{section.title}</h3>
              {section.paragraphs?.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
              {section.items && (
                <ul>
                  {section.items.map((item, k) => (
                    <li key={k}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </>
      }
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-4">
        {/* Upload area */}
        {!imageSrc && (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-16 transition-colors ${
              isDragging
                ? "border-blue-500 bg-blue-500/10"
                : "border-zinc-700 bg-zinc-900 hover:border-zinc-600"
            }`}
          >
            <p className="text-lg text-zinc-400">{t("labels.uploadText")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("labels.uploadHint")}</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />

        {imageSrc && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Canvas */}
            <div className="lg:col-span-2">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm text-zinc-400">{t("labels.clickInstruction")}</p>
                <button
                  onClick={() => { setImageSrc(""); setCurrentColor(null); }}
                  className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {t("labels.changeImage")}
                </button>
              </div>
              <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 inline-block">
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className="max-w-full cursor-crosshair"
                />
              </div>
            </div>

            {/* Color info */}
            <div className="space-y-4">
              {currentColor && (
                <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-zinc-300">{t("labels.pickedColor")}</h3>
                  <div
                    className="mb-3 h-20 w-full rounded-lg border border-zinc-700"
                    style={{ backgroundColor: currentColor.hex }}
                  />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400">{t("labels.hex")}</span>
                      <div className="flex items-center gap-2">
                        <code className="text-sm text-zinc-200">{currentColor.hex}</code>
                        <CopyButton text={currentColor.hex} label={t("buttons.copy")} className="text-xs px-2 py-0.5" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400">{t("labels.rgb")}</span>
                      <div className="flex items-center gap-2">
                        <code className="text-sm text-zinc-200">
                          {currentColor.rgb.r}, {currentColor.rgb.g}, {currentColor.rgb.b}
                        </code>
                        <CopyButton
                          text={`rgb(${currentColor.rgb.r}, ${currentColor.rgb.g}, ${currentColor.rgb.b})`}
                          label={t("buttons.copy")}
                          className="text-xs px-2 py-0.5"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400">{t("labels.hsl")}</span>
                      <div className="flex items-center gap-2">
                        <code className="text-sm text-zinc-200">
                          {currentColor.hsl.h}, {currentColor.hsl.s}%, {currentColor.hsl.l}%
                        </code>
                        <CopyButton
                          text={`hsl(${currentColor.hsl.h}, ${currentColor.hsl.s}%, ${currentColor.hsl.l}%)`}
                          label={t("buttons.copy")}
                          className="text-xs px-2 py-0.5"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent colors */}
              {recentColors.length > 0 && (
                <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-zinc-300">{t("labels.recentPicks")}</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {recentColors.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentColor(c)}
                        className="group relative h-10 w-full rounded border border-zinc-700 transition-transform hover:scale-110"
                        style={{ backgroundColor: c.hex }}
                        title={c.hex}
                      >
                        <span className="absolute inset-0 flex items-center justify-center rounded bg-black/50 text-[8px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          {c.hex}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
