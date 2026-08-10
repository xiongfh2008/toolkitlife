"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function GlassmorphismGeneratorPage() {
  const t = useTranslations("tools.glassmorphism-generator");
  const [blur, setBlur] = useState(12);
  const [opacity, setOpacity] = useState(20);
  const [saturation, setSaturation] = useState(180);
  const [radius, setRadius] = useState(16);
  const [border, setBorder] = useState(1);
  const [bgColor, setBgColor] = useState("#3b82f6");

  const css = useMemo(() => {
    return `background: rgba(255, 255, 255, ${opacity / 100});\nborder-radius: ${radius}px;\nbox-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);\nbackdrop-filter: blur(${blur}px) saturate(${saturation}%);\n-webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);\nborder: ${border}px solid rgba(255, 255, 255, 0.18);`;
  }, [blur, opacity, saturation, radius, border]);

  const cardStyle: React.CSSProperties = {
    background: `rgba(255, 255, 255, ${opacity / 100})`,
    borderRadius: `${radius}px`,
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
    backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
    border: `${border}px solid rgba(255, 255, 255, 0.18)`,
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="glassmorphism-generator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.blur")}: {blur}px
            </label>
            <input
              type="range"
              min="0"
              max="40"
              value={blur}
              onChange={(e) => setBlur(parseInt(e.target.value, 10))}
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.opacity")}: {opacity}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(parseInt(e.target.value, 10))}
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.saturation")}: {saturation}%
            </label>
            <input
              type="range"
              min="100"
              max="300"
              value={saturation}
              onChange={(e) => setSaturation(parseInt(e.target.value, 10))}
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.radius")}: {radius}px
            </label>
            <input
              type="range"
              min="0"
              max="48"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value, 10))}
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.border")}: {border}px
            </label>
            <input
              type="range"
              min="0"
              max="5"
              value={border}
              onChange={(e) => setBorder(parseInt(e.target.value, 10))}
              className="w-full"
            />
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
          style={{ background: bgColor }}
        >
          <div
            className="flex h-40 w-64 flex-col items-center justify-center p-6 text-center"
            style={cardStyle}
          >
            <h3 className="text-lg font-semibold text-zinc-900">
              {t("preview.title")}
            </h3>
            <p className="text-sm text-zinc-800">{t("preview.body")}</p>
          </div>
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
