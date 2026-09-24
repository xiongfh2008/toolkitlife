"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  validateIBAN,
  extractIBAN,
  friendlyFormatIBAN,
  isSEPACountry,
  ValidationErrorsIBAN,
  type ValidationErrorsIBAN as ValidationErrors,
} from "ibantools";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

const ERROR_KEYS: Partial<Record<ValidationErrors, string>> = {
  [ValidationErrorsIBAN.NoIBANProvided]: "noIban",
  [ValidationErrorsIBAN.NoIBANCountry]: "noCountry",
  [ValidationErrorsIBAN.WrongBBANLength]: "wrongLength",
  [ValidationErrorsIBAN.WrongBBANFormat]: "wrongFormat",
  [ValidationErrorsIBAN.ChecksumNotNumber]: "checksumNotNumber",
  [ValidationErrorsIBAN.WrongIBANChecksum]: "wrongChecksum",
  [ValidationErrorsIBAN.WrongAccountBankBranchChecksum]: "wrongAccountChecksum",
  [ValidationErrorsIBAN.QRIBANNotAllowed]: "qrNotAllowed",
};

export default function IbanValidatorPage() {
  const t = useTranslations("tools.iban-validator");

  const [value, setValue] = useState("");

  const normalized = useMemo(
    () => value.toUpperCase().replace(/[\s-]/g, "").slice(0, 34),
    [value]
  );

  const result = useMemo(() => {
    if (normalized.length === 0) return null;
    const v = validateIBAN(normalized);
    const extracted = extractIBAN(normalized);
    const pretty = friendlyFormatIBAN(normalized);
    const sepa = extracted.countryCode ? isSEPACountry(extracted.countryCode) : false;
    return { v, extracted, pretty, sepa };
  }, [normalized]);

  const faqs: FAQ[] = [0, 1, 2, 3].map((i) => ({
    question: t(`faqs.${i}.question`),
    answer: t(`faqs.${i}.answer`),
  }));

  const relatedTools: RelatedTool[] = [
    { name: t("related.0.name"), href: "/tools/swift-bic-checker" },
    { name: t("related.1.name"), href: "/tools/bank-card-validate" },
    { name: t("related.2.name"), href: "/tools/aba-routing-number-validator" },
  ];

  return (
    <ToolLayout
      title={t("title")}
      slug="iban-validator"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={t.raw("keywords") as string[]}
    >
      <div className="max-w-4xl space-y-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <label htmlFor="iban-input" className="mb-2 block text-base font-medium text-zinc-100">
            {t("labels.inputTitle")}
          </label>
          <input
            id="iban-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            placeholder={t("labels.placeholder")}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-lg uppercase text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none"
          />
          <p className="mt-2 text-xs text-zinc-500">{t("labels.hint")}</p>

          {result === null ? (
            <p className="mt-5 text-sm text-zinc-500">{t("labels.empty")}</p>
          ) : (
            <div className="mt-5 space-y-3" aria-live="polite">
              <p
                className={`rounded-lg px-4 py-3 text-sm font-medium ${
                  result.v.valid ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                }`}
              >
                {result.v.valid
                  ? t("labels.valid")
                  : t("labels.invalid")}
              </p>
              {!result.v.valid && result.v.errorCodes.length > 0 && (
                <p className="text-sm text-red-400">
                  {t(
                    `labels.errors.${
                      ERROR_KEYS[result.v.errorCodes[0] as ValidationErrors] ?? "wrongChecksum"
                    }`
                  )}
                </p>
              )}
              {result.v.valid && (
                <dl className="grid gap-2 text-sm sm:grid-cols-2">
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 sm:col-span-2">
                    <dt className="text-xs text-zinc-500">{t("labels.formatted")}</dt>
                    <dd className="font-mono text-zinc-100">{result.pretty}</dd>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2">
                    <dt className="text-xs text-zinc-500">{t("labels.country")}</dt>
                    <dd className="font-mono text-zinc-100">{result.extracted.countryCode}</dd>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2">
                    <dt className="text-xs text-zinc-500">{t("labels.sepa")}</dt>
                    <dd className={result.sepa ? "text-green-400" : "text-zinc-100"}>
                      {result.sepa ? t("labels.sepaYes") : t("labels.sepaNo")}
                    </dd>
                  </div>
                  {result.extracted.bban && (
                    <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 sm:col-span-2">
                      <dt className="text-xs text-zinc-500">{t("labels.bban")}</dt>
                      <dd className="font-mono text-zinc-100">{result.extracted.bban}</dd>
                    </div>
                  )}
                </dl>
              )}
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
