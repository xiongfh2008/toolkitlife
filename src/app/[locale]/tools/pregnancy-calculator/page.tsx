"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

export default function PregnancyCalculatorPage() {
  const t = useTranslations("tools.pregnancy-calculator");
  const [mode, setMode] = useState<"lastPeriod" | "dueDate">("lastPeriod");
  const [lastPeriod, setLastPeriod] = useState("");
  const [dueDate, setDueDate] = useState("");

  const formatDate = (date: Date) =>
    date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const calculate = () => {
    if (mode === "lastPeriod") {
      const start = new Date(lastPeriod);
      if (Number.isNaN(start.getTime())) return null;

      const due = new Date(start);
      due.setDate(due.getDate() + 280);

      const today = new Date();
      const diffTime = today.getTime() - start.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const weeks = Math.floor(diffDays / 7);
      const days = diffDays % 7;
      const totalDays = Math.max(0, 280 - diffDays);

      let trimester = "first";
      if (weeks >= 27) trimester = "third";
      else if (weeks >= 13) trimester = "second";

      return {
        estimatedDueDate: formatDate(due),
        gestationalAge: `${weeks}w ${days}d`,
        trimester,
        daysRemaining: totalDays.toString(),
      };
    } else {
      const due = new Date(dueDate);
      if (Number.isNaN(due.getTime())) return null;

      const start = new Date(due);
      start.setDate(start.getDate() - 280);

      const today = new Date();
      const diffTime = today.getTime() - start.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const weeks = Math.floor(diffDays / 7);
      const days = diffDays % 7;
      const totalDays = Math.max(0, 280 - diffDays);

      let trimester = "first";
      if (weeks >= 27) trimester = "third";
      else if (weeks >= 13) trimester = "second";

      return {
        estimatedDueDate: formatDate(due),
        gestationalAge: `${weeks}w ${days}d`,
        trimester,
        daysRemaining: totalDays.toString(),
      };
    }
  };

  const result = calculate();

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="pregnancy-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="flex flex-wrap gap-2">
          {(["lastPeriod", "dueDate"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                mode === m
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {t(`options.${m}Mode`)}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {mode === "lastPeriod" ? (
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.lastPeriod")}
              </label>
              <input
                type="date"
                value={lastPeriod}
                onChange={(e) => setLastPeriod(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          ) : (
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.dueDate")}
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          )}
        </div>

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.estimatedDueDate")}</p>
                <p className="text-2xl font-bold text-blue-400">{result.estimatedDueDate}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.gestationalAge")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.gestationalAge}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.trimester")}</p>
                <p className="text-xl font-semibold text-zinc-200 capitalize">{result.trimester}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.daysRemaining")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.daysRemaining}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
