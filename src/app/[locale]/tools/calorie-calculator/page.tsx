"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

const activityFactors: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

const activityLevels = ["sedentary", "light", "moderate", "active", "veryActive"] as const;

const fmt = (n: number) => Math.round(n).toLocaleString();

export default function CalorieCalculatorPage() {
  const t = useTranslations("tools.calorie-calculator");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("30");
  const [weight, setWeight] = useState("70");
  const [heightCm, setHeightCm] = useState("175");
  const [feet, setFeet] = useState("5");
  const [inches, setInches] = useState("9");
  const [activity, setActivity] = useState<(typeof activityLevels)[number]>("moderate");

  // Mifflin-St Jeor equation, updated live as inputs change.
  const result = useMemo(() => {
    const ageNum = parseFloat(age);
    const kg =
      unit === "metric" ? parseFloat(weight) : parseFloat(weight) * 0.45359237;
    const cm =
      unit === "metric"
        ? parseFloat(heightCm)
        : (parseFloat(feet) * 12 + parseFloat(inches)) * 2.54;
    if ([ageNum, kg, cm].some((v) => Number.isNaN(v) || v <= 0)) return null;
    const bmr =
      gender === "male"
        ? 10 * kg + 6.25 * cm - 5 * ageNum + 5
        : 10 * kg + 6.25 * cm - 5 * ageNum - 161;
    const tdee = bmr * activityFactors[activity];
    return { bmr, tdee };
  }, [unit, gender, age, weight, heightCm, feet, inches, activity]);

  const input =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40";

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="calorie-calculator"
    >
      <div className="max-w-3xl space-y-5">
        {/* Unit switch */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            {t("labels.unit")}
          </label>
          <div className="flex flex-wrap gap-2">
            {(["metric", "imperial"] as const).map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  unit === u
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                {t(`labels.${u}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            {t("labels.gender")}
          </label>
          <div className="flex flex-wrap gap-2">
            {(["male", "female"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
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

        <div className="grid gap-4 sm:grid-cols-2">
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
              className={input}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {unit === "metric" ? t("labels.weightKg") : t("labels.weightLbs")}
            </label>
            <input
              type="number"
              min="1"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={unit === "metric" ? "70" : "154"}
              className={input}
            />
          </div>
        </div>

        {/* Height: cm or feet+inches */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            {unit === "metric" ? t("labels.heightCm") : t("labels.feet") + " / " + t("labels.inches")}
          </label>
          {unit === "metric" ? (
            <input
              type="number"
              min="1"
              step="0.1"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              placeholder="175"
              className={input}
            />
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                min="1"
                step="1"
                value={feet}
                onChange={(e) => setFeet(e.target.value)}
                placeholder="5"
                className={input}
              />
              <input
                type="number"
                min="0"
                step="0.5"
                value={inches}
                onChange={(e) => setInches(e.target.value)}
                placeholder="9"
                className={input}
              />
            </div>
          )}
        </div>

        {/* Activity level cards */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            {t("labels.activityLevel")}
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            {activityLevels.map((level) => (
              <button
                key={level}
                onClick={() => setActivity(level)}
                className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                  activity === level
                    ? "border-blue-600 bg-blue-600/10"
                    : "border-zinc-700 bg-zinc-800 hover:border-blue-500/40"
                }`}
              >
                <span
                  className={`block text-sm font-medium ${
                    activity === level ? "text-blue-600" : "text-zinc-200"
                  }`}
                >
                  {t(`options.${level}`)}
                </span>
                <span className="mt-0.5 block text-xs text-zinc-500">
                  {t(`options.${level}Desc`)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900 p-5">
            <div className="border-b border-zinc-800 pb-4">
              <h3 className="text-sm font-medium text-zinc-300">
                {t("labels.maintain")}
              </h3>
              <p className="mt-1 text-4xl font-bold text-blue-400">
                #{fmt(result.tdee)}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {t("labels.bmrResult")}:{" "}
                {t("labels.calPerDay", { value: fmt(result.bmr) })}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
                <h4 className="mb-3 text-sm font-semibold text-emerald-400">
                  {t("labels.weightLoss")}
                </h4>
                <div className="space-y-2 text-sm">
                  {[
                    { label: t("labels.losePerWeek", { value: "0.5" }), cal: result.tdee - 250 },
                    { label: t("labels.losePerWeek", { value: "1" }), cal: result.tdee - 500 },
                    { label: t("labels.losePerWeek", { value: "2" }), cal: result.tdee - 1000 },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-2">
                      <span className="text-zinc-400">{row.label}</span>
                      <span className="font-medium text-zinc-100">
                        {t("labels.calPerDay", { value: fmt(row.cal) })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
                <h4 className="mb-3 text-sm font-semibold text-rose-400">
                  {t("labels.weightGain")}
                </h4>
                <div className="space-y-2 text-sm">
                  {[
                    { label: t("labels.gainPerWeek", { value: "0.5" }), cal: result.tdee + 250 },
                    { label: t("labels.gainPerWeek", { value: "1" }), cal: result.tdee + 500 },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-2">
                      <span className="text-zinc-400">{row.label}</span>
                      <span className="font-medium text-zinc-100">
                        {t("labels.calPerDay", { value: fmt(row.cal) })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
