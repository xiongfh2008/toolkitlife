"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type Mode = "encode" | "decode";

export default function UrlEncoderPage() {
  const t = useTranslations("tools.url-encoder");
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleAction = () => {
    setError("");
    try {
      if (mode === "encode") {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch {
      setError(t("labels.error"));
      setOutput("");
    }
  };

  const modes: Mode[] = ["encode", "decode"];

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="url-encoder"
    >
      <div className="max-w-3xl space-y-4">
        <div className="flex flex-wrap gap-2">
          {modes.map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setOutput("");
                setError("");
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                mode === m ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {t(`options.${m}`)}
            </button>
          ))}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.input")}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 resize-y"
          />
        </div>

        <button
          onClick={handleAction}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
        >
          {mode === "encode" ? t("buttons.encode") : t("buttons.decode")}
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
