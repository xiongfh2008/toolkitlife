"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

const DICE_FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

export default function DiceRollerPage() {
  const t = useTranslations("tools.dice-roller");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [count, setCount] = useState(2);
  const [values, setValues] = useState<number[]>([]);
  const [rolling, setRolling] = useState(false);
  const [rollingValues, setRollingValues] = useState<number[]>([]);

  const roll = () => {
    setRollingValues(Array.from({ length: count }, () => 1 + Math.floor(Math.random() * 6)));
    setRolling(true);
    setTimeout(() => {
      const v = Array.from({ length: count }, () => 1 + Math.floor(Math.random() * 6));
      setValues(v);
      setRolling(false);
    }, 400);
  };

  const sum = values.reduce((a, b) => a + b, 0);

  return (
    <ToolLayout
      title={t("title")}
      slug="dice-roller"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="flex flex-col items-center gap-6 py-4">
        <div className="flex flex-wrap items-end justify-center gap-3">
          {values.length === 0 && !rolling && (
            <span className="text-6xl text-zinc-600">{DICE_FACES[5]}</span>
          )}
          {(rolling ? rollingValues : values).map((v, i) => (
            <span key={i} className={`text-6xl text-zinc-100 ${rolling ? "animate-bounce" : ""}`}>
              {DICE_FACES[v - 1]}
            </span>
          ))}
        </div>

        {values.length > 0 && !rolling && (
          <p className="text-lg text-zinc-200">
            {t("labels.total")}: <span className="font-semibold text-blue-400">{sum}</span>
          </p>
        )}

        <div className="flex items-center gap-3">
          <label className="text-sm text-zinc-300">{t("labels.diceCount")}</label>
          <input
            type="number"
            min={1}
            max={10}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
            className="w-20 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={roll}
            disabled={rolling}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {t("buttons.roll")}
          </button>
          <button onClick={() => setValues([])} className="rounded-lg border border-zinc-700 px-6 py-2 text-sm font-medium text-zinc-300 hover:border-zinc-500">
            {t("buttons.reset")}
          </button>
        </div>
      </div>
    </ToolLayout>
  );
}
