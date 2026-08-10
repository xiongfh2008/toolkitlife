"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

export default function SleepCalculatorPage() {
  const t = useTranslations("tools.sleep-calculator");
  const [mode, setMode] = useState<"bedtime" | "waketime">("bedtime");
  const [time, setTime] = useState("07:00");
  const [duration, setDuration] = useState("7.5");
  const [result, setResult] = useState<string[] | null>(null);

  const parseTime = (value: string) => {
    const [h, m] = value.split(":").map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return { h, m };
  };

  const formatTime = (totalMinutes: number) => {
    const dayMinutes = ((totalMinutes % 1440) + 1440) % 1440;
    const h = Math.floor(dayMinutes / 60);
    const m = dayMinutes % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}`;
  };

  const calculate = () => {
    const parsed = parseTime(time);
    const hours = parseFloat(duration);

    if (!parsed || Number.isNaN(hours) || hours <= 0) {
      setResult(null);
      return;
    }

    const baseMinutes = parsed.h * 60 + parsed.m;
    const offset = hours * 60;

    if (mode === "bedtime") {
      const target = baseMinutes - offset;
      setResult([formatTime(target)]);
    } else {
      const targets = [6, 7.5, 9].map((h) => formatTime(baseMinutes + h * 60));
      setResult(targets);
    }
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="sleep-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            {t("labels.mode")}
          </label>
          <div className="flex flex-wrap gap-2">
            {(["bedtime", "waketime"] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setResult(null);
                }}
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
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {mode === "bedtime" ? t("labels.wakeTime") : t("labels.bedTime")}
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.duration")}
            </label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="7.5"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        <button
          onClick={calculate}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
        >
          {t("buttons.calculate")}
        </button>

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <p className="text-sm text-zinc-400">
              {mode === "bedtime"
                ? t("labels.recommendedBedtime")
                : t("labels.recommendedWakeTimes")}
            </p>
            <div className="flex flex-wrap gap-3">
              {result.map((r) => (
                <p
                  key={r}
                  className="text-3xl font-bold text-blue-400"
                >
                  {r}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
