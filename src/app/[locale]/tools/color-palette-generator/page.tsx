"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface PaletteColor {
  hex: string;
  locked: boolean;
}

function randomHex(): string {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 0, g: 0, b: 0 };
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

type ExportFormat = "css" | "tailwind" | "hex";
const EXPORT_FORMATS: ExportFormat[] = ["css", "tailwind", "hex"];

export default function ColorPaletteGeneratorPage() {
  const t = useTranslations("tools.color-palette-generator");
  const exportLabels = t.raw("export.formats") as string[];

  const [colors, setColors] = useState<PaletteColor[]>(() =>
    Array.from({ length: 5 }, () => ({ hex: randomHex(), locked: false }))
  );
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("css");

  const generate = useCallback(() => {
    setColors((prev) => prev.map((c) => (c.locked ? c : { ...c, hex: randomHex() })));
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        generate();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [generate]);

  const toggleLock = (idx: number) => {
    setColors((prev) => prev.map((c, i) => (i === idx ? { ...c, locked: !c.locked } : c)));
  };

  const copyHex = async (hex: string, idx: number) => {
    await navigator.clipboard.writeText(hex);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const getExportText = (): string => {
    switch (exportFormat) {
      case "css":
        return `:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join("\n")}\n}`;
      case "tailwind":
        return `colors: {\n${colors.map((c, i) => `  'palette-${i + 1}': '${c.hex}',`).join("\n")}\n}`;
      case "hex":
        return colors.map((c) => c.hex).join("\n");
      default:
        return "";
    }
  };

  const formatLabel = (fmt: ExportFormat) => {
    const idx = EXPORT_FORMATS.indexOf(fmt);
    return exportLabels[idx] ?? fmt;
  };

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      category={t("category")}
      slug="color-palette-generator"
      faqs={t.raw("faqs") as FAQ[]}
      relatedTools={t.raw("relatedTools") as RelatedTool[]}
      keywords={t.raw("keywords") as string[]}
      guide={
        <>
          <h2>{t("guide.whatIs.title")}</h2>
          {(t.raw("guide.whatIs.body") as string[]).map((p, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
          ))}

          <h3>{t("guide.howTo.title")}</h3>
          <p dangerouslySetInnerHTML={{ __html: t("guide.howTo.intro") }} />
          <ul>
            {(t.raw("guide.howTo.items") as string[]).map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>

          <h3>{t("guide.exportFormats.title")}</h3>
          <p dangerouslySetInnerHTML={{ __html: t("guide.exportFormats.intro") }} />
          <ul>
            {(t.raw("guide.exportFormats.items") as string[]).map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>

          <h3>{t("guide.tips.title")}</h3>
          <ul>
            {(t.raw("guide.tips.items") as string[]).map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>

          <h3>{t("guide.useCases.title")}</h3>
          <ul>
            {(t.raw("guide.useCases.items") as string[]).map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </>
      }
    >
      {/* Palette display */}
      <div className="mb-6 grid grid-cols-5 gap-2 overflow-hidden rounded-lg">
        {colors.map((c, i) => {
          const rgb = hexToRgb(c.hex);
          const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
          const isLight = hsl.l > 55;
          return (
            <div
              key={i}
              className="group relative flex min-h-[200px] cursor-pointer flex-col items-center justify-end p-4 transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: c.hex }}
              onClick={() => copyHex(c.hex, i)}
            >
              {/* Lock button */}
              <button
                onClick={(e) => { e.stopPropagation(); toggleLock(i); }}
                className={`absolute top-3 right-3 rounded-full p-1.5 text-xs transition-all ${
                  c.locked
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                } ${isLight ? "bg-black/20 text-black" : "bg-white/20 text-white"}`}
              >
                {c.locked ? "\u{1F512}" : "\u{1F513}"}
              </button>

              {/* Copied indicator */}
              {copiedIdx === i && (
                <span className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg px-3 py-1 text-sm font-medium ${isLight ? "bg-black/70 text-white" : "bg-white/70 text-black"}`}>
                  {t("copied")}
                </span>
              )}

              {/* Color info */}
              <div className={`space-y-0.5 text-center text-xs font-mono ${isLight ? "text-black/80" : "text-white/80"}`}>
                <div className="text-sm font-bold">{c.hex.toUpperCase()}</div>
                <div>rgb({rgb.r}, {rgb.g}, {rgb.b})</div>
                <div>hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          onClick={generate}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
        >
          {t("buttons.generate")}
        </button>
        <span className="text-xs text-zinc-500">{t("hint.spacebar")}</span>
      </div>

      {/* Export */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        <div className="mb-3 flex items-center gap-3">
          <h3 className="text-sm font-medium text-zinc-300">{t("export.title")}</h3>
          {EXPORT_FORMATS.map((fmt) => (
            <button
              key={fmt}
              onClick={() => setExportFormat(fmt)}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                exportFormat === fmt
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {formatLabel(fmt)}
            </button>
          ))}
        </div>
        <pre className="rounded-lg bg-zinc-800 p-4 text-sm text-zinc-300 overflow-x-auto">
          {getExportText()}
        </pre>
        <div className="mt-3">
          <CopyButton text={getExportText()} label={t("export.copy")} />
        </div>
      </div>
    </ToolLayout>
  );
}
