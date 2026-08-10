"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

const presets = [
  { label: "16:9", w: 16, h: 9 },
  { label: "4:3", w: 4, h: 3 },
  { label: "1:1", w: 1, h: 1 },
  { label: "21:9", w: 21, h: 9 },
  { label: "9:16", w: 9, h: 16 },
  { label: "3:2", w: 3, h: 2 },
];

interface GuideSection {
  title: string;
  paragraphs?: string[];
  items?: string[];
}

export default function AspectRatioCalculatorPage() {
  const t = useTranslations("tools.aspect-ratio-calculator");
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [locked, setLocked] = useState(false);
  const [lockedRatio, setLockedRatio] = useState<number | null>(null);

  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];
  const guideIntro = t.raw("guide.intro") as { title: string; paragraphs: string[] };
  const guideSections = t.raw("guide.sections") as GuideSection[];

  const ratio = useMemo(() => {
    if (width <= 0 || height <= 0) return t("labels.ratioNa");
    const g = gcd(width, height);
    return `${width / g}:${height / g}`;
  }, [width, height, t]);

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (locked && lockedRatio && val > 0) {
      setHeight(Math.round(val / lockedRatio));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (locked && lockedRatio && val > 0) {
      setWidth(Math.round(val * lockedRatio));
    }
  };

  const handleLockToggle = () => {
    if (!locked && width > 0 && height > 0) {
      setLockedRatio(width / height);
    }
    setLocked(!locked);
  };

  const applyPreset = (w: number, h: number) => {
    // Keep the larger dimension and calculate the other
    const scaledH = Math.round((width * h) / w);
    setHeight(scaledH);
    setLockedRatio(w / h);
    setLocked(true);
  };

  // Visual preview dimensions (max 300px)
  const previewMax = 300;
  const previewW = width >= height ? previewMax : Math.round((previewMax * width) / height);
  const previewH = height >= width ? previewMax : Math.round((previewMax * height) / width);

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="aspect-ratio-calculator"
      keywords={keywords}
      guide={
        <>
          <h2>{guideIntro.title}</h2>
          {guideIntro.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {guideSections.map((section, i) => (
            <section key={i}>
              <h3>{section.title}</h3>
              {section.paragraphs?.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
              {section.items && (
                <ul>
                  {section.items.map((item, k) => (
                    <li key={k}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </>
      }
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Controls */}
        <div className="space-y-4">
          {/* Dimensions */}
          <div className="grid grid-cols-[1fr,auto,1fr] items-end gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.width")}</label>
              <input
                type="number"
                min={1}
                value={width}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleLockToggle}
              className={`mb-0.5 rounded-lg px-3 py-2 text-lg transition-colors ${
                locked ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
              title={locked ? t("labels.lockTitleLocked") : t("labels.lockTitleUnlocked")}
            >
              {locked ? "\u{1F512}" : "\u{1F513}"}
            </button>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.height")}</label>
              <input
                type="number"
                min={1}
                value={height}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Ratio display */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-center">
            <span className="text-sm text-zinc-400">{t("labels.aspectRatio")}</span>
            <p className="text-3xl font-bold text-blue-400">{ratio}</p>
          </div>

          {/* Presets */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">{t("labels.commonRatios")}</label>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p.w, p.h)}
                  className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visual preview */}
        <div className="flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 p-6 min-h-[350px]">
          <div className="flex flex-col items-center gap-3">
            <div
              className="rounded border-2 border-blue-500 bg-blue-500/10 transition-all flex items-center justify-center"
              style={{ width: `${previewW}px`, height: `${previewH}px` }}
            >
              <span className="text-sm text-blue-400 font-mono">
                {width} x {height}
              </span>
            </div>
            <span className="text-xs text-zinc-500">{ratio}</span>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
