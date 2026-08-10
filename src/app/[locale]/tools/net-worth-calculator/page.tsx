"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

interface Item {
  id: string;
  name: string;
  value: string;
}

export default function NetWorthCalculatorPage() {
  const t = useTranslations("tools.net-worth-calculator");
  const [assets, setAssets] = useState<Item[]>([
    { id: "1", name: "", value: "" },
  ]);
  const [liabilities, setLiabilities] = useState<Item[]>([
    { id: "1", name: "", value: "" },
  ]);

  const totalAssets = assets.reduce((sum, item) => {
    const v = parseFloat(item.value);
    return sum + (Number.isNaN(v) ? 0 : v);
  }, 0);

  const totalLiabilities = liabilities.reduce((sum, item) => {
    const v = parseFloat(item.value);
    return sum + (Number.isNaN(v) ? 0 : v);
  }, 0);

  const netWorth = totalAssets - totalLiabilities;
  const debtToAsset =
    totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;

  const fmt = (v: number) =>
    v.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });

  const addItem = (type: "asset" | "liability") => {
    const setter = type === "asset" ? setAssets : setLiabilities;
    const list = type === "asset" ? assets : liabilities;
    setter([...list, { id: crypto.randomUUID(), name: "", value: "" }]);
  };

  const removeItem = (type: "asset" | "liability", id: string) => {
    const setter = type === "asset" ? setAssets : setLiabilities;
    const list = type === "asset" ? assets : liabilities;
    setter(list.filter((item) => item.id !== id));
  };

  const updateItem = (
    type: "asset" | "liability",
    id: string,
    field: keyof Item,
    value: string
  ) => {
    const setter = type === "asset" ? setAssets : setLiabilities;
    const list = type === "asset" ? assets : liabilities;
    setter(
      list.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const renderList = (type: "asset" | "liability", list: Item[]) => (
    <div className="space-y-2">
      {list.map((item) => (
        <div key={item.id} className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
          <input
            type="text"
            value={item.name}
            onChange={(e) =>
              updateItem(type, item.id, "name", e.target.value)
            }
            placeholder={t("labels.itemName")}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
          />
          <input
            type="number"
            min="0"
            step="0.01"
            value={item.value}
            onChange={(e) =>
              updateItem(type, item.id, "value", e.target.value)
            }
            placeholder="0"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
          />
          <button
            onClick={() => removeItem(type, item.id)}
            className="rounded-lg bg-red-600/20 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-600/30 transition-colors"
          >
            {t("buttons.remove")}
          </button>
        </div>
      ))}
      <button
        onClick={() => addItem(type)}
        className="w-full rounded-lg border border-dashed border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-400 hover:border-zinc-500 hover:text-zinc-300 transition-colors"
      >
        {type === "asset" ? t("buttons.addAsset") : t("buttons.addLiability")}
      </button>
    </div>
  );

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="net-worth-calculator"
    >
      <div className="max-w-3xl space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-100">
              {t("labels.assets")}
            </h2>
            {renderList("asset", assets)}
          </div>
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-100">
              {t("labels.liabilities")}
            </h2>
            {renderList("liability", liabilities)}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-zinc-400">{t("labels.totalAssets")}</p>
              <p className="text-xl font-semibold text-zinc-200">
                {fmt(totalAssets)}
              </p>
            </div>
            <div>
              <p className="text-sm text-zinc-400">
                {t("labels.totalLiabilities")}
              </p>
              <p className="text-xl font-semibold text-zinc-200">
                {fmt(totalLiabilities)}
              </p>
            </div>
            <div>
              <p className="text-sm text-zinc-400">{t("labels.netWorth")}</p>
              <p
                className={`text-2xl font-bold ${
                  netWorth >= 0 ? "text-blue-400" : "text-red-400"
                }`}
              >
                {fmt(netWorth)}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-zinc-400">
              {t("labels.debtToAssetRatio")}
            </p>
            <p className="text-xl font-semibold text-zinc-200">
              {debtToAsset.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
