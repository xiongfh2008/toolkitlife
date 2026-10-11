"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type Direction = "pem2jwk" | "jwk2pem";

interface KeyInfo {
  kty: string;
  alg: string;
  size: string;
  isPublic: boolean;
}

// Minimal DER helpers used to re-wrap PKCS#1 / SEC1 keys into the
// SPKI / PKCS#8 containers that WebCrypto importKey understands.
function derLength(len: number): Uint8Array {
  if (len < 0x80) return new Uint8Array([len]);
  if (len < 0x100) return new Uint8Array([0x81, len]);
  return new Uint8Array([0x82, (len >> 8) & 0xff, len & 0xff]);
}

function cat(...parts: Uint8Array[]): Uint8Array<ArrayBuffer> {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

function containsPattern(bytes: Uint8Array, pattern: number[]): boolean {
  outer: for (let i = 0; i <= bytes.length - pattern.length; i++) {
    for (let j = 0; j < pattern.length; j++) {
      if (bytes[i + j] !== pattern[j]) continue outer;
    }
    return true;
  }
  return false;
}

function bytesToBase64(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function base64ToBytes(base64: string): Uint8Array<ArrayBuffer> {
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function base64UrlToBytes(input: string): Uint8Array {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  return base64ToBytes(padded + "=".repeat((4 - (padded.length % 4)) % 4));
}

function toPem(label: string, bytes: Uint8Array): string {
  const base64 = bytesToBase64(bytes);
  const lines = base64.match(/.{1,64}/g) ?? [];
  return `-----BEGIN ${label}-----\n${lines.join("\n")}\n-----END ${label}-----`;
}

// rsaEncryption AlgorithmIdentifier (SEQUENCE { OID, NULL })
const RSA_ALG_ID = new Uint8Array([
  0x30, 0x0d, 0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x01, 0x05, 0x00,
]);

const RSA_OID = [0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01];
const EC_OID = [0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01];

const CURVES: { pattern: number[]; oid: Uint8Array; curve: "P-256" | "P-384" | "P-521" }[] = [
  {
    pattern: [0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07],
    oid: new Uint8Array([0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07]),
    curve: "P-256",
  },
  {
    pattern: [0x2b, 0x81, 0x04, 0x00, 0x22],
    oid: new Uint8Array([0x06, 0x05, 0x2b, 0x81, 0x04, 0x00, 0x22]),
    curve: "P-384",
  },
  {
    pattern: [0x2b, 0x81, 0x04, 0x00, 0x23],
    oid: new Uint8Array([0x06, 0x05, 0x2b, 0x81, 0x04, 0x00, 0x23]),
    curve: "P-521",
  },
];

function pkcs1ToSpki(pkcs1: Uint8Array): Uint8Array<ArrayBuffer> {
  const bitString = cat(
    new Uint8Array([0x03]),
    derLength(pkcs1.length + 1),
    new Uint8Array([0x00]),
    pkcs1
  );
  const content = cat(RSA_ALG_ID, bitString);
  return cat(new Uint8Array([0x30]), derLength(content.length), content);
}

function sec1ToPkcs8(sec1: Uint8Array): Uint8Array<ArrayBuffer> {
  const matched = CURVES.find((c) => containsPattern(sec1, c.pattern));
  if (!matched) throw new Error("unsupported curve");
  const ecPubKeyOid = new Uint8Array([0x06, 0x07, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01]);
  const algIdContent = cat(ecPubKeyOid, matched.oid);
  const algId = cat(new Uint8Array([0x30]), derLength(algIdContent.length), algIdContent);
  const content = cat(
    new Uint8Array([0x02, 0x01, 0x00]),
    algId,
    new Uint8Array([0x04]),
    derLength(sec1.length),
    sec1
  );
  return cat(new Uint8Array([0x30]), derLength(content.length), content);
}

function parsePem(text: string): { format: "spki" | "pkcs8"; bytes: Uint8Array<ArrayBuffer> } {
  const match = text.match(/-----BEGIN ([A-Z ]+)-----/);
  if (!match) throw new Error("invalid pem");
  const label = match[1].trim();
  const base64 = text.replace(/-----(BEGIN|END) [A-Z ]+-----/g, "").replace(/\s+/g, "");
  const bytes = base64ToBytes(base64);
  if (label === "PUBLIC KEY") return { format: "spki", bytes };
  if (label === "RSA PUBLIC KEY") return { format: "spki", bytes: pkcs1ToSpki(bytes) };
  if (label === "PRIVATE KEY") return { format: "pkcs8", bytes };
  if (label === "EC PRIVATE KEY") return { format: "pkcs8", bytes: sec1ToPkcs8(bytes) };
  throw new Error("unsupported pem type");
}

function jwkToKeyInfo(jwk: JsonWebKey, isPublic: boolean): KeyInfo {
  if (jwk.kty === "RSA") {
    let size = "";
    if (typeof jwk.n === "string") {
      try {
        size = String(base64UrlToBytes(jwk.n).length * 8);
      } catch {
        size = "";
      }
    }
    return { kty: "RSA", alg: "RSA", size, isPublic };
  }
  if (jwk.kty === "EC") {
    const crv = typeof jwk.crv === "string" ? jwk.crv : "";
    return { kty: "EC", alg: `EC ${crv}`.trim(), size: crv.replace(/^P-/, ""), isPublic };
  }
  return { kty: jwk.kty ?? "", alg: jwk.kty ?? "", size: "", isPublic };
}

export default function PemJwkConverterPage() {
  const t = useTranslations("tools.pem-jwk-converter");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [direction, setDirection] = useState<Direction>("pem2jwk");
  const [pemInput, setPemInput] = useState("");
  const [jwkInput, setJwkInput] = useState("");
  const [jwkOutput, setJwkOutput] = useState("");
  const [pemOutput, setPemOutput] = useState("");
  const [info, setInfo] = useState<KeyInfo | null>(null);
  const [error, setError] = useState("");

  const switchDirection = (next: Direction) => {
    setDirection(next);
    setError("");
  };

  const convertPemToJwk = async () => {
    setError("");
    setJwkOutput("");
    setInfo(null);
    if (!pemInput.trim()) {
      setError(t("labels.emptyPem"));
      return;
    }
    let parsed: { format: "spki" | "pkcs8"; bytes: Uint8Array<ArrayBuffer> };
    try {
      parsed = parsePem(pemInput);
    } catch {
      setError(t("labels.invalidPem"));
      return;
    }
    const isPublic = parsed.format === "spki";
    try {
      if (containsPattern(parsed.bytes, RSA_OID)) {
        const cryptoKey = await crypto.subtle.importKey(
          parsed.format,
          parsed.bytes,
          { name: "RSA-OAEP", hash: "SHA-256" },
          true,
          isPublic ? ["encrypt"] : ["decrypt"]
        );
        const exported = await crypto.subtle.exportKey("jwk", cryptoKey);
        setJwkOutput(JSON.stringify(exported, null, 2));
        setInfo(jwkToKeyInfo(exported, isPublic));
      } else if (containsPattern(parsed.bytes, EC_OID)) {
        const matched = CURVES.find((c) => containsPattern(parsed.bytes, c.pattern));
        if (!matched) {
          setError(t("labels.errorPem"));
          return;
        }
        const cryptoKey = await crypto.subtle.importKey(
          parsed.format,
          parsed.bytes,
          { name: "ECDSA", namedCurve: matched.curve },
          true,
          isPublic ? ["verify"] : ["sign"]
        );
        const exported = await crypto.subtle.exportKey("jwk", cryptoKey);
        setJwkOutput(JSON.stringify(exported, null, 2));
        setInfo(jwkToKeyInfo(exported, isPublic));
      } else {
        setError(t("labels.errorPem"));
      }
    } catch {
      setError(t("labels.errorPem"));
    }
  };

  const convertJwkToPem = async () => {
    setError("");
    setPemOutput("");
    setInfo(null);
    if (!jwkInput.trim()) {
      setError(t("labels.emptyJwk"));
      return;
    }
    let jwk: JsonWebKey;
    try {
      jwk = JSON.parse(jwkInput) as JsonWebKey;
    } catch {
      setError(t("labels.invalidJson"));
      return;
    }
    if (jwk.kty !== "RSA" && jwk.kty !== "EC") {
      setError(t("labels.unsupportedKty"));
      return;
    }
    const isPrivate = typeof jwk.d === "string";
    // Strip metadata members that could conflict with the import algorithm;
    // only the key material is needed for re-export.
    const importJwk: JsonWebKey = { ...jwk };
    delete importJwk.alg;
    delete importJwk.key_ops;
    delete importJwk.ext;
    delete importJwk.use;
    try {
      let cryptoKey: CryptoKey;
      if (jwk.kty === "RSA") {
        cryptoKey = await crypto.subtle.importKey(
          "jwk",
          importJwk,
          { name: "RSA-OAEP", hash: "SHA-256" },
          true,
          isPrivate ? ["decrypt"] : ["encrypt"]
        );
      } else {
        if (jwk.crv !== "P-256" && jwk.crv !== "P-384" && jwk.crv !== "P-521") {
          setError(t("labels.unsupportedCurve"));
          return;
        }
        cryptoKey = await crypto.subtle.importKey(
          "jwk",
          importJwk,
          { name: "ECDSA", namedCurve: jwk.crv },
          true,
          isPrivate ? ["sign"] : ["verify"]
        );
      }
      const format = isPrivate ? "pkcs8" : "spki";
      const exported = await crypto.subtle.exportKey(format, cryptoKey);
      setPemOutput(toPem(isPrivate ? "PRIVATE KEY" : "PUBLIC KEY", new Uint8Array(exported)));
      setInfo(jwkToKeyInfo(jwk, !isPrivate));
    } catch {
      setError(t("labels.errorJwk"));
    }
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="pem-jwk-converter"
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => switchDirection("pem2jwk")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              direction === "pem2jwk"
                ? "bg-blue-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            {t("labels.tabPemToJwk")}
          </button>
          <button
            onClick={() => switchDirection("jwk2pem")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              direction === "jwk2pem"
                ? "bg-blue-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            {t("labels.tabJwkToPem")}
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-800 bg-red-950 p-3 text-sm text-red-400">{error}</div>
        )}

        {direction === "pem2jwk" ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.pemInput")}</label>
              <textarea
                value={pemInput}
                onChange={(e) => setPemInput(e.target.value)}
                placeholder={t("labels.pemInputPlaceholder")}
                rows={14}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 resize-y"
                spellCheck={false}
              />
              <button
                onClick={convertPemToJwk}
                className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
              >
                {t("buttons.convert")}
              </button>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-300">{t("labels.jwkOutput")}</label>
                {jwkOutput && <CopyButton text={jwkOutput} className="text-xs px-2 py-1" />}
              </div>
              <textarea
                readOnly
                value={jwkOutput}
                placeholder={t("labels.outputPlaceholder")}
                rows={14}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-xs text-zinc-300 placeholder-zinc-500 outline-none resize-y"
                spellCheck={false}
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.jwkInput")}</label>
              <textarea
                value={jwkInput}
                onChange={(e) => setJwkInput(e.target.value)}
                placeholder={t("labels.jwkInputPlaceholder")}
                rows={14}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 resize-y"
                spellCheck={false}
              />
              <button
                onClick={convertJwkToPem}
                className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
              >
                {t("buttons.convert")}
              </button>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-300">{t("labels.pemOutput")}</label>
                {pemOutput && <CopyButton text={pemOutput} className="text-xs px-2 py-1" />}
              </div>
              <textarea
                readOnly
                value={pemOutput}
                placeholder={t("labels.outputPlaceholder")}
                rows={14}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-xs text-zinc-300 placeholder-zinc-500 outline-none resize-y"
                spellCheck={false}
              />
            </div>
          </div>
        )}

        {info && (
          <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-4">
            <div className="mb-2 text-sm font-medium text-zinc-300">{t("labels.keyInfo")}</div>
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <span className="text-zinc-500">{t("labels.infoKty")}: </span>
                <span className="font-mono text-zinc-300">{info.kty}</span>
              </div>
              <div>
                <span className="text-zinc-500">{t("labels.infoAlg")}: </span>
                <span className="font-mono text-zinc-300">{info.alg}</span>
              </div>
              <div>
                <span className="text-zinc-500">{t("labels.infoSize")}: </span>
                <span className="font-mono text-zinc-300">
                  {info.size} {t("labels.bits")}
                </span>
              </div>
              <div>
                <span className="text-zinc-500">{t("labels.infoUsage")}: </span>
                <span className="text-zinc-300">
                  {info.isPublic ? t("labels.public") : t("labels.private")}
                </span>
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-zinc-500">{t("labels.privacy")}</p>
      </div>
    </ToolLayout>
  );
}
