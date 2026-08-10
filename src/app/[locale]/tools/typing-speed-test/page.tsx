"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

const DEFAULT_DURATION = 60;

export default function TypingSpeedTestPage() {
  const t = useTranslations("tools.typing-speed-test");
  const sampleText = t("sampleText");
  const [typed, setTyped] = useState("");
  const [status, setStatus] = useState<"idle" | "running" | "finished">("idle");
  const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATION);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timeLeftRef = useRef(timeLeft);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  const stats = useMemo(() => {
    if (status === "idle") {
      return { cpm: 0, wpm: 0, accuracy: 0 };
    }
    const elapsed = DEFAULT_DURATION - timeLeft;
    if (elapsed <= 0) return { cpm: 0, wpm: 0, accuracy: 0 };
    const chars = typed.length;
    const correct = typed.split("").filter((c, i) => c === sampleText[i]).length;
    const minutes = elapsed / 60;
    return {
      cpm: Math.round(chars / minutes),
      wpm: Math.round(chars / 5 / minutes),
      accuracy: chars === 0 ? 0 : Math.round((correct / chars) * 100),
    };
  }, [typed, timeLeft, status, sampleText]);

  const finish = () => {
    setStatus("finished");
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const reset = () => {
    setTyped("");
    setStatus("idle");
    setTimeLeft(DEFAULT_DURATION);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const start = () => {
    if (status === "running") return;
    reset();
    setStatus("running");
  };

  useEffect(() => {
    if (status !== "running") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    timerRef.current = setInterval(() => {
      const next = timeLeftRef.current - 1;
      if (next <= 0) {
        setTimeLeft(0);
        finish();
      } else {
        setTimeLeft(next);
      }
    }, 1000);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [status]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (status === "finished") return;
    const next = e.target.value;
    setTyped(next);
    if (status === "idle" && next.length > 0) {
      setStatus("running");
    }
    if (next.length >= sampleText.length) {
      finish();
    }
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="typing-speed-test"
    >
      <div className="max-w-3xl space-y-4">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-lg leading-relaxed text-zinc-300">
            {sampleText.split("").map((char, i) => {
              let color = "text-zinc-500";
              if (i < typed.length) {
                color = typed[i] === char ? "text-zinc-100" : "text-red-400";
              }
              return (
                <span key={i} className={color}>
                  {char}
                </span>
              );
            })}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-center">
            <p className="text-sm text-zinc-400">{t("labels.time")}</p>
            <p className="text-2xl font-bold text-zinc-100">{timeLeft}s</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-center">
            <p className="text-sm text-zinc-400">{t("labels.wpm")}</p>
            <p className="text-2xl font-bold text-blue-400">{stats.wpm}</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-center">
            <p className="text-sm text-zinc-400">{t("labels.accuracy")}</p>
            <p className="text-2xl font-bold text-blue-400">{stats.accuracy}%</p>
          </div>
        </div>

        <textarea
          value={typed}
          onChange={handleChange}
          disabled={status === "finished"}
          placeholder={t("labels.placeholder")}
          rows={4}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 resize-y disabled:opacity-50"
        />

        <div className="flex flex-wrap gap-2">
          {status === "idle" && (
            <button
              onClick={start}
              className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
            >
              {t("buttons.start")}
            </button>
          )}
          {status === "running" && (
            <button
              onClick={finish}
              className="rounded-lg bg-zinc-700 px-6 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-600 transition-colors"
            >
              {t("buttons.finish")}
            </button>
          )}
          <button
            onClick={reset}
            className="rounded-lg bg-zinc-800 px-6 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
          >
            {t("buttons.restart")}
          </button>
        </div>

        {status === "finished" && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-2">
            <h3 className="text-lg font-semibold text-zinc-200">{t("labels.results")}</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.wpm")}</p>
                <p className="text-3xl font-bold text-blue-400">{stats.wpm}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.cpm")}</p>
                <p className="text-3xl font-bold text-blue-400">{stats.cpm}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.accuracy")}</p>
                <p className="text-3xl font-bold text-blue-400">{stats.accuracy}%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
