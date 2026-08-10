"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

export default function CountdownTimerPage() {
  const t = useTranslations("tools.countdown-timer");
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("0");
  const [seconds, setSeconds] = useState("0");
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!running || remaining <= 0) {
      clearTimer();
      return;
    }
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearTimer();
          setRunning(false);
          if (typeof window !== "undefined") {
            window.alert(`${t("labels.timeRemaining")}: 00:00:00`);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return clearTimer;
  }, [running, remaining, t, clearTimer]);

  const start = () => {
    if (running) return;
    if (remaining === 0) {
      const h = parseInt(hours || "0", 10);
      const m = parseInt(minutes || "0", 10);
      const s = parseInt(seconds || "0", 10);
      const total = h * 3600 + m * 60 + s;
      if (total <= 0) {
        if (typeof window !== "undefined") {
          window.alert(t("errors.invalidTime"));
        }
        return;
      }
      setRemaining(total);
    }
    setRunning(true);
  };

  const pause = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    setRemaining(0);
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="countdown-timer"
    >
      <div className="max-w-xl space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Input
            label={t("labels.hours")}
            value={hours}
            onChange={setHours}
            min="0"
            max="99"
          />
          <Input
            label={t("labels.minutes")}
            value={minutes}
            onChange={setMinutes}
            min="0"
            max="59"
          />
          <Input
            label={t("labels.seconds")}
            value={seconds}
            onChange={setSeconds}
            min="0"
            max="59"
          />
        </div>

        <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-8 text-center">
          <p className="text-sm text-zinc-400 mb-2">{t("labels.timeRemaining")}</p>
          <div className="text-6xl font-mono text-zinc-100">
            {formatTime(remaining)}
          </div>
        </div>

        <div className="flex justify-center gap-3">
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
            onClick={reset}
            className="rounded-lg bg-red-600 px-6 py-2 text-sm font-medium text-white hover:bg-red-500 transition-colors"
          >
            {t("buttons.reset")}
          </button>
        </div>
      </div>
    </ToolLayout>
  );
}

function Input({
  label,
  value,
  onChange,
  ...props
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-zinc-300">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
        {...props}
      />
    </div>
  );
}
