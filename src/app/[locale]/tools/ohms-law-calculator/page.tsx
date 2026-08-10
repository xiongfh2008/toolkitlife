"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type Quantity = "voltage" | "current" | "resistance" | "power";

const QUANTITIES: Quantity[] = ["voltage", "current", "resistance", "power"];

export default function OhmsLawCalculatorPage() {
  const t = useTranslations("tools.ohms-law-calculator");
  const [known1, setKnown1] = useState<Quantity>("voltage");
  const [known2, setKnown2] = useState<Quantity>("current");
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");

  const result = useMemo(() => {
    const v1 = parseFloat(value1);
    const v2 = parseFloat(value2);

    if (value1 === "" || value2 === "" || Number.isNaN(v1) || Number.isNaN(v2)) {
      return null;
    }

    const pair: [Quantity, Quantity] = [known1, known2];
    let voltage = 0;
    let current = 0;
    let resistance = 0;
    let power = 0;

    try {
      if (pair[0] === "voltage" && pair[1] === "current") {
        voltage = v1;
        current = v2;
        if (current === 0) throw new Error(t("errors.divideByZero"));
        resistance = voltage / current;
        power = voltage * current;
      } else if (pair[0] === "current" && pair[1] === "voltage") {
        voltage = v2;
        current = v1;
        if (current === 0) throw new Error(t("errors.divideByZero"));
        resistance = voltage / current;
        power = voltage * current;
      } else if (pair[0] === "voltage" && pair[1] === "resistance") {
        voltage = v1;
        resistance = v2;
        if (resistance === 0) throw new Error(t("errors.divideByZero"));
        current = voltage / resistance;
        power = (voltage * voltage) / resistance;
      } else if (pair[0] === "resistance" && pair[1] === "voltage") {
        voltage = v2;
        resistance = v1;
        if (resistance === 0) throw new Error(t("errors.divideByZero"));
        current = voltage / resistance;
        power = (voltage * voltage) / resistance;
      } else if (pair[0] === "voltage" && pair[1] === "power") {
        voltage = v1;
        power = v2;
        if (voltage === 0) throw new Error(t("errors.divideByZero"));
        current = power / voltage;
        resistance = (voltage * voltage) / power;
      } else if (pair[0] === "power" && pair[1] === "voltage") {
        voltage = v2;
        power = v1;
        if (voltage === 0) throw new Error(t("errors.divideByZero"));
        current = power / voltage;
        resistance = (voltage * voltage) / power;
      } else if (pair[0] === "current" && pair[1] === "resistance") {
        current = v1;
        resistance = v2;
        voltage = current * resistance;
        power = current * current * resistance;
      } else if (pair[0] === "resistance" && pair[1] === "current") {
        current = v2;
        resistance = v1;
        voltage = current * resistance;
        power = current * current * resistance;
      } else if (pair[0] === "current" && pair[1] === "power") {
        current = v1;
        power = v2;
        if (current === 0) throw new Error(t("errors.divideByZero"));
        voltage = power / current;
        resistance = power / (current * current);
      } else if (pair[0] === "power" && pair[1] === "current") {
        current = v2;
        power = v1;
        if (current === 0) throw new Error(t("errors.divideByZero"));
        voltage = power / current;
        resistance = power / (current * current);
      } else if (pair[0] === "resistance" && pair[1] === "power") {
        resistance = v1;
        power = v2;
        if (resistance <= 0) throw new Error(t("errors.resistancePositive"));
        current = Math.sqrt(power / resistance);
        voltage = Math.sqrt(power * resistance);
      } else if (pair[0] === "power" && pair[1] === "resistance") {
        resistance = v2;
        power = v1;
        if (resistance <= 0) throw new Error(t("errors.resistancePositive"));
        current = Math.sqrt(power / resistance);
        voltage = Math.sqrt(power * resistance);
      } else {
        throw new Error(t("errors.sameQuantity"));
      }

      if (
        !Number.isFinite(voltage) ||
        !Number.isFinite(current) ||
        !Number.isFinite(resistance) ||
        !Number.isFinite(power)
      ) {
        throw new Error(t("errors.invalidResult"));
      }

      return { ok: true as const, voltage, current, resistance, power };
    } catch (err) {
      return { ok: false as const, error: err instanceof Error ? err.message : t("errors.invalidResult") };
    }
  }, [known1, known2, value1, value2, t]);

  const fmt = (n: number) =>
    n.toLocaleString(undefined, {
      maximumFractionDigits: 6,
      minimumFractionDigits: 0,
    });

  const inputClass =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40";
  const selectClass =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500";

  const handleKnown1Change = (q: Quantity) => {
    setKnown1(q);
    if (q === known2) {
      const next = QUANTITIES.find((x) => x !== q) ?? "current";
      setKnown2(next);
    }
  };

  const handleKnown2Change = (q: Quantity) => {
    if (q !== known1) {
      setKnown2(q);
    }
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="ohms-law-calculator"
    >
      <div className="max-w-3xl space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300">
              {t("labels.known1")}
            </label>
            <select
              value={known1}
              onChange={(e) => handleKnown1Change(e.target.value as Quantity)}
              className={selectClass}
            >
              {QUANTITIES.map((q) => (
                <option key={q} value={q}>
                  {t(`quantities.${q}`)}
                </option>
              ))}
            </select>
            <input
              type="number"
              step="any"
              value={value1}
              onChange={(e) => setValue1(e.target.value)}
              placeholder={t("placeholders.value")}
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300">
              {t("labels.known2")}
            </label>
            <select
              value={known2}
              onChange={(e) => handleKnown2Change(e.target.value as Quantity)}
              className={selectClass}
            >
              {QUANTITIES.filter((q) => q !== known1).map((q) => (
                <option key={q} value={q}>
                  {t(`quantities.${q}`)}
                </option>
              ))}
            </select>
            <input
              type="number"
              step="any"
              value={value2}
              onChange={(e) => setValue2(e.target.value)}
              placeholder={t("placeholders.value")}
              className={inputClass}
            />
          </div>
        </div>

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            {result.ok ? (
              <>
                <ResultRow
                  label={t("quantities.voltage")}
                  unit={t("units.voltage")}
                  value={fmt(result.voltage)}
                />
                <ResultRow
                  label={t("quantities.current")}
                  unit={t("units.current")}
                  value={fmt(result.current)}
                />
                <ResultRow
                  label={t("quantities.resistance")}
                  unit={t("units.resistance")}
                  value={fmt(result.resistance)}
                />
                <ResultRow
                  label={t("quantities.power")}
                  unit={t("units.power")}
                  value={fmt(result.power)}
                />
              </>
            ) : (
              <p className="text-sm text-red-400">{result.error}</p>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

function ResultRow({
  label,
  unit,
  value,
}: {
  label: string;
  unit: string;
  value: string;
}) {
  const display = `${value} ${unit}`;
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-zinc-400">{label}</p>
        <p className="text-xl font-semibold text-zinc-200">{display}</p>
      </div>
      <CopyButton text={display} className="text-xs px-2 py-1" />
    </div>
  );
}
