"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const ENTITY_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  " ": "&#160;",
  "©": "&copy;",
  "®": "&reg;",
  "™": "&trade;",
  "€": "&euro;",
  "£": "&pound;",
  "¥": "&yen;",
  "¢": "&cent;",
  "§": "&sect;",
  "¶": "&para;",
  "•": "&bull;",
  "…": "&hellip;",
  "–": "&ndash;",
  "—": "&mdash;",
  "‘": "&lsquo;",
  "’": "&rsquo;",
  "“": "&ldquo;",
  "”": "&rdquo;",
  "«": "&laquo;",
  "»": "&raquo;",
  "←": "&larr;",
  "↑": "&uarr;",
  "→": "&rarr;",
  "↓": "&darr;",
  "⇐": "&lArr;",
  "⇑": "&uArr;",
  "⇒": "&rArr;",
  "⇓": "&dArr;",
  "⇔": "&hArr;",
  "∀": "&forall;",
  "∂": "&part;",
  "∃": "&exist;",
  "∅": "&empty;",
  "∇": "&nabla;",
  "∈": "&isin;",
  "∉": "&notin;",
  "∋": "&ni;",
  "∏": "&prod;",
  "∑": "&sum;",
  "−": "&minus;",
  "∗": "&lowast;",
  "√": "&radic;",
  "∝": "&prop;",
  "∞": "&infin;",
  "∠": "&ang;",
  "∧": "&and;",
  "∨": "&or;",
  "∩": "&cap;",
  "∪": "&cup;",
  "∫": "&int;",
  "∴": "&there4;",
  "∼": "&sim;",
  "≅": "&cong;",
  "≈": "&asymp;",
  "≠": "&ne;",
  "≡": "&equiv;",
  "≤": "&le;",
  "≥": "&ge;",
  "⊂": "&sub;",
  "⊃": "&sup;",
  "⊄": "&nsub;",
  "⊆": "&sube;",
  "⊇": "&supe;",
  "⊕": "&oplus;",
  "⊗": "&otimes;",
  "⊥": "&perp;",
  "⋅": "&sdot;",
  "α": "&alpha;",
  "β": "&beta;",
  "γ": "&gamma;",
  "δ": "&delta;",
  "ε": "&epsilon;",
  "ζ": "&zeta;",
  "η": "&eta;",
  "θ": "&theta;",
  "ι": "&iota;",
  "κ": "&kappa;",
  "λ": "&lambda;",
  "μ": "&mu;",
  "ν": "&nu;",
  "ξ": "&xi;",
  "ο": "&omicron;",
  "π": "&pi;",
  "ρ": "&rho;",
  "ς": "&sigmaf;",
  "σ": "&sigma;",
  "τ": "&tau;",
  "υ": "&upsilon;",
  "φ": "&phi;",
  "χ": "&chi;",
  "ψ": "&psi;",
  "ω": "&omega;",
};

const REVERSE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(ENTITY_MAP).map(([k, v]) => [v, k])
);

function encodeHtml(input: string): string {
  return input
    .split("")
    .map((c) => ENTITY_MAP[c] || c)
    .join("");
}

function decodeHtml(input: string): string {
  return input
    .replace(/&#[xX]([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(parseInt(num, 10)))
    .replace(/&[a-zA-Z0-9]+;/g, (match) => REVERSE_MAP[match] || match);
}

type Mode = "encode" | "decode";

export default function HtmlEntityEncoderPage() {
  const t = useTranslations("tools.html-entity-encoder");
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const convert = useCallback((text: string, m: Mode) => {
    if (!text) {
      setOutput("");
      return;
    }
    setOutput(m === "encode" ? encodeHtml(text) : decodeHtml(text));
  }, []);

  const handleInputChange = (text: string) => {
    setInput(text);
    convert(text, mode);
  };

  const handleModeChange = (m: Mode) => {
    setMode(m);
    convert(input, m);
  };

  const clear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="html-entity-encoder"
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {(["encode", "decode"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                mode === m ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {t(`buttons.${m}`)}
            </button>
          ))}
          <button onClick={clear} className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-700 transition-colors">
            {t("buttons.clear")}
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {mode === "encode" ? t("labels.text") : t("labels.entities")}
            </label>
            <textarea
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={mode === "encode" ? t("labels.textPlaceholder") : t("labels.entitiesPlaceholder")}
              rows={16}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 resize-y"
              spellCheck={false}
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">{t("labels.output")}</label>
              {output && <CopyButton text={output} className="text-xs px-2 py-1" />}
            </div>
            <textarea
              value={output}
              readOnly
              rows={16}
              placeholder={t("labels.outputPlaceholder")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-sm text-zinc-300 placeholder-zinc-500 outline-none resize-y"
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
