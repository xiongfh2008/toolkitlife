"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

interface RdapEvent {
  eventAction: string;
  eventDate: string;
}

interface RdapResponse {
  ldhName?: string;
  status?: string[];
  events?: RdapEvent[];
}

function normalizeDomain(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .split("?")[0]
    .split("#")[0];
}

interface AgeResult {
  domain: string;
  created: string;
  ageDays: number;
  expires: string;
  updated: string;
  status: string[];
}

function ageText(days: number, t: (k: string, v?: { n: number }) => string): string {
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  const d = days - years * 365 - months * 30;
  const parts: string[] = [];
  if (years > 0) parts.push(t("labels.years", { n: years }).replace("{n}", String(years)));
  if (months > 0) parts.push(t("labels.months", { n: months }).replace("{n}", String(months)));
  parts.push(t("labels.days", { n: d }).replace("{n}", String(d)));
  return parts.join(" ");
}

export default function DomainAgePage() {
  const t = useTranslations("tools.domain-age");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AgeResult | null>(null);

  const check = async () => {
    const d = normalizeDomain(domain);
    if (!d) {
      setError(t("messages.errorEmpty"));
      setResult(null);
      return;
    }
    if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(d)) {
      setError(t("messages.errorInvalid"));
      setResult(null);
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`https://rdap.org/domain/${encodeURIComponent(d)}`);
      if (!res.ok) {
        setError(res.status === 404 ? t("messages.errorNotFound") : t("messages.errorGeneric"));
        return;
      }
      const data = (await res.json()) as RdapResponse;
      const created = data.events?.find((e) => e.eventAction === "registration")?.eventDate ?? "";
      const expires = data.events?.find((e) => e.eventAction === "expiration")?.eventDate ?? "";
      const updated = data.events?.find((e) => e.eventAction === "last changed")?.eventDate ?? "";
      if (!created) {
        setError(t("messages.noRegistration"));
        return;
      }
      const ageDays = Math.max(
        0,
        Math.floor((Date.now() - new Date(created).getTime()) / 86400000)
      );
      setResult({
        domain: data.ldhName ?? d,
        created,
        ageDays,
        expires,
        updated,
        status: data.status ?? [],
      });
    } catch {
      setError(t("messages.errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="domain-age"
    >
      <div className="max-w-4xl space-y-4">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            {t("labels.domain")}
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && check()}
              placeholder="example.com"
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
            <button
              onClick={check}
              disabled={loading}
              className="shrink-0 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-60"
            >
              {loading ? t("buttons.checking") : t("buttons.check")}
            </button>
          </div>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        </div>

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <div className="border-b border-zinc-800 py-3 text-center">
              <div className="text-sm text-zinc-500">{result.domain}</div>
              <div className="mt-1 text-3xl font-bold text-emerald-400">
                {ageText(result.ageDays, t)}
              </div>
            </div>
            <div className="flex justify-between gap-4 py-2.5 text-sm">
              <span className="text-zinc-500">{t("labels.registrationDate")}</span>
              <span className="text-zinc-100">
                {new Date(result.created).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between gap-4 py-2.5 text-sm">
              <span className="text-zinc-500">{t("labels.expiryDate")}</span>
              <span className="text-zinc-100">
                {result.expires ? new Date(result.expires).toLocaleDateString() : "—"}
              </span>
            </div>
            <div className="flex justify-between gap-4 py-2.5 text-sm">
              <span className="text-zinc-500">{t("labels.updatedDate")}</span>
              <span className="text-zinc-100">
                {result.updated ? new Date(result.updated).toLocaleDateString() : "—"}
              </span>
            </div>
            {result.status.length > 0 && (
              <div className="flex justify-between gap-4 py-2.5 text-sm">
                <span className="text-zinc-500">{t("labels.status")}</span>
                <span className="text-right text-zinc-100">{result.status.join(", ")}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
