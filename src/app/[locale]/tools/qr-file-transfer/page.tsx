"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import Sender from "@/components/qr-file-transfer/Sender";
import Receiver from "@/components/qr-file-transfer/Receiver";

type Tab = "send" | "receive";

export default function QrFileTransferPage() {
  const t = useTranslations("tools.qr-file-transfer");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];
  const [tab, setTab] = useState<Tab>("send");

  return (
    <ToolLayout
      title={t("title")}
      slug="qr-file-transfer"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-5">
        <div className="flex gap-2" role="tablist" aria-label={t("tabs.label")}>
          {(["send", "receive"] as const).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                tab === key
                  ? "bg-blue-600 text-white"
                  : "border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              {key === "send" ? t("tabs.send") : t("tabs.receive")}
            </button>
          ))}
        </div>
        {tab === "send" ? <Sender /> : <Receiver />}
      </div>
    </ToolLayout>
  );
}
