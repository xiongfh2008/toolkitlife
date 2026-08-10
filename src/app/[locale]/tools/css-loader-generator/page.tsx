"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type LoaderStyle = "spinner" | "dots" | "pulse" | "bars";

const LOADER_STYLES: Record<
  LoaderStyle,
  { html: string; css: (color: string, bg: string, size: number, speed: number) => string }
> = {
  spinner: {
    html: `<div class="loader"></div>`,
    css: (color, bg, size, speed) => `
.loader {
  width: ${size}px;
  height: ${size}px;
  border: ${Math.max(2, Math.round(size * 0.1))}px solid ${bg};
  border-top-color: ${color};
  border-radius: 50%;
  animation: spin ${speed}s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}`,
  },
  dots: {
    html: `<div class="loader"><span></span><span></span><span></span></div>`,
    css: (color, bg, size, speed) => `
.loader {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${Math.round(size * 0.2)}px;
  width: ${size}px;
  height: ${size}px;
}
.loader span {
  width: ${Math.round(size * 0.25)}px;
  height: ${Math.round(size * 0.25)}px;
  background: ${color};
  border-radius: 50%;
  animation: bounce ${speed}s ease-in-out infinite;
}
.loader span:nth-child(1) { animation-delay: -${(speed * 0.32).toFixed(2)}s; }
.loader span:nth-child(2) { animation-delay: -${(speed * 0.16).toFixed(2)}s; }
@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}`,
  },
  pulse: {
    html: `<div class="loader"></div>`,
    css: (color, _bg, size, speed) => `
.loader {
  width: ${size}px;
  height: ${size}px;
  background: ${color};
  border-radius: 50%;
  animation: pulse ${speed}s ease-in-out infinite;
}
@keyframes pulse {
  0% { transform: scale(0.8); opacity: 0.5; }
  50% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0.8); opacity: 0.5; }
}`,
  },
  bars: {
    html: `<div class="loader"><span></span><span></span><span></span><span></span><span></span></div>`,
    css: (color, bg, size, speed) => `
.loader {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: ${size}px;
  height: ${size}px;
  gap: ${Math.max(2, Math.round(size * 0.05))}px;
}
.loader span {
  flex: 1;
  height: 100%;
  background: ${color};
  animation: grow ${speed}s ease-in-out infinite;
}
.loader span:nth-child(1) { animation-delay: -${(speed * 0.4).toFixed(2)}s; }
.loader span:nth-child(2) { animation-delay: -${(speed * 0.3).toFixed(2)}s; }
.loader span:nth-child(3) { animation-delay: -${(speed * 0.2).toFixed(2)}s; }
.loader span:nth-child(4) { animation-delay: -${(speed * 0.1).toFixed(2)}s; }
@keyframes grow {
  0%, 40%, 100% { transform: scaleY(0.4); }
  20% { transform: scaleY(1); }
}`,
  },
};

export default function CssLoaderGeneratorPage() {
  const t = useTranslations("tools.css-loader-generator");
  const [style, setStyle] = useState<LoaderStyle>("spinner");
  const [color, setColor] = useState("#3b82f6");
  const [bg, setBg] = useState("#27272a");
  const [size, setSize] = useState("40");
  const [speed, setSpeed] = useState("1");

  const css = useMemo(() => {
    const s = parseInt(size, 10);
    const sp = parseFloat(speed);
    if (Number.isNaN(s) || Number.isNaN(sp) || s <= 0 || sp <= 0) return "";
    return LOADER_STYLES[style].css(color, bg, s, sp).trim();
  }, [style, color, bg, size, speed]);

  const snippet = `<style>\n${css}\n</style>\n${LOADER_STYLES[style].html}`;

  const previewHtml = `<style>${css}</style>${LOADER_STYLES[style].html}`;

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="css-loader-generator"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.style")}</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as LoaderStyle)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500"
            >
              <option value="spinner">{t("options.spinner")}</option>
              <option value="dots">{t("options.dots")}</option>
              <option value="pulse">{t("options.pulse")}</option>
              <option value="bars">{t("options.bars")}</option>
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.color")}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-8 w-8 cursor-pointer rounded border border-zinc-700 bg-transparent"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.backgroundColor")}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bg}
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.size")}</label>
              <input
                type="number"
                min="10"
                max="200"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.speed")}</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex h-40 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950">
            <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">{t("labels.css")}</label>
              <CopyButton text={snippet} label={t("buttons.copy")} />
            </div>
            <pre className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900 p-4 font-mono text-sm text-zinc-300">
              {snippet}
            </pre>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
