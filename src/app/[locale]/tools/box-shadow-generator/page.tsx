"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface Shadow {
  id: number;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  inset: boolean;
}

let nextId = 1;

function createShadow(): Shadow {
  return { id: ++nextId, x: 4, y: 4, blur: 10, spread: 0, color: "#0000004d", inset: false };
}

export default function BoxShadowGeneratorPage() {
  const t = useTranslations("tools.box-shadow-generator");

  const [shadows, setShadows] = useState<Shadow[]>([createShadow()]);
  const [activeId, setActiveId] = useState<number>(shadows[0].id);

  const activeShadow = shadows.find((s) => s.id === activeId) || shadows[0];

  const updateShadow = (id: number, updates: Partial<Shadow>) => {
    setShadows((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const addShadow = () => {
    const ns = createShadow();
    setShadows((prev) => [...prev, ns]);
    setActiveId(ns.id);
  };

  const removeShadow = (id: number) => {
    if (shadows.length <= 1) return;
    setShadows((prev) => {
      const next = prev.filter((s) => s.id !== id);
      if (activeId === id) setActiveId(next[0].id);
      return next;
    });
  };

  const shadowCSS = shadows
    .map((s) => `${s.inset ? "inset " : ""}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}`)
    .join(",\n    ");

  const cssCode = `box-shadow: ${shadowCSS};`;

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      category={t("category")}
      slug="box-shadow-generator"
      keywords={t.raw("keywords") as string[]}
      relatedTools={t.raw("relatedTools") as RelatedTool[]}
      faqs={t.raw("faqs") as FAQ[]}
      guide={
        <>
          <h2>{t("guide.whatIs.title")}</h2>
          <p dangerouslySetInnerHTML={{ __html: t("guide.whatIs.body") }} />

          <h3>{t("guide.howTo.title")}</h3>
          <p dangerouslySetInnerHTML={{ __html: t("guide.howTo.intro") }} />
          <ul>
            {(t.raw("guide.howTo.items") as string[]).map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
          <p dangerouslySetInnerHTML={{ __html: t("guide.howTo.outro") }} />

          <h3>{t("guide.tips.title")}</h3>
          {(t.raw("guide.tips.body") as string[]).map((p, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
          ))}

          <h3>{t("guide.useCases.title")}</h3>
          <ul>
            {(t.raw("guide.useCases.items") as string[]).map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>

          <h3>{t("guide.why.title")}</h3>
          <p dangerouslySetInnerHTML={{ __html: t("guide.why.body") }} />
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Controls */}
        <div className="space-y-4">
          {/* Shadow list */}
          <div className="flex flex-wrap items-center gap-2">
            {shadows.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActiveId(s.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeId === s.id ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                {t("labels.shadow", { n: i + 1 })}
                {shadows.length > 1 && (
                  <span
                    onClick={(e) => { e.stopPropagation(); removeShadow(s.id); }}
                    className="ml-2 text-zinc-500 hover:text-red-400"
                  >
                    &#x2715;
                  </span>
                )}
              </button>
            ))}
            <button
              onClick={addShadow}
              className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
            >
              {t("buttons.add")}
            </button>
          </div>

          {/* Sliders */}
          {activeShadow && (
            <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              {([
                { labelKey: "xOffset", key: "x" as const, min: -100, max: 100 },
                { labelKey: "yOffset", key: "y" as const, min: -100, max: 100 },
                { labelKey: "blur", key: "blur" as const, min: 0, max: 200 },
                { labelKey: "spread", key: "spread" as const, min: -100, max: 100 },
              ] as const).map((ctrl) => (
                <div key={ctrl.key}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm text-zinc-300">{t(`labels.${ctrl.labelKey}`)}</label>
                    <span className="text-xs text-zinc-500">{activeShadow[ctrl.key]}px</span>
                  </div>
                  <input
                    type="range"
                    min={ctrl.min}
                    max={ctrl.max}
                    value={activeShadow[ctrl.key]}
                    onChange={(e) => updateShadow(activeShadow.id, { [ctrl.key]: Number(e.target.value) })}
                    className="w-full accent-blue-500"
                  />
                </div>
              ))}

              <div>
                <label className="mb-1 block text-sm text-zinc-300">{t("labels.color")}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={activeShadow.color.substring(0, 7)}
                    onChange={(e) => updateShadow(activeShadow.id, { color: e.target.value })}
                    className="h-8 w-8 cursor-pointer rounded border border-zinc-700 bg-transparent"
                  />
                  <input
                    type="text"
                    value={activeShadow.color}
                    onChange={(e) => updateShadow(activeShadow.id, { color: e.target.value })}
                    className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeShadow.inset}
                  onChange={(e) => updateShadow(activeShadow.id, { inset: e.target.checked })}
                  className="accent-blue-500"
                />
                <span className="text-sm text-zinc-300">{t("labels.inset")}</span>
              </label>
            </div>
          )}
        </div>

        {/* Preview & Code */}
        <div className="space-y-4">
          <div className="flex h-64 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
            <div
              className="h-32 w-48 rounded-lg bg-zinc-700"
              style={{ boxShadow: shadowCSS }}
            />
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <pre className="overflow-x-auto text-sm text-zinc-300">{cssCode}</pre>
            <div className="mt-3">
              <CopyButton text={cssCode} label={t("buttons.copy")} />
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
