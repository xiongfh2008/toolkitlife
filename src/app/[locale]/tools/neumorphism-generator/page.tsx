"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function NeumorphismGeneratorPage() {
  const t = useTranslations("tools.neumorphism-generator");
  const [distance, setDistance] = useState(12);
  const [blur, setBlur] = useState(24);
  const [intensity, setIntensity] = useState(15);
  const [radius, setRadius] = useState(24);
  const [shape, setShape] = useState<"flat" | "concave" | "convex" | "pressed">(
    "flat",
  );
  const [bgColor, setBgColor] = useState("#e0e5ec");

  const shadowColor = useMemo(() => {
    const hex = bgColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const light = `rgba(${Math.min(255, r + 255 * (intensity / 100))}, ${Math.min(255, g + 255 * (intensity / 100))}, ${Math.min(255, b + 255 * (intensity / 100))}, 1)`;
    const dark = `rgba(${Math.max(0, r - 255 * (intensity / 100))}, ${Math.max(0, g - 255 * (intensity / 100))}, ${Math.max(0, b - 255 * (intensity / 100))}, 1)`;
    return { light, dark };
  }, [bgColor, intensity]);

  const style = useMemo<React.CSSProperties>(() => {
    const { light, dark } = shadowColor;
    const base: React.CSSProperties = {
      borderRadius: `${radius}px`,
      background: bgColor,
      boxShadow: `${distance}px ${distance}px ${blur}px ${dark}, -${distance}px -${distance}px ${blur}px ${light}`,
    };

    if (shape === "concave") {
      base.background = `linear-gradient(145deg, ${shadowColor.dark}, ${shadowColor.light})`;
    } else if (shape === "convex") {
      base.background = `linear-gradient(145deg, ${shadowColor.light}, ${shadowColor.dark})`;
    } else if (shape === "pressed") {
      base.boxShadow = `inset ${distance}px ${distance}px ${blur}px ${dark}, inset -${distance}px -${distance}px ${blur}px ${light}`;
    }

    return base;
  }, [distance, blur, radius, shape, bgColor, shadowColor]);

  const css = useMemo(() => {
    const { light, dark } = shadowColor;
    let background = bgColor;
    if (shape === "concave") {
      background = `linear-gradient(145deg, ${dark}, ${light})`;
    } else if (shape === "convex") {
      background = `linear-gradient(145deg, ${light}, ${dark})`;
    }

    const boxShadow =
      shape === "pressed"
        ? `inset ${distance}px ${distance}px ${blur}px ${dark}, inset -${distance}px -${distance}px ${blur}px ${light}`
        : `${distance}px ${distance}px ${blur}px ${dark}, -${distance}px -${distance}px ${blur}px ${light}`;

    return `border-radius: ${radius}px;\nbackground: ${background};\nbox-shadow: ${boxShadow};`;
  }, [distance, blur, radius, shape, bgColor, shadowColor]);

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="neumorphism-generator"
    >
      <div className="max-w-3xl space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            {t("labels.shape")}
          </label>
          <select
            value={shape}
            onChange={(e) => setShape(e.target.value as typeof shape)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
          >
            <option value="flat">{t("options.flat")}</option>
            <option value="concave">{t("options.concave")}</option>
            <option value="convex">{t("options.convex")}</option>
            <option value="pressed">{t("options.pressed")}</option>
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.distance")}: {distance}px
            </label>
            <input
              type="range"
              min="2"
              max="40"
              value={distance}
              onChange={(e) => setDistance(parseInt(e.target.value, 10))}
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.blur")}: {blur}px
            </label>
            <input
              type="range"
              min="0"
              max="60"
              value={blur}
              onChange={(e) => setBlur(parseInt(e.target.value, 10))}
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.intensity")}: {intensity}%
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value, 10))}
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
              max="60"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value, 10))}
              className="w-full"
            />
          </div>
          <div className="sm:col-span-2">
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
            className="flex h-40 w-64 items-center justify-center text-center"
            style={style}
          >
            <span className="font-semibold" style={{ color: shadowColor.dark }}>
              {t("preview.text")}
            </span>
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
