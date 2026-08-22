"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

interface Strength {
  label: string;
  color: string; // tailwind text color
  bar: string; // tailwind bg color
  width: string; // bar width %
}

export default function PasswordStrengthPage() {
  const t = useTranslations("tools.password-strength");
  const [password, setPassword] = useState("");

  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    digit: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };

  const passed = Object.values(checks).filter(Boolean).length;
  const score = Math.min(5, passed + Math.min(2, Math.floor(password.length / 8)));

  const strength: Strength = (() => {
    if (password.length === 0)
      return { label: t("labels.empty"), color: "text-zinc-500", bar: "bg-zinc-600", width: "0%" };
    if (score <= 2)
      return { label: t("labels.weak"), color: "text-red-400", bar: "bg-red-500", width: "25%" };
    if (score <= 3)
      return { label: t("labels.fair"), color: "text-orange-400", bar: "bg-orange-500", width: "50%" };
    if (score <= 4)
      return { label: t("labels.good"), color: "text-yellow-400", bar: "bg-yellow-500", width: "75%" };
    return { label: t("labels.strong"), color: "text-green-400", bar: "bg-green-500", width: "100%" };
  })();

  const criteria: { key: keyof typeof checks; label: string }[] = [
    { key: "length", label: t("labels.criteria.length") },
    { key: "upper", label: t("labels.criteria.upper") },
    { key: "lower", label: t("labels.criteria.lower") },
    { key: "digit", label: t("labels.criteria.digit") },
    { key: "symbol", label: t("labels.criteria.symbol") },
  ];

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="password-strength"
    >
      <div className="max-w-xl space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.password")}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("labels.enterPassword")}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
          />
        </div>

        {/* Strength bar */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-zinc-400">{t("labels.strength")}</span>
            <span className={`font-medium ${strength.color}`}>{strength.label}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className={`h-full rounded-full transition-all duration-300 ${strength.bar}`}
              style={{ width: strength.width }}
            />
          </div>
        </div>

        {/* Criteria checklist */}
        <ul className="space-y-2">
          {criteria.map((c) => (
            <li key={c.key} className="flex items-center gap-2 text-sm">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                  checks[c.key]
                    ? "bg-green-500/20 text-green-400"
                    : "bg-zinc-800 text-zinc-600"
                }`}
              >
                {checks[c.key] ? "✓" : "•"}
              </span>
              <span className={checks[c.key] ? "text-zinc-300" : "text-zinc-600"}>
                {c.label}
              </span>
            </li>
          ))}
        </ul>

        <p className="text-xs text-zinc-500">{t("labels.privacy")}</p>
      </div>
    </ToolLayout>
  );
}
