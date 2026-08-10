"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type PatternType = "grid" | "dots" | "lines" | "checkerboard";

export default function CssBackgroundPatternPage() {
  const t = useTranslations("tools.css-background-pattern");
  const [pattern, setPattern] = useState<PatternType>("grid");
  const [color1, setColor1] = useState("#3b82f6");
  const [color2, setColor2] = useState("#1f2937");
  const [size, setSize] = useState(40);

  const css = useMemo(() => {
    switch (pattern) {
      case "grid":
        return `background-color: ${color2};\nbackground-image: linear-gradient(${color1} 1px, transparent 1px), linear-gradient(90deg, ${color1} 1px, transparent 1px);\nbackground-size: ${size}px ${size}px;`;
      case "dots":
        return `background-color: ${color2};\nbackground-image: radial-gradient(${color1} 1.5px, transparent 1.5px);\nbackground-size: ${size}px ${size}px;`;
      case "lines":
        return `background-color: ${color2};\nbackground-image: repeating-linear-gradient(45deg, ${color1} 0, ${color1} 1px, transparent 0, transparent 50%);\nbackground-size: ${size}px ${size}px;`;
      case "checkerboard":
        return `background-color: ${color2};\nbackground-image: conic-gradient(${color1} 90deg, transparent 90deg 180deg, ${color1} 180deg 270deg, transparent 270deg);\nbackground-size: ${size}px ${size}px;`;
      default:
        return "";
    }
  }, [pattern, color1, color2, size]);

  const previewStyle = useMemo<React.CSSProperties>(() => {
    switch (pattern) {
      case "grid":
        return {
          backgroundColor: color2,
          backgroundImage: `linear-gradient(${color1} 1px, transparent 1px), linear-gradient(90deg, ${color1} 1px, transparent 1px)`,
          backgroundSize: `${size}px ${size}px`,
        };
      case "dots":
        return {
          backgroundColor: color2,
          backgroundImage: `radial-gradient(${color1} 1.5px, transparent 1.5px)`,
          backgroundSize: `${size}px ${size}px`,
        };
      case "lines":
        return {
          backgroundColor: color2,
          backgroundImage: `repeating-linear-gradient(45deg, ${color1} 0, ${color1} 1px, transparent 0, transparent 50%)`,
          backgroundSize: `${size}px ${size}px`,
        };
      case "checkerboard":
        return {
          backgroundColor: color2,
          backgroundImage: `conic-gradient(${color1} 90deg, transparent 90deg 180deg, ${color1} 180deg 270deg, transparent 270deg)`,
          backgroundSize: `${size}px ${size}px`,
        };
      default:
        return {};
    }
  }, [pattern, color1, color2, size]);

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="css-background-pattern"
    >
      <div className="max-w-3xl space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            {t("labels.pattern")}
          </label>
          <select
            value={pattern}
            onChange={(e) => setPattern(e.target.value as PatternType)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
          >
            <option value="grid">{t("options.grid")}</option>
            <option value="dots">{t("options.dots")}</option>
            <option value="lines">{t("options.lines")}</option>
            <option value="checkerboard">{t("options.checkerboard")}</option>
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.color1")}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="h-10 w-10 rounded border border-zinc-700 bg-zinc-800"
              />
              <input
                type="text"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.color2")}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="h-10 w-10 rounded border border-zinc-700 bg-zinc-800"
              />
              <input
                type="text"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.size")}: {size}px
            </label>
            <input
              type="range"
              min="10"
              max="120"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value, 10))}
              className="w-full"
            />
          </div>
        </div>

        <div
          className="h-64 w-full rounded-lg border border-zinc-700"
          style={previewStyle}
        />

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-300">
              {t("labels.css")}
            </span>
            <CopyButton text={css} className="text-xs px-2 py-1" />
          </div>
          <pre className="overflow-x-auto rounded bg-zinc-950 p-3 text-xs text-zinc-300">
            {css}
          </pre>
        </div>
      </div>
    </ToolLayout>
  );
}
