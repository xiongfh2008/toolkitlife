"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

interface Contact {
  name: string;
  phone: string;
}

export default function VcfGeneratorPage() {
  const t = useTranslations("tools.vcf-generator");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const linkRef = useRef<HTMLAnchorElement>(null);

  const parseContacts = (): Contact[] => {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const contacts: Contact[] = [];
    for (const line of lines) {
      const parts = line.split(/[\t,，;；]/).map((p) => p.trim());
      const name = parts[0];
      const phone = parts[1]?.replace(/\D/g, "");
      if (name && phone && phone.length >= 5) contacts.push({ name, phone });
    }
    return contacts;
  };

  const download = () => {
    const contacts = parseContacts();
    if (contacts.length === 0) {
      setError(t("labels.noContact"));
      return;
    }
    setError("");
    const vcf = contacts
      .map(
        (c, i) =>
          `BEGIN:VCARD\nVERSION:3.0\nN:${c.name};;;;\nFN:${c.name}\nTEL;TYPE=CELL:${c.phone}\nUID:${Date.now()}-${i}\nEND:VCARD`
      )
      .join("\n");
    const blob = new Blob([vcf], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = linkRef.current;
    if (a) {
      a.href = url;
      a.download = `contacts-${Date.now()}.vcf`;
      a.click();
    }
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title={t("title")}
      slug="vcf-generator"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder={t("labels.placeholder")}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={download} className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-500">
            {t("buttons.download")}
          </button>
          <span className="text-sm text-zinc-400">
            {t("labels.parsed", { count: parseContacts().length })}
          </span>
          <a ref={linkRef} className="hidden" />
        </div>
      </div>
    </ToolLayout>
  );
}
