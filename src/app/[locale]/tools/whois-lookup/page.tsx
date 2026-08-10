"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

interface RdapEvent {
  eventAction: string;
  eventDate: string;
}

interface RdapEntity {
  roles?: string[];
  vcardArray?: unknown[];
}

interface RdapResponse {
  ldhName?: string;
  status?: string[];
  events?: RdapEvent[];
  entities?: RdapEntity[];
  nameservers?: { ldhName?: string }[];
  secureDNS?: { delegationSigned?: boolean };
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

/** Pull a single value out of an RDAP vcardArray (e.g. "fn", "org", "email"). */
function pickVcard(entity: RdapEntity, wanted: string): string {
  const arr = entity.vcardArray as unknown[] | undefined;
  if (!Array.isArray(arr) || !Array.isArray(arr[1])) return "";
  for (const row of arr[1] as unknown[][]) {
    if (row[0] === wanted && typeof row[3] === "string") return row[3];
  }
  return "";
}

function entityByRole(data: RdapResponse, role: string): RdapEntity | undefined {
  return data.entities?.find((e) => e.roles?.includes(role));
}

function formatEventDate(data: RdapResponse, action: string): string {
  const hit = data.events?.find((e) => e.eventAction === action);
  if (!hit) return "";
  const dt = new Date(hit.eventDate);
  return Number.isNaN(dt.getTime()) ? hit.eventDate : dt.toLocaleString();
}

export default function WhoisLookupPage() {
  const t = useTranslations("tools.whois-lookup");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<RdapResponse | null>(null);
  const [copied, setCopied] = useState("");

  const copy = (key: string, value: string) => {
    try {
      navigator.clipboard?.writeText(value);
    } catch {
      /* ignore */
    }
    setCopied(key);
    setTimeout(() => setCopied(""), 1500);
  };

  const lookup = async () => {
    const d = normalizeDomain(domain);
    if (!d) {
      setError(t("labels.errorEmpty"));
      setData(null);
      return;
    }
    if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(d)) {
      setError(t("labels.errorInvalid"));
      setData(null);
      return;
    }
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await fetch(`https://rdap.org/domain/${encodeURIComponent(d)}`);
      if (!res.ok) {
        setError(
          res.status === 404
            ? t("labels.errorNotFound")
            : t("labels.errorGeneric")
        );
        return;
      }
      setData((await res.json()) as RdapResponse);
    } catch {
      setError(t("labels.errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  const registrar = data ? entityByRole(data, "registrar") : undefined;
  const registrant = data ? entityByRole(data, "registrant") : undefined;
  const nsList =
    data?.nameservers?.map((n) => n.ldhName).filter(Boolean) ?? [];

  const rows: { key: string; label: string; value: string }[] = data
    ? [
        { key: "domainName", label: t("labels.domainName"), value: data.ldhName ?? "" },
        { key: "status", label: t("labels.status"), value: (data.status ?? []).join(", ") || t("labels.unknown") },
        { key: "created", label: t("labels.created"), value: formatEventDate(data, "registration") || t("labels.unknown") },
        { key: "updated", label: t("labels.updated"), value: formatEventDate(data, "last changed") || t("labels.unknown") },
        { key: "expires", label: t("labels.expires"), value: formatEventDate(data, "expiration") || t("labels.unknown") },
        { key: "dnssec", label: t("labels.dnssec"), value: data.secureDNS?.delegationSigned ? "✓" : t("labels.unknown") },
        { key: "registrar", label: t("labels.registrar"), value: registrar ? pickVcard(registrar, "fn") || pickVcard(registrar, "org") || t("labels.unknown") : t("labels.unknown") },
        { key: "registrant", label: t("labels.registrant"), value: registrant ? pickVcard(registrant, "fn") || t("labels.unknown") : t("labels.unknown") },
        { key: "nameservers", label: t("labels.nameservers"), value: nsList.length ? nsList.join(", ") : t("labels.unknown") },
      ]
    : [];

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="whois-lookup"
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
              onKeyDown={(e) => e.key === "Enter" && lookup()}
              placeholder={t("labels.example")}
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
            <button
              onClick={lookup}
              disabled={loading}
              className="shrink-0 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-60"
            >
              {loading ? t("labels.loading") : t("labels.lookUp")}
            </button>
          </div>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        </div>

        {data && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            {rows.map((row) => (
              <div
                key={row.key}
                className="flex items-start justify-between gap-4 border-b border-zinc-800 py-2.5 last:border-0"
              >
                <span className="shrink-0 text-sm text-zinc-500">
                  {row.label}
                </span>
                <span className="flex items-center gap-2 text-right text-sm text-zinc-100">
                  <span className="break-all">{row.value}</span>
                  {row.value && row.value !== t("labels.unknown") && (
                    <button
                      onClick={() => copy(row.key, row.value)}
                      className="shrink-0 text-xs text-blue-600 hover:text-blue-700"
                    >
                      {copied === row.key ? t("labels.copied") : t("labels.copy")}
                    </button>
                  )}
                </span>
              </div>
            ))}
            <details className="mt-3">
              <summary className="cursor-pointer text-xs text-zinc-500 hover:text-zinc-300">
                {t("labels.rawJson")}
              </summary>
              <pre className="mt-2 max-h-72 overflow-auto rounded-lg bg-zinc-950 p-3 text-xs text-zinc-400">
                {JSON.stringify(data, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
