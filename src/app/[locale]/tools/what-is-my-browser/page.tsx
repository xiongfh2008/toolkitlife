"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface BrowserInfo {
  browser: string;
  version: string;
  engine: string;
  os: string;
  screen: string;
  colorDepth: string;
  language: string;
  languages: string;
  timezone: string;
  platform: string;
  cookies: string;
  online: string;
  userAgent: string;
}

function detect(): BrowserInfo {
  const ua = navigator.userAgent;
  const browser = (() => {
    if (/edg\//i.test(ua)) return "Microsoft Edge";
    if (/opr\/|opera/i.test(ua)) return "Opera";
    if (/chrome\/|crios\//i.test(ua)) return "Google Chrome";
    if (/firefox\/|fxios\//i.test(ua)) return "Mozilla Firefox";
    if (/safari\//i.test(ua)) return "Apple Safari";
    return "Unknown";
  })();
  const version = (() => {
    const m =
      ua.match(/edg\/([\d.]+)/) ||
      ua.match(/opr\/([\d.]+)/) ||
      ua.match(/chrome\/([\d.]+)/) ||
      ua.match(/firefox\/([\d.]+)/) ||
      ua.match(/version\/([\d.]+)/);
    return m?.[1] ?? "";
  })();
  const engine = (() => {
    if (/edg\/|chrome\/|chromium/i.test(ua)) return "Blink";
    if (/firefox\//i.test(ua)) return "Gecko";
    if (/safari\//i.test(ua)) return "WebKit";
    return "";
  })();
  const os = (() => {
    if (/windows nt 10/i.test(ua)) return "Windows 10/11";
    if (/windows nt 6\.3/i.test(ua)) return "Windows 8.1";
    if (/windows nt 6\.2/i.test(ua)) return "Windows 8";
    if (/windows nt 6\.1/i.test(ua)) return "Windows 7";
    if (/android/i.test(ua)) return "Android";
    if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
    if (/mac os x/i.test(ua)) return "macOS";
    if (/linux/i.test(ua)) return "Linux";
    return navigator.platform || "";
  })();
  return {
    browser,
    version,
    engine,
    os,
    screen: `${window.screen.width} × ${window.screen.height}`,
    colorDepth: `${window.screen.colorDepth}-bit`,
    language: navigator.language,
    languages: navigator.languages.join(", "),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    platform: navigator.platform || "",
    cookies: navigator.cookieEnabled ? "yes" : "no",
    online: navigator.onLine ? "yes" : "no",
    userAgent: ua,
  };
}

export default function WhatIsMyBrowserPage() {
  const t = useTranslations("tools.what-is-my-browser");
  const [info, setInfo] = useState<BrowserInfo | null>(null);
  const [ip, setIp] = useState("");

  const load = useCallback(async () => {
    setInfo(detect());
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      if (res.ok) {
        const json = (await res.json()) as { ip?: string };
        setIp(json.ip ?? "");
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const rows = info
    ? [
        { key: "browser", label: t("labels.browser"), value: info.browser },
        { key: "version", label: t("labels.version"), value: info.version },
        { key: "engine", label: t("labels.engine"), value: info.engine },
        { key: "os", label: t("labels.os"), value: info.os },
        { key: "screen", label: t("labels.screen"), value: info.screen },
        { key: "colorDepth", label: t("labels.colorDepth"), value: info.colorDepth },
        { key: "language", label: t("labels.language"), value: info.language },
        { key: "languages", label: t("labels.languages"), value: info.languages },
        { key: "timezone", label: t("labels.timezone"), value: info.timezone },
        { key: "ip", label: t("labels.ipAddress"), value: ip || t("messages.ipFailed") },
        { key: "cookies", label: t("labels.cookies"), value: info.cookies === "yes" ? t("messages.yes") : t("messages.no") },
        { key: "online", label: t("labels.online"), value: info.online === "yes" ? t("messages.yes") : t("messages.no") },
      ]
    : [];

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="what-is-my-browser"
    >
      <div className="max-w-4xl space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={load}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
          >
            {t("buttons.refresh")}
          </button>
        </div>
        {rows.length > 0 && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            {rows.map((row) => (
              <div
                key={row.key}
                className="flex items-start justify-between gap-4 border-b border-zinc-800 py-2.5 last:border-0"
              >
                <span className="shrink-0 text-sm text-zinc-500">{row.label}</span>
                <span className="break-all text-right text-sm text-zinc-100">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        )}
        {info && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-zinc-500">{t("labels.userAgent")}</span>
              <CopyButton text={info.userAgent} label={t("buttons.copy")} />
            </div>
            <p className="break-all font-mono text-xs text-zinc-400">{info.userAgent}</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
