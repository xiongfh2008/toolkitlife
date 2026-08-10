"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type CaseType = "lower" | "upper" | "title" | "sentence" | "camelCase" | "snakeCase" | "kebabCase";

function toTitleCase(text: string): string {
  return text.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

function toSentenceCase(text: string): string {
  return text.toLowerCase().replace(/(^|[.!?]\s+)([a-z])/g, (_, prefix, char) => prefix + char.toUpperCase());
}

function toCamelCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
}

function toSnakeCase(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function toKebabCase(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function convert(text: string, type: CaseType): string {
  switch (type) {
    case "lower":
      return text.toLowerCase();
    case "upper":
      return text.toUpperCase();
    case "title":
      return toTitleCase(text);
    case "sentence":
      return toSentenceCase(text);
    case "camelCase":
      return toCamelCase(text);
    case "snakeCase":
      return toSnakeCase(text);
    case "kebabCase":
      return toKebabCase(text);
    default:
      return text;
  }
}

export default function TextCaseConverterPage() {
  const t = useTranslations("tools.text-case-converter");
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");

  const handleConvert = (type: CaseType) => {
    setOutput(convert(text, type));
  };

  const buttons: CaseType[] = ["lower", "upper", "title", "sentence", "camelCase", "snakeCase", "kebabCase"];

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="text-case-converter"
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.enterText")}</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 resize-y"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {buttons.map((type) => (
            <button
              key={type}
              onClick={() => handleConvert(type)}
              className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-600 transition-colors"
            >
              {t(`buttons.${type}`)}
            </button>
          ))}
        </div>

        {output && (
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">{t("labels.output")}</label>
              <CopyButton text={output} className="text-xs px-2 py-1" />
            </div>
            <textarea
              value={output}
              readOnly
              rows={8}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-300 outline-none resize-y"
            />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
