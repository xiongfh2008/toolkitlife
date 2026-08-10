"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function ToolPage() {
  const t = useTranslations("tools.401k-calculator");

  const [salary, setSalary] = useState("60000");
  const [contribution, setContribution] = useState("10");
  const [employerMatch, setEmployerMatch] = useState("50");
  const [employerMatchCap, setEmployerMatchCap] = useState("6");
  const [currentBalance, setCurrentBalance] = useState("0");
  const [returnRate, setReturnRate] = useState("7");
  const [years, setYears] = useState("30");

  const result = useMemo(() => {
    const s = parseFloat(salary);
    const c = parseFloat(contribution);
    const m = parseFloat(employerMatch);
    const cap = parseFloat(employerMatchCap);
    const bal = parseFloat(currentBalance);
    const r = parseFloat(returnRate);
    const y = parseFloat(years);

    if (
      [s, c, m, cap, bal, r, y].some((v) => Number.isNaN(v)) ||
      s < 0 ||
      c < 0 ||
      m < 0 ||
      cap < 0 ||
      bal < 0 ||
      r < 0 ||
      y <= 0
    ) {
      return null;
    }

    const rate = r / 100;
    const fvBalance = bal * Math.pow(1 + rate, y);
    const employeeAnnual = s * (c / 100);
    const employerAnnual = s * (Math.min(c, cap) / 100) * (m / 100);
    const totalAnnual = employeeAnnual + employerAnnual;
    const fvContributions =
      rate === 0
        ? totalAnnual * y
        : totalAnnual * ((Math.pow(1 + rate, y) - 1) / rate);
    const totalEmployee = employeeAnnual * y;
    const totalEmployer = employerAnnual * y;
    const final = fvBalance + fvContributions;
    const totalGrowth = final - bal - totalEmployee - totalEmployer;

    const fmt = (v: number) =>
      v.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      });

    return {
      finalBalance: fmt(final),
      totalContributions: fmt(totalEmployee),
      totalEmployerMatch: fmt(totalEmployer),
      totalGrowth: fmt(totalGrowth),
    };
  }, [
    salary,
    contribution,
    employerMatch,
    employerMatchCap,
    currentBalance,
    returnRate,
    years,
  ]);

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="401k-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label={t("labels.salary")}
            value={salary}
            onChange={setSalary}
            placeholder={t("placeholders.salary")}
            min="0"
            step="1000"
          />
          <Input
            label={t("labels.contribution")}
            value={contribution}
            onChange={setContribution}
            placeholder={t("placeholders.contribution")}
            min="0"
            max="100"
            step="0.5"
          />
          <Input
            label={t("labels.employerMatch")}
            value={employerMatch}
            onChange={setEmployerMatch}
            placeholder={t("placeholders.employerMatch")}
            min="0"
            max="100"
            step="5"
          />
          <Input
            label={t("labels.employerMatchCap")}
            value={employerMatchCap}
            onChange={setEmployerMatchCap}
            placeholder={t("placeholders.employerMatchCap")}
            min="0"
            max="100"
            step="0.5"
          />
          <Input
            label={t("labels.currentBalance")}
            value={currentBalance}
            onChange={setCurrentBalance}
            placeholder={t("placeholders.currentBalance")}
            min="0"
            step="1000"
          />
          <Input
            label={t("labels.returnRate")}
            value={returnRate}
            onChange={setReturnRate}
            placeholder={t("placeholders.returnRate")}
            min="0"
            step="0.5"
          />
          <Input
            label={t("labels.years")}
            value={years}
            onChange={setYears}
            placeholder={t("placeholders.years")}
            min="1"
            step="1"
          />
        </div>

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.finalBalance")}</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-blue-400">
                    {result.finalBalance}
                  </p>
                  <CopyButton
                    text={result.finalBalance}
                    className="text-xs px-2 py-1"
                  />
                </div>
              </div>
              <div>
                <p className="text-sm text-zinc-400">
                  {t("labels.totalContributions")}
                </p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.totalContributions}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">
                  {t("labels.totalEmployerMatch")}
                </p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.totalEmployerMatch}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.totalGrowth")}</p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.totalGrowth}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

function Input({
  label,
  value,
  onChange,
  ...props
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-zinc-300">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
        {...props}
      />
    </div>
  );
}
