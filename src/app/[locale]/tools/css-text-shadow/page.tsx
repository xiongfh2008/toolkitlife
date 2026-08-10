"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function CssTextShadowPage() {
  const t = useTranslations("tools.css-text-shadow");
  const [x, setX] = useState(2);
  const [y, setY] = useState(2);
  const [blur, setBlur] = useState(4);
  const [color, setColor] = useState("#000000");

  const css = useMemo(() => `text-shadow: ${x}px ${y}px ${blur}px ${color};`, [x, y, blur, color]);

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="css-text-shadow"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          {[
            { label: t("labels.xOffset"), value: x, set: setX, min: -50, max: 50 },
            { label: t("labels.yOffset"), value: y, set: setY, min: -50, max: 50 },
            { label: t("labels.blur"), value: blur, set: setBlur, min: 0, max: 50 },
          ].map((c) => (
            <div key={c.label}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-zinc-300">{c.label}</label>
                <span className="text-xs text-zinc-500">{c.value}px</span>
              </div>
              <input
                type="range"
                min={c.min}
                max={c.max}
                value={c.value}
                onChange={(e) => c.set(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
          ))}
          <div>
            <label className="mb-1 block text-sm text-zinc-300">{t("labels.color")}</label>
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
        </div>

        <div className="space-y-4">
          <div className="flex h-64 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
            <p
              className="text-4xl font-bold text-zinc-100"
              style={{ textShadow: `${x}px ${y}px ${blur}px ${color}` }}
            >
              {t("labels.preview")}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <pre className="overflow-x-auto text-sm text-zinc-300">{css}</pre>
            <div className="mt-3">
              <CopyButton text={css} label={t("buttons.copy")} />
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
