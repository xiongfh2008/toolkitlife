"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

export default function OvertimeCalculatorPage() {
  const t = useTranslations("tools.overtime-calculator");
  const [hourlyRate, setHourlyRate] = useState("20");
  const [regularHours, setRegularHours] = useState("40");
  const [overtimeHours, setOvertimeHours] = useState("5");
  const [multiplier, setMultiplier] = useState("1.5");

  const fmt = (v: number) =>
    v.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });

  const rate = parseFloat(hourlyRate);
  const reg = parseFloat(regularHours);
  const otHours = parseFloat(overtimeHours);
  const mult = parseFloat(multiplier);
  const valid =
    !Number.isNaN(rate) &&
    !Number.isNaN(reg) &&
    !Number.isNaN(otHours) &&
    !Number.isNaN(mult) &&
    rate >= 0 &&
    reg >= 0 &&
    otHours >= 0 &&
    mult >= 1;

  const regularPay = valid ? rate * reg : 0;
  const overtimePay = valid ? rate * mult * otHours : 0;
  const weeklyPay = regularPay + overtimePay;

  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40";

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="overtime-calculator"
      keywords={keywords}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="max-w-3xl space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.hourlyRate")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              placeholder={t("placeholders.hourlyRate")}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.regularHours")}
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={regularHours}
              onChange={(e) => setRegularHours(e.target.value)}
              placeholder={t("placeholders.regularHours")}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.overtimeHours")}
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={overtimeHours}
              onChange={(e) => setOvertimeHours(e.target.value)}
              placeholder={t("placeholders.overtimeHours")}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.multiplier")}
            </label>
            <div className="flex gap-2">
              {["1.5", "2"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMultiplier(m)}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    multiplier === m
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  {m}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {valid ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <p className="text-xs text-zinc-500">{t("labels.regularPay")}</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-100">
                {fmt(regularPay)}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <p className="text-xs text-zinc-500">{t("labels.overtimePay")}</p>
              <p className="mt-1 text-2xl font-semibold text-green-400">
                {fmt(overtimePay)}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <p className="text-xs text-zinc-500">{t("labels.weeklyPay")}</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-100">
                {fmt(weeklyPay)}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-red-400">{t("errors.invalidInputs")}</p>
        )}
      </div>
    </ToolLayout>
  );
}
