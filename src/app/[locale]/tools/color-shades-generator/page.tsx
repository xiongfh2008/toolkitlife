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

function mixWithWhite({ r, g, b }: RGB, factor: number): RGB {
  return {
    r: Math.round(r + (255 - r) * factor),
    g: Math.round(g + (255 - g) * factor),
    b: Math.round(b + (255 - b) * factor),
  };
}

function mixWithBlack({ r, g, b }: RGB, factor: number): RGB {
  return {
    r: Math.round(r * (1 - factor)),
    g: Math.round(g * (1 - factor)),
    b: Math.round(b * (1 - factor)),
  };
}

export default function ColorShadesGeneratorPage() {
  const t = useTranslations("tools.color-shades-generator");
  const [hex, setHex] = useState("#3b82f6");
  const [count, setCount] = useState(5);

  const shades = useMemo(() => {
    const base = hexToRgb(hex);
    if (!base) return [];
    const half = Math.floor(count / 2);
    const arr: { name: string; hex: string; isBase: boolean }[] = [];
    for (let i = half; i > 0; i--) {
      const factor = i / (half + 1);
      arr.push({ name: `-${(half - i + 1) * 100}`, hex: rgbToHex(mixWithBlack(base, factor)), isBase: false });
    }
    arr.push({ name: "-base", hex: rgbToHex(base), isBase: true });
    for (let i = 1; i <= half; i++) {
      const factor = i / (half + 1);
      arr.push({ name: `-${(i) * 100}`, hex: rgbToHex(mixWithWhite(base, factor)), isBase: false });
    }
    if (count % 2 === 0) {
      arr.pop();
    }
    return arr;
  }, [hex, count]);

  const paletteCss = shades.map((s) => `  ${s.name}: ${s.hex};`).join("\n");

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="color-shades-generator"
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-zinc-300">{t("labels.baseColor")}</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={hexToRgb(hex) ? hex : "#3b82f6"}
                onChange={(e) => setHex(e.target.value)}
                className="h-8 w-8 cursor-pointer rounded border border-zinc-700 bg-transparent"
              />
              <input
                type="text"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm text-zinc-300">{t("labels.shades")}</label>
              <span className="text-xs text-zinc-500">{count}</span>
            </div>
            <input
              type="range"
              min={3}
              max={11}
              step={2}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
        </div>

        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${shades.length || 1}, minmax(0, 1fr))` }}>
          {shades.map((shade) => (
            <button
              key={shade.hex}
              onClick={() => setHex(shade.hex)}
              className={`group relative h-32 rounded-lg border-2 transition-all ${shade.isBase ? "border-blue-500" : "border-transparent hover:border-zinc-600"}`}
              style={{ backgroundColor: shade.hex }}
            >
              <span className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                {shade.hex}
              </span>
            </button>
          ))}
        </div>

        {shades.length > 0 && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <pre className="overflow-x-auto text-sm text-zinc-300">{paletteCss}</pre>
            <div className="mt-3">
              <CopyButton text={paletteCss} label={t("buttons.copy")} />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
