"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

interface RdapCidr {
  v4prefix?: string;
  v6prefix?: string;
  length?: number;
}

interface RdapNetwork {
  handle?: string;
  name?: string;
  type?: string;
  country?: string;
  startAddress?: string;
  endAddress?: string;
  cidr0_cidrs?: RdapCidr[];
  status?: string[];
  parentHandle?: string;
  entities?: { roles?: string[]; handle?: string }[];
}

const IPV4_RE = /^(\d{1,3}\.){3}\d{1,3}$/;

async function fetchNetwork(ip: string): Promise<RdapNetwork> {
  const res = await fetch(`https://rdap.org/ip/${encodeURIComponent(ip)}`);
  if (!res.ok) throw new Error(String(res.status));
  const json: unknown = await res.json();
  // Some registries wrap the network inside a "networks" array.
  const nets = (json as { networks?: RdapNetwork[] }).networks;
  if (Array.isArray(nets) && nets.length > 0) return nets[0];
  return json as RdapNetwork;
}

async function fetchMyIp(): Promise<string> {
  const res = await fetch("https://api.ipify.org?format=json");
  if (!res.ok) throw new Error(String(res.status));
  const json = (await res.json()) as { ip?: string };
  if (!json.ip) throw new Error("missing ip");
  return json.ip;
}

function formatCidr(net: RdapNetwork): string {
  const c = net.cidr0_cidrs?.[0];
  if (c) {
    const prefix = c.v4prefix ?? c.v6prefix;
    if (prefix && c.length !== undefined) return `${prefix}/${c.length}`;
  }
  return "";
}

export default function IpLookupPage() {
  const t = useTranslations("tools.ip-lookup");
  const [myIp, setMyIp] = useState("");
  const [myNet, setMyNet] = useState<RdapNetwork | null>(null);
  const [loadingMine, setLoadingMine] = useState(true);
  const [errorMine, setErrorMine] = useState("");
  const [query, setQuery] = useState("");
  const [queryNet, setQueryNet] = useState<RdapNetwork | null>(null);
  const [loadingQuery, setLoadingQuery] = useState(false);
  const [errorQuery, setErrorQuery] = useState("");
  const [copied, setCopied] = useState("");

  const detectMine = useCallback(async () => {
    setLoadingMine(true);
    setErrorMine("");
    try {
      const ip = await fetchMyIp();
      setMyIp(ip);
      try {
        setMyNet(await fetchNetwork(ip));
      } catch {
        setMyNet(null);
      }
    } catch {
      setErrorMine(t("labels.errorGeneric"));
    } finally {
      setLoadingMine(false);
    }
  }, [t]);

  useEffect(() => {
    detectMine();
  }, [detectMine]);

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
    const ip = query.trim();
    if (!ip) {
      setErrorQuery(t("labels.errorEmpty"));
      setQueryNet(null);
      return;
    }
    if (!IPV4_RE.test(ip) || ip.split(".").some((p) => Number(p) > 255)) {
      setErrorQuery(t("labels.errorInvalid"));
      setQueryNet(null);
      return;
    }
    setLoadingQuery(true);
    setErrorQuery("");
    setQueryNet(null);
    try {
      setQueryNet(await fetchNetwork(ip));
    } catch (e) {
      const status = e instanceof Error ? Number(e.message) : 0;
      setErrorQuery(
        status === 404 ? t("labels.errorNotFound") : t("labels.errorGeneric")
      );
    } finally {
      setLoadingQuery(false);
    }
  };

  const owner = (net: RdapNetwork): string => {
    const hit = net.entities?.find(
      (e) => e.roles?.includes("abuse") || e.roles?.includes("registrant")
    );
    return hit?.handle ?? "";
  };

  const renderInfo = (net: RdapNetwork, ip: string) => {
    const rows = [
      { key: "ipAddress", label: t("labels.ipAddress"), value: ip },
      { key: "cidrBlock", label: t("labels.cidrBlock"), value: formatCidr(net) },
      { key: "addressRange", label: t("labels.addressRange"), value: net.startAddress && net.endAddress ? `${net.startAddress} - ${net.endAddress}` : "" },
      { key: "networkName", label: t("labels.networkName"), value: net.name ?? "" },
      { key: "country", label: t("labels.country"), value: net.country ?? "" },
      { key: "networkType", label: t("labels.networkType"), value: net.type ?? "" },
      { key: "status", label: t("labels.status"), value: (net.status ?? []).join(", ") },
      { key: "owner", label: t("labels.owner"), value: owner(net) },
    ].filter((r) => r.value);
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
        {rows.map((row) => (
          <div
            key={row.key}
            className="flex items-start justify-between gap-4 border-b border-zinc-800 py-2.5 last:border-0"
          >
            <span className="shrink-0 text-sm text-zinc-500">{row.label}</span>
            <span className="flex items-center gap-2 text-right text-sm text-zinc-100">
              <span className="break-all">{row.value}</span>
              <button
                onClick={() => copy(row.key, row.value)}
                className="shrink-0 text-xs text-blue-600 hover:text-blue-700"
              >
                {copied === row.key ? t("labels.copied") : t("labels.copy")}
              </button>
            </span>
          </div>
        ))}
        {rows.length === 0 && (
          <p className="text-sm text-zinc-500">{t("labels.noData")}</p>
        )}
      </div>
    );
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="ip-lookup"
    >
      <div className="max-w-4xl space-y-4">
        {/* My IP */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium text-zinc-300">
              {t("labels.myIp")}
            </h2>
            <button
              onClick={detectMine}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              {t("labels.refresh")}
            </button>
          </div>
          {loadingMine ? (
            <p className="text-sm text-zinc-500">{t("labels.loading")}</p>
          ) : errorMine ? (
            <p className="text-sm text-red-500">{errorMine}</p>
          ) : (
            <div className="space-y-3">
              <p className="font-mono text-2xl text-zinc-100">{myIp}</p>
              {myNet && renderInfo(myNet, myIp)}
              {!myNet && (
                <p className="text-sm text-zinc-500">{t("labels.noData")}</p>
              )}
            </div>
          )}
        </div>

        {/* Look up any IP */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            {t("labels.ipInput")}
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lookup()}
              placeholder="8.8.8.8"
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
            <button
              onClick={lookup}
              disabled={loadingQuery}
              className="shrink-0 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-60"
            >
              {loadingQuery ? t("labels.loading") : t("labels.lookUp")}
            </button>
          </div>
          {errorQuery && <p className="mt-3 text-sm text-red-500">{errorQuery}</p>}
        </div>

        {queryNet && renderInfo(queryNet, query.trim())}
      </div>
    </ToolLayout>
  );
}
