"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

/** Classic spigot algorithm — returns `n` digits of pi after the decimal point. */
function spigotPi(n: number): string {
  const N = Math.floor((10 * n) / 3) + 2;
  const a = new Array(N + 1).fill(2);
  let nines = 0;
  let predigit = 0;
  let out = "";
  for (let k = 0; k < n; k++) {
    let q = 0;
    for (let i = N; i > 0; i--) {
      const x = 10 * a[i] + q * i;
      a[i] = x % (2 * i - 1);
      q = Math.floor(x / (2 * i - 1));
    }
    a[0] = q % 10;
    q = Math.floor(q / 10);
    if (q === 9) {
      nines++;
    } else if (q === 10) {
      out += String(predigit + 1);
      out += "0".repeat(nines);
      predigit = 0;
      nines = 0;
    } else {
      out += String(predigit);
      predigit = q;
      out += "9".repeat(nines);
      nines = 0;
    }
  }
  return out;
}

export default function PiDigitsPage() {
  const t = useTranslations("tools.pi-digits");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [digits, setDigits] = useState(1000);
  const [search, setSearch] = useState("");
  const [piString, setPiString] = useState("");
  const [position, setPosition] = useState<number | null>(null);

  const piMemo = useMemo(() => {
    if (!piString) return "";
    return piString;
  }, [piString]);

  const generate = () => {
    const n = Math.max(10, Math.min(100000, digits));
    const start = Date.now();
    // The spigot emits the integer part "3" first; slice it off.
    const s = spigotPi(n + 1).slice(1);
    console.log(`generated ${n} digits in ${Date.now() - start}ms`);
    setPiString(s);
    setPosition(null);
  };

  const doSearch = () => {
    const q = search.trim();
    if (!q || !piMemo) return;
    const idx = piMemo.indexOf(q);
    setPosition(idx === -1 ? -1 : idx + 1);
  };

  const download = () => {
    const content = `3.${piMemo}\n`;
    const blob = new Blob([content], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `pi-${piMemo.length}-digits.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none";

  return (
    <ToolLayout
      title={t("title")}
      slug="pi-digits"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-zinc-300">{t("labels.digits")}</label>
          <input
            type="number"
            min={10}
            max={100000}
            step={100}
            value={digits}
            onChange={(e) => setDigits(Math.max(10, Math.min(100000, Number(e.target.value) || 1000)))}
            className="w-32 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
          />
          <button onClick={generate} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500">
            {t("buttons.generate")}
          </button>
        </div>
        {piMemo && (
          <>
            <div className="max-h-48 overflow-auto rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-xs leading-relaxed text-zinc-300">
              3.{piMemo.slice(0, 2000)}
              {piMemo.length > 2000 && <span className="text-zinc-600"> … ({piMemo.length} digits)</span>}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("labels.searchPlaceholder")}
                className={inputCls + " max-w-xs"}
              />
              <button onClick={doSearch} disabled={!search.trim()} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50">
                {t("buttons.search")}
              </button>
              <button onClick={download} className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:border-zinc-500">
                {t("buttons.download")}
              </button>
            </div>
            {position !== null && (
              <p className="text-sm text-zinc-300">
                {position === -1 ? t("labels.notFound") : t("labels.found") + `: ${position}`}
              </p>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
}
