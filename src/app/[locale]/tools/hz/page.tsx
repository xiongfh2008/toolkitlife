"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { encodeWav } from "@/lib/audio";

const WAVEFORMS = ["sine", "square", "sawtooth", "triangle"] as const;

function generateTone(
  waveform: (typeof WAVEFORMS)[number],
  freq: number,
  duration: number,
  amplitude: number,
  sampleRate = 44100
): Float32Array {
  const len = Math.floor(duration * sampleRate);
  const data = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / sampleRate;
    const phase = 2 * Math.PI * freq * t;
    let v: number;
    switch (waveform) {
      case "sine":
        v = Math.sin(phase);
        break;
      case "square":
        v = Math.sin(phase) >= 0 ? 1 : -1;
        break;
      case "sawtooth":
        v = 2 * (freq * t - Math.floor(0.5 + freq * t));
        break;
      case "triangle":
        v = 4 * Math.abs(freq * t - Math.floor(freq * t + 0.5)) - 1;
        break;
    }
    data[i] = Math.max(-1, Math.min(1, v)) * amplitude;
  }
  return data;
}

const PRESETS = [261.63, 440, 523.25, 1000];

export default function HzTonePage() {
  const t = useTranslations("tools.hz");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [waveform, setWaveform] = useState<(typeof WAVEFORMS)[number]>("sine");
  const [freq, setFreq] = useState(440);
  const [duration, setDuration] = useState(5);
  const [amplitude, setAmplitude] = useState(0.5);
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState("");

  const generate = () => {
    setError("");
    try {
      const data = generateTone(waveform, freq, duration, amplitude);
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
    a.download = `tone-${waveform}-${freq}hz.wav`;
    a.click();
  };

  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none";

  return (
    <ToolLayout
      title={t("title")}
      slug="hz"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.waveform")}</label>
            <select value={waveform} onChange={(e) => setWaveform(e.target.value as (typeof WAVEFORMS)[number])} className={inputCls}>
              {WAVEFORMS.map((k) => (
                <option key={k} value={k}>
                  {t(`waveforms.${k}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.frequency")}: {freq} Hz
            </label>
            <input
              type="number"
              min={20}
              max={20000}
              value={freq}
              onChange={(e) => setFreq(Math.max(20, Math.min(20000, Number(e.target.value) || 0)))}
              className={inputCls}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => setFreq(p)}
                  className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:border-blue-500 hover:text-blue-400"
                >
                  {p} Hz
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.duration")}: {duration}s
            </label>
            <input
              type="range"
              min={1}
              max={30}
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
