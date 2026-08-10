"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

export default function PeriodCalculatorPage() {
  const t = useTranslations("tools.period-calculator");
  const [lastPeriod, setLastPeriod] = useState("");
  const [cycleLength, setCycleLength] = useState("28");
  const [duration, setDuration] = useState("5");
  const [result, setResult] = useState<{
    nextPeriod: string;
    nextPeriodEnd: string;
    ovulation: string;
    fertileWindow: string;
    safePeriod: string;
  } | null>(null);
  const [error, setError] = useState(false);

  const formatDate = (date: Date) =>
    date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const calculate = () => {
    const start = new Date(lastPeriod);
    const cycle = parseInt(cycleLength, 10);
    const periodDays = parseInt(duration, 10);
    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(cycle) ||
      Number.isNaN(periodDays) ||
      cycle < 14 ||
      periodDays < 1
    ) {
      setError(true);
      setResult(null);
      return;
    }
    setError(false);

    const nextPeriod = new Date(start);
    nextPeriod.setDate(start.getDate() + cycle);

    const nextPeriodEnd = new Date(nextPeriod);
    nextPeriodEnd.setDate(nextPeriod.getDate() + periodDays - 1);

    const ovulation = new Date(start);
    ovulation.setDate(start.getDate() + cycle - 14);

    const fertileStart = new Date(ovulation);
    fertileStart.setDate(ovulation.getDate() - 5);
    const fertileEnd = new Date(ovulation);
    fertileEnd.setDate(ovulation.getDate() + 1);

    const safeStart = new Date(start);
    safeStart.setDate(start.getDate() + periodDays);
    const safeEnd = new Date(fertileStart);
    safeEnd.setDate(fertileStart.getDate() - 1);

    const safeStart2 = new Date(fertileEnd);
    safeStart2.setDate(fertileEnd.getDate() + 1);
    const safeEnd2 = new Date(nextPeriod);
    safeEnd2.setDate(nextPeriod.getDate() - 3);

    let safePeriod = "";
    if (safeStart.getTime() <= safeEnd.getTime()) {
      safePeriod = `${formatDate(safeStart)} — ${formatDate(safeEnd)}`;
    }
    if (safeStart2.getTime() <= safeEnd2.getTime()) {
      if (safePeriod) safePeriod += `; `;
      safePeriod += `${formatDate(safeStart2)} — ${formatDate(safeEnd2)}`;
    }
    if (!safePeriod) safePeriod = t("labels.noSafePeriod");

    setResult({
      nextPeriod: formatDate(nextPeriod),
      nextPeriodEnd: formatDate(nextPeriodEnd),
      ovulation: formatDate(ovulation),
      fertileWindow: `${formatDate(fertileStart)} — ${formatDate(fertileEnd)}`,
      safePeriod,
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="period-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
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
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.cycleLength")}
            </label>
            <input
              type="number"
              min="14"
              max="60"
              step="1"
              value={cycleLength}
              onChange={(e) => setCycleLength(e.target.value)}
              placeholder="28"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.duration")}
            </label>
            <input
              type="number"
              min="1"
              max="14"
              step="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="5"
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

        {error && (
          <p className="text-sm text-red-400">{t("errors.invalid")}</p>
        )}

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.nextPeriod")}</p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.nextPeriod}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">
                  {t("labels.nextPeriodEnd")}
                </p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.nextPeriodEnd}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.ovulation")}</p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.ovulation}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">
                  {t("labels.fertileWindow")}
                </p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.fertileWindow}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-zinc-400">{t("labels.safePeriod")}</p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.safePeriod}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
