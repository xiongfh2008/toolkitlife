"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

function luhnValid(card: string): boolean {
  const digits = card.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

export default function BankCardValidatePage() {
  const t = useTranslations("tools.bank-card-validate");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [card, setCard] = useState("");
  const [result, setResult] = useState<boolean | null>(null);

  const validate = () => {
    setResult(luhnValid(card.trim()));
  };

  return (
    <ToolLayout
      title={t("title")}
      slug="bank-card-validate"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={card}
            onChange={(e) => setCard(e.target.value)}
            placeholder={t("labels.placeholder")}
            className="w-full max-w-sm rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
          />
          <button onClick={validate} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500">
            {t("buttons.validate")}
          </button>
        </div>
        {result !== null && (
          <div
            className={`rounded-lg border p-4 ${result ? "border-emerald-900 bg-emerald-950/40" : "border-red-900 bg-red-950/40"}`}
          >
            <p className={`text-lg font-semibold ${result ? "text-emerald-400" : "text-red-400"}`}>
              {result ? t("labels.valid") : t("labels.invalid")}
            </p>
            <p className="mt-1 text-sm text-zinc-400">{t("labels.luhnNote")}</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
