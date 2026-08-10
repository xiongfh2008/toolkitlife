"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type ColorMode = "hex" | "rgb" | "hsl" | "hsv";

interface RGB { r: number; g: number; b: number; }
interface HSL { h: number; s: number; l: number; }
interface HSV { h: number; s: number; v: number; }

function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)); }

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

function rgbToHsl({ r, g, b }: RGB): HSL {
  const rr = r / 255, gg = g / 255, bb = b / 255;
  const max = Math.max(rr, gg, bb), min = Math.min(rr, gg, bb);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rr: h = (gg - bb) / d + (gg < bb ? 6 : 0); break;
      case gg: h = (bb - rr) / d + 2; break;
      case bb: h = (rr - gg) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb({ h, s, l }: HSL): RGB {
  const hh = clamp(h, 0, 360) / 360;
  const ss = clamp(s, 0, 100) / 100;
  const ll = clamp(l, 0, 100) / 100;
  let r = ll, g = ll, b = ll;
  if (ss !== 0) {
    const q = ll < 0.5 ? ll * (1 + ss) : ll + ss - ll * ss;
    const p = 2 * ll - q;
    const hue2rgb = (p1: number, q1: number, t: number) => {
      let tt = t;
      if (tt < 0) tt += 1;
      if (tt > 1) tt -= 1;
      if (tt < 1 / 6) return p1 + (q1 - p1) * 6 * tt;
      if (tt < 1 / 2) return q1;
      if (tt < 2 / 3) return p1 + (q1 - p1) * (2 / 3 - tt) * 6;
      return p1;
    };
    r = hue2rgb(p, q, hh + 1 / 3);
    g = hue2rgb(p, q, hh);
    b = hue2rgb(p, q, hh - 1 / 3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function rgbToHsv({ r, g, b }: RGB): HSV {
  const rr = r / 255, gg = g / 255, bb = b / 255;
  const max = Math.max(rr, gg, bb), min = Math.min(rr, gg, bb);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    switch (max) {
      case rr: h = ((gg - bb) / d + (gg < bb ? 6 : 0)) / 6; break;
      case gg: h = ((bb - rr) / d + 2) / 6; break;
      case bb: h = ((rr - gg) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(max === 0 ? 0 : (d / max) * 100), v: Math.round(max * 100) };
}

function hsvToRgb({ h, s, v }: HSV): RGB {
  const hh = clamp(h, 0, 360) / 360;
  const ss = clamp(s, 0, 100) / 100;
  const vv = clamp(v, 0, 100) / 100;
  const i = Math.floor(hh * 6);
  const f = hh * 6 - i;
  const p = vv * (1 - ss);
  const q = vv * (1 - f * ss);
  const t = vv * (1 - (1 - f) * ss);
  let r = 0, g = 0, b = 0;
  switch (i % 6) {
    case 0: r = vv; g = t; b = p; break;
    case 1: r = q; g = vv; b = p; break;
    case 2: r = p; g = vv; b = t; break;
    case 3: r = p; g = q; b = vv; break;
    case 4: r = t; g = p; b = vv; break;
    case 5: r = vv; g = p; b = q; break;
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

export default function ColorConverterPage() {
  const t = useTranslations("tools.color-converter");
  const [mode, setMode] = useState<ColorMode>("hex");
  const [hex, setHex] = useState("#3b82f6");
  const [rgb, setRgb] = useState<RGB>({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState<HSL>({ h: 217, s: 91, l: 60 });
  const [hsv, setHsv] = useState<HSV>({ h: 217, s: 76, v: 96 });

  const color = useMemo(() => {
    if (mode === "hex") return hexToRgb(hex);
    if (mode === "rgb") return rgb;
    if (mode === "hsl") return hslToRgb(hsl);
    return hsvToRgb(hsv);
  }, [mode, hex, rgb, hsl, hsv]);

  const all = useMemo(() => {
    if (!color) return null;
    const h = rgbToHsl(color);
    const v = rgbToHsv(color);
    return {
      hex: rgbToHex(color),
      rgb: color,
      hsl: h,
      hsv: v,
    };
  }, [color]);

  const updateFromHex = (value: string) => {
    setHex(value);
    const c = hexToRgb(value);
    if (c) {
      setRgb(c);
      setHsl(rgbToHsl(c));
      setHsv(rgbToHsv(c));
    }
    setMode("hex");
  };

  const updateFromRgb = (value: RGB) => {
    setRgb(value);
    setHex(rgbToHex(value));
    setHsl(rgbToHsl(value));
    setHsv(rgbToHsv(value));
    setMode("rgb");
  };

  const updateFromHsl = (value: HSL) => {
    setHsl(value);
    const c = hslToRgb(value);
    setRgb(c);
    setHex(rgbToHex(c));
    setHsv(rgbToHsv(c));
    setMode("hsl");
  };

  const updateFromHsv = (value: HSV) => {
    setHsv(value);
    const c = hsvToRgb(value);
    setRgb(c);
    setHex(rgbToHex(c));
    setHsl(rgbToHsl(c));
    setMode("hsv");
  };

  const cssString = all ? `color: ${all.hex};\nbackground-color: ${all.hex};` : "";

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="color-converter"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div>
            <label className="mb-1 block text-sm text-zinc-300">HEX</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={all?.hex ?? "#000000"}
                onChange={(e) => updateFromHex(e.target.value)}
                className="h-8 w-8 cursor-pointer rounded border border-zinc-700 bg-transparent"
              />
              <input
                type="text"
                value={hex}
                onChange={(e) => updateFromHex(e.target.value)}
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-zinc-300">RGB</label>
            <div className="grid grid-cols-3 gap-2">
              {(["r", "g", "b"] as const).map((k) => (
                <input
                  key={k}
                  type="number"
                  min={0}
                  max={255}
                  value={rgb[k]}
                  onChange={(e) => updateFromRgb({ ...rgb, [k]: Number(e.target.value) })}
                  className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 outline-none focus:border-blue-500"
                />
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-zinc-300">HSL</label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                min={0}
                max={360}
                value={hsl.h}
                onChange={(e) => updateFromHsl({ ...hsl, h: Number(e.target.value) })}
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 outline-none focus:border-blue-500"
              />
              <input
                type="number"
                min={0}
                max={100}
                value={hsl.s}
                onChange={(e) => updateFromHsl({ ...hsl, s: Number(e.target.value) })}
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 outline-none focus:border-blue-500"
              />
              <input
                type="number"
                min={0}
                max={100}
                value={hsl.l}
                onChange={(e) => updateFromHsl({ ...hsl, l: Number(e.target.value) })}
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-zinc-300">HSV</label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                min={0}
                max={360}
                value={hsv.h}
                onChange={(e) => updateFromHsv({ ...hsv, h: Number(e.target.value) })}
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 outline-none focus:border-blue-500"
              />
              <input
                type="number"
                min={0}
                max={100}
                value={hsv.s}
                onChange={(e) => updateFromHsv({ ...hsv, s: Number(e.target.value) })}
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 outline-none focus:border-blue-500"
              />
              <input
                type="number"
                min={0}
                max={100}
                value={hsv.v}
                onChange={(e) => updateFromHsv({ ...hsv, v: Number(e.target.value) })}
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div
            className="h-40 rounded-lg border border-zinc-800"
            style={{ backgroundColor: all?.hex ?? "transparent" }}
          />
          {all && (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">HEX</span>
                <span className="font-mono text-zinc-100">{all.hex}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">RGB</span>
                <span className="font-mono text-zinc-100">rgb({all.rgb.r}, {all.rgb.g}, {all.rgb.b})</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">HSL</span>
                <span className="font-mono text-zinc-100">hsl({all.hsl.h}, {all.hsl.s}%, {all.hsl.l}%)</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">HSV</span>
                <span className="font-mono text-zinc-100">hsv({all.hsv.h}, {all.hsv.s}%, {all.hsv.v}%)</span>
              </div>
            </div>
          )}
          {all && (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <pre className="overflow-x-auto text-sm text-zinc-300">{cssString}</pre>
              <div className="mt-3">
                <CopyButton text={cssString} label={t("buttons.copy")} />
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
