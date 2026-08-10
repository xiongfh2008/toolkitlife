"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

interface Expense {
  id: string;
  name: string;
  amount: string;
}

export default function BudgetCalculatorPage() {
  const t = useTranslations("tools.budget-calculator");
  const [income, setIncome] = useState("5000");
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: "1", name: "Rent", amount: "1200" },
    { id: "2", name: "Groceries", amount: "400" },
    { id: "3", name: "Utilities", amount: "150" },
  ]);

  const totalExpenses = expenses.reduce((sum, item) => {
    const v = parseFloat(item.amount);
    return sum + (Number.isNaN(v) ? 0 : v);
  }, 0);

  const incomeValue = parseFloat(income);
  const remaining = Number.isNaN(incomeValue) ? -totalExpenses : incomeValue - totalExpenses;

  const fmt = (v: number) =>
    v.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });

  const updateExpense = (id: string, field: keyof Expense, value: string) => {
    setExpenses(
      expenses.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addExpense = () => {
    setExpenses([
      ...expenses,
      { id: crypto.randomUUID(), name: "", amount: "" },
    ]);
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter((item) => item.id !== id));
  };

  const needs = incomeValue > 0 ? (totalExpenses / incomeValue) * 100 : 0;
  const wants = 30;
  const savings = 20;

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="budget-calculator"
    >
      <div className="max-w-3xl space-y-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            {t("labels.income")}
          </label>
          <input
            type="number"
            min="0"
            step="100"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="5000"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-100">
            {t("labels.expenses")}
          </h2>
          <div className="space-y-2">
            {expenses.map((item) => (
              <div
                key={item.id}
                className="grid gap-2 sm:grid-cols-[1fr_auto_auto]"
              >
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) =>
                    updateExpense(item.id, "name", e.target.value)
                  }
                  placeholder={t("labels.expenseName")}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.amount}
                  onChange={(e) =>
                    updateExpense(item.id, "amount", e.target.value)
                  }
                  placeholder="0"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
                />
                <button
                  onClick={() => removeExpense(item.id)}
                  className="rounded-lg bg-red-600/20 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-600/30 transition-colors"
                >
                  {t("buttons.remove")}
                </button>
              </div>
            ))}
            <button
              onClick={addExpense}
              className="w-full rounded-lg border border-dashed border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-400 hover:border-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {t("buttons.addExpense")}
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-zinc-400">{t("labels.totalIncome")}</p>
              <p className="text-xl font-semibold text-zinc-200">
                {fmt(Number.isNaN(incomeValue) ? 0 : incomeValue)}
              </p>
            </div>
            <div>
              <p className="text-sm text-zinc-400">
                {t("labels.totalExpenses")}
              </p>
              <p className="text-xl font-semibold text-zinc-200">
                {fmt(totalExpenses)}
              </p>
            </div>
            <div>
              <p className="text-sm text-zinc-400">{t("labels.remaining")}</p>
              <p
                className={`text-2xl font-bold ${
                  remaining >= 0 ? "text-blue-400" : "text-red-400"
                }`}
              >
                {fmt(remaining)}
              </p>
            </div>
          </div>
        </div>

        {incomeValue > 0 && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <h3 className="text-sm font-medium text-zinc-300">
              {t("labels.fiftyThirtyTwenty")}
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">
                  {t("labels.needs")} (50%)
                </span>
                <span className="text-zinc-200">{needs.toFixed(1)}%</span>
              </div>
              <div className="h-2 rounded-full bg-zinc-800">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: `${Math.min(needs, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">
                  {t("labels.wants")} (30%)
                </span>
                <span className="text-zinc-200">{wants.toFixed(1)}%</span>
              </div>
              <div className="h-2 rounded-full bg-zinc-800">
                <div
                  className="h-2 rounded-full bg-purple-500"
                  style={{ width: `${Math.min(wants, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">
                  {t("labels.savings")} (20%)
                </span>
                <span className="text-zinc-200">{savings.toFixed(1)}%</span>
              </div>
              <div className="h-2 rounded-full bg-zinc-800">
                <div
                  className="h-2 rounded-full bg-green-500"
                  style={{ width: `${Math.min(savings, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
