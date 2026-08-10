"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const PRESETS = [
  { key: "fiveK", distance: 5 },
  { key: "tenK", distance: 10 },
  { key: "halfMarathon", distance: 21.0975 },
  { key: "marathon", distance: 42.195 },
] as const;

export default function PaceCalculatorPage() {
  const t = useTranslations("tools.pace-calculator");
  const [mode, setMode] = useState<"pace" | "time">("pace");
  const [distance, setDistance] = useState("5");
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("25");
  const [seconds, setSeconds] = useState("0");
  const [paceMinutes, setPaceMinutes] = useState("5");
  const [paceSeconds, setPaceSeconds] = useState("0");

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.round(totalSeconds % 60);
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const calculate = (): { pace?: string; paceMile?: string; predictedTime?: string } | null => {
    const dist = parseFloat(distance);
    const h = parseFloat(hours) || 0;
    const m = parseFloat(minutes) || 0;
    const s = parseFloat(seconds) || 0;
    const pm = parseFloat(paceMinutes) || 0;
    const ps = parseFloat(paceSeconds) || 0;

    if (Number.isNaN(dist) || dist <= 0) return null;

    if (mode === "pace") {
      const totalSeconds = h * 3600 + m * 60 + s;
      if (totalSeconds <= 0) return null;
      const pacePerKm = totalSeconds / dist;
      const pacePerMile = totalSeconds / (dist * 0.621371);
      return {
        pace: `${formatTime(pacePerKm)} /km`,
        paceMile: `${formatTime(pacePerMile)} /mile`,
      };
    } else {
      const paceTotalSeconds = pm * 60 + ps;
      if (paceTotalSeconds <= 0) return null;
      const totalSeconds = paceTotalSeconds * dist;
      return {
        predictedTime: formatTime(totalSeconds),
      };
    }
  };

  const result = calculate();

  const applyPreset = (presetDistance: number) => {
    setDistance(presetDistance.toString());
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="pace-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="flex flex-wrap gap-2">
          {(["pace", "time"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                mode === m
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {t(`options.${m}`)}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.distance")} (km)
            </label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="5"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.distanceUnit")}
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => applyPreset(p.distance)}
                  className="rounded-lg bg-zinc-800 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
                >
                  {t(`options.${p.key}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {mode === "pace" ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.hours")}</label>
              <input
                type="number"
                min="0"
                step="1"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="0"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.minutes")}</label>
              <input
                type="number"
                min="0"
                step="1"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                placeholder="25"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.seconds")}</label>
              <input
                type="number"
                min="0"
                step="1"
                value={seconds}
                onChange={(e) => setSeconds(e.target.value)}
                placeholder="0"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.pace")} (min/km)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={paceMinutes}
                  onChange={(e) => setPaceMinutes(e.target.value)}
                  placeholder="5"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
                />
                <input
                  type="number"
                  min="0"
                  max="59"
                  step="1"
                  value={paceSeconds}
                  onChange={(e) => setPaceSeconds(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {mode === "pace" ? (
                <>
                  <div>
                    <p className="text-sm text-zinc-400">{t("labels.pace")}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-blue-400">{result.pace}</p>
                      <CopyButton text={result.pace!} className="text-xs px-2 py-1" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">{t("labels.pace")} / mile</p>
                    <p className="text-xl font-semibold text-zinc-200">{result.paceMile}</p>
                  </div>
                </>
              ) : (
                <div>
                  <p className="text-sm text-zinc-400">{t("labels.predictedTime")}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-blue-400">{result.predictedTime}</p>
                    <CopyButton text={result.predictedTime!} className="text-xs px-2 py-1" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
