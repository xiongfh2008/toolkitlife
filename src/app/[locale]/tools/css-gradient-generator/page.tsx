"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface ColorStop {
  color: string;
  position: number;
  id: number;
}

type GradientType = "linear" | "radial" | "conic";

const presets: { name: string; type: GradientType; angle: number; stops: Omit<ColorStop, "id">[] }[] = [
  { name: "Sunset", type: "linear", angle: 135, stops: [{ color: "#ff6b6b", position: 0 }, { color: "#feca57", position: 100 }] },
  { name: "Ocean", type: "linear", angle: 180, stops: [{ color: "#0f2027", position: 0 }, { color: "#2c5364", position: 100 }] },
  { name: "Purple Haze", type: "linear", angle: 45, stops: [{ color: "#7b2ff7", position: 0 }, { color: "#c850c0", position: 50 }, { color: "#ff6987", position: 100 }] },
  { name: "Northern Lights", type: "linear", angle: 90, stops: [{ color: "#43e97b", position: 0 }, { color: "#38f9d7", position: 100 }] },
  { name: "Fire", type: "radial", angle: 0, stops: [{ color: "#f83600", position: 0 }, { color: "#f9d423", position: 100 }] },
  { name: "Rainbow", type: "conic", angle: 0, stops: [{ color: "#ff0000", position: 0 }, { color: "#ff8800", position: 17 }, { color: "#ffff00", position: 33 }, { color: "#00ff00", position: 50 }, { color: "#0088ff", position: 67 }, { color: "#8800ff", position: 83 }, { color: "#ff0000", position: 100 }] },
];

let nextId = 100;

export default function CSSGradientGeneratorPage() {
  const t = useTranslations("tools.css-gradient-generator");

  const [type, setType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<ColorStop[]>([
    { color: "#3b82f6", position: 0, id: 1 },
    { color: "#8b5cf6", position: 100, id: 2 },
  ]);

  const getGradientCSS = (): string => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const stopsStr = sortedStops.map((s) => `${s.color} ${s.position}%`).join(", ");
    switch (type) {
      case "linear":
        return `linear-gradient(${angle}deg, ${stopsStr})`;
      case "radial":
        return `radial-gradient(circle, ${stopsStr})`;
      case "conic":
        return `conic-gradient(from ${angle}deg, ${stopsStr})`;
    }
  };

  const cssCode = `background: ${getGradientCSS()};`;

  const addStop = () => {
    setStops((prev) => [...prev, { color: "#ffffff", position: 50, id: ++nextId }]);
  };

  const removeStop = (id: number) => {
    if (stops.length <= 2) return;
    setStops((prev) => prev.filter((s) => s.id !== id));
  };

  const updateStop = (id: number, field: "color" | "position", value: string | number) => {
    setStops((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const applyPreset = (preset: typeof presets[0]) => {
    setType(preset.type);
    setAngle(preset.angle);
    setStops(preset.stops.map((s) => ({ ...s, id: ++nextId })));
  };

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      category={t("category")}
      slug="css-gradient-generator"
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
          {/* Type */}
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.type")}</label>
            <div className="flex gap-2">
              {(["linear", "radial", "conic"] as GradientType[]).map((gt) => (
                <button
                  key={gt}
                  onClick={() => setType(gt)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    type === gt ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  {t(`types.${gt}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Angle */}
          {(type === "linear" || type === "conic") && (
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.angle", { angle })}
              </label>
              <input
                type="range"
                min={0}
                max={360}
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
          )}

          {/* Color stops */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">{t("labels.colorStops")}</label>
              <button
                onClick={addStop}
                className="rounded-lg bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
              >
                {t("buttons.addStop")}
              </button>
            </div>
            <div className="space-y-2">
              {stops.map((stop) => (
                <div key={stop.id} className="flex items-center gap-2 rounded-lg bg-zinc-800 p-2">
                  <input
                    type="color"
                    value={stop.color}
                    onChange={(e) => updateStop(stop.id, "color", e.target.value)}
                    className="h-8 w-8 cursor-pointer rounded border border-zinc-700 bg-transparent"
                  />
                  <input
                    type="text"
                    value={stop.color}
                    onChange={(e) => updateStop(stop.id, "color", e.target.value)}
                    className="w-24 rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-100 outline-none focus:border-blue-500"
                  />
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={stop.position}
                    onChange={(e) => updateStop(stop.id, "position", Number(e.target.value))}
                    className="flex-1 accent-blue-500"
                  />
                  <span className="w-10 text-right text-xs text-zinc-400">{stop.position}%</span>
                  {stops.length > 2 && (
                    <button
                      onClick={() => removeStop(stop.id)}
                      className="text-zinc-500 hover:text-red-400 transition-colors text-sm"
                    >
                      &#x2715;
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Presets */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">{t("labels.presets")}</label>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p.name}
                  onClick={() => applyPreset(p)}
                  className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
                >
                  {t(`presetNames.${p.name}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview & Code */}
        <div className="space-y-4">
          <div
            className="h-64 w-full rounded-lg border border-zinc-800"
            style={{ background: getGradientCSS() }}
          />
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
