"use client";

import { useTranslations } from "next-intl";
import type {
  CaseStyleConfig,
  FindReplaceConfig,
  InsertConfig,
  MapListConfig,
  RandomConfig,
  RecombineConfig,
  RegexConfig,
  RemoveCleanupConfig,
  RuleConfig,
  SequenceConfig,
  SliceConfig,
  SliceSegment,
} from "@/lib/rename/types";

interface RuleEditorsProps {
  ruleConfig: RuleConfig;
  onChange: (config: RuleConfig) => void;
}

const inputCls =
  "rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 focus:border-blue-500 focus:outline-none";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs text-zinc-400">{label}</label>
      {children}
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-1.5 text-xs text-zinc-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-blue-500"
      />
      {label}
    </label>
  );
}

function NumInput({
  value,
  onChange,
  min = 0,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
}) {
  return (
    <input
      type="number"
      min={min}
      value={value}
      onChange={(e) => onChange(Math.max(min, parseInt(e.target.value, 10) || 0))}
      className={`${inputCls} w-full`}
    />
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputCls} w-full`}
    />
  );
}

function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputCls} w-full`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function FindReplaceEditor({ config, onChange }: { config: FindReplaceConfig; onChange: (c: RuleConfig) => void }) {
  const t = useTranslations("tools.batch-rename");
  const f = t.raw("fields") as Record<string, string>;
  const update = (patch: Partial<FindReplaceConfig>) =>
    onChange({ type: "findReplace", config: { ...config, ...patch } });

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={f.find}>
          <TextInput value={config.find} onChange={(v) => update({ find: v })} />
        </Field>
        <Field label={f.replace}>
          <TextInput value={config.replace} onChange={(v) => update({ replace: v })} />
        </Field>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <Checkbox
          label={f.caseSensitive}
          checked={config.caseSensitive}
          onChange={(v) => update({ caseSensitive: v })}
        />
        <Checkbox
          label={f.matchAll}
          checked={config.matchAll}
          onChange={(v) => update({ matchAll: v })}
        />
        <Checkbox
          label={f.replacePosition}
          checked={config.usePosition}
          onChange={(v) => update({ usePosition: v })}
        />
      </div>
      {config.usePosition && (
        <div className="space-y-2">
          <Checkbox
            label={f.fromEnd}
            checked={config.fromEnd}
            onChange={(v) => update({ fromEnd: v })}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={f.position}>
              <NumInput value={config.positionStart} onChange={(v) => update({ positionStart: v })} />
            </Field>
            <Field label={f.length}>
              <NumInput
                value={config.positionCount}
                onChange={(v) => update({ positionCount: Math.max(1, v) })}
                min={1}
              />
            </Field>
          </div>
        </div>
      )}
    </div>
  );
}

function InsertEditor({ config, onChange }: { config: InsertConfig; onChange: (c: RuleConfig) => void }) {
  const t = useTranslations("tools.batch-rename");
  const f = t.raw("fields") as Record<string, string>;
  const update = (patch: Partial<InsertConfig>) =>
    onChange({ type: "insert", config: { ...config, ...patch } });

  return (
    <div className="space-y-3">
      <Field label={f.insertText}>
        <TextInput value={config.text} onChange={(v) => update({ text: v })} />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={f.insertPosition}>
          <SelectInput
            value={config.position}
            onChange={(v) => update({ position: v as InsertConfig["position"] })}
            options={[
              { value: "start", label: f.positionStart },
              { value: "end", label: f.positionEnd },
              { value: "index", label: f.positionIndex },
            ]}
          />
        </Field>
        {config.position === "index" && (
          <Field label={f.position}>
            <NumInput value={config.index} onChange={(v) => update({ index: v })} />
          </Field>
        )}
      </div>
    </div>
  );
}

function SequenceEditor({ config, onChange }: { config: SequenceConfig; onChange: (c: RuleConfig) => void }) {
  const t = useTranslations("tools.batch-rename");
  const f = t.raw("fields") as Record<string, string>;
  const update = (patch: Partial<SequenceConfig>) =>
    onChange({ type: "sequence", config: { ...config, ...patch } });

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={f.seqType}>
          <SelectInput
            value={config.seqType}
            onChange={(v) => update({ seqType: v as SequenceConfig["seqType"] })}
            options={[
              { value: "numeric", label: f.numeric },
              { value: "alpha", label: f.alpha },
              { value: "roman", label: f.roman },
            ]}
          />
        </Field>
        <Field label={f.seqPosition}>
          <SelectInput
            value={config.position}
            onChange={(v) => update({ position: v as SequenceConfig["position"] })}
            options={[
              { value: "start", label: f.positionStart },
              { value: "end", label: f.positionEnd },
              { value: "replaceAll", label: f.replaceWhole },
            ]}
          />
        </Field>
        <Field label={f.seqStart}>
          <NumInput value={config.start} onChange={(v) => update({ start: v })} />
        </Field>
        <Field label={f.step}>
          <NumInput value={config.step} onChange={(v) => update({ step: Math.max(1, v) })} min={1} />
        </Field>
        <Field label={`${f.padding}: ${config.padding}`}>
          <NumInput value={config.padding} onChange={(v) => update({ padding: v })} />
        </Field>
      </div>
      <Field label={f.template}>
        <TextInput
          value={config.template}
          onChange={(v) => update({ template: v })}
          placeholder="image_{n}"
        />
      </Field>
    </div>
  );
}

function CaseStyleEditor({ config, onChange }: { config: CaseStyleConfig; onChange: (c: RuleConfig) => void }) {
  const t = useTranslations("tools.batch-rename");
  const f = t.raw("fields") as Record<string, string>;
  const modeOptions = t.raw("styleOptions") as Record<string, string>;
  const sepOptions = t.raw("separatorOptions") as Record<string, string>;
  const update = (patch: Partial<CaseStyleConfig>) =>
    onChange({ type: "caseStyle", config: { ...config, ...patch } });

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label={f.mode}>
        <SelectInput
          value={config.mode}
          onChange={(v) => update({ mode: v as CaseStyleConfig["mode"] })}
          options={Object.entries(modeOptions).map(([value, label]) => ({ value, label }))}
        />
      </Field>
      <Field label={f.style}>
        <SelectInput
          value={config.style}
          onChange={(v) => update({ style: v as CaseStyleConfig["style"] })}
          options={Object.entries(sepOptions).map(([value, label]) => ({ value, label }))}
        />
      </Field>
    </div>
  );
}

function RegexEditor({ config, onChange }: { config: RegexConfig; onChange: (c: RuleConfig) => void }) {
  const t = useTranslations("tools.batch-rename");
  const f = t.raw("fields") as Record<string, string>;
  const update = (patch: Partial<RegexConfig>) =>
    onChange({ type: "regex", config: { ...config, ...patch } });

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={f.regexPattern}>
          <TextInput value={config.pattern} onChange={(v) => update({ pattern: v })} />
        </Field>
        <Field label={f.regexReplacement}>
          <TextInput value={config.replacement} onChange={(v) => update({ replacement: v })} />
        </Field>
      </div>
      <Field label={f.flags}>
        <TextInput value={config.flags} onChange={(v) => update({ flags: v })} placeholder="g" />
      </Field>
    </div>
  );
}

function RemoveCleanupEditor({ config, onChange }: { config: RemoveCleanupConfig; onChange: (c: RuleConfig) => void }) {
  const t = useTranslations("tools.batch-rename");
  const f = t.raw("fields") as Record<string, string>;
  const modeOptions = t.raw("removeModes") as Record<string, string>;
  const update = (patch: Partial<RemoveCleanupConfig>) =>
    onChange({ type: "removeCleanup", config: { ...config, ...patch } });

  return (
    <div className="space-y-3">
      <Field label={f.removeMode}>
        <SelectInput
          value={config.mode}
          onChange={(v) => update({ mode: v as RemoveCleanupConfig["mode"] })}
          options={Object.entries(modeOptions).map(([value, label]) => ({ value, label }))}
        />
      </Field>
      {config.mode === "chars" && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={f.charsDirection}>
            <SelectInput
              value={config.direction}
              onChange={(v) => update({ direction: v as RemoveCleanupConfig["direction"] })}
              options={[
                { value: "start", label: f.fromStart },
                { value: "end", label: f.fromEnd },
              ]}
            />
          </Field>
          <Field label={f.charsCount}>
            <NumInput value={config.count} onChange={(v) => update({ count: v })} />
          </Field>
        </div>
      )}
      {config.mode === "range" && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={f.rangeStart}>
            <NumInput value={config.rangeStart} onChange={(v) => update({ rangeStart: v })} />
          </Field>
          <Field label={f.rangeEnd}>
            <NumInput value={config.rangeEnd} onChange={(v) => update({ rangeEnd: v })} />
          </Field>
        </div>
      )}
      {config.mode === "cleanup" && (
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Checkbox label={f.removeDigits} checked={config.removeDigits} onChange={(v) => update({ removeDigits: v })} />
          <Checkbox label={f.removeSymbols} checked={config.removeSymbols} onChange={(v) => update({ removeSymbols: v })} />
          <Checkbox label={f.removeSpaces} checked={config.removeSpaces} onChange={(v) => update({ removeSpaces: v })} />
          <Checkbox label={f.removeChinese} checked={config.removeChinese} onChange={(v) => update({ removeChinese: v })} />
          <Checkbox label={f.removeEnglish} checked={config.removeEnglish} onChange={(v) => update({ removeEnglish: v })} />
        </div>
      )}
    </div>
  );
}

function RecombineEditor({ config, onChange }: { config: RecombineConfig; onChange: (c: RuleConfig) => void }) {
  const t = useTranslations("tools.batch-rename");
  const f = t.raw("fields") as Record<string, string>;
  const update = (patch: Partial<RecombineConfig>) =>
    onChange({ type: "recombine", config: { ...config, ...patch } });

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={f.recombineSeparator}>
          <TextInput value={config.separator} onChange={(v) => update({ separator: v })} placeholder="-" />
        </Field>
        <Field label={f.recombineJoinWith}>
          <TextInput value={config.joinWith} onChange={(v) => update({ joinWith: v })} placeholder="-" />
        </Field>
      </div>
      <Field label={f.recombineOrder}>
        <TextInput
          value={config.order}
          onChange={(v) => update({ order: v })}
          placeholder={f.recombineOrderHint}
        />
      </Field>
    </div>
  );
}

function SliceEditor({ config, onChange }: { config: SliceConfig; onChange: (c: RuleConfig) => void }) {
  const t = useTranslations("tools.batch-rename");
  const f = t.raw("fields") as Record<string, string>;
  const update = (patch: Partial<SliceConfig>) =>
    onChange({ type: "slice", config: { ...config, ...patch } });

  const updateSegment = (index: number, patch: Partial<SliceSegment>) => {
    const segments = config.segments.map((seg, i) => (i === index ? { ...seg, ...patch } : seg));
    update({ segments });
  };
  const addSegment = () => update({ segments: [...config.segments, { start: 0, length: 1 }] });
  const removeSegment = (index: number) =>
    update({ segments: config.segments.filter((_, i) => i !== index) });

  return (
    <div className="space-y-3">
      {config.segments.map((seg, index) => (
        <div key={index} className="grid grid-cols-[1fr_1fr_auto] items-end gap-2">
          <Field label={`${f.sliceStart} #${index + 1}`}>
            <NumInput value={seg.start} onChange={(v) => updateSegment(index, { start: v })} />
          </Field>
          <Field label={f.length}>
            <NumInput value={seg.length} onChange={(v) => updateSegment(index, { length: v })} />
          </Field>
          <button
            type="button"
            onClick={() => removeSegment(index)}
            disabled={config.segments.length <= 1}
            className="rounded-md border border-zinc-700 px-2 py-2 text-xs text-zinc-400 transition-colors hover:border-red-500/50 hover:text-red-400 disabled:opacity-40"
          >
            ✕
          </button>
        </div>
      ))}
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={f.sliceJoinWith}>
          <TextInput value={config.joinWith} onChange={(v) => update({ joinWith: v })} />
        </Field>
        <div className="flex items-end">
          <button
            type="button"
            onClick={addSegment}
            className="rounded-md border border-zinc-700 px-3 py-2 text-xs text-zinc-300 transition-colors hover:border-blue-500/50 hover:text-blue-400"
          >
            + {f.sliceAdd}
          </button>
        </div>
      </div>
    </div>
  );
}

function RandomEditor({ config, onChange }: { config: RandomConfig; onChange: (c: RuleConfig) => void }) {
  const t = useTranslations("tools.batch-rename");
  const f = t.raw("fields") as Record<string, string>;
  const charsetOptions = t.raw("randomCharsets") as Record<string, string>;
  const update = (patch: Partial<RandomConfig>) =>
    onChange({ type: "random", config: { ...config, ...patch } });

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={f.randomCharset}>
          <SelectInput
            value={config.charset}
            onChange={(v) => update({ charset: v as RandomConfig["charset"] })}
            options={Object.entries(charsetOptions).map(([value, label]) => ({ value, label }))}
          />
        </Field>
        <Field label={f.randomPosition}>
          <SelectInput
            value={config.position}
            onChange={(v) => update({ position: v as RandomConfig["position"] })}
            options={[
              { value: "start", label: f.positionStart },
              { value: "end", label: f.positionEnd },
            ]}
          />
        </Field>
        <Field label={`${f.randomLength}: ${config.length}`}>
          <NumInput value={config.length} onChange={(v) => update({ length: v })} />
        </Field>
      </div>
      {config.charset === "custom" && (
        <Field label={f.randomCustomChars}>
          <TextInput value={config.customChars} onChange={(v) => update({ customChars: v })} />
        </Field>
      )}
    </div>
  );
}

function MapListEditor({ config, onChange }: { config: MapListConfig; onChange: (c: RuleConfig) => void }) {
  const t = useTranslations("tools.batch-rename");
  const f = t.raw("fields") as Record<string, string>;
  const text = config.entries.map((e) => `${e.from}=${e.to}`).join("\n");
  const handleChange = (value: string) => {
    const entries = value
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const eq = line.indexOf("=");
        return eq === -1
          ? { from: line, to: "" }
          : { from: line.slice(0, eq).trim(), to: line.slice(eq + 1).trim() };
      });
    onChange({ type: "mapList", config: { ...config, entries } });
  };

  return (
    <div className="space-y-2">
      <Field label={f.mapListHint}>
        <textarea
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          rows={5}
          placeholder={f.mapListPlaceholder}
          className={`${inputCls} w-full font-mono`}
        />
      </Field>
    </div>
  );
}

export default function RuleEditors({ ruleConfig, onChange }: RuleEditorsProps) {
  switch (ruleConfig.type) {
    case "findReplace":
      return <FindReplaceEditor config={ruleConfig.config} onChange={onChange} />;
    case "insert":
      return <InsertEditor config={ruleConfig.config} onChange={onChange} />;
    case "sequence":
      return <SequenceEditor config={ruleConfig.config} onChange={onChange} />;
    case "caseStyle":
      return <CaseStyleEditor config={ruleConfig.config} onChange={onChange} />;
    case "regex":
      return <RegexEditor config={ruleConfig.config} onChange={onChange} />;
    case "removeCleanup":
      return <RemoveCleanupEditor config={ruleConfig.config} onChange={onChange} />;
    case "recombine":
      return <RecombineEditor config={ruleConfig.config} onChange={onChange} />;
    case "slice":
      return <SliceEditor config={ruleConfig.config} onChange={onChange} />;
    case "random":
      return <RandomEditor config={ruleConfig.config} onChange={onChange} />;
    case "mapList":
      return <MapListEditor config={ruleConfig.config} onChange={onChange} />;
  }
}
