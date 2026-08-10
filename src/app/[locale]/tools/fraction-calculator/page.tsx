"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

export default function FractionCalculatorPage() {
  const t = useTranslations("tools.fraction-calculator");
  const [num1, setNum1] = useState("1");
  const [den1, setDen1] = useState("2");
  const [num2, setNum2] = useState("1");
  const [den2, setDen2] = useState("3");
  const [operation, setOperation] = useState<"+" | "-" | "*" | "/">("+");
  const [result, setResult] = useState<{
    numerator: number;
    denominator: number;
    decimal: string;
    display: string;
  } | null>(null);

  const gcd = (a: number, b: number): number => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  const calculate = () => {
    const n1 = parseInt(num1, 10);
    const d1 = parseInt(den1, 10);
    const n2 = parseInt(num2, 10);
    const d2 = parseInt(den2, 10);

    if (
      Number.isNaN(n1) ||
      Number.isNaN(d1) ||
      Number.isNaN(n2) ||
      Number.isNaN(d2) ||
      d1 === 0 ||
      d2 === 0
    ) {
      setResult(null);
      return;
    }

    let numerator = 0;
    let denominator = 1;

    switch (operation) {
      case "+":
        numerator = n1 * d2 + n2 * d1;
        denominator = d1 * d2;
        break;
      case "-":
        numerator = n1 * d2 - n2 * d1;
        denominator = d1 * d2;
        break;
      case "*":
        numerator = n1 * n2;
        denominator = d1 * d2;
        break;
      case "/":
        numerator = n1 * d2;
        denominator = d1 * n2;
        break;
    }

    if (denominator === 0) {
      setResult(null);
      return;
    }

    const common = gcd(numerator, denominator);
    numerator = numerator / common;
    denominator = denominator / common;

    if (denominator < 0) {
      numerator = -numerator;
      denominator = -denominator;
    }

    const whole = Math.floor(Math.abs(numerator) / denominator);
    const remainder = Math.abs(numerator) % denominator;
    const sign = numerator < 0 ? "-" : "";

    let display = "";
    if (whole > 0 && remainder > 0) {
      display = `${sign}${whole} ${remainder}/${denominator}`;
    } else if (whole > 0) {
      display = `${sign}${whole}`;
    } else {
      display = `${sign}${remainder}/${denominator}`;
    }

    setResult({
      numerator,
      denominator,
      decimal: (numerator / denominator).toFixed(6).replace(/\.?0+$/, ""),
      display,
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="fraction-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col items-center gap-1">
            <input
              type="number"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              className="w-20 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-center text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
            <div className="h-px w-20 bg-zinc-600" />
            <input
              type="number"
              value={den1}
              onChange={(e) => setDen1(e.target.value)}
              className="w-20 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-center text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          <div className="flex gap-1">
            {(["+", "-", "*", "/"] as const).map((op) => (
              <button
                key={op}
                onClick={() => {
                  setOperation(op);
                  setResult(null);
                }}
                className={`h-10 w-10 rounded-lg text-lg font-medium transition-colors ${
                  operation === op
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                {op}
              </button>
            ))}
          </div>

          <div className="flex flex-col items-center gap-1">
            <input
              type="number"
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
              className="w-20 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-center text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
            <div className="h-px w-20 bg-zinc-600" />
            <input
              type="number"
              value={den2}
              onChange={(e) => setDen2(e.target.value)}
              className="w-20 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-center text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
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
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">
                  {t("labels.result")}
                </p>
                <p className="text-3xl font-bold text-blue-400">
                  {result.display}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">
                  {t("labels.decimal")}
                </p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.decimal}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
