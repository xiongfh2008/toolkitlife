"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { encodeWav } from "@/lib/audio";

const TYPES = ["white", "pink", "brown"] as const;

function generateNoise(type: (typeof TYPES)[number], duration: number, amplitude: number, sampleRate = 44100): Float32Array {
  const len = Math.floor(duration * sampleRate);
  const data = new Float32Array(len);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  let last = 0;
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;
    let v: number;
    if (type === "white") {
      v = white;
    } else if (type === "pink") {
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      v = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    } else {
      v = (last + 0.02 * white) / 1.02;
      last = v;
      v *= 3.5;
    }
    data[i] = Math.max(-1, Math.min(1, v)) * amplitude;
  }
  return data;
}

export default function WhiteNoisePage() {
  const t = useTranslations("tools.white-noise");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [type, setType] = useState<(typeof TYPES)[number]>("white");
  const [duration, setDuration] = useState(10);
  const [amplitude, setAmplitude] = useState(0.5);
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState("");

  const generate = () => {
    setError("");
    try {
      const data = generateNoise(type, duration, amplitude);
      const blob = encodeWav([data], 44100);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
    } catch {
      setError(t("errors.failed"));
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `${type}-noise-${duration}s.wav`;
    a.click();
  };

  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none";

  return (
    <ToolLayout
      title={t("title")}
      slug="white-noise"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.type")}</label>
            <select value={type} onChange={(e) => setType(e.target.value as (typeof TYPES)[number])} className={inputCls}>
              {TYPES.map((k) => (
                <option key={k} value={k}>
                  {t(`types.${k}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.duration")}: {duration}s
            </label>
            <input
              type="range"
              min={1}
              max={60}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.amplitude")}: {Math.round(amplitude * 100)}%
            </label>
            <input
              type="range"
              min={5}
              max={100}
              value={Math.round(amplitude * 100)}
              onChange={(e) => setAmplitude(Number(e.target.value) / 100)}
              className="w-full accent-blue-500"
            />
          </div>
          <button
            onClick={generate}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            {t("buttons.generate")}
          </button>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        <div className="space-y-4">
          {resultUrl ? (
            <>
              <audio controls src={resultUrl} className="w-full" />
              <button
                onClick={handleDownload}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
              >
                {t("buttons.download")}
              </button>
            </>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-zinc-700 text-sm text-zinc-500">
              {t("labels.placeholder")}
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
