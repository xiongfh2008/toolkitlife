"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function CssTransformGeneratorPage() {
  const t = useTranslations("tools.css-transform-generator");
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [scale, setScale] = useState(1);
  const [skewX, setSkewX] = useState(0);
  const [skewY, setSkewY] = useState(0);

  const transform = useMemo(() => {
    const parts: string[] = [];
    if (tx !== 0 || ty !== 0) parts.push(`translate(${tx}px, ${ty}px)`);
    if (rotate !== 0) parts.push(`rotate(${rotate}deg)`);
    if (scale !== 1) parts.push(`scale(${scale})`);
    if (skewX !== 0 || skewY !== 0) parts.push(`skew(${skewX}deg, ${skewY}deg)`);
    return parts.length ? parts.join(" ") : "none";
  }, [tx, ty, rotate, scale, skewX, skewY]);

  const css = `transform: ${transform};`;

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="css-transform-generator"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          {([
            { label: t("labels.translateX"), value: tx, set: setTx, min: -200, max: 200, step: 1, unit: "px" },
            { label: t("labels.translateY"), value: ty, set: setTy, min: -200, max: 200, step: 1, unit: "px" },
            { label: t("labels.rotate"), value: rotate, set: setRotate, min: -360, max: 360, step: 1, unit: "°" },
            { label: t("labels.scale"), value: scale, set: setScale, min: 0.1, max: 3, step: 0.1, unit: "" },
            { label: t("labels.skewX"), value: skewX, set: setSkewX, min: -90, max: 90, step: 1, unit: "°" },
            { label: t("labels.skewY"), value: skewY, set: setSkewY, min: -90, max: 90, step: 1, unit: "°" },
          ] as const).map((c) => (
            <div key={c.label}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-zinc-300">{c.label}</label>
                <span className="text-xs text-zinc-500">{c.value}{c.unit}</span>
              </div>
              <input
                type="range"
                min={c.min}
                max={c.max}
                step={c.step ?? 1}
                value={c.value}
                onChange={(e) => c.set(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex h-64 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
            <div
              className="h-24 w-24 rounded-lg bg-blue-600"
              style={{ transform }}
            />
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
