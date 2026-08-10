"use client";

import { useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function createSeededRandom(seed: number) {
  let s = seed;
  return () => {
    s = Math.sin(s * 12.9898 + 78.233) * 43758.5453;
    return s - Math.floor(s);
  };
}

function generateBlobPath(complexity: number, size: number, seed: number) {
  const rand = createSeededRandom(seed);
  const points: { x: number; y: number }[] = [];
  const center = size / 2;
  const baseRadius = size * 0.35;

  for (let i = 0; i < complexity; i++) {
    const angle = (i / complexity) * Math.PI * 2;
    const radius = baseRadius * (0.7 + rand() * 0.6);
    points.push({
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
    });
  }

  const catmullRom2bezier = (p0: typeof points[0], p1: typeof points[0], p2: typeof points[0], p3: typeof points[0]) => {
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    return { cp1x, cp1y, cp2x, cp2y, x: p2.x, y: p2.y };
  };

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length; i++) {
    const p0 = points[(i - 1 + points.length) % points.length];
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    const p3 = points[(i + 2) % points.length];
    const curve = catmullRom2bezier(p0, p1, p2, p3);
    d += ` C ${curve.cp1x} ${curve.cp1y}, ${curve.cp2x} ${curve.cp2y}, ${curve.x} ${curve.y}`;
  }
  d += " Z";
  return d;
}

export default function SvgBlobGeneratorPage() {
  const t = useTranslations("tools.svg-blob-generator");
  const [complexity, setComplexity] = useState(8);
  const [color, setColor] = useState("#3b82f6");
  const [size, setSize] = useState(400);
  const [seed, setSeed] = useState(1);

  const path = useMemo(
    () => generateBlobPath(complexity, size, seed),
    [complexity, size, seed]
  );

  const svgCode = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <path d="${path}" fill="${color}" />
</svg>`;

  const regenerate = useCallback(() => {
    setSeed((s) => s + 1);
  }, []);

  const handleDownload = () => {
    const blob = new Blob([svgCode], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "blob.svg";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="svg-blob-generator"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.complexity")}</label>
            <input
              type="range"
              min="4"
              max="20"
              step="1"
              value={complexity}
              onChange={(e) => setComplexity(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <p className="text-right text-xs text-zinc-500">{complexity}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.size")}</label>
            <input
              type="range"
              min="200"
              max="800"
              step="50"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <p className="text-right text-xs text-zinc-500">{size}px</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.color")}</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded border border-zinc-700 bg-transparent"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.seed")}</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                step="1"
                value={seed}
                onChange={(e) => setSeed(Number(e.target.value))}
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
              <button
                onClick={regenerate}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
              >
                {t("buttons.generate")}
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <CopyButton text={svgCode} label={t("buttons.copySvg")} />
            <button
              onClick={handleDownload}
              className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-600 transition-colors"
            >
              {t("buttons.downloadSvg")}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 p-6">
            <svg width={size > 400 ? 400 : size} height={size > 400 ? 400 : size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
              <path d={path} fill={color} />
            </svg>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.svgCode")}</label>
            <pre className="max-h-48 overflow-auto rounded-lg bg-zinc-950 p-3 text-xs text-zinc-300">{svgCode}</pre>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
