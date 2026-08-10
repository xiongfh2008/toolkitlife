"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

function povertyGuideline(familySize: number): number {
  // 2025 contiguous U.S. federal poverty guideline: $15,060 for one + $5,380 per additional person
  return 15060 + Math.max(0, familySize - 1) * 5380;
}

function fmtCurrency(v: number): string {
  return v.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default function SaveVsRepayeCalculatorPage() {
  const t = useTranslations("tools.save-vs-rap-calculator");
  const [loanAmount, setLoanAmount] = useState("30000");
  const [interestRate, setInterestRate] = useState("5.5");
  const [annualIncome, setAnnualIncome] = useState("50000");
  const [familySize, setFamilySize] = useState("1");
  const [repaymentYears, setRepaymentYears] = useState("20");

  const result = useMemo(() => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate);
    const income = parseFloat(annualIncome);
    const size = parseInt(familySize, 10);
    const years = parseFloat(repaymentYears);

    if (
      Number.isNaN(principal) ||
      Number.isNaN(rate) ||
      Number.isNaN(income) ||
      Number.isNaN(size) ||
      Number.isNaN(years) ||
      principal < 0 ||
      rate < 0 ||
      size < 1 ||
      years <= 0
    ) {
      return null;
    }

    const pg = povertyGuideline(size);
    const months = years * 12;
    const monthlyRate = rate / 100 / 12;

    // SAVE: discretionary income = income - 225% of poverty, 10% rate for simplicity
    const saveDiscretionary = Math.max(0, income - pg * 2.25);
    const saveMonthly = (saveDiscretionary * 0.1) / 12;

    // REPAYE: discretionary income = income - 150% of poverty, 10% rate
    const repayeDiscretionary = Math.max(0, income - pg * 1.5);
    const repayeMonthly = (repayeDiscretionary * 0.1) / 12;

    // Cap monthly payments at 10-year standard amortization
    const standardTenYear =
      monthlyRate === 0
        ? principal / 120
        : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -120));

    const savePayment = Math.min(saveMonthly, standardTenYear);
    const repayePayment = Math.min(repayeMonthly, standardTenYear);

    const saveTotalPaid = savePayment * months;
    const repayeTotalPaid = repayePayment * months;

    // Approximate forgiveness: balance + simple accrued interest - total paid
    const accrued = principal * (rate / 100) * years;
    const saveForgiveness = Math.max(0, principal + accrued - saveTotalPaid);
    const repayeForgiveness = Math.max(0, principal + accrued - repayeTotalPaid);

    return {
      saveMonthly: fmtCurrency(savePayment),
      repayeMonthly: fmtCurrency(repayePayment),
      saveTotalPaid: fmtCurrency(saveTotalPaid),
      repayeTotalPaid: fmtCurrency(repayeTotalPaid),
      saveForgiveness: fmtCurrency(saveForgiveness),
      repayeForgiveness: fmtCurrency(repayeForgiveness),
    };
  }, [loanAmount, interestRate, annualIncome, familySize, repaymentYears]);

  const inputClass =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40";

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="save-vs-rap-calculator"
    >
      <div className="max-w-4xl space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.loanAmount")}
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              placeholder={t("placeholders.loanAmount")}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.interestRate")}
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder={t("placeholders.interestRate")}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.annualIncome")}
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(e.target.value)}
              placeholder={t("placeholders.annualIncome")}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.familySize")}
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={familySize}
              onChange={(e) => setFamilySize(e.target.value)}
              placeholder={t("placeholders.familySize")}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.repaymentYears")}
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={repaymentYears}
              onChange={(e) => setRepaymentYears(e.target.value)}
              placeholder={t("placeholders.repaymentYears")}
              className={inputClass}
            />
          </div>
        </div>

        {result && (
          <div className="space-y-4">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
              <h3 className="mb-4 text-lg font-semibold text-zinc-100">
                {t("labels.comparison")}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <PlanCard
                  name={t("labels.savePlan")}
                  monthlyPayment={result.saveMonthly}
                  totalPaid={result.saveTotalPaid}
                  forgiveness={result.saveForgiveness}
                  highlight
                />
                <PlanCard
                  name={t("labels.repayePlan")}
                  monthlyPayment={result.repayeMonthly}
                  totalPaid={result.repayeTotalPaid}
                  forgiveness={result.repayeForgiveness}
                />
              </div>
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed">
              {t("labels.disclaimer")}
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

function PlanCard({
  name,
  monthlyPayment,
  totalPaid,
  forgiveness,
  highlight = false,
}: {
  name: string;
  monthlyPayment: string;
  totalPaid: string;
  forgiveness: string;
  highlight?: boolean;
}) {
  const t = useTranslations("tools.save-vs-rap-calculator");
  return (
    <div
      className={`rounded-lg border p-5 space-y-3 ${
        highlight
          ? "border-blue-500/40 bg-blue-600/5"
          : "border-zinc-700 bg-zinc-800/50"
      }`}
    >
      <h4 className="font-semibold text-zinc-100">{name}</h4>
      <div>
        <p className="text-sm text-zinc-400">{t("labels.monthlyPayment")}</p>
        <p className="text-2xl font-bold text-blue-400">{monthlyPayment}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-zinc-400">{t("labels.totalPaid")}</p>
          <p className="text-lg font-semibold text-zinc-200">{totalPaid}</p>
        </div>
        <div>
          <p className="text-sm text-zinc-400">{t("labels.forgiveness")}</p>
          <p className="text-lg font-semibold text-zinc-200">{forgiveness}</p>
        </div>
      </div>
    </div>
  );
}
