"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type Preset = "none" | "circle" | "ellipse" | "inset" | "polygon" | "custom";

const PRESETS: Record<string, string> = {
  circle: "circle(50% at 50% 50%)",
  ellipse: "ellipse(50% 30% at 50% 50%)",
  inset: "inset(10% 20% 10% 20% round 10px)",
  polygon:
    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
  triangle: "polygon(50% 0%, 0% 100%, 100% 100%)",
  rhombus: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
  arrow: "polygon(0% 35%, 70% 35%, 70% 0%, 100% 50%, 70% 100%, 70% 65%, 0% 65%)",
  star: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
};

export default function CssClipPathPage() {
  const t = useTranslations("tools.css-clip-path");
  const [preset, setPreset] = useState<Preset>("circle");
  const [custom, setCustom] = useState(
    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
  );
  const [shapeColor, setShapeColor] = useState("#3b82f6");
  const [bgColor, setBgColor] = useState("#18181b");

  const clipPath = useMemo(() => {
    if (preset === "custom") return custom;
    if (preset === "none") return "none";
    return PRESETS[preset] || "none";
  }, [preset, custom]);

  const css = `clip-path: ${clipPath};`;

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="css-clip-path"
    >
      <div className="max-w-3xl space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            {t("labels.preset")}
          </label>
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value as Preset)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
          >
            <option value="none">{t("options.none")}</option>
            <option value="circle">{t("options.circle")}</option>
            <option value="ellipse">{t("options.ellipse")}</option>
            <option value="inset">{t("options.inset")}</option>
            <option value="polygon">{t("options.polygon")}</option>
            <option value="triangle">{t("options.triangle")}</option>
            <option value="rhombus">{t("options.rhombus")}</option>
            <option value="arrow">{t("options.arrow")}</option>
            <option value="star">{t("options.star")}</option>
            <option value="custom">{t("options.custom")}</option>
          </select>
        </div>

        {preset === "custom" && (
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.customValue")}
            </label>
            <textarea
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.shapeColor")}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={shapeColor}
                onChange={(e) => setShapeColor(e.target.value)}
                className="h-10 w-10 rounded border border-zinc-700 bg-zinc-800"
              />
              <input
                type="text"
                value={shapeColor}
                onChange={(e) => setShapeColor(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.backgroundColor")}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-10 w-10 rounded border border-zinc-700 bg-zinc-800"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div
          className="flex h-64 w-full items-center justify-center rounded-lg border border-zinc-700"
          style={{ backgroundColor: bgColor }}
        >
          <div
            className="h-40 w-40 rounded-lg"
            style={{
              backgroundColor: shapeColor,
              clipPath,
            }}
          />
        </div>

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
