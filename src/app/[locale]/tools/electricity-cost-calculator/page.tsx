"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function ElectricityCostCalculatorPage() {
  const t = useTranslations("tools.electricity-cost-calculator");
  const [wattage, setWattage] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [days, setDays] = useState("30");
  const [rate, setRate] = useState("");
  const [result, setResult] = useState<{
    dailyCost: string;
    monthlyCost: string;
    yearlyCost: string;
    kwh: string;
  } | null>(null);

  const calculate = () => {
    const w = parseFloat(wattage);
    const h = parseFloat(hoursPerDay);
    const d = parseFloat(days);
    const r = parseFloat(rate);
    if (
      Number.isNaN(w) ||
      Number.isNaN(h) ||
      Number.isNaN(d) ||
      Number.isNaN(r) ||
      w < 0 ||
      h < 0 ||
      d <= 0 ||
      r < 0
    ) {
      setResult(null);
      return;
    }

    const kwh = (w * h * d) / 1000;
    const dailyKwh = (w * h) / 1000;
    const cost = kwh * (r / 100);
    const dailyCost = dailyKwh * (r / 100);
    const yearlyCost = dailyCost * 365;

    const fmt = (v: number) =>
      v.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      });

    setResult({
      dailyCost: fmt(dailyCost),
      monthlyCost: fmt(cost),
      yearlyCost: fmt(yearlyCost),
      kwh: `${kwh.toLocaleString(undefined, { maximumFractionDigits: 2 })} kWh`,
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="electricity-cost-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.wattage")}
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={wattage}
              onChange={(e) => setWattage(e.target.value)}
              placeholder="60"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.hoursPerDay")}
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(e.target.value)}
              placeholder="8"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.days")}
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder="30"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.ratePerKwh")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="0.13"
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
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.monthlyCost")}</h3>
              <CopyButton text={result.monthlyCost} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.monthlyCost}</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.dailyCost")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.dailyCost}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.yearlyCost")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.yearlyCost}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.energyUsage")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.kwh}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
