"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

const REQUIRED_HOURS = 80;

export default function MedicaidWorkRequirementCalculatorPage() {
  const t = useTranslations("tools.medicaid-work-requirement-calculator");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [weeksPerMonth, setWeeksPerMonth] = useState("4");
  const [result, setResult] = useState<{
    monthlyHours: number;
    meets: boolean;
    remaining: number;
  } | null>(null);

  const calculate = () => {
    const h = parseFloat(hoursPerWeek);
    const w = parseFloat(weeksPerMonth);
    if (Number.isNaN(h) || Number.isNaN(w) || h < 0 || w <= 0) {
      setResult(null);
      return;
    }

    const monthly = h * w;
    const meets = monthly >= REQUIRED_HOURS;
    const remaining = Math.max(0, REQUIRED_HOURS - monthly);
    setResult({ monthlyHours: monthly, meets, remaining });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="medicaid-work-requirement-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.hoursPerWeek")}
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(e.target.value)}
              placeholder="20"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.weeksPerMonth")}
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={weeksPerMonth}
              onChange={(e) => setWeeksPerMonth(e.target.value)}
              placeholder="4"
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
          <div
            className={`rounded-lg border p-5 space-y-4 ${
              result.meets
                ? "border-green-800 bg-green-900/20"
                : "border-red-800 bg-red-900/20"
            }`}
          >
            <div>
              <p className="text-sm text-zinc-400">{t("labels.monthlyHours")}</p>
              <p className="text-3xl font-bold text-zinc-100">
                {result.monthlyHours.toLocaleString(undefined, { maximumFractionDigits: 1 })}
              </p>
            </div>
            <div>
              <p className="text-sm text-zinc-400">{t("labels.status")}</p>
              <p
                className={`text-xl font-semibold ${
                  result.meets ? "text-green-400" : "text-red-400"
                }`}
              >
                {result.meets ? t("options.meets") : t("options.doesNotMeet")}
              </p>
            </div>
            {!result.meets && (
              <div>
                <p className="text-sm text-zinc-400">{t("labels.hoursNeeded")}</p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.remaining.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
