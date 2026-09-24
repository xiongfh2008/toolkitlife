"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { validateBIC, extractBIC } from "ibantools";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

// ISO 3166-1 alpha-2 (uppercase, joined) + XK (Kosovo, used in practice by BICs).
const ISO_COUNTRIES = new Set(
  (
    "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW XK"
  ).split(" ")
);

// Records: [code, bank, city, countryCode, branch?]
type SwiftRecord = [string, string, string, string, string?];

type LookupResult =
  | { kind: "exact" | "primary"; record: SwiftRecord }
  | { kind: "none" };

export default function SwiftBicCheckerPage() {
  const t = useTranslations("tools.swift-bic-checker");

  const [value, setValue] = useState("");
  const [loadingData, setLoadingData] = useState(false);
  const dataRef = useRef<{
    exact: Map<string, SwiftRecord>;
    primary: Map<string, SwiftRecord>;
  } | null>(null);

  const normalized = useMemo(
    () => value.toUpperCase().replace(/[\s-]/g, "").slice(0, 11),
    [value]
  );

  const lookup = useCallback(
    async (code: string): Promise<LookupResult | "unavailable" | null> => {
      if (code.length < 8) return null;
      if (!dataRef.current) {
        setLoadingData(true);
        try {
          const res = await fetch("/data/swift-codes.json");
          const arr: SwiftRecord[] = await res.json();
          const exact = new Map<string, SwiftRecord>();
          const primary = new Map<string, SwiftRecord>();
          for (const r of arr) {
            if (!exact.has(r[0])) exact.set(r[0], r);
            const b8 = r[0].slice(0, 8);
            if (!primary.has(b8)) primary.set(b8, r);
          }
          dataRef.current = { exact, primary };
        } catch {
          return "unavailable";
        } finally {
          setLoadingData(false);
        }
      }
      const { exact, primary } = dataRef.current;
      const hit =
        exact.get(code) ??
        (code.length === 11
          ? (exact.get(code.slice(0, 8) + "XXX") ?? primary.get(code.slice(0, 8)))
          : primary.get(code));
      return hit ? { kind: exact.has(code) ? "exact" : "primary", record: hit } : { kind: "none" };
    },
    []
  );

  const [lookupResult, setLookupResult] = useState<LookupResult | "unavailable" | null>(null);

  // Re-run the lookup (debounced) whenever the normalized code changes.
  useEffect(() => {
    const handle = window.setTimeout(() => {
      void lookup(normalized).then(setLookupResult);
    }, 300);
    return () => window.clearTimeout(handle);
  }, [normalized, lookup]);

  const bic = validateBIC(normalized);
  const segments = normalized.length >= 8 ? extractBIC(normalized) : null;
  const countryOk =
    segments?.countryCode != null && ISO_COUNTRIES.has(segments.countryCode);
  const loc = segments?.locationCode ?? "";
  const locFlag = loc.startsWith("0") ? "test" : loc.startsWith("1") ? "passive" : loc.startsWith("2") ? "reverse" : null;
  const formatValid = bic.valid && countryOk !== false;

  const faqs: FAQ[] = [0, 1, 2, 3].map((i) => ({
    question: t(`faqs.${i}.question`),
    answer: t(`faqs.${i}.answer`),
  }));

  const relatedTools: RelatedTool[] = [
    { name: t("related.0.name"), href: "/tools/iban-validator" },
    { name: t("related.1.name"), href: "/tools/aba-routing-number-validator" },
    { name: t("related.2.name"), href: "/tools/bank-card-validate" },
  ];

  return (
    <ToolLayout
      title={t("title")}
      slug="swift-bic-checker"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={t.raw("keywords") as string[]}
    >
      <div className="max-w-4xl space-y-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <label htmlFor="bic-input" className="mb-2 block text-base font-medium text-zinc-100">
            {t("labels.inputTitle")}
          </label>
          <input
            id="bic-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            placeholder={t("labels.placeholder")}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-lg uppercase tracking-[0.2em] text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none"
          />
          <p className="mt-2 text-xs text-zinc-500">{t("labels.hint")}</p>

          {normalized.length === 0 ? (
            <p className="mt-5 text-sm text-zinc-500">{t("labels.empty")}</p>
          ) : normalized.length < 8 ? (
            <p className="mt-5 text-sm text-zinc-500">{t("labels.tooShort")}</p>
          ) : (
            <div className="mt-5 space-y-3" aria-live="polite">
              <p
                className={`rounded-lg px-4 py-3 text-sm font-medium ${
                  formatValid ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                }`}
              >
                {formatValid ? t("labels.valid") : t("labels.invalid")}
              </p>

              {segments && (
                <dl className="grid gap-2 text-sm sm:grid-cols-2">
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2">
                    <dt className="text-xs text-zinc-500">{t("labels.bankCode")}</dt>
                    <dd className="font-mono text-zinc-100">{segments.bankCode}</dd>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2">
                    <dt className="text-xs text-zinc-500">{t("labels.countryCode")}</dt>
                    <dd className="font-mono text-zinc-100">
                      {segments.countryCode}
                      {countryOk === false && (
                        <span className="ml-2 text-red-400">{t("labels.unknownCountry")}</span>
                      )}
                    </dd>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2">
                    <dt className="text-xs text-zinc-500">{t("labels.locationCode")}</dt>
                    <dd className="font-mono text-zinc-100">
                      {loc}
                      {locFlag && (
                        <span className="ml-2 text-amber-400">{t(`labels.loc_${locFlag}`)}</span>
                      )}
                    </dd>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2">
                    <dt className="text-xs text-zinc-500">{t("labels.branchCode")}</dt>
                    <dd className="font-mono text-zinc-100">
                      {segments.branchCode ?? t("labels.primaryOffice")}
                    </dd>
                  </div>
                </dl>
              )}

              <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm">
                <p className="mb-1 text-xs text-zinc-500">{t("labels.lookupTitle")}</p>
                {loadingData || lookupResult === null ? (
                  <p className="text-zinc-500">{t("labels.lookupLoading")}</p>
                ) : lookupResult === "unavailable" ? (
                  <p className="text-zinc-500">{t("labels.lookupUnavailable")}</p>
                ) : lookupResult.kind === "none" ? (
                  <p className="text-zinc-400">{t("labels.lookupNone")}</p>
                ) : (
                  <div>
                    <p className="font-medium text-zinc-100">{lookupResult.record[1]}</p>
                    <p className="text-zinc-400">
                      {lookupResult.record[4] ? `${lookupResult.record[4]} · ` : ""}
                      {lookupResult.record[2]} · {lookupResult.record[3]}
                    </p>
                    {lookupResult.kind === "primary" && (
                      <p className="mt-1 text-xs text-zinc-500">{t("labels.lookupPrimaryNote")}</p>
                    )}
                    <p className="mt-1 text-xs text-zinc-600">{t("labels.lookupDisclaimer")}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
