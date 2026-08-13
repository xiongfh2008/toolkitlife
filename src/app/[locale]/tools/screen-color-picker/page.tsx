"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const HISTORY_KEY = "tp:screen-colors";
const MAX_HISTORY = 10;

interface PickedColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

// EyeDropper is not (yet) in every TS lib.dom, so declare a minimal shape.
interface EyeDropperLike {
  open(): Promise<{ sRGBHex: string }>;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const n = parseInt(hex.replace("#", ""), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
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

export default function ScreenColorPickerPage() {
  const t = useTranslations("tools.screen-color-picker");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];
  const guideSteps = t.raw("guide.steps") as string[];

  // Default to supported during SSR (server can't detect EyeDropper), then
  // correct on hydration so unsupported browsers get the warning instead of a
  // brief flash of it on every load.
  const [supported, setSupported] = useState(true);
  const [picking, setPicking] = useState(false);
  const [currentColor, setCurrentColor] = useState<PickedColor | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "EyeDropper" in window);
    try {
      setHistory(JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"));
    } catch {
      setHistory([]);
    }
  }, []);

  const addColor = useCallback((hex: string) => {
    const rgb = hexToRgb(hex);
    const color: PickedColor = {
      hex,
      rgb,
      hsl: rgbToHsl(rgb.r, rgb.g, rgb.b),
    };
    setCurrentColor(color);
    setHistory((prev) => {
      const next = [
        hex,
        ...prev.filter((c) => c.toLowerCase() !== hex.toLowerCase()),
      ].slice(0, MAX_HISTORY);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const pickFromScreen = useCallback(async () => {
    const Ctor = (window as unknown as { EyeDropper?: new () => EyeDropperLike })
      .EyeDropper;
    if (!Ctor) return;
    setPicking(true);
    try {
      const dropper = new Ctor();
      const result = await dropper.open();
      if (result?.sRGBHex) addColor(result.sRGBHex.toLowerCase());
    } catch {
      // User dismissed the eyedropper — nothing to do.
    } finally {
      setPicking(false);
    }
  }, [addColor]);

  const selectHistory = (hex: string) => {
    const rgb = hexToRgb(hex);
    setCurrentColor({ hex, rgb, hsl: rgbToHsl(rgb.r, rgb.g, rgb.b) });
  };

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors";

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      category={t("category")}
      slug="screen-color-picker"
      keywords={keywords}
      faqs={faqs}
      relatedTools={relatedTools}
      guide={
        <div className="space-y-4 text-sm text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-100">
            {t("guide.heading")}
          </h2>
          <ol className="list-decimal list-inside space-y-2">
            {guideSteps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Unsupported browser notice */}
        {!supported && (
          <div className="rounded-xl border border-amber-600/40 bg-amber-500/10 px-5 py-4 text-sm text-amber-200">
            {t("ui.unsupported")}
          </div>
        )}

        {/* Pick button */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={pickFromScreen}
            disabled={!supported || picking}
            className={`inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-base font-semibold transition-all ${
              supported
                ? "bg-blue-600 text-white hover:bg-blue-500"
                : "cursor-not-allowed bg-zinc-800 text-zinc-500"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m2 22 1-1h3l9-9" />
              <path d="M3 21v-3l9-9" />
              <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z" />
            </svg>
            {picking ? t("ui.picking") : t("ui.pickButton")}
          </button>
          <p className="text-xs text-zinc-500">{t("ui.hint")}</p>
        </div>

        {/* Current color */}
        {currentColor && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <h3 className="mb-3 text-sm font-semibold text-zinc-300">
              {t("ui.pickedColor")}
            </h3>
            <div
              className="mb-4 h-24 w-full rounded-lg border border-zinc-700"
              style={{ backgroundColor: currentColor.hex }}
            />
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-zinc-400">HEX</span>
                <div className="flex items-center gap-2">
                  <code className="text-sm text-zinc-100">{currentColor.hex}</code>
                  <CopyButton
                    text={currentColor.hex}
                    label={t("ui.copy")}
                    className="text-xs px-2 py-0.5"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-zinc-400">RGB</span>
                <div className="flex items-center gap-2">
                  <code className="text-sm text-zinc-100">
                    {currentColor.rgb.r}, {currentColor.rgb.g}, {currentColor.rgb.b}
                  </code>
                  <CopyButton
                    text={`rgb(${currentColor.rgb.r}, ${currentColor.rgb.g}, ${currentColor.rgb.b})`}
                    label={t("ui.copy")}
                    className="text-xs px-2 py-0.5"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-zinc-400">HSL</span>
                <div className="flex items-center gap-2">
                  <code className="text-sm text-zinc-100">
                    {currentColor.hsl.h}, {currentColor.hsl.s}%, {currentColor.hsl.l}%
                  </code>
                  <CopyButton
                    text={`hsl(${currentColor.hsl.h}, ${currentColor.hsl.s}%, ${currentColor.hsl.l}%)`}
                    label={t("ui.copy")}
                    className="text-xs px-2 py-0.5"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-300">
                {t("ui.recentPicks")}
              </h3>
              <button
                onClick={clearHistory}
                className="text-xs text-zinc-500 transition-colors hover:text-zinc-300"
              >
                {t("ui.clear")}
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
              {history.map((hex) => (
                <button
                  key={hex}
                  onClick={() => selectHistory(hex)}
                  className="group relative h-10 w-full rounded border border-zinc-700 transition-transform hover:scale-110"
                  style={{ backgroundColor: hex }}
                  title={hex}
                >
                  <span className="absolute inset-0 flex items-center justify-center rounded bg-black/50 text-[8px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {hex}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
