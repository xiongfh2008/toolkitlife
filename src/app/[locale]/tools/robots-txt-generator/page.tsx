"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface Rule {
  id: number;
  userAgent: string;
  allow: string;
  disallow: string;
}

export default function RobotsTxtGeneratorPage() {
  const t = useTranslations("tools.robots-txt-generator");
  const [rules, setRules] = useState<Rule[]>([
    { id: 1, userAgent: "*", allow: "", disallow: "/admin\n/private" },
  ]);
  const [sitemap, setSitemap] = useState("");
  const [nextId, setNextId] = useState(2);

  const output = useMemo(() => {
    const lines: string[] = [];
    rules.forEach((rule) => {
      lines.push(`User-agent: ${rule.userAgent || "*"}`);
      rule.allow
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .forEach((path) => lines.push(`Allow: ${path}`));
      rule.disallow
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .forEach((path) => lines.push(`Disallow: ${path}`));
      lines.push("");
    });
    if (sitemap.trim()) {
      lines.push(`Sitemap: ${sitemap.trim()}`);
    }
    return lines.join("\n").trim();
  }, [rules, sitemap]);

  const updateRule = (id: number, field: keyof Rule, value: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const addRule = () => {
    setRules((prev) => [
      ...prev,
      { id: nextId, userAgent: "*", allow: "", disallow: "" },
    ]);
    setNextId((id) => id + 1);
  };

  const removeRule = (id: number) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="robots-txt-generator"
    >
      <div className="max-w-3xl space-y-4">
        {rules.map((rule, index) => (
          <div
            key={rule.id}
            className="rounded-lg border border-zinc-700 bg-zinc-800 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">
                {t("labels.rule")} #{index + 1}
              </h3>
              {rules.length > 1 && (
                <button
                  onClick={() => removeRule(rule.id)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  {t("buttons.remove")}
                </button>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.userAgent")}
              </label>
              <input
                type="text"
                value={rule.userAgent}
                onChange={(e) => updateRule(rule.id, "userAgent", e.target.value)}
                placeholder="*"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">
                  {t("labels.allow")}
                </label>
                <textarea
                  value={rule.allow}
                  onChange={(e) => updateRule(rule.id, "allow", e.target.value)}
                  placeholder="/public"
                  rows={3}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">
                  {t("labels.disallow")}
                </label>
                <textarea
                  value={rule.disallow}
                  onChange={(e) => updateRule(rule.id, "disallow", e.target.value)}
                  placeholder="/admin"
                  rows={3}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addRule}
          className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
        >
          {t("buttons.addRule")}
        </button>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            {t("labels.sitemap")}
          </label>
          <input
            type="text"
            value={sitemap}
            onChange={(e) => setSitemap(e.target.value)}
            placeholder="https://example.com/sitemap.xml"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
          />
        </div>

        {output && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">
                {t("labels.output")}
              </h3>
              <CopyButton text={output} className="text-xs px-2 py-1" />
            </div>
            <textarea
              readOnly
              value={output}
              rows={12}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-mono text-zinc-300 outline-none"
            />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
