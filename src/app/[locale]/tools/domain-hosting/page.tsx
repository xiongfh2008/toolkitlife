"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

interface HostingResult {
  domain: string;
  ip: string;
  isp: string;
  org: string;
  asn: string;
  country: string;
  city: string;
}

interface DnsAnswer {
  data?: string;
  type?: number;
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

export default function DomainHostingPage() {
  const t = useTranslations("tools.domain-hosting");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<HostingResult | null>(null);

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
      // 1) Resolve A records via DNS-over-HTTPS (CORS-enabled).
      const dnsRes = await fetch(
        `https://dns.google/resolve?name=${encodeURIComponent(d)}&type=A`
      );
      if (!dnsRes.ok) throw new Error("dns");
      const dnsJson = (await dnsRes.json()) as { Answer?: DnsAnswer[] };
      const aRecord = (dnsJson.Answer ?? []).find((a) => a.type === 1);
      const ip = aRecord?.data ?? "";
      if (!ip) {
        setError(t("messages.errorNoARecord"));
        return;
      }
      // 2) Look up hosting info for the resolved IP.
      const geoRes = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`);
      if (!geoRes.ok) throw new Error("geo");
      const geo = (await geoRes.json()) as {
        isp?: string;
        org?: string;
        country?: string;
        city?: string;
        connection?: { asn?: number };
      };
      setResult({
        domain: d,
        ip,
        isp: geo.isp ?? "",
        org: geo.org ?? "",
        asn: geo.connection?.asn ? `AS${geo.connection.asn}` : "",
        country: geo.country ?? "",
        city: geo.city ?? "",
      });
    } catch {
      setError(t("messages.errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  const rows = result
    ? [
        { key: "domain", label: t("labels.domain"), value: result.domain },
        { key: "ip", label: t("labels.ipAddress"), value: result.ip },
        { key: "host", label: t("labels.host"), value: result.isp || result.org },
        { key: "org", label: t("labels.organization"), value: result.org },
        { key: "asn", label: t("labels.asn"), value: result.asn },
        { key: "country", label: t("labels.country"), value: result.country },
        { key: "city", label: t("labels.city"), value: result.city },
      ].filter((r) => r.value)
    : [];

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="domain-hosting"
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

        {rows.length > 0 && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            {rows.map((row) => (
              <div
                key={row.key}
                className="flex items-start justify-between gap-4 border-b border-zinc-800 py-2.5 last:border-0"
              >
                <span className="shrink-0 text-sm text-zinc-500">{row.label}</span>
                <span className="break-all text-right text-sm text-zinc-100">{row.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
