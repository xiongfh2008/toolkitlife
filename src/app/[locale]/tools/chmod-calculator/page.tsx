"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type PermissionTarget = "owner" | "group" | "other";
type PermissionType = "read" | "write" | "execute";

const TARGETS: PermissionTarget[] = ["owner", "group", "other"];
const TYPES: PermissionType[] = ["read", "write", "execute"];
const BIT_VALUES: Record<PermissionType, number> = { read: 4, write: 2, execute: 1 };
const CHARS: Record<PermissionType, string> = { read: "r", write: "w", execute: "x" };

function permsFromNumber(value: string): Record<PermissionTarget, Record<PermissionType, boolean>> {
  const num = parseInt(value, 10);
  if (isNaN(num) || num < 0 || num > 777) {
    return {
      owner: { read: false, write: false, execute: false },
      group: { read: false, write: false, execute: false },
      other: { read: false, write: false, execute: false },
    };
  }
  const digits = value.padStart(3, "0").slice(-3).split("").map((d) => parseInt(d, 10));
  const perms = {} as Record<PermissionTarget, Record<PermissionType, boolean>>;
  TARGETS.forEach((target, i) => {
    const digit = digits[i];
    perms[target] = {
      read: (digit & 4) !== 0,
      write: (digit & 2) !== 0,
      execute: (digit & 1) !== 0,
    };
  });
  return perms;
}

function numberAndSymbolicFromPerms(perms: Record<PermissionTarget, Record<PermissionType, boolean>>): { number: string; symbolic: string } {
  let num = 0;
  let sym = "";
  TARGETS.forEach((target) => {
    let digit = 0;
    TYPES.forEach((type) => {
      if (perms[target][type]) {
        digit += BIT_VALUES[type];
        sym += CHARS[type];
      } else {
        sym += "-";
      }
    });
    num = num * 10 + digit;
  });
  return { number: String(num), symbolic: sym };
}

export default function ChmodCalculatorPage() {
  const t = useTranslations("tools.chmod-calculator");
  const [number, setNumber] = useState<string>("755");
  const [perms, setPerms] = useState<Record<PermissionTarget, Record<PermissionType, boolean>>>(() => permsFromNumber("755"));
  const [symbolic, setSymbolic] = useState("rwxr-xr-x");

  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const updateFromNumber = useCallback((value: string) => {
    const newPerms = permsFromNumber(value);
    const { number: num, symbolic: sym } = numberAndSymbolicFromPerms(newPerms);
    setPerms(newPerms);
    setNumber(value === "" ? "" : num);
    setSymbolic(sym);
  }, []);

  const toggle = (target: PermissionTarget, type: PermissionType) => {
    const newPerms = {
      ...perms,
      [target]: { ...perms[target], [type]: !perms[target][type] },
    };
    const { number: num, symbolic: sym } = numberAndSymbolicFromPerms(newPerms);
    setPerms(newPerms);
    setNumber(num);
    setSymbolic(sym);
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="chmod-calculator"
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.octal")}</label>
            <input
              type="text"
              value={number}
              onChange={(e) => updateFromNumber(e.target.value)}
              maxLength={3}
              className="w-32 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-center font-mono text-lg text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              spellCheck={false}
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.symbolic")}</label>
            <div className="flex items-center gap-2">
              <code className="block rounded-lg bg-zinc-900 px-4 py-2 font-mono text-lg text-blue-400">
                {symbolic}
              </code>
              <CopyButton text={symbolic} className="text-xs px-2 py-1" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {TARGETS.map((target) => (
              <div key={target}>
                <h3 className="mb-2 text-sm font-semibold text-zinc-200 capitalize">{t(`labels.${target}`)}</h3>
                <div className="space-y-2">
                  {TYPES.map((type) => (
                    <label key={type} className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={perms[target][type]}
                        onChange={() => toggle(target, type)}
                        className="h-4 w-4 rounded border-zinc-600 bg-zinc-700 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="uppercase">{CHARS[type]}</span>
                      <span className="text-zinc-500">{t(`labels.${type}`)}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {TARGETS.map((target) => {
            const digit =
              (perms[target].read ? 4 : 0) +
              (perms[target].write ? 2 : 0) +
              (perms[target].execute ? 1 : 0);
            const sym = TYPES.map((type) => (perms[target][type] ? CHARS[type] : "-")).join("");
            return (
              <div key={target} className="rounded-lg border border-zinc-700 bg-zinc-800 p-4 text-center">
                <p className="text-xs text-zinc-500 uppercase">{t(`labels.${target}`)}</p>
                <p className="mt-1 text-2xl font-mono text-zinc-100">{digit}</p>
                <p className="font-mono text-sm text-blue-400">{sym}</p>
              </div>
            );
          })}
        </div>
      </div>
    </ToolLayout>
  );
}
