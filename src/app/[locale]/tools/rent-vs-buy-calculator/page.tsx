"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

export default function RentVsBuyCalculatorPage() {
  const t = useTranslations("tools.rent-vs-buy-calculator");

  const [monthlyRent, setMonthlyRent] = useState("1500");
  const [renterInsurance, setRenterInsurance] = useState("15");
  const [rentIncrease, setRentIncrease] = useState("3");
  const [homePrice, setHomePrice] = useState("300000");
  const [downPercent, setDownPercent] = useState("20");
  const [mortgageRate, setMortgageRate] = useState("6.5");
  const [termYears, setTermYears] = useState("30");
  const [propTaxRate, setPropTaxRate] = useState("1.1");
  const [homeInsurance, setHomeInsurance] = useState("1200");
  const [hoa, setHoa] = useState("50");
  const [maintenancePct, setMaintenancePct] = useState("1");
  const [closingPct, setClosingPct] = useState("3");
  const [analysisYears, setAnalysisYears] = useState("10");
  const [investReturn, setInvestReturn] = useState("7");
  const [appreciation, setAppreciation] = useState("3");

  const fmt = (v: number) =>
    v.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });

  const n = (s: string) => parseFloat(s);

  const calculate = () => {
    const rent = n(monthlyRent);
    const rIns = n(renterInsurance);
    const rInc = n(rentIncrease);
    const price = n(homePrice);
    const downPct = n(downPercent) / 100;
    const mRate = n(mortgageRate) / 100;
    const term = n(termYears);
    const ptax = n(propTaxRate) / 100;
    const hIns = n(homeInsurance);
    const hoaMo = n(hoa);
    const maintPct = n(maintenancePct) / 100;
    const closingPctNum = n(closingPct) / 100;
    const years = Math.round(n(analysisYears));
    const invest = n(investReturn) / 100;
    const appr = n(appreciation) / 100;

    if (
      [rent, rIns, rInc, price, downPct, mRate, term, ptax, hIns, hoaMo, maintPct, closingPctNum, invest, appr].some(
        (v) => Number.isNaN(v)
      ) ||
      price <= 0 ||
      term <= 0 ||
      years <= 0 ||
      downPct < 0 ||
      mRate < 0
    ) {
      return null;
    }

    const loanAmount = price * (1 - downPct);
    const nMonths = Math.round(term * 12);
    const mr = mRate / 12;
    const mortgage =
      mr === 0
        ? loanAmount / nMonths
        : (loanAmount * (mr * Math.pow(1 + mr, nMonths))) / (Math.pow(1 + mr, nMonths) - 1);

    const upfront = price * downPct + price * closingPctNum;

    // Year-by-year simulation.
    let remainingBalance = loanAmount;
    let renterPortfolio = upfront; // renter invests the down payment + closing upfront
    const rows: {
      year: number;
      rent: number;
      buy: number;
      renterNW: number;
      buyerNW: number;
    }[] = [];
    let rentThisYear = rent;
    let breakEvenYear: number | null = null;
    let currentMonthlyRent = rent + rIns;
    let currentMonthlyBuy = 0;
    let totalRentPaid = 0;
    let totalBuyCost = upfront;
    let finalRenterNW = 0;
    let finalBuyerNW = 0;

    for (let yr = 1; yr <= years; yr++) {
      const homeValue = price * Math.pow(1 + appr, yr);

      // Amortize one year of mortgage.
      for (let mo = 0; mo < 12; mo++) {
        const interest = remainingBalance * mr;
        remainingBalance -= mortgage - interest;
      }

      const rentYear = rentThisYear * 12 + rIns * 12;
      const propTax = homeValue * ptax;
      const maint = homeValue * maintPct;
      const buyYear = mortgage * 12 + propTax + hIns + hoaMo * 12 + maint;

      // Renter invests the (savings) difference + earns on portfolio.
      const savingsDiff = buyYear - rentYear; // extra cash if renting
      renterPortfolio = renterPortfolio * (1 + invest) + savingsDiff;

      const buyerEquity = homeValue - Math.max(0, remainingBalance);

      totalRentPaid += rentYear;
      totalBuyCost += buyYear;
      rows.push({ year: yr, rent: rentYear, buy: buyYear, renterNW: renterPortfolio, buyerNW: buyerEquity });
      if (breakEvenYear === null && buyerEquity >= renterPortfolio) breakEvenYear = yr;

      currentMonthlyRent = rentThisYear + rIns;
      currentMonthlyBuy = mortgage + propTax / 12 + hIns / 12 + hoaMo + maint / 12;
      finalRenterNW = renterPortfolio;
      finalBuyerNW = buyerEquity;

      rentThisYear *= 1 + rInc / 100;
    }

    const verdict = finalBuyerNW > finalRenterNW ? "buy" : "rent";

    return {
      monthlyRent: fmt(currentMonthlyRent),
      monthlyBuy: fmt(currentMonthlyBuy),
      breakEvenYear,
      verdict,
      renterNW: fmt(finalRenterNW),
      buyerNW: fmt(finalBuyerNW),
      advantage: fmt(Math.abs(finalBuyerNW - finalRenterNW)),
      equity: fmt(finalBuyerNW),
      totalRent: fmt(totalRentPaid),
      totalBuy: fmt(totalBuyCost),
      rows,
    };
  };

  const result = calculate();
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40";
  const groupCls = "rounded-xl border border-zinc-800 bg-zinc-900 p-4";

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="rent-vs-buy-calculator"
      keywords={keywords}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="max-w-3xl space-y-6">
        <div className={groupCls}>
          <h3 className="mb-3 text-sm font-semibold text-zinc-200">{t("groups.rent")}</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.monthlyRent")}</label>
              <input type="number" min="0" step="0.01" value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.renterInsurance")}</label>
              <input type="number" min="0" step="0.01" value={renterInsurance} onChange={(e) => setRenterInsurance(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.rentIncrease")}</label>
              <input type="number" min="0" step="0.1" value={rentIncrease} onChange={(e) => setRentIncrease(e.target.value)} className={inputCls} />
            </div>
          </div>
        </div>

        <div className={groupCls}>
          <h3 className="mb-3 text-sm font-semibold text-zinc-200">{t("groups.buy")}</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.homePrice")}</label>
              <input type="number" min="0" step="0.01" value={homePrice} onChange={(e) => setHomePrice(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.downPercent")}</label>
              <input type="number" min="0" max="100" step="0.1" value={downPercent} onChange={(e) => setDownPercent(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.mortgageRate")}</label>
              <input type="number" min="0" step="0.01" value={mortgageRate} onChange={(e) => setMortgageRate(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.termYears")}</label>
              <input type="number" min="1" max="40" step="1" value={termYears} onChange={(e) => setTermYears(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.propTaxRate")}</label>
              <input type="number" min="0" step="0.01" value={propTaxRate} onChange={(e) => setPropTaxRate(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.homeInsurance")}</label>
              <input type="number" min="0" step="0.01" value={homeInsurance} onChange={(e) => setHomeInsurance(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.hoa")}</label>
              <input type="number" min="0" step="0.01" value={hoa} onChange={(e) => setHoa(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.maintenancePct")}</label>
              <input type="number" min="0" step="0.1" value={maintenancePct} onChange={(e) => setMaintenancePct(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.closingPct")}</label>
              <input type="number" min="0" step="0.1" value={closingPct} onChange={(e) => setClosingPct(e.target.value)} className={inputCls} />
            </div>
          </div>
        </div>

        <div className={groupCls}>
          <h3 className="mb-3 text-sm font-semibold text-zinc-200">{t("groups.assumptions")}</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.analysisYears")}</label>
              <input type="number" min="1" max="40" step="1" value={analysisYears} onChange={(e) => setAnalysisYears(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.investReturn")}</label>
              <input type="number" min="0" step="0.1" value={investReturn} onChange={(e) => setInvestReturn(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.appreciation")}</label>
              <input type="number" min="0" step="0.1" value={appreciation} onChange={(e) => setAppreciation(e.target.value)} className={inputCls} />
            </div>
          </div>
        </div>

        {result ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className={groupCls}>
                <p className="text-xs text-zinc-500">{t("results.monthlyRent")}</p>
                <p className="mt-1 text-2xl font-semibold text-zinc-100">{result.monthlyRent}</p>
              </div>
              <div className={groupCls}>
                <p className="text-xs text-zinc-500">{t("results.monthlyBuy")}</p>
                <p className="mt-1 text-2xl font-semibold text-zinc-100">{result.monthlyBuy}</p>
              </div>
              <div className={groupCls}>
                <p className="text-xs text-zinc-500">{t("results.breakEven")}</p>
                <p className="mt-1 text-2xl font-semibold text-zinc-100">
                  {result.breakEvenYear
                    ? t("results.breakEvenValue", { year: result.breakEvenYear })
                    : t("results.noBreakEven")}
                </p>
              </div>
              <div className={groupCls}>
                <p className="text-xs text-zinc-500">{t("results.verdict")}</p>
                <p className="mt-1 text-2xl font-semibold text-zinc-100">
                  {result.verdict === "buy" ? t("results.buyWins") : t("results.rentWins")}
                </p>
              </div>
              <div className={groupCls}>
                <p className="text-xs text-zinc-500">{t("results.renterNW")}</p>
                <p className="mt-1 text-xl text-zinc-200">{result.renterNW}</p>
              </div>
              <div className={groupCls}>
                <p className="text-xs text-zinc-500">{t("results.buyerNW")}</p>
                <p className="mt-1 text-xl text-zinc-200">{result.buyerNW}</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-xs text-zinc-500">
                    <th className="px-4 py-3">{t("table.year")}</th>
                    <th className="px-4 py-3">{t("table.rent")}</th>
                    <th className="px-4 py-3">{t("table.buy")}</th>
                    <th className="px-4 py-3">{t("table.renterNW")}</th>
                    <th className="px-4 py-3">{t("table.buyerNW")}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row) => (
                    <tr key={row.year} className="border-b border-zinc-800/60 last:border-0">
                      <td className="px-4 py-2 text-zinc-200">{row.year}</td>
                      <td className="px-4 py-2 text-zinc-400">{fmt(row.rent)}</td>
                      <td className="px-4 py-2 text-zinc-400">{fmt(row.buy)}</td>
                      <td className="px-4 py-2 text-zinc-400">{fmt(row.renterNW)}</td>
                      <td className="px-4 py-2 text-zinc-400">{fmt(row.buyerNW)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="text-sm text-red-400">{t("errors.invalidInputs")}</p>
        )}
      </div>
    </ToolLayout>
  );
}
