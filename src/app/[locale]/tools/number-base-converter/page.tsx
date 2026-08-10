"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const BASES = [2, 8, 10, 16, 36] as const;
type Base = (typeof BASES)[number];

function getDigits(base: Base): string {
  return "0123456789abcdefghijklmnopqrstuvwxyz".slice(0, base);
}

function isValidForBase(value: string, base: Base): boolean {
  const digits = getDigits(base);
  return value.split("").every((c) => digits.includes(c.toLowerCase()));
}

export default function NumberBaseConverterPage() {
  const t = useTranslations("tools.number-base-converter");
  const [input, setInput] = useState("");
  const [fromBase, setFromBase] = useState<Base>(10);
  const [toBase, setToBase] = useState<Base>(2);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    setError("");
    setResult("");
    const trimmed = input.trim();
    if (!trimmed) return;
    if (!isValidForBase(trimmed, fromBase)) {
      setError(t("errors.invalidInput", { base: fromBase }));
      return;
    }
    const decimal = parseInt(trimmed, fromBase);
    if (Number.isNaN(decimal)) {
      setError(t("errors.invalidInput", { base: fromBase }));
      return;
    }
    setResult(decimal.toString(toBase).toUpperCase());
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="number-base-converter"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.fromBase")}
            </label>
            <select
              value={fromBase}
              onChange={(e) => {
                setFromBase(Number(e.target.value) as Base);
                setResult("");
                setError("");
              }}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            >
              {BASES.map((b) => (
                <option key={b} value={b}>
                  {t("options.base", { base: b })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.toBase")}
            </label>
            <select
              value={toBase}
              onChange={(e) => {
                setToBase(Number(e.target.value) as Base);
                setResult("");
                setError("");
              }}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            >
              {BASES.map((b) => (
                <option key={b} value={b}>
                  {t("options.base", { base: b })}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            {t("labels.input")}
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setResult("");
              setError("");
            }}
            placeholder={t("labels.inputPlaceholder")}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
          />
        </div>

        <button
          onClick={convert}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
        >
          {t("buttons.convert")}
        </button>

        {error && <p className="text-sm text-red-400">{error}</p>}

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">
                {t("labels.result")}
              </h3>
              <CopyButton text={result} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400 break-all">{result}</p>
            <p className="mt-1 text-sm text-zinc-500">
              {t("labels.resultBase", { base: toBase })}
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
