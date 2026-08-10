"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface ScheduleRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export default function AmortizationCalculatorPage() {
  const t = useTranslations("tools.amortization-calculator");
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [term, setTerm] = useState("");
  const [schedule, setSchedule] = useState<ScheduleRow[]>([]);
  const [summary, setSummary] = useState<{
    monthlyPayment: string;
    totalPayment: string;
    totalInterest: string;
  } | null>(null);

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const years = parseFloat(term);
    if (
      Number.isNaN(p) ||
      Number.isNaN(r) ||
      Number.isNaN(years) ||
      p <= 0 ||
      years <= 0
    ) {
      setSchedule([]);
      setSummary(null);
      return;
    }

    const n = years * 12;
    const monthlyRate = r / 100 / 12;
    let monthly = 0;
    if (monthlyRate === 0) {
      monthly = p / n;
    } else {
      monthly =
        (p * (monthlyRate * Math.pow(1 + monthlyRate, n))) /
        (Math.pow(1 + monthlyRate, n) - 1);
    }

    const rows: ScheduleRow[] = [];
    let balance = p;
    let totalInterest = 0;
    for (let i = 1; i <= n; i++) {
      const interest = balance * monthlyRate;
      const principalPaid = monthly - interest;
      balance -= principalPaid;
      totalInterest += interest;
      rows.push({
        month: i,
        payment: monthly,
        principal: principalPaid,
        interest,
        balance: Math.max(0, balance),
      });
    }

    const fmt = (v: number) =>
      v.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      });

    setSchedule(rows);
    setSummary({
      monthlyPayment: fmt(monthly),
      totalPayment: fmt(monthly * n),
      totalInterest: fmt(totalInterest),
    });
  };

  const csv = [
    ["Month", "Payment", "Principal", "Interest", "Balance"].join(","),
    ...schedule.map((row) =>
      [
        row.month,
        row.payment.toFixed(2),
        row.principal.toFixed(2),
        row.interest.toFixed(2),
        row.balance.toFixed(2),
      ].join(",")
    ),
  ].join("\n");

  const downloadCsv = () => {
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "amortization-schedule.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="amortization-calculator"
    >
      <div className="max-w-4xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.principal")}
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="300000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.annualRate")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="6.5"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.term")}
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
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

        {summary && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">
                {t("labels.monthlyPayment")}
              </h3>
              <CopyButton text={summary.monthlyPayment} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{summary.monthlyPayment}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.totalPayment")}</p>
                <p className="text-xl font-semibold text-zinc-200">{summary.totalPayment}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.totalInterest")}</p>
                <p className="text-xl font-semibold text-zinc-200">{summary.totalInterest}</p>
              </div>
            </div>
          </div>
        )}

        {schedule.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.schedule")}</h3>
              <button
                onClick={downloadCsv}
                className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-600 transition-colors"
              >
                {t("buttons.downloadCsv")}
              </button>
            </div>
            <div className="max-h-96 overflow-auto rounded-lg border border-zinc-800 bg-zinc-950">
              <table className="w-full text-sm text-zinc-300">
                <thead className="sticky top-0 bg-zinc-900 text-zinc-100">
                  <tr>
                    <th className="px-4 py-2 text-left">{t("labels.month")}</th>
                    <th className="px-4 py-2 text-right">{t("labels.payment")}</th>
                    <th className="px-4 py-2 text-right">{t("labels.principalPaid")}</th>
                    <th className="px-4 py-2 text-right">{t("labels.interestPaid")}</th>
                    <th className="px-4 py-2 text-right">{t("labels.remainingBalance")}</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((row) => (
                    <tr key={row.month} className="border-t border-zinc-800">
                      <td className="px-4 py-2">{row.month}</td>
                      <td className="px-4 py-2 text-right">
                        {row.payment.toLocaleString(undefined, {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {row.principal.toLocaleString(undefined, {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {row.interest.toLocaleString(undefined, {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {row.balance.toLocaleString(undefined, {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
