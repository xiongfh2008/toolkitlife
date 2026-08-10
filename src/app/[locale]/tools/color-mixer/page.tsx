"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface RGB { r: number; g: number; b: number; }

function hexToRgb(hex: string): RGB | null {
  let h = hex.trim().replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (h.length !== 6) return null;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return null;
  return { r, g, b };
}

function rgbToHex({ r, g, b }: RGB) {
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

function mix(c1: RGB, c2: RGB, ratio: number): RGB {
  return {
    r: Math.round(c1.r * (1 - ratio) + c2.r * ratio),
    g: Math.round(c1.g * (1 - ratio) + c2.g * ratio),
    b: Math.round(c1.b * (1 - ratio) + c2.b * ratio),
  };
}

export default function ColorMixerPage() {
  const t = useTranslations("tools.color-mixer");
  const [color1, setColor1] = useState("#3b82f6");
  const [color2, setColor2] = useState("#ef4444");
  const [ratio, setRatio] = useState(50);

  const result = useMemo(() => {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
    if (!c1 || !c2) return null;
    return rgbToHex(mix(c1, c2, ratio / 100));
  }, [color1, color2, ratio]);

  const css = result ? `background: linear-gradient(to right, ${color1}, ${color2});\nbackground: ${result};` : "";

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="color-mixer"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div>
            <label className="mb-1 block text-sm text-zinc-300">{t("labels.color1")}</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={hexToRgb(color1) ? color1 : "#3b82f6"}
                onChange={(e) => setColor1(e.target.value)}
                className="h-8 w-8 cursor-pointer rounded border border-zinc-700 bg-transparent"
              />
              <input
                type="text"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm text-zinc-300">{t("labels.color2")}</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={hexToRgb(color2) ? color2 : "#ef4444"}
                onChange={(e) => setColor2(e.target.value)}
                className="h-8 w-8 cursor-pointer rounded border border-zinc-700 bg-transparent"
              />
              <input
                type="text"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm text-zinc-300">{t("labels.ratio")}</label>
              <span className="text-xs text-zinc-500">{ratio}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={ratio}
              onChange={(e) => setRatio(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div
            className="h-40 rounded-lg border border-zinc-800"
            style={{ background: result ? `linear-gradient(to right, ${color1}, ${color2})` : "transparent" }}
          />
          <div
            className="h-24 rounded-lg border border-zinc-800 flex items-center justify-center text-lg font-semibold"
            style={{ backgroundColor: result ?? "transparent", color: "#fff" }}
          >
            {result ?? t("labels.invalid")}
          </div>
          {result && (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <pre className="overflow-x-auto text-sm text-zinc-300">{css}</pre>
              <div className="mt-3">
                <CopyButton text={css} label={t("buttons.copy")} />
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
