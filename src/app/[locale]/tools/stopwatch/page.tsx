"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  const centiseconds = Math.floor((ms % 1000) / 10)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}.${centiseconds}`;
}

export default function StopwatchPage() {
  const t = useTranslations("tools.stopwatch");
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const startTimeRef = useRef(0);

  const tick = useCallback(() => {
    setElapsed(Date.now() - startTimeRef.current);
  }, []);

  useEffect(() => {
    if (!running) return;
    startTimeRef.current = Date.now() - elapsed;
    const id = setInterval(tick, 10);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const start = () => setRunning(true);
  const pause = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    setElapsed(0);
    setLaps([]);
  };
  const recordLap = () => {
    setLaps((prev) => [elapsed, ...prev]);
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="stopwatch"
    >
      <div className="max-w-xl space-y-6">
        <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-8 text-center">
          <p className="text-sm text-zinc-400 mb-2">{t("labels.elapsed")}</p>
          <div className="text-6xl font-mono text-zinc-100 mb-6">
            {formatTime(elapsed)}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {!running ? (
              <button
                onClick={start}
                className="rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-500 transition-colors"
              >
                {t("buttons.start")}
              </button>
            ) : (
              <button
                onClick={pause}
                className="rounded-lg bg-yellow-600 px-6 py-2 text-sm font-medium text-white hover:bg-yellow-500 transition-colors"
              >
                {t("buttons.pause")}
              </button>
            )}
            <button
              onClick={recordLap}
              disabled={!running}
              className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
            >
              {t("buttons.lap")}
            </button>
            <button
              onClick={reset}
              className="rounded-lg bg-red-600 px-6 py-2 text-sm font-medium text-white hover:bg-red-500 transition-colors"
            >
              {t("buttons.reset")}
            </button>
          </div>
          <div className="mt-4 flex justify-center">
            <CopyButton text={formatTime(elapsed)} className="text-xs px-3 py-1" />
          </div>
        </div>

        {laps.length > 0 && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-zinc-200 mb-3">
              {t("labels.laps")}
            </h3>
            <ul className="max-h-64 space-y-2 overflow-auto">
              {laps.map((lapTime, index) => (
                <li
                  key={laps.length - index}
                  className="flex items-center justify-between border-b border-zinc-800 pb-2 text-sm text-zinc-300 last:border-0 last:pb-0"
                >
                  <span>
                    {t("labels.lap")} #{laps.length - index}
                  </span>
                  <span className="font-mono">{formatTime(lapTime)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
