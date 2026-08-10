"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function BmrCalculatorPage() {
  const t = useTranslations("tools.bmr-calculator");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [bmr, setBmr] = useState<string | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age, 10);
    if (
      Number.isNaN(w) ||
      Number.isNaN(h) ||
      Number.isNaN(a) ||
      w <= 0 ||
      h <= 0 ||
      a <= 0
    ) {
      setBmr(null);
      return;
    }

    let value = 10 * w + 6.25 * h - 5 * a;
    value += gender === "male" ? 5 : -161;

    setBmr(Math.round(value).toLocaleString());
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="bmr-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            {t("labels.gender")}
          </label>
          <div className="flex flex-wrap gap-2">
            {(["male", "female"] as const).map((g) => (
              <button
                key={g}
                onClick={() => {
                  setGender(g);
                  setBmr(null);
                }}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  gender === g
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                {t(`options.${g}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.weightKg")}
            </label>
            <input
              type="number"
              min="1"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="70"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.heightCm")}
            </label>
            <input
              type="number"
              min="1"
              step="0.1"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="175"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.age")}
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="30"
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

        {bmr && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">
                {t("labels.bmr")}
              </h3>
              <CopyButton text={bmr} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{bmr}</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
