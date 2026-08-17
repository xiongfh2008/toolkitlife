"use client";

import { useTranslations } from "next-intl";
import RuleEditors from "./RuleEditors";
import type {
  ExtensionScope,
  RenameRule,
  RuleConfig,
  RuleType,
} from "@/lib/rename/types";

interface RulePanelProps {
  rules: RenameRule[];
  scope: ExtensionScope;
  onAddRule: (type: RuleType) => void;
  onUpdateRuleConfig: (id: string, config: RuleConfig) => void;
  onToggleRule: (id: string) => void;
  onRemoveRule: (id: string) => void;
  onMoveRule: (id: string, dir: -1 | 1) => void;
  onCloneRule: (id: string) => void;
  onSetScope: (scope: ExtensionScope) => void;
  onClearRules: () => void;
}

const RULE_TYPES: RuleType[] = [
  "findReplace",
  "insert",
  "sequence",
  "caseStyle",
  "regex",
  "removeCleanup",
  "recombine",
  "slice",
  "random",
  "mapList",
];

const RULE_ACCENTS: Record<RuleType, string> = {
  findReplace: "border-l-blue-500",
  insert: "border-l-emerald-500",
  sequence: "border-l-amber-500",
  caseStyle: "border-l-violet-500",
  regex: "border-l-rose-500",
  removeCleanup: "border-l-orange-500",
  recombine: "border-l-cyan-500",
  slice: "border-l-teal-500",
  random: "border-l-lime-500",
  mapList: "border-l-pink-500",
};

const RULE_BADGES: Record<RuleType, string> = {
  findReplace: "bg-blue-500/15 text-blue-400",
  insert: "bg-emerald-500/15 text-emerald-400",
  sequence: "bg-amber-500/15 text-amber-400",
  caseStyle: "bg-violet-500/15 text-violet-400",
  regex: "bg-rose-500/15 text-rose-400",
  removeCleanup: "bg-orange-500/15 text-orange-400",
  recombine: "bg-cyan-500/15 text-cyan-400",
  slice: "bg-teal-500/15 text-teal-400",
  random: "bg-lime-500/15 text-lime-400",
  mapList: "bg-pink-500/15 text-pink-400",
};

const iconBtn =
  "rounded-md p-1 text-zinc-500 transition-colors hover:bg-zinc-700 hover:text-zinc-200";

export default function RulePanel({
  rules,
  scope,
  onAddRule,
  onUpdateRuleConfig,
  onToggleRule,
  onRemoveRule,
  onMoveRule,
  onCloneRule,
  onSetScope,
  onClearRules,
}: RulePanelProps) {
  const t = useTranslations("tools.batch-rename");
  const ruleTypeNames = t.raw("ruleTypes") as Record<string, string>;
  const scopeNames = t.raw("scope") as Record<string, string>;

  const scopeOptions: { value: ExtensionScope; label: string }[] = [
    { value: "name", label: scopeNames.name },
    { value: "extension", label: scopeNames.extension },
    { value: "full", label: scopeNames.full },
  ];

  return (
    <div className="flex h-full flex-col rounded-xl border border-zinc-800 bg-zinc-900/60">
      <div className="border-b border-zinc-800 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-300">{t("rulesPanel.title")}</span>
          <span className="text-xs text-zinc-500">
            {rules.filter((r) => r.enabled).length} / {rules.length}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs text-zinc-400">{t("scope.label")}</span>
          <div className="flex overflow-hidden rounded-lg border border-zinc-700">
            {scopeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onSetScope(opt.value)}
                className={`px-2.5 py-1 text-xs transition-colors ${
                  scope === opt.value
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-auto p-3">
        {rules.length === 0 && (
          <p className="py-6 text-center text-xs text-zinc-500">{t("rulesPanel.empty")}</p>
        )}
        {rules.map((rule, idx) => {
          const accent = RULE_ACCENTS[rule.ruleConfig.type];
          const badge = RULE_BADGES[rule.ruleConfig.type];
          const name = ruleTypeNames[rule.ruleConfig.type] ?? rule.ruleConfig.type;
          return (
            <div
              key={rule.id}
              className={`rounded-lg border-l-4 ${accent} border border-zinc-800 bg-zinc-900 p-2.5`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rule.enabled}
                  onChange={() => onToggleRule(rule.id)}
                  className="accent-blue-500"
                  aria-label={t("labels.enableRule")}
                />
                <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${badge}`}>
                  {name}
                </span>
                <span className="text-[11px] text-zinc-600">#{idx + 1}</span>
                <div className="ml-auto flex items-center gap-0.5">
                  <button
                    onClick={() => onMoveRule(rule.id, -1)}
                    disabled={idx === 0}
                    className={`${iconBtn} disabled:opacity-30`}
                    title={t("buttons.moveUp")}
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => onMoveRule(rule.id, 1)}
                    disabled={idx === rules.length - 1}
                    className={`${iconBtn} disabled:opacity-30`}
                    title={t("buttons.moveDown")}
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => onCloneRule(rule.id)}
                    className={iconBtn}
                    title={t("buttons.cloneRule")}
                  >
                    ⧉
                  </button>
                  <button
                    onClick={() => onRemoveRule(rule.id)}
                    className={`${iconBtn} hover:text-red-400`}
                    title={t("buttons.removeRule")}
                  >
                    ✕
                  </button>
                </div>
              </div>
              {rule.enabled && (
                <div className="mt-2.5">
                  <RuleEditors
                    ruleConfig={rule.ruleConfig}
                    onChange={(config) => onUpdateRuleConfig(rule.id, config)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-t border-zinc-800 p-3">
        <div className="flex items-center gap-2">
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) onAddRule(e.target.value as RuleType);
              e.target.value = "";
            }}
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 focus:border-blue-500 focus:outline-none"
          >
            <option value="" disabled>
              {t("rulesPanel.add")}…
            </option>
            {RULE_TYPES.map((type) => (
              <option key={type} value={type}>
                {ruleTypeNames[type]}
              </option>
            ))}
          </select>
          <button
            onClick={onClearRules}
            disabled={rules.length === 0}
            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-400 transition-colors hover:border-red-500/50 hover:text-red-400 disabled:opacity-40"
          >
            {t("rulesPanel.clear")}
          </button>
        </div>
        <p className="mt-2 text-[11px] text-zinc-500">{t("rulesPanel.reorderHint")}</p>
      </div>
    </div>
  );
}
