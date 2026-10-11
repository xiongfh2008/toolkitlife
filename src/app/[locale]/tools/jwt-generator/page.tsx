"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

type Alg = "HS256" | "HS384" | "HS512";
type Expiry = "none" | "15m" | "1h" | "8h" | "1d" | "7d" | "30d";

const HASH: Record<Alg, "SHA-256" | "SHA-384" | "SHA-512"> = {
  HS256: "SHA-256",
  HS384: "SHA-384",
  HS512: "SHA-512",
};

const EXPIRY_SECONDS: Record<Exclude<Expiry, "none">, number> = {
  "15m": 900,
  "1h": 3600,
  "8h": 28800,
  "1d": 86400,
  "7d": 604800,
  "30d": 2592000,
};

function base64UrlFromBytes(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function encodePart(value: unknown): string {
  return base64UrlFromBytes(new TextEncoder().encode(JSON.stringify(value)));
}

export default function JwtGeneratorPage() {
  const t = useTranslations("tools.jwt-generator");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [headerJson, setHeaderJson] = useState('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
  const [payloadJson, setPayloadJson] = useState(
    '{\n  "iss": "toolkitlife",\n  "sub": "1234567890",\n  "iat": 1700000000,\n  "exp": 1700003600\n}'
  );
  const [alg, setAlg] = useState<Alg>("HS256");
  const [secret, setSecret] = useState("");
  const [expiry, setExpiry] = useState<Expiry>("none");
  const [token, setToken] = useState("");
  const [decodedHeader, setDecodedHeader] = useState("");
  const [decodedPayload, setDecodedPayload] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const changeAlg = (next: Alg) => {
    setAlg(next);
    try {
      const header = JSON.parse(headerJson) as Record<string, unknown>;
      header.alg = next;
      setHeaderJson(JSON.stringify(header, null, 2));
    } catch {
      /* header is invalid JSON — leave it untouched, the error shows on generate */
    }
  };

  const generateRandomSecret = () => {
    const buf = new Uint8Array(32);
    window.crypto.getRandomValues(buf);
    setSecret(base64UrlFromBytes(buf));
  };

  const generate = async () => {
    let header: unknown;
    let payload: Record<string, unknown>;
    try {
      header = JSON.parse(headerJson);
    } catch {
      setToken("");
      setDecodedHeader("");
      setDecodedPayload("");
      setError(t("errors.invalidHeader"));
      return;
    }
    try {
      payload = JSON.parse(payloadJson) as Record<string, unknown>;
    } catch {
      setToken("");
      setDecodedHeader("");
      setDecodedPayload("");
      setError(t("errors.invalidPayload"));
      return;
    }
    if (!secret) {
      setToken("");
      setDecodedHeader("");
      setDecodedPayload("");
      setError(t("errors.missingSecret"));
      return;
    }

    setError("");
    const now = Math.floor(Date.now() / 1000);
    payload = { ...payload, iat: now };
    if (expiry !== "none") {
      payload = { ...payload, exp: now + EXPIRY_SECONDS[expiry] };
    }

    const unsigned = `${encodePart(header)}.${encodePart(payload)}`;
    try {
      const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        { name: "HMAC", hash: HASH[alg] },
        false,
        ["sign"]
      );
      const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(unsigned));
      setToken(`${unsigned}.${base64UrlFromBytes(new Uint8Array(signature))}`);
      setDecodedHeader(JSON.stringify(header, null, 2));
      setDecodedPayload(JSON.stringify(payload, null, 2));
    } catch {
      setToken("");
      setDecodedHeader("");
      setDecodedPayload("");
      setError(t("errors.missingSecret"));
    }
  };

  const copyToken = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const selectCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500";
  const textareaCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-xs text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40";

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="jwt-generator"
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="max-w-xl space-y-4">
        {/* Header JSON */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.header")}</label>
          <textarea
            rows={4}
            value={headerJson}
            onChange={(e) => setHeaderJson(e.target.value)}
            className={textareaCls}
            spellCheck={false}
          />
        </div>

        {/* Payload JSON */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.payload")}</label>
          <textarea
            rows={6}
            value={payloadJson}
            onChange={(e) => setPayloadJson(e.target.value)}
            className={textareaCls}
            spellCheck={false}
          />
        </div>

        {/* Algorithm + expiry */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.algorithm")}</label>
            <select value={alg} onChange={(e) => changeAlg(e.target.value as Alg)} className={selectCls}>
              <option value="HS256">HS256</option>
              <option value="HS384">HS384</option>
              <option value="HS512">HS512</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.expiry")}</label>
            <select value={expiry} onChange={(e) => setExpiry(e.target.value as Expiry)} className={selectCls}>
              <option value="none">{t("labels.expiryNone")}</option>
              <option value="15m">{t("labels.expiry15m")}</option>
              <option value="1h">{t("labels.expiry1h")}</option>
              <option value="8h">{t("labels.expiry8h")}</option>
              <option value="1d">{t("labels.expiry1d")}</option>
              <option value="7d">{t("labels.expiry7d")}</option>
              <option value="30d">{t("labels.expiry30d")}</option>
            </select>
          </div>
        </div>

        {/* Secret */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.secret")}</label>
          <div className="flex gap-2">
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder={t("labels.secretPlaceholder")}
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
            <button
              type="button"
              onClick={generateRandomSecret}
              title={t("labels.randomSecret")}
              className="shrink-0 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-100"
            >
              {t("labels.randomSecret")}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          onClick={generate}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          {t("labels.generate")}
        </button>

        {/* Signed token */}
        {token && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
            <label className="mb-2 block text-sm font-medium text-zinc-300">{t("labels.token")}</label>
            <textarea
              readOnly
              rows={4}
              value={token}
              className={`${textareaCls} break-all`}
              spellCheck={false}
            />
            <button
              onClick={copyToken}
              className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              {copied ? t("labels.copied") : t("labels.copy")}
            </button>
          </div>
        )}

        {/* Decoded preview table */}
        {token && decodedHeader && decodedPayload && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
            <p className="mb-2 text-sm font-medium text-zinc-300">{t("labels.decoded")}</p>
            <table className="w-full table-fixed border-collapse text-left text-xs">
              <tbody>
                <tr className="border-t border-zinc-800">
                  <th className="w-24 py-2 pr-3 align-top font-medium text-zinc-400">
                    {t("labels.header")}
                  </th>
                  <td className="py-2">
                    <pre className="overflow-x-auto whitespace-pre-wrap break-all font-mono text-zinc-300">
                      {decodedHeader}
                    </pre>
                  </td>
                </tr>
                <tr className="border-t border-zinc-800">
                  <th className="w-24 py-2 pr-3 align-top font-medium text-zinc-400">
                    {t("labels.payload")}
                  </th>
                  <td className="py-2">
                    <pre className="overflow-x-auto whitespace-pre-wrap break-all font-mono text-zinc-300">
                      {decodedPayload}
                    </pre>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <p className="text-xs text-zinc-500">{t("labels.privacy")}</p>
      </div>
    </ToolLayout>
  );
}
