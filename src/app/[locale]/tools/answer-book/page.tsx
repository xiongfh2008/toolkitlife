"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

const ANSWERS = [
  "Yes, definitely.",
  "Ask again later.",
  "Outlook not so good.",
  "It is certain.",
  "Cannot predict now.",
  "Most likely.",
  "Do not count on it.",
  "Yes.",
  "No.",
  "Very doubtful.",
  "Signs point to yes.",
  "Better not tell you now.",
];

export default function AnswerBookPage() {
  const t = useTranslations("tools.answer-book");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [answer, setAnswer] = useState<string | null>(null);

  const ask = () => {
    setAnswer(ANSWERS[Math.floor(Math.random() * ANSWERS.length)]);
  };

  return (
    <ToolLayout
      title={t("title")}
      slug="answer-book"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="flex flex-col items-center gap-6 py-4">
        <button
          onClick={ask}
          className={`flex h-56 w-full max-w-md items-center justify-center rounded-2xl border-2 border-blue-600/40 bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 text-center text-xl font-medium text-zinc-100 transition-all hover:border-blue-500 ${answer ? "" : "text-zinc-400"}`}
        >
          {answer ?? t("labels.ask")}
        </button>
        <p className="text-sm text-zinc-500">{t("labels.hint")}</p>
      </div>
    </ToolLayout>
  );
}
