"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

// ABA routing transit number checksum (derived from Wikipedia, ABA routing
// transit number): weights 3,7,1 repeating over the 9 digits, sum mod 10 == 0.
function isValidAbaChecksum(digits: string): boolean {
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number(digits[i]) * [3, 7, 1][i % 3];
  }
  return sum % 10 === 0;
}

// First two digits identify the Federal Reserve district / institution type.
const FED_DISTRICTS: Record<number, string> = {
  1: "Boston",
  2: "New York",
  3: "Philadelphia",
  4: "Cleveland",
  5: "Richmond",
  6: "Atlanta",
  7: "Chicago",
  8: "St. Louis",
  9: "Minneapolis",
  10: "Kansas City",
  11: "Dallas",
  12: "San Francisco",
};

type PrefixInfo = { type: string; district: number | null };

function decodePrefix(d2: number): PrefixInfo | null {
  const valid =
    d2 === 0 || (d2 >= 1 && d2 <= 12) || (d2 >= 21 && d2 <= 32) || (d2 >= 61 && d2 <= 72) || d2 === 80;
  if (!valid) return null;
  if (d2 === 0) return { type: "gov", district: null };
  if (d2 === 80) return { type: "tcc", district: null };
  if (d2 >= 1 && d2 <= 12) return { type: "fed", district: d2 };
  if (d2 >= 21 && d2 <= 32) return { type: "thrift", district: d2 - 20 };
  return { type: "fedmember", district: d2 - 60 };
}

export default function AbaRoutingNumberValidatorPage() {
  const t = useTranslations("tools.aba-routing-number-validator");

  const [value, setValue] = useState("");
  const digits = useMemo(() => value.replace(/\D/g, "").slice(0, 9), [value]);

  const result = useMemo(() => {
    if (digits.length === 0) return null;
    const complete = digits.length === 9;
    const checksumOk = complete && isValidAbaChecksum(digits);
    const prefix = complete ? decodePrefix(Number(digits.slice(0, 2))) : null;
    return { complete, checksumOk, prefix, valid: checksumOk && prefix !== null };
  }, [digits]);

  const faqs: FAQ[] = [0, 1, 2, 3].map((i) => ({
    question: t(`faqs.${i}.question`),
    answer: t(`faqs.${i}.answer`),
  }));

  const relatedTools: RelatedTool[] = [
    { name: t("related.0.name"), href: "/tools/swift-bic-checker" },
    { name: t("related.1.name"), href: "/tools/iban-validator" },
    { name: t("related.2.name"), href: "/tools/bank-card-validate" },
  ];

  return (
    <ToolLayout
      title={t("title")}
      slug="aba-routing-number-validator"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={t.raw("keywords") as string[]}
    >
      <div className="max-w-4xl space-y-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <label htmlFor="aba-input" className="mb-2 block text-base font-medium text-zinc-100">
            {t("labels.inputTitle")}
          </label>
          <input
            id="aba-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            inputMode="numeric"
            autoComplete="off"
            placeholder={t("labels.placeholder")}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-lg tracking-[0.3em] text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none"
          />
          <p className="mt-2 text-xs text-zinc-500">{t("labels.hint")}</p>

          {result === null ? (
            <p className="mt-5 text-sm text-zinc-500">{t("labels.empty")}</p>
          ) : (
            <div className="mt-5 space-y-3" aria-live="polite">
              <p
                className={`rounded-lg px-4 py-3 text-sm font-medium ${
                  !result.complete
                    ? "bg-zinc-800 text-zinc-300"
                    : result.valid
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                }`}
              >
                {!result.complete
                  ? t("labels.incomplete", { n: digits.length })
                  : result.valid
                    ? t("labels.valid")
                    : t("labels.invalid")}
              </p>
              {result.complete && (
                <dl className="grid gap-2 text-sm sm:grid-cols-2">
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2">
                    <dt className="text-xs text-zinc-500">{t("labels.checksum")}</dt>
                    <dd className={result.checksumOk ? "text-green-400" : "text-red-400"}>
                      {result.checksumOk ? t("labels.pass") : t("labels.fail")}
                    </dd>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2">
                    <dt className="text-xs text-zinc-500">{t("labels.district")}</dt>
                    <dd className="text-zinc-100">
                      {result.prefix?.district
                        ? t("labels.districtValue", {
                            n: result.prefix.district,
                            name: FED_DISTRICTS[result.prefix.district],
                          })
                        : t("labels.districtNone")}
                    </dd>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 sm:col-span-2">
                    <dt className="text-xs text-zinc-500">{t("labels.type")}</dt>
                    <dd className="text-zinc-100">
                      {result.prefix ? t(`labels.type_${result.prefix.type}`) : "—"}
                    </dd>
                  </div>
                </dl>
              )}
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
