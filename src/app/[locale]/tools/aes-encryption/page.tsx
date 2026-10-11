"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

const PBKDF2_ITERATIONS = 150000;
// Container: magic "TKL1" (4 bytes) || version (1 byte) || salt (16) || iv || ciphertext
const MAGIC = [0x54, 0x4b, 0x4c, 0x31]; // "TKL1"
const VERSION_GCM = 1;
const VERSION_CBC = 2;
const SALT_LENGTH = 16;
const IV_GCM = 12;
const IV_CBC = 16;

function bytesToBase64(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function base64ToBytes(b64: string): Uint8Array | null {
  try {
    const bin = atob(b64.trim());
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  } catch {
    return null;
  }
}

async function deriveKey(
  password: string,
  salt: Uint8Array<ArrayBuffer>,
  alg: "AES-GCM" | "AES-CBC",
  usages: KeyUsage[]
): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    { name: alg, length: 256 },
    false,
    usages
  );
}

// Random 16-byte salt, or a deterministic 16-byte salt derived from the
// optional user-supplied salt text.
async function makeSalt(saltText: string): Promise<Uint8Array<ArrayBuffer>> {
  if (!saltText.trim()) {
    return crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  }
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(saltText)));
  return digest.slice(0, SALT_LENGTH);
}

export default function AesEncryptionPage() {
  const t = useTranslations("tools.aes-encryption");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [alg, setAlg] = useState<"AES-GCM" | "AES-CBC">("AES-GCM");
  const [password, setPassword] = useState("");
  const [saltText, setSaltText] = useState("");
  const [inputText, setInputText] = useState("");
  const [output, setOutput] = useState("");
  const [saltInfo, setSaltInfo] = useState("");
  const [ivInfo, setIvInfo] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetResult = () => {
    setOutput("");
    setSaltInfo("");
    setIvInfo("");
    setError("");
    setCopied(false);
  };

  const switchMode = (next: "encrypt" | "decrypt") => {
    setMode(next);
    resetResult();
  };

  const handleEncrypt = async () => {
    resetResult();
    if (!password) {
      setError(t("errors.requiredPassword"));
      return;
    }
    if (!inputText) {
      setError(t("errors.requiredText"));
      return;
    }
    setBusy(true);
    try {
      const salt = await makeSalt(saltText);
      const ivLength = alg === "AES-GCM" ? IV_GCM : IV_CBC;
      const iv = crypto.getRandomValues(new Uint8Array(ivLength));
      const key = await deriveKey(password, salt, alg, ["encrypt"]);
      const ciphertext = new Uint8Array(
        await crypto.subtle.encrypt({ name: alg, iv }, key, new TextEncoder().encode(inputText))
      );
      const version = alg === "AES-GCM" ? VERSION_GCM : VERSION_CBC;
      const blob = new Uint8Array(MAGIC.length + 1 + salt.length + iv.length + ciphertext.length);
      blob.set(MAGIC, 0);
      blob[MAGIC.length] = version;
      blob.set(salt, MAGIC.length + 1);
      blob.set(iv, MAGIC.length + 1 + salt.length);
      blob.set(ciphertext, MAGIC.length + 1 + salt.length + iv.length);
      setOutput(bytesToBase64(blob));
      setSaltInfo(bytesToBase64(salt));
      setIvInfo(bytesToBase64(iv));
    } catch {
      setError(t("errors.invalidData"));
    } finally {
      setBusy(false);
    }
  };

  const handleDecrypt = async () => {
    resetResult();
    if (!password) {
      setError(t("errors.requiredPassword"));
      return;
    }
    if (!inputText) {
      setError(t("errors.requiredText"));
      return;
    }
    const bytes = base64ToBytes(inputText);
    const invalid = () => {
      resetResult();
      setError(t("errors.invalidData"));
    };
    if (!bytes || bytes.length < MAGIC.length + 1 + SALT_LENGTH + IV_GCM + 16) {
      invalid();
      return;
    }
    for (let i = 0; i < MAGIC.length; i++) {
      if (bytes[i] !== MAGIC[i]) {
        invalid();
        return;
      }
    }
    const version = bytes[MAGIC.length];
    if (version !== VERSION_GCM && version !== VERSION_CBC) {
      invalid();
      return;
    }
    const algName: "AES-GCM" | "AES-CBC" = version === VERSION_GCM ? "AES-GCM" : "AES-CBC";
    const ivLength = algName === "AES-GCM" ? IV_GCM : IV_CBC;
    const salt = bytes.slice(MAGIC.length + 1, MAGIC.length + 1 + SALT_LENGTH);
    const iv = bytes.slice(MAGIC.length + 1 + SALT_LENGTH, MAGIC.length + 1 + SALT_LENGTH + ivLength);
    const ciphertext = bytes.slice(MAGIC.length + 1 + SALT_LENGTH + ivLength);
    setBusy(true);
    try {
      const key = await deriveKey(password, salt, algName, ["decrypt"]);
      const plaintext = await crypto.subtle.decrypt({ name: algName, iv }, key, ciphertext);
      setOutput(new TextDecoder().decode(plaintext));
    } catch {
      resetResult();
      setError(t("errors.wrongPassword"));
    } finally {
      setBusy(false);
    }
  };

  const handleAction = mode === "encrypt" ? handleEncrypt : handleDecrypt;

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const inputLabel = mode === "encrypt" ? t("labels.plaintext") : t("labels.ciphertext");
  const inputPlaceholder =
    mode === "encrypt" ? t("labels.plaintextPlaceholder") : t("labels.ciphertextPlaceholder");
  const outputLabel = mode === "encrypt" ? t("labels.outputEncrypt") : t("labels.outputDecrypt");

  const tabCls = (active: boolean) =>
    `rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
      active
        ? "border-blue-500 bg-blue-600/20 text-blue-400"
        : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600"
    }`;

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="aes-encryption"
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="max-w-xl space-y-4">
        {/* Mode tabs */}
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => switchMode("encrypt")} className={tabCls(mode === "encrypt")}>
            {t("labels.encryptTab")}
          </button>
          <button onClick={() => switchMode("decrypt")} className={tabCls(mode === "decrypt")}>
            {t("labels.decryptTab")}
          </button>
        </div>

        {/* Algorithm (encrypt mode only — decrypt auto-detects from the data) */}
        {mode === "encrypt" && (
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.algorithm")}</label>
            <select
              value={alg}
              onChange={(e) => setAlg(e.target.value as "AES-GCM" | "AES-CBC")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500"
            >
              <option value="AES-GCM">AES-GCM 256</option>
              <option value="AES-CBC">AES-CBC 256</option>
            </select>
          </div>
        )}

        {/* Password */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.password")}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("labels.passwordPlaceholder")}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
          />
        </div>

        {/* Optional salt (encrypt mode only) */}
        {mode === "encrypt" && (
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.salt")}</label>
            <input
              type="text"
              value={saltText}
              onChange={(e) => setSaltText(e.target.value)}
              placeholder={t("labels.saltPlaceholder")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        )}

        {/* Input text */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">{inputLabel}</label>
          <textarea
            rows={6}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={inputPlaceholder}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            spellCheck={false}
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          onClick={handleAction}
          disabled={busy}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {mode === "encrypt" ? t("labels.encryptButton") : t("labels.decryptButton")}
        </button>

        {/* Output */}
        {output && (
          <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-900 p-5">
            <label className="block text-sm font-medium text-zinc-300">{outputLabel}</label>
            <textarea
              readOnly
              rows={mode === "encrypt" ? 5 : 4}
              value={output}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-xs text-zinc-100 outline-none focus:border-blue-500"
              spellCheck={false}
            />
            {mode === "encrypt" && saltInfo && ivInfo && (
              <div className="space-y-1 text-xs">
                <p className="text-zinc-500">
                  {t("labels.saltUsed")}: <span className="break-all font-mono text-zinc-400">{saltInfo}</span>
                </p>
                <p className="text-zinc-500">
                  {t("labels.ivUsed")}: <span className="break-all font-mono text-zinc-400">{ivInfo}</span>
                </p>
              </div>
            )}
            <button
              onClick={copyOutput}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              {copied ? t("labels.copied") : t("labels.copy")}
            </button>
          </div>
        )}

        <p className="text-xs text-zinc-500">{t("labels.privacy")}</p>
      </div>
    </ToolLayout>
  );
}
