"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

export default function OvulationCalculatorPage() {
  const t = useTranslations("tools.ovulation-calculator");
  const [lastPeriod, setLastPeriod] = useState("");
  const [cycleLength, setCycleLength] = useState("28");
  const [result, setResult] = useState<{
    ovulationDate: string;
    fertileStart: string;
    fertileEnd: string;
    nextPeriod: string;
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
    if (Number.isNaN(start.getTime()) || Number.isNaN(cycle) || cycle < 14) {
      setError(true);
      setResult(null);
      return;
    }
    setError(false);

    const ovulation = new Date(start);
    ovulation.setDate(start.getDate() + cycle - 14);

    const fertileStart = new Date(ovulation);
    fertileStart.setDate(ovulation.getDate() - 5);
    const fertileEnd = new Date(ovulation);
    fertileEnd.setDate(ovulation.getDate() + 1);

    const nextPeriod = new Date(start);
    nextPeriod.setDate(start.getDate() + cycle);

    setResult({
      ovulationDate: formatDate(ovulation),
      fertileStart: formatDate(fertileStart),
      fertileEnd: formatDate(fertileEnd),
      nextPeriod: formatDate(nextPeriod),
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="ovulation-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
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
                <p className="text-sm text-zinc-400">
                  {t("labels.ovulationDate")}
                </p>
                <p className="text-2xl font-bold text-blue-400">
                  {result.ovulationDate}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.nextPeriod")}</p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.nextPeriod}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-zinc-400">
                  {t("labels.fertileWindow")}
                </p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.fertileStart} — {result.fertileEnd}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
