"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type KeySize = 2048 | 3072 | 4096;

interface KeyMeta {
  size: KeySize;
  algorithm: string;
  created: string;
}

function bytesToBase64(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function toPem(label: string, bytes: Uint8Array): string {
  const base64 = bytesToBase64(bytes);
  const lines = base64.match(/.{1,64}/g) ?? [];
  return `-----BEGIN ${label}-----\n${lines.join("\n")}\n-----END ${label}-----`;
}

export default function RsaKeyGeneratorPage() {
  const t = useTranslations("tools.rsa-key-generator");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [keySize, setKeySize] = useState<KeySize>(2048);
  const [publicPem, setPublicPem] = useState("");
  const [privatePem, setPrivatePem] = useState("");
  const [meta, setMeta] = useState<KeyMeta | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const generate = async () => {
    setError("");
    setPublicPem("");
    setPrivatePem("");
    setMeta(null);
    setBusy(true);
    try {
      const pair = await crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: keySize,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
      );
      const [spki, pkcs8] = await Promise.all([
        crypto.subtle.exportKey("spki", pair.publicKey),
        crypto.subtle.exportKey("pkcs8", pair.privateKey),
      ]);
      setPublicPem(toPem("PUBLIC KEY", new Uint8Array(spki)));
      setPrivatePem(toPem("PRIVATE KEY", new Uint8Array(pkcs8)));
      setMeta({
        size: keySize,
        algorithm: t("labels.algorithmValue"),
        created: new Date().toLocaleString(),
      });
    } catch {
      setError(t("labels.error"));
    } finally {
      setBusy(false);
    }
  };

  const downloadPem = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "application/x-pem-file" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="rsa-key-generator"
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-zinc-400">{t("labels.keySize")}</label>
            <select
              value={keySize}
              onChange={(e) => setKeySize(Number(e.target.value) as KeySize)}
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1 text-sm text-zinc-100 outline-none focus:border-blue-500"
            >
              <option value={2048}>2048</option>
              <option value={3072}>3072</option>
              <option value={4096}>4096</option>
            </select>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-zinc-400">{t("labels.algorithm")}</span>
            <span className="font-mono text-zinc-300">RSA-OAEP (SHA-256)</span>
          </div>
          <button
            onClick={generate}
            disabled={busy}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? t("buttons.generating") : t("buttons.generate")}
          </button>
        </div>

        {keySize === 4096 && (
          <div className="rounded-lg border border-yellow-800 bg-yellow-950 p-3 text-sm text-yellow-400">
            {t("labels.warning4096")}
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-800 bg-red-950 p-3 text-sm text-red-400">{error}</div>
        )}

        {meta && (
          <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-4">
            <div className="grid gap-2 text-sm sm:grid-cols-3">
              <div>
                <span className="text-zinc-500">{t("labels.metaSize")}: </span>
                <span className="text-zinc-300">
                  {meta.size} {t("labels.bits")}
                </span>
              </div>
              <div>
                <span className="text-zinc-500">{t("labels.metaAlgorithm")}: </span>
                <span className="font-mono text-zinc-300">{meta.algorithm}</span>
              </div>
              <div>
                <span className="text-zinc-500">{t("labels.metaCreated")}: </span>
                <span className="text-zinc-300">{meta.created}</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">{t("labels.publicKey")}</label>
              {publicPem && (
                <div className="flex gap-2">
                  <CopyButton text={publicPem} className="text-xs px-2 py-1" />
                  <button
                    onClick={() => downloadPem(`public-${keySize}.pem`, publicPem)}
                    className="rounded-lg bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
                  >
                    {t("buttons.download")}
                  </button>
                </div>
              )}
            </div>
            <textarea
              readOnly
              value={publicPem}
              placeholder={t("labels.outputPlaceholder")}
              rows={14}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-xs text-zinc-300 placeholder-zinc-500 outline-none resize-y"
              spellCheck={false}
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">{t("labels.privateKey")}</label>
              {privatePem && (
                <div className="flex gap-2">
                  <CopyButton text={privatePem} className="text-xs px-2 py-1" />
                  <button
                    onClick={() => downloadPem(`private-${keySize}.pem`, privatePem)}
                    className="rounded-lg bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
                  >
                    {t("buttons.download")}
                  </button>
                </div>
              )}
            </div>
            <textarea
              readOnly
              value={privatePem}
              placeholder={t("labels.outputPlaceholder")}
              rows={14}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-xs text-zinc-300 placeholder-zinc-500 outline-none resize-y"
              spellCheck={false}
            />
          </div>
        </div>

        <div className="rounded-lg border border-yellow-800 bg-yellow-950 p-3 text-sm text-yellow-400">
          {t("labels.securityNote")}
        </div>
        <p className="text-xs text-zinc-500">{t("labels.privacy")}</p>
      </div>
    </ToolLayout>
  );
}
