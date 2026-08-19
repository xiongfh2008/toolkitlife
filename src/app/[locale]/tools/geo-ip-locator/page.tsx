"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

interface GeoInfo {
  ip: string;
  continent?: string;
  country?: string;
  country_code?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  isp?: string;
  org?: string;
  timezone?: { id?: string };
  connection?: { asn?: number };
  type?: string;
  success?: boolean;
}

const IPV4_RE = /^(\d{1,3}\.){3}\d{1,3}$/;

export default function GeoIpLocatorPage() {
  const t = useTranslations("tools.geo-ip-locator");
  const [ip, setIp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<GeoInfo | null>(null);

  const lookup = async (target?: string) => {
    const value = target ?? ip.trim();
    if (value && !IPV4_RE.test(value)) {
      setError(t("messages.errorInvalid"));
      setData(null);
      return;
    }
    setLoading(true);
    setError("");
    setData(null);
    try {
      const url = value ? `https://ipwho.is/${encodeURIComponent(value)}` : "https://ipwho.is/";
      const res = await fetch(url);
      if (!res.ok) throw new Error(String(res.status));
      const json = (await res.json()) as GeoInfo;
      if (json.success === false) {
        setError(t("messages.errorNotFound"));
        return;
      }
      setData(json);
    } catch {
      setError(t("messages.errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  const rows = data
    ? [
        { key: "ip", label: t("labels.ip"), value: data.ip },
        { key: "continent", label: t("labels.continent"), value: data.continent ?? "" },
        { key: "country", label: t("labels.country"), value: data.country ?? "" },
        { key: "region", label: t("labels.region"), value: data.region ?? "" },
        { key: "city", label: t("labels.city"), value: data.city ?? "" },
        { key: "coords", label: t("labels.coordinates"), value: data.latitude !== undefined ? `${data.latitude}, ${data.longitude}` : "" },
        { key: "isp", label: t("labels.isp"), value: data.isp ?? "" },
        { key: "org", label: t("labels.organization"), value: data.org ?? "" },
        { key: "asn", label: t("labels.asn"), value: data.connection?.asn ? `AS${data.connection.asn}` : "" },
        { key: "timezone", label: t("labels.timezone"), value: data.timezone?.id ?? "" },
        { key: "type", label: t("labels.type"), value: data.type ?? "" },
      ].filter((r) => r.value)
    : [];

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="geo-ip-locator"
    >
      <div className="max-w-4xl space-y-4">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            {t("labels.ip")}
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lookup()}
              placeholder="8.8.8.8"
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
            <button
              onClick={() => lookup()}
              disabled={loading}
              className="shrink-0 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-60"
            >
              {loading ? t("buttons.loading") : t("buttons.lookUp")}
            </button>
          </div>
          <button
            onClick={() => lookup("")}
            className="mt-2 text-xs text-blue-600 hover:text-blue-700"
          >
            {t("labels.myIp")}
          </button>
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
