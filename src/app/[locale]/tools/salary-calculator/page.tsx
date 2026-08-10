"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function SalaryCalculatorPage() {
  const t = useTranslations("tools.salary-calculator");
  const [mode, setMode] = useState<"annual" | "hourly">("annual");
  const [annual, setAnnual] = useState("");
  const [hourly, setHourly] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("40");

  const fmt = (v: number) =>
    v.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });

  const hoursNumber = parseFloat(hoursPerWeek);
  const hoursValid = !Number.isNaN(hoursNumber) && hoursNumber > 0;

  const values = (() => {
    if (!hoursValid) return null;
    const a = parseFloat(annual.replace(/[^0-9.-]/g, ""));
    const hr = parseFloat(hourly.replace(/[^0-9.-]/g, ""));
    if (Number.isNaN(a) || Number.isNaN(hr)) return null;
    const weekly = hr * hoursNumber;
    const monthly = weekly * 4.333333;
    return {
      hourly: fmt(hr),
      weekly: fmt(weekly),
      monthly: fmt(monthly),
      annual: fmt(a),
    };
  })();

  const output = values
    ? `${t("labels.hourly")}: ${values.hourly}\n${t("labels.weekly")}: ${values.weekly}\n${t("labels.monthly")}: ${values.monthly}\n${t("labels.annual")}: ${values.annual}`
    : "";

  const recalc = (currentMode: "annual" | "hourly", currentAnnual: string, currentHourly: string, currentHours: string) => {
    const h = parseFloat(currentHours);
    if (Number.isNaN(h) || h <= 0) {
      setHourly("");
      setAnnual("");
      return;
    }
    if (currentMode === "annual") {
      const a = parseFloat(currentAnnual);
      setHourly(Number.isNaN(a) ? "" : fmt(a / (h * 52)));
    } else {
      const hr = parseFloat(currentHourly);
      setAnnual(Number.isNaN(hr) ? "" : fmt(hr * h * 52));
    }
  };

  const handleAnnualChange = (value: string) => {
    setAnnual(value);
    recalc("annual", value, hourly, hoursPerWeek);
  };

  const handleHourlyChange = (value: string) => {
    setHourly(value);
    recalc("hourly", annual, value, hoursPerWeek);
  };

  const handleHoursChange = (value: string) => {
    setHoursPerWeek(value);
    recalc(mode, annual, hourly, value);
  };

  const handleModeChange = (newMode: "annual" | "hourly") => {
    recalc(mode, annual, hourly, hoursPerWeek);
    setMode(newMode);
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="salary-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            {t("labels.mode")}
          </label>
          <select
            value={mode}
            onChange={(e) => handleModeChange(e.target.value as "annual" | "hourly")}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
          >
            <option value="annual">{t("options.annual")}</option>
            <option value="hourly">{t("options.hourly")}</option>
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {mode === "annual" ? t("labels.annual") : t("labels.hourly")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={mode === "annual" ? annual : hourly}
              onChange={(e) =>
                mode === "annual" ? handleAnnualChange(e.target.value) : handleHourlyChange(e.target.value)
              }
              placeholder={mode === "annual" ? "60000" : "28.85"}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.hoursPerWeek")}
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={hoursPerWeek}
              onChange={(e) => handleHoursChange(e.target.value)}
              placeholder="40"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        {values && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.payBreakdown")}</h3>
              <CopyButton text={output} className="text-xs px-2 py-1" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.hourly")}</p>
                <p className="text-xl font-semibold text-zinc-200">{values.hourly}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.weekly")}</p>
                <p className="text-xl font-semibold text-zinc-200">{values.weekly}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.monthly")}</p>
                <p className="text-xl font-semibold text-blue-400">{values.monthly}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.annual")}</p>
                <p className="text-xl font-semibold text-zinc-200">{values.annual}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
