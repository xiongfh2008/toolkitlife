"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const FREQ_KEYS = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"] as const;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export default function XmlSitemapPage() {
  const t = useTranslations("tools.xml-sitemap");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [paths, setPaths] = useState(
    "/\n/about\n/contact\n/blog\n/privacy-policy\n/terms"
  );
  const [changefreq, setChangefreq] = useState("weekly");
  const [priority, setPriority] = useState("0.8");
  const [output, setOutput] = useState("");

  const normalizeUrl = (url: string) => {
    let u = url.trim().replace(/\/+$/, "");
    if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
    return u;
  };

  const generate = () => {
    const base = normalizeUrl(websiteUrl);
    if (!base || !/^https?:\/\/[^/\s]+/i.test(base)) {
      setOutput(`<!-- ${t("messages.invalidUrl")} -->`);
      return;
    }
    const lines = paths
      .split(/\r?\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    if (lines.length === 0) {
      setOutput(`<!-- ${t("messages.empty")} -->`);
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const entries = lines
      .map((p) => {
        const loc = base + (p.startsWith("/") ? p : `/${p}`);
        return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
      })
      .join("\n");
    setOutput(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`
    );
  };

  const download = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sitemap.xml";
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40";
  const btnCls =
    "rounded-lg px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors";

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="xml-sitemap"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.websiteUrl")}</label>
            <input
              type="text"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder={t("placeholders.websiteUrl")}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.paths")}</label>
            <textarea
              value={paths}
              onChange={(e) => setPaths(e.target.value)}
              rows={8}
              className={inputCls}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.changefreq")}</label>
              <select
                value={changefreq}
                onChange={(e) => setChangefreq(e.target.value)}
                className={inputCls}
              >
                {FREQ_KEYS.map((k) => (
                  <option key={k} value={k}>
                    {t(`options.${k}`)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.priority")}</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={generate} className={btnCls}>
              {t("buttons.generate")}
            </button>
            <button
              onClick={() => {
                setOutput("");
                setWebsiteUrl("");
                setPaths("");
              }}
              className="rounded-lg px-4 py-2 text-sm font-medium bg-zinc-700 hover:bg-zinc-600 text-white transition-colors"
            >
              {t("buttons.clear")}
            </button>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-200">{t("labels.results")}</h2>
            {output && (
              <div className="flex gap-2">
                <CopyButton text={output} label={t("buttons.copy")} />
                <button onClick={download} className={btnCls}>
                  {t("buttons.download")}
                </button>
              </div>
            )}
          </div>
          <pre className="max-h-[480px] overflow-auto rounded-lg border border-zinc-700 bg-zinc-900 p-4 text-xs leading-relaxed text-emerald-300">
            {output || t("messages.placeholder")}
          </pre>
        </div>
      </div>
    </ToolLayout>
  );
}
