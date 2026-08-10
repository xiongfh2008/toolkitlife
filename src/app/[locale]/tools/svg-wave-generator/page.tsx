"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function generateWavePath(
  type: "sine" | "sawtooth" | "square",
  width: number,
  height: number,
  amplitude: number,
  frequency: number,
  phase: number
) {
  const points: string[] = [];
  const steps = 200;
  const mid = height / 2;

  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * width;
    const normalized = i / steps;
    let y = mid;

    if (type === "sine") {
      y = mid + Math.sin((normalized * frequency * Math.PI * 2) + phase) * amplitude;
    } else if (type === "sawtooth") {
      const cycle = (normalized * frequency + phase / (Math.PI * 2)) % 1;
      y = mid + (cycle < 0.5 ? cycle * 2 - 0.5 : 0.5 - (cycle - 0.5) * 2) * amplitude * 2;
    } else if (type === "square") {
      const cycle = (normalized * frequency + phase / (Math.PI * 2)) % 1;
      y = mid + (cycle < 0.5 ? amplitude : -amplitude);
    }

    points.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }

  return points.join(" ");
}

export default function SvgWaveGeneratorPage() {
  const t = useTranslations("tools.svg-wave-generator");
  const [type, setType] = useState<"sine" | "sawtooth" | "square">("sine");
  const [amplitude, setAmplitude] = useState(50);
  const [frequency, setFrequency] = useState(3);
  const [phase, setPhase] = useState(0);
  const [color, setColor] = useState("#3b82f6");
  const [strokeWidth, setStrokeWidth] = useState(3);

  const width = 800;
  const height = 200;

  const path = useMemo(
    () => generateWavePath(type, width, height, amplitude, frequency, phase),
    [type, amplitude, frequency, phase]
  );

  const svgCode = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <path d="${path}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;

  const handleDownload = () => {
    const blob = new Blob([svgCode], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "wave.svg";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="svg-wave-generator"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.type")}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as typeof type)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500"
            >
              <option value="sine">{t("options.sine")}</option>
              <option value="sawtooth">{t("options.sawtooth")}</option>
              <option value="square">{t("options.square")}</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.amplitude")}: {amplitude}
            </label>
            <input
              type="range"
              min="5"
              max="90"
              step="1"
              value={amplitude}
              onChange={(e) => setAmplitude(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.frequency")}: {frequency}
            </label>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.phase")}: {phase}
            </label>
            <input
              type="range"
              min="0"
              max="6.28"
              step="0.1"
              value={phase}
              onChange={(e) => setPhase(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.strokeWidth")}: {strokeWidth}
            </label>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.color")}
            </label>
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
            <svg
              width={width}
              height={height}
              viewBox={`0 0 ${width} ${height}`}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d={path}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.svgCode")}
            </label>
            <pre className="max-h-48 overflow-auto rounded-lg bg-zinc-950 p-3 text-xs text-zinc-300">
              {svgCode}
            </pre>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
