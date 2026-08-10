"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function HourlyToSalaryCalculatorPage() {
  const t = useTranslations("tools.hourly-to-salary-calculator");
  const [hourly, setHourly] = useState("25");
  const [hoursPerWeek, setHoursPerWeek] = useState("40");
  const [weeksPerYear, setWeeksPerYear] = useState("52");

  const result = useMemo(() => {
    const rate = parseFloat(hourly);
    const hours = parseFloat(hoursPerWeek);
    const weeks = parseFloat(weeksPerYear);
    if ([rate, hours, weeks].some((v) => Number.isNaN(v)) || rate < 0 || hours < 0 || weeks < 0)
      return null;

    const annual = rate * hours * weeks;
    const monthly = annual / 12;
    const weekly = rate * hours;

    const fmt = (v: number) =>
      v.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      });

    return {
      annual: fmt(annual),
      monthly: fmt(monthly),
      weekly: fmt(weekly),
    };
  }, [hourly, hoursPerWeek, weeksPerYear]);

  const inputClass =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40";

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="hourly-to-salary-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.hourlyRate")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={hourly}
              onChange={(e) => setHourly(e.target.value)}
              placeholder={t("placeholders.hourlyRate")}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.hoursPerWeek")}
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(e.target.value)}
              placeholder={t("placeholders.hoursPerWeek")}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.weeksPerYear")}
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={weeksPerYear}
              onChange={(e) => setWeeksPerYear(e.target.value)}
              placeholder={t("placeholders.weeksPerYear")}
              className={inputClass}
            />
          </div>
        </div>

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.annualSalary")}</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-blue-400">{result.annual}</p>
                  <CopyButton text={result.annual} className="text-xs px-2 py-1" />
                </div>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.monthlySalary")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.monthly}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.weeklySalary")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.weekly}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
