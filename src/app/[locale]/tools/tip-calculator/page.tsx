"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function TipCalculatorPage() {
  const t = useTranslations("tools.tip-calculator");
  const [bill, setBill] = useState("");
  const [tip, setTip] = useState("");
  const [people, setPeople] = useState("1");
  const [result, setResult] = useState<{
    tipAmount: string;
    totalAmount: string;
    tipPerPerson: string;
    totalPerPerson: string;
  } | null>(null);

  const presets = [10, 15, 20];

  const calculate = (
    billValue: string = bill,
    tipValue: string = tip,
    peopleValue: string = people
  ) => {
    const b = parseFloat(billValue);
    const tp = parseFloat(tipValue);
    const p = parseInt(peopleValue, 10);
    if (
      Number.isNaN(b) ||
      Number.isNaN(tp) ||
      Number.isNaN(p) ||
      b < 0 ||
      tp < 0 ||
      p <= 0
    ) {
      setResult(null);
      return;
    }

    const tipAmount = b * (tp / 100);
    const totalAmount = b + tipAmount;
    const fmt = (v: number) =>
      v.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    setResult({
      tipAmount: fmt(tipAmount),
      totalAmount: fmt(totalAmount),
      tipPerPerson: fmt(tipAmount / p),
      totalPerPerson: fmt(totalAmount / p),
    });
  };

  const applyPreset = (value: number) => {
    setTip(value.toString());
    calculate(bill, value.toString(), people);
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="tip-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.billAmount")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={bill}
              onChange={(e) => {
                setBill(e.target.value);
                calculate(e.target.value, tip, people);
              }}
              placeholder="50.00"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.tipPercentage")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={tip}
              onChange={(e) => {
                setTip(e.target.value);
                calculate(bill, e.target.value, people);
              }}
              placeholder="15"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.numberOfPeople")}
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={people}
              onChange={(e) => {
                setPeople(e.target.value);
                calculate(bill, tip, e.target.value);
              }}
              placeholder="1"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.presets")}
            </label>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => applyPreset(p)}
                  className="rounded-lg bg-zinc-800 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
                >
                  {p}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.tipAmount")}</p>
                <p className="text-2xl font-bold text-blue-400">
                  {result.tipAmount}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">
                  {t("labels.totalAmount")}
                </p>
                <p className="text-2xl font-bold text-blue-400">
                  {result.totalAmount}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">
                  {t("labels.tipPerPerson")}
                </p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.tipPerPerson}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">
                  {t("labels.totalPerPerson")}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-semibold text-zinc-200">
                    {result.totalPerPerson}
                  </p>
                  <CopyButton
                    text={result.totalPerPerson}
                    className="text-xs px-2 py-1"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
