"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function base64UrlDecode(input: string): string {
  const padding = "=".repeat((4 - (input.length % 4)) % 4);
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/") + padding;
  return decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
      .join("")
  );
}

function formatJson(json: string): string {
  try {
    return JSON.stringify(JSON.parse(json), null, 2);
  } catch {
    return json;
  }
}

export default function JwtDecoderPage() {
  const t = useTranslations("tools.jwt-decoder");
  const [input, setInput] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [error, setError] = useState("");
  const [expires, setExpires] = useState("");

  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const decode = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) {
      setHeader("");
      setPayload("");
      setExpires("");
      setError("");
      return;
    }
    const parts = trimmed.split(".");
    if (parts.length !== 3) {
      setError(t("labels.invalid"));
      setHeader("");
      setPayload("");
      setExpires("");
      return;
    }
    try {
      const headerJson = base64UrlDecode(parts[0]);
      const payloadJson = base64UrlDecode(parts[1]);
      setHeader(formatJson(headerJson));
      setPayload(formatJson(payloadJson));
      setError("");

      const payloadObj = JSON.parse(payloadJson);
      if (payloadObj.exp) {
        const expDate = new Date(payloadObj.exp * 1000);
        setExpires(expDate.toLocaleString());
      } else {
        setExpires("");
      }
    } catch {
      setError(t("labels.invalid"));
      setHeader("");
      setPayload("");
      setExpires("");
    }
  }, [input, t]);

  const clear = () => {
    setInput("");
    setHeader("");
    setPayload("");
    setExpires("");
    setError("");
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="jwt-decoder"
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={decode} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors">
            {t("buttons.decode")}
          </button>
          <button onClick={clear} className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-700 transition-colors">
            {t("buttons.clear")}
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-800 bg-red-950 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {expires && (
          <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-sm text-zinc-300">
            {t("labels.expires")}: <span className="font-mono text-zinc-100">{expires}</span>
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.input")}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("labels.inputPlaceholder")}
            rows={6}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 resize-y"
            spellCheck={false}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">{t("labels.header")}</label>
              {header && <CopyButton text={header} className="text-xs px-2 py-1" />}
            </div>
            <textarea
              value={header}
              readOnly
              rows={12}
              placeholder={t("labels.outputPlaceholder")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-sm text-zinc-300 placeholder-zinc-500 outline-none resize-y"
              spellCheck={false}
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">{t("labels.payload")}</label>
              {payload && <CopyButton text={payload} className="text-xs px-2 py-1" />}
            </div>
            <textarea
              value={payload}
              readOnly
              rows={12}
              placeholder={t("labels.outputPlaceholder")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-sm text-zinc-300 placeholder-zinc-500 outline-none resize-y"
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
