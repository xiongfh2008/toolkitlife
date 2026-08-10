"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function NoiseGeneratorPage() {
  const t = useTranslations("tools.noise-generator");
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState("256");
  const [baseColor, setBaseColor] = useState("#27272a");
  const [opacity, setOpacity] = useState("0.15");
  const [density, setDensity] = useState("0.5");
  const [svgCode, setSvgCode] = useState("");

  const seed = 12345;

  const random = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };

  const generateSvg = () => {
    const s = parseInt(size, 10) || 256;
    const op = parseFloat(opacity) || 0.15;
    const dens = Math.max(0.01, Math.min(1, parseFloat(density) || 0.5));
    const count = Math.floor(s * s * dens * 0.5);

    let rects = "";
    for (let i = 0; i < count; i += 1) {
      const x = Math.floor(random(seed + i * 2) * s);
      const y = Math.floor(random(seed + i * 3) * s);
      const w = 1 + Math.floor(random(seed + i * 5) * 2);
      const h = 1 + Math.floor(random(seed + i * 7) * 2);
      const alpha = (random(seed + i * 11) * op).toFixed(3);
      rects += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#ffffff" fill-opacity="${alpha}"/>`;
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"><rect width="${s}" height="${s}" fill="${baseColor}"/>${rects}</svg>`;
    setSvgCode(svg);
    return svg;
  };

  useEffect(() => {
    generateSvg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downloadPng = async () => {
    const svg = svgRef.current;
    if (!svg) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = parseInt(size, 10) || 256;
      canvas.height = parseInt(size, 10) || 256;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const png = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = png;
      link.download = `noise-${size}.png`;
      link.click();
    };
    img.src = url;
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="noise-generator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.size")}
            </label>
            <input
              type="number"
              min="16"
              step="16"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.density")}
            </label>
            <input
              type="number"
              min="0.01"
              max="1"
              step="0.05"
              value={density}
              onChange={(e) => setDensity(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.backgroundColor")}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="h-10 w-10 rounded-lg border border-zinc-700 bg-zinc-800"
              />
              <input
                type="text"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.opacity")}
            </label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        <button
          onClick={generateSvg}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
        >
          {t("buttons.generate")}
        </button>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
          <div
            className="inline-block rounded-lg border border-zinc-700 overflow-hidden"
            dangerouslySetInnerHTML={{
              __html: svgCode,
            }}
          />
          <svg
            ref={svgRef}
            className="hidden"
            dangerouslySetInnerHTML={{ __html: svgCode.replace(/<svg[^>]*>/, "").replace(/<\/svg>/, "") }}
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={downloadPng}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500 transition-colors"
            >
              {t("buttons.downloadPng")}
            </button>
            <CopyButton
              text={svgCode}
              label={t("buttons.copySvg")}
              className="text-sm"
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
