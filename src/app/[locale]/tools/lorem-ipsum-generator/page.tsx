"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "perspiciatis", "unde",
  "omnis", "iste", "natus", "error", "voluptatem", "accusantium", "doloremque",
  "laudantium", "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo",
  "inventore", "veritatis", "quasi", "architecto", "beatae", "vitae", "dicta",
  "explicabo", "nemo", "ipsam", "voluptas", "aspernatur", "aut", "odit",
  "fugit", "consequuntur", "magni", "dolores", "eos", "ratione", "sequi",
  "nesciunt", "neque", "porro", "quisquam", "dolorem", "adipisci",
  "numquam", "eius", "modi", "tempora", "incidunt", "magnam", "aliquam",
  "quaerat",
];

const LOREM_START = "Lorem ipsum dolor sit amet, consectetur adipiscing elit";

type GenerateType = "paragraphs" | "sentences" | "words";

interface GuideSection {
  title: string;
  paragraphs?: string[];
  items?: string[];
}

function randomWord(): string {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

function generateSentence(minWords = 6, maxWords = 14): string {
  const count = minWords + Math.floor(Math.random() * (maxWords - minWords + 1));
  const words = Array.from({ length: count }, () => randomWord());
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

function generateParagraph(minSentences = 3, maxSentences = 7): string {
  const count = minSentences + Math.floor(Math.random() * (maxSentences - minSentences + 1));
  return Array.from({ length: count }, () => generateSentence()).join(" ");
}

export default function LoremIpsumGeneratorPage() {
  const t = useTranslations("tools.lorem-ipsum-generator");
  const [type, setType] = useState<GenerateType>("paragraphs");
  const [quantity, setQuantity] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [generated, setGenerated] = useState("");

  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];
  const guideIntro = t.raw("guide.intro") as { title: string; paragraphs: string[] };
  const guideSections = t.raw("guide.sections") as GuideSection[];
  const options = t.raw("options") as { paragraphs: string; sentences: string; words: string };

  const generate = useCallback(() => {
    let result = "";
    switch (type) {
      case "paragraphs": {
        const paras = Array.from({ length: quantity }, () => generateParagraph());
        if (startWithLorem && paras.length > 0) {
          paras[0] = LOREM_START + ". " + paras[0];
        }
        result = paras.join("\n\n");
        break;
      }
      case "sentences": {
        const sents = Array.from({ length: quantity }, () => generateSentence());
        if (startWithLorem && sents.length > 0) {
          sents[0] = LOREM_START + ".";
        }
        result = sents.join(" ");
        break;
      }
      case "words": {
        const words = Array.from({ length: quantity }, () => randomWord());
        if (startWithLorem && words.length >= 2) {
          words[0] = "lorem";
          words[1] = words.length > 1 ? "ipsum" : words[1];
        }
        result = words.join(" ");
        break;
      }
    }
    setGenerated(result);
  }, [type, quantity, startWithLorem]);

  const wordCount = generated ? generated.split(/\s+/).filter(Boolean).length : 0;
  const charCount = generated.length;

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="lorem-ipsum-generator"
      keywords={keywords}
      relatedTools={relatedTools}
      faqs={faqs}
      guide={
        <>
          <h2>{guideIntro.title}</h2>
          {guideIntro.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {guideSections.map((section, i) => (
            <section key={i}>
              <h3>{section.title}</h3>
              {section.paragraphs?.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
              {section.items && (
                <ul>
                  {section.items.map((item, k) => (
                    <li key={k}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </>
      }
    >
      <div className="space-y-4">
        {/* Controls */}
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.type")}</label>
            <div className="flex gap-2">
              {(["paragraphs", "sentences", "words"] as GenerateType[]).map((tType) => (
                <button
                  key={tType}
                  onClick={() => setType(tType)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    type === tType ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  {options[tType]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.quantity")}</label>
            <input
              type="number"
              min={1}
              max={100}
              value={quantity}
              onChange={(e) => setQuantity(Math.min(100, Math.max(1, Number(e.target.value))))}
              className="w-24 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pb-1">
            <input
              type="checkbox"
              checked={startWithLorem}
              onChange={(e) => setStartWithLorem(e.target.checked)}
              className="accent-blue-500"
            />
            <span className="text-sm text-zinc-300">{t("labels.startWithLorem")}</span>
          </label>

          <button
            onClick={generate}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
          >
            {t("buttons.generate")}
          </button>
        </div>

        {/* Output */}
        {generated && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex gap-4 text-xs text-zinc-500">
                <span>{wordCount} {t("labels.words")}</span>
                <span>{charCount} {t("labels.characters")}</span>
              </div>
              <CopyButton text={generated} />
            </div>
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
              {generated}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
