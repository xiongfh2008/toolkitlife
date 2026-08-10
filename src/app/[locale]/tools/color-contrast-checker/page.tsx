"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function parseColor(input: string): { r: number; g: number; b: number } | null {
  const trimmed = input.trim();
  // hex
  if (trimmed.startsWith("#")) {
    let hex = trimmed.slice(1);
    if (hex.length === 3) {
      hex = hex.split("").map((c) => c + c).join("");
    }
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      if ([r, g, b].every((n) => !Number.isNaN(n))) return { r, g, b };
    }
    return null;
  }
  // rgb/rgba
  const rgbMatch = trimmed.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return {
      r: Number(rgbMatch[1]),
      g: Number(rgbMatch[2]),
      b: Number(rgbMatch[3]),
    };
  }
  // hsl/hsla - simple conversion
  const hslMatch = trimmed.match(/hsla?\(\s*(\d+),\s*(\d+)%,?\s*(\d+)%/);
  if (hslMatch) {
    const h = Number(hslMatch[1]) / 360;
    const s = Number(hslMatch[2]) / 100;
    const l = Number(hslMatch[3]) / 100;
    const a = s * Math.min(l, 1 - l);
    const k = (n: number) => (n + h * 12) % 12;
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return {
      r: Math.round(f(0) * 255),
      g: Math.round(f(8) * 255),
      b: Math.round(f(4) * 255),
    };
  }
  return null;
}

function luminance({ r, g, b }: { r: number; g: number; b: number }) {
  const a = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function contrast(rgb1: { r: number; g: number; b: number }, rgb2: { r: number; g: number; b: number }) {
  const l1 = luminance(rgb1) + 0.05;
  const l2 = luminance(rgb2) + 0.05;
  return l1 > l2 ? l1 / l2 : l2 / l1;
}

export default function ColorContrastCheckerPage() {
  const t = useTranslations("tools.color-contrast-checker");
  const [fg, setFg] = useState("#ffffff");
  const [bg, setBg] = useState("#1d4ed8");

  const fgRgb = useMemo(() => parseColor(fg), [fg]);
  const bgRgb = useMemo(() => parseColor(bg), [bg]);
  const ratio = useMemo(() => {
    if (!fgRgb || !bgRgb) return null;
    return contrast(fgRgb, bgRgb);
  }, [fgRgb, bgRgb]);

  const pass = (level: number) => ratio !== null && ratio >= level;

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="color-contrast-checker"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div>
            <label className="mb-1 block text-sm text-zinc-300">{t("labels.foreground")}</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={fgRgb ? `#${((1 << 24) + (fgRgb.r << 16) + (fgRgb.g << 8) + fgRgb.b).toString(16).slice(1)}` : "#ffffff"}
                onChange={(e) => setFg(e.target.value)}
                className="h-8 w-8 cursor-pointer rounded border border-zinc-700 bg-transparent"
              />
              <input
                type="text"
                value={fg}
                onChange={(e) => setFg(e.target.value)}
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm text-zinc-300">{t("labels.background")}</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgRgb ? `#${((1 << 24) + (bgRgb.r << 16) + (bgRgb.g << 8) + bgRgb.b).toString(16).slice(1)}` : "#1d4ed8"}
                onChange={(e) => setBg(e.target.value)}
                className="h-8 w-8 cursor-pointer rounded border border-zinc-700 bg-transparent"
              />
              <input
                type="text"
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div
            className="flex h-40 items-center justify-center rounded-lg border border-zinc-800 text-2xl font-semibold"
            style={{ backgroundColor: bg, color: fg }}
          >
            {t("labels.preview")}
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            {ratio === null ? (
              <p className="text-sm text-red-400">{t("labels.invalid")}</p>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-300">{t("labels.ratio")}</span>
                  <span className="text-2xl font-semibold text-zinc-100">{ratio.toFixed(2)}:1</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`rounded-lg border p-3 text-center ${pass(4.5) ? "border-green-700 bg-green-900/20" : "border-red-700 bg-red-900/20"}`}>
                    <div className="text-sm text-zinc-400">AA</div>
                    <div className={`font-semibold ${pass(4.5) ? "text-green-400" : "text-red-400"}`}>{pass(4.5) ? t("labels.pass") : t("labels.fail")}</div>
                  </div>
                  <div className={`rounded-lg border p-3 text-center ${pass(7) ? "border-green-700 bg-green-900/20" : "border-red-700 bg-red-900/20"}`}>
                    <div className="text-sm text-zinc-400">AAA</div>
                    <div className={`font-semibold ${pass(7) ? "text-green-400" : "text-red-400"}`}>{pass(7) ? t("labels.pass") : t("labels.fail")}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">{t("labels.aaLarge")}</span>
                  <span className={pass(3) ? "text-green-400" : "text-red-400"}>{pass(3) ? t("labels.pass") : t("labels.fail")}</span>
                </div>
              </div>
            )}
          </div>
          {ratio !== null && (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <pre className="overflow-x-auto text-sm text-zinc-300">color: {fg};{`
`}background-color: {bg};</pre>
              <div className="mt-3">
                <CopyButton text={`color: ${fg};\nbackground-color: ${bg};`} label={t("buttons.copy")} />
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
