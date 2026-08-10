"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type Mode =
  | "textToBinary"
  | "binaryToText"
  | "textToHex"
  | "hexToText"
  | "textToDecimal"
  | "decimalToText";

function textToBinary(text: string): string {
  return Array.from(new TextEncoder().encode(text))
    .map((b) => b.toString(2).padStart(8, "0"))
    .join(" ");
}

function binaryToText(binary: string): string {
  const cleaned = binary.replace(/\s+/g, "");
  if (cleaned.length % 8 !== 0 || /[^01]/.test(cleaned)) {
    throw new Error("Invalid binary");
  }
  const bytes = new Uint8Array(cleaned.match(/.{8}/g)!.map((b) => parseInt(b, 2)));
  return new TextDecoder().decode(bytes);
}

function textToHex(text: string): string {
  return Array.from(new TextEncoder().encode(text))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(" ");
}

function hexToText(hex: string): string {
  const cleaned = hex.replace(/\s+/g, "");
  if (cleaned.length % 2 !== 0 || /[^0-9a-fA-F]/.test(cleaned)) {
    throw new Error("Invalid hex");
  }
  const bytes = new Uint8Array(cleaned.match(/.{2}/g)!.map((h) => parseInt(h, 16)));
  return new TextDecoder().decode(bytes);
}

function textToDecimal(text: string): string {
  return Array.from(new TextEncoder().encode(text))
    .map((b) => b.toString(10))
    .join(" ");
}

function decimalToText(decimal: string): string {
  const cleaned = decimal.replace(/\s+/g, " ").trim();
  const parts = cleaned.split(/\s+/);
  if (parts.some((p) => /[^0-9]/.test(p) || p === "" || parseInt(p, 10) > 255)) {
    throw new Error("Invalid decimal");
  }
  const bytes = new Uint8Array(parts.map((p) => parseInt(p, 10)));
  return new TextDecoder().decode(bytes);
}

function convert(text: string, mode: Mode): string {
  switch (mode) {
    case "textToBinary":
      return textToBinary(text);
    case "binaryToText":
      return binaryToText(text);
    case "textToHex":
      return textToHex(text);
    case "hexToText":
      return hexToText(text);
    case "textToDecimal":
      return textToDecimal(text);
    case "decimalToText":
      return decimalToText(text);
    default:
      return text;
  }
}

export default function BinaryConverterPage() {
  const t = useTranslations("tools.binary-converter");
  const [mode, setMode] = useState<Mode>("textToBinary");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleConvert = () => {
    setError("");
    try {
      setOutput(convert(input, mode));
    } catch {
      setError(t("labels.error"));
      setOutput("");
    }
  };

  const modes: Mode[] = [
    "textToBinary",
    "binaryToText",
    "textToHex",
    "hexToText",
    "textToDecimal",
    "decimalToText",
  ];

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="binary-converter"
    >
      <div className="max-w-3xl space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.mode")}</label>
          <select
            value={mode}
            onChange={(e) => {
              setMode(e.target.value as Mode);
              setOutput("");
              setError("");
            }}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
          >
            {modes.map((m) => (
              <option key={m} value={m}>
                {t(`options.${m}`)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.input")}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("labels.inputPlaceholder")}
            rows={6}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 resize-y"
          />
        </div>

        <button
          onClick={handleConvert}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
        >
          {t("buttons.convert")}
        </button>

        {error && <p className="text-sm text-red-400">{error}</p>}

        {output && (
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">{t("labels.output")}</label>
              <CopyButton text={output} className="text-xs px-2 py-1" />
            </div>
            <textarea
              value={output}
              readOnly
              rows={6}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-300 outline-none resize-y"
            />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
