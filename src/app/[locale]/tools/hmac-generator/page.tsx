"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type KeyFormat = "text" | "hex" | "base64";
type HmacAlgo = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function bytesToBase64(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function decodeKey(key: string, format: KeyFormat): Uint8Array<ArrayBuffer> | null {
  if (format === "text") return new TextEncoder().encode(key);
  const clean = key.replace(/\s+/g, "");
  if (format === "hex") {
    if (!/^[0-9a-fA-F]+$/.test(clean) || clean.length % 2 !== 0) return null;
    const bytes = new Uint8Array(clean.length / 2);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
    }
    return bytes;
  }
  try {
    const bin = atob(clean);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  } catch {
    return null;
  }
}

export default function HmacGeneratorPage() {
  const t = useTranslations("tools.hmac-generator");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [message, setMessage] = useState("");
  const [key, setKey] = useState("");
  const [keyFormat, setKeyFormat] = useState<KeyFormat>("text");
  const [algo, setAlgo] = useState<HmacAlgo>("SHA-256");
  const [hex, setHex] = useState("");
  const [base64, setBase64] = useState("");
  const [error, setError] = useState("");

  const compute = async () => {
    setError("");
    setHex("");
    setBase64("");
    if (!message) {
      setError(t("labels.emptyMessage"));
      return;
    }
    if (!key) {
      setError(t("labels.emptyKey"));
      return;
    }
    const keyBytes = decodeKey(key, keyFormat);
    if (!keyBytes) {
      setError(keyFormat === "hex" ? t("labels.invalidHex") : t("labels.invalidBase64"));
      return;
    }
    try {
      const cryptoKey = await crypto.subtle.importKey("raw", keyBytes, { name: "HMAC", hash: algo }, false, ["sign"]);
      const signature = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(message));
      const bytes = new Uint8Array(signature);
      setHex(bytesToHex(bytes));
      setBase64(bytesToBase64(bytes));
    } catch {
      setError(t("labels.error"));
    }
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="hmac-generator"
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.message")}</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("labels.messagePlaceholder")}
                rows={7}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 resize-y"
                spellCheck={false}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.key")}</label>
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder={t("labels.keyPlaceholder")}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 font-mono text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-zinc-400">{t("labels.keyFormat")}</label>
                <select
                  value={keyFormat}
                  onChange={(e) => setKeyFormat(e.target.value as KeyFormat)}
                  className="rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1 text-sm text-zinc-100 outline-none focus:border-blue-500"
                >
                  <option value="text">{t("labels.formatText")}</option>
                  <option value="hex">{t("labels.formatHex")}</option>
                  <option value="base64">{t("labels.formatBase64")}</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-zinc-400">{t("labels.algorithm")}</label>
                <select
                  value={algo}
                  onChange={(e) => setAlgo(e.target.value as HmacAlgo)}
                  className="rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1 text-sm text-zinc-100 outline-none focus:border-blue-500"
                >
                  <option value="SHA-1">HMAC SHA-1</option>
                  <option value="SHA-256">HMAC SHA-256</option>
                  <option value="SHA-384">HMAC SHA-384</option>
                  <option value="SHA-512">HMAC SHA-512</option>
                </select>
              </div>
              <button
                onClick={compute}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
              >
                {t("buttons.generate")}
              </button>
            </div>

            {error && (
              <div className="rounded-lg border border-red-800 bg-red-950 p-3 text-sm text-red-400">{error}</div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-300">{t("labels.hexOutput")}</label>
                {hex && <CopyButton text={hex} className="text-xs px-2 py-1" />}
              </div>
              <textarea
                readOnly
                value={hex}
                placeholder={t("labels.outputPlaceholder")}
                rows={5}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-xs text-zinc-300 placeholder-zinc-500 outline-none resize-y"
                spellCheck={false}
              />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-300">{t("labels.base64Output")}</label>
                {base64 && <CopyButton text={base64} className="text-xs px-2 py-1" />}
              </div>
              <textarea
                readOnly
                value={base64}
                placeholder={t("labels.outputPlaceholder")}
                rows={5}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-xs text-zinc-300 placeholder-zinc-500 outline-none resize-y"
                spellCheck={false}
              />
            </div>
          </div>
        </div>

        <p className="text-xs text-zinc-500">{t("labels.privacy")}</p>
      </div>
    </ToolLayout>
  );
}
