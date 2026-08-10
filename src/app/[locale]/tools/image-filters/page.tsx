"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

interface Sliders {
  grayscale: number;
  sepia: number;
  blur: number;
  brightness: number;
  contrast: number;
  saturate: number;
  hueRotate: number;
}

const DEFAULT_SLIDERS: Sliders = {
  grayscale: 0,
  sepia: 0,
  blur: 0,
  brightness: 100,
  contrast: 100,
  saturate: 100,
  hueRotate: 0,
};

// Instagram-style filter presets, applied through the Canvas filter API.
const PRESETS: { name: string; filter: string }[] = [
  { name: "Original", filter: "" },
  { name: "Vintage", filter: "sepia(0.35) contrast(1.1) brightness(1.05) saturate(1.2)" },
  { name: "Sepia", filter: "sepia(0.8) contrast(1.05) brightness(1.05)" },
  { name: "Noir", filter: "grayscale(1) contrast(1.4) brightness(0.9)" },
  { name: "Grayscale", filter: "grayscale(1)" },
  { name: "Mono", filter: "grayscale(1) brightness(1.05) contrast(1.1)" },
  { name: "Warm", filter: "sepia(0.25) saturate(1.3) hue-rotate(-10deg)" },
  { name: "Cool", filter: "hue-rotate(15deg) saturate(1.1) brightness(1.05)" },
  { name: "Fade", filter: "brightness(1.1) contrast(0.85) saturate(0.85)" },
  { name: "High Contrast", filter: "contrast(1.5) brightness(1.02) saturate(1.1)" },
  { name: "Vibrant", filter: "saturate(1.8) contrast(1.05)" },
  { name: "Drama", filter: "contrast(1.3) brightness(0.85) saturate(1.2)" },
  { name: "Soft", filter: "brightness(1.08) contrast(0.9) saturate(0.9) blur(0.4px)" },
  { name: "Sunset", filter: "sepia(0.5) hue-rotate(-15deg) saturate(1.6) brightness(1.05)" },
  { name: "Cyan", filter: "hue-rotate(120deg) saturate(1.3) brightness(1.02)" },
  { name: "Pastel", filter: "brightness(1.1) contrast(0.8) saturate(0.7) sepia(0.15)" },
];

const buildFilterString = (s: Sliders) =>
  `grayscale(${s.grayscale}%) sepia(${s.sepia}%) blur(${s.blur}px) brightness(${s.brightness}%) contrast(${s.contrast}%) saturate(${s.saturate}%) hue-rotate(${s.hueRotate}deg)`;

export default function ImageFiltersPage() {
  const t = useTranslations("tools.image-filters");
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [srcUrl, setSrcUrl] = useState("");
  const [filter, setFilter] = useState("");
  const [presetName, setPresetName] = useState("Original");
  const [sliders, setSliders] = useState<Sliders>(DEFAULT_SLIDERS);
  const [dragging, setDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        setImg(image);
        setSrcUrl(reader.result as string);
        setSliders(DEFAULT_SLIDERS);
        setFilter("");
        setPresetName("Original");
      };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadFile(file);
    e.target.value = "";
  };

  useEffect(() => {
    if (!img || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.filter = filter;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }, [img, filter]);

  const applyPreset = (p: { name: string; filter: string }) => {
    setFilter(p.filter);
    setPresetName(p.name);
  };

  const updateSlider = (key: keyof Sliders, value: number) => {
    const next = { ...sliders, [key]: value };
    setSliders(next);
    setFilter(buildFilterString(next));
    setPresetName("Custom");
  };

  const resetFilters = () => {
    setSliders(DEFAULT_SLIDERS);
    setFilter("");
    setPresetName("Original");
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "filtered-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const slider = (key: keyof Sliders, min: number, max: number, step: number, label: string) => (
    <div key={key}>
      <label className="mb-1 block text-sm font-medium text-zinc-300">
        {label}: {sliders[key]}
        {key === "blur" ? "px" : key === "hueRotate" ? "°" : "%"}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={sliders[key]}
        onChange={(e) => updateSlider(key, Number(e.target.value))}
        className="w-full accent-blue-500"
      />
    </div>
  );

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="image-filters"
    >
      <div className="max-w-4xl space-y-4">
        {/* Drop zone */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) loadFile(file);
          }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-10 text-center transition-colors ${
            dragging
              ? "border-blue-600 bg-blue-600/10"
              : "border-zinc-700 bg-zinc-800/50 hover:border-blue-600/50"
          }`}
        >
          <svg viewBox="0 0 24 24" className="h-10 w-10 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2 1.586-1.586a2 2 0 0 1 2.828 0L20 14" />
            <path d="M14 8h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
          </svg>
          <p className="text-sm font-medium text-zinc-300">{t("labels.dropPrompt")}</p>
          <p className="text-xs text-zinc-500">{t("labels.dropHint")}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {img && (
          <>
            {/* Filter presets */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                {t("labels.presets")}
              </label>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => {
                  const active = presetName === p.name;
                  return (
                    <button
                      key={p.name}
                      onClick={() => applyPreset(p)}
                      className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                        active
                          ? "border-blue-600 bg-blue-600/10 text-blue-600"
                          : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-blue-500/40 hover:text-blue-600"
                      }`}
                    >
                      {p.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {slider("grayscale", 0, 100, 1, t("labels.grayscale"))}
              {slider("sepia", 0, 100, 1, t("labels.sepia"))}
              {slider("blur", 0, 20, 0.5, t("labels.blur"))}
              {slider("brightness", 0, 200, 1, t("labels.brightness"))}
              {slider("contrast", 0, 200, 1, t("labels.contrast"))}
              {slider("saturate", 0, 200, 1, t("labels.saturate"))}
              {slider("hueRotate", 0, 360, 1, t("labels.hueRotate"))}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <label className="text-sm font-medium text-zinc-300">{t("labels.preview")}</label>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-400">
                    {presetName === "Custom" ? t("labels.custom") : presetName}
                  </span>
                  <button
                    onClick={resetFilters}
                    className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-600 transition-colors"
                  >
                    {t("buttons.reset")}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
                  >
                    {t("buttons.download")}
                  </button>
                </div>
              </div>
              <div className="overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                <canvas ref={canvasRef} className="max-w-full border border-zinc-800" />
              </div>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
