/**
 * 批量重命名规则引擎（纯函数，无框架依赖）。
 * 设计参考 Rename.Tools（AGPL-3.0，仅借鉴设计，代码自研）。
 */
import { resolveVariables } from "./variables";
import type {
  CaseStyleConfig,
  ExtensionScope,
  FileEntry,
  FindReplaceConfig,
  InsertConfig,
  MapListConfig,
  PreviewResult,
  RandomConfig,
  RecombineConfig,
  RegexConfig,
  RemoveCleanupConfig,
  RenameRule,
  RuleContext,
  SequenceConfig,
  SliceConfig,
} from "./types";

// ── 序号工具 ──

function toAlpha(n: number): string {
  if (n <= 0) return "";
  let result = "";
  let v = n;
  while (v > 0) {
    v--;
    result = String.fromCharCode(65 + (v % 26)) + result;
    v = Math.floor(v / 26);
  }
  return result;
}

function toRoman(n: number): string {
  if (n <= 0 || n >= 4000) return String(n);
  const map: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"],
    [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"],
    [5, "V"], [4, "IV"], [1, "I"],
  ];
  let result = "";
  let v = n;
  for (const [value, symbol] of map) {
    while (v >= value) {
      result += symbol;
      v -= value;
    }
  }
  return result;
}

const EXT_CATEGORIES: Record<string, string[]> = {
  image: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg", ".tiff", ".ico", ".heic", ".heif", ".avif"],
  video: [".mp4", ".mov", ".avi", ".mkv", ".wmv", ".flv", ".webm", ".m4v"],
  audio: [".mp3", ".wav", ".flac", ".aac", ".ogg", ".wma", ".m4a"],
  document: [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".rtf", ".odt"],
  code: [".js", ".ts", ".jsx", ".tsx", ".py", ".java", ".cpp", ".c", ".h", ".css", ".html", ".json", ".xml", ".yml", ".yaml"],
};

function getFileCategory(ext: string): string {
  const lower = ext.toLowerCase();
  for (const [cat, exts] of Object.entries(EXT_CATEGORIES)) {
    if (exts.includes(lower)) return cat;
  }
  return "other";
}

function naturalCompare(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

interface SequenceFileData {
  index: number;
  seqValue?: string;
}

/**
 * 预计算每个文件的序号数据（按 fileId 映射）。
 * 分组 → 可选排序 → 层级编号/常规编号，避免在规则链中重复计算。
 */
function computeSequenceData(
  files: FileEntry[],
  config: SequenceConfig,
): Map<string, SequenceFileData> {
  const result = new Map<string, SequenceFileData>();

  // 保留原序号：从文件名提取数字并重新格式化，提取失败的走常规编号
  if (config.preserveOriginal) {
    for (const file of files) {
      try {
        const match = file.baseName.match(new RegExp(config.preservePattern));
        if (match?.[1]) {
          const num = Number.parseInt(match[1], 10);
          if (!Number.isNaN(num) && num > 0) {
            let seqValue: string;
            switch (config.seqType) {
              case "numeric":
                seqValue = String(num).padStart(config.padding, "0");
                break;
              case "alpha":
                seqValue = toAlpha(num);
                break;
              case "roman":
                seqValue = toRoman(num);
                break;
            }
            result.set(file.id, { index: num, seqValue });
          }
        }
      } catch {
        // 正则无效则跳过
      }
    }
    return result;
  }

  // 按 scope 分组
  const groups = new Map<string, FileEntry[]>();
  for (const file of files) {
    let groupKey: string;
    switch (config.scope) {
      case "perExtension":
        groupKey = file.extension.toLowerCase();
        break;
      case "perCategory":
        groupKey = getFileCategory(file.extension);
        break;
      default:
        groupKey = "__global__";
        break;
    }
    if (!groups.has(groupKey)) groups.set(groupKey, []);
    groups.get(groupKey)!.push(file);
  }

  // 排序
  if (config.sortBeforeNumbering) {
    for (const group of groups.values()) {
      group.sort((a, b) => {
        let cmp: number;
        switch (config.sortBy) {
          case "name":
            cmp = config.naturalSort
              ? naturalCompare(a.baseName, b.baseName)
              : a.baseName.localeCompare(b.baseName);
            break;
          case "extension":
            cmp = a.extension.localeCompare(b.extension);
            break;
          default:
            cmp = 0;
        }
        return config.sortOrder === "desc" ? -cmp : cmp;
      });
    }
  }

  // 层级编号（1.1, 1.2, 2.1…）：组间递增 + 组内递增
  if (config.hierarchical && config.scope !== "global") {
    const groupKeys = [...groups.keys()].sort();
    for (let g = 0; g < groupKeys.length; g++) {
      const groupFiles = groups.get(groupKeys[g])!;
      const level1 = config.start + g * config.step;
      for (let f = 0; f < groupFiles.length; f++) {
        const level2 = config.start + f * config.step;
        let seqValue: string;
        if (config.seqType === "numeric") {
          const pad = Math.max(1, config.padding);
          seqValue = `${String(level1).padStart(pad, "0")}${config.hierarchySeparator}${String(level2).padStart(pad, "0")}`;
        } else {
          const fmt = config.seqType === "alpha" ? toAlpha : toRoman;
          seqValue = `${fmt(level1)}${config.hierarchySeparator}${fmt(level2)}`;
        }
        result.set(groupFiles[f].id, { index: f, seqValue });
      }
    }
    return result;
  }

  // 常规编号
  for (const group of groups.values()) {
    for (let i = 0; i < group.length; i++) {
      result.set(group[i].id, { index: i });
    }
  }

  return result;
}

// ── 各规则实现 ──

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function applyFindReplace(name: string, c: FindReplaceConfig): string {
  if (c.usePosition) {
    const start = c.fromEnd
      ? Math.max(0, name.length - c.positionStart - c.positionCount)
      : c.positionStart;
    const end = start + c.positionCount;
    return name.slice(0, start) + c.replace + name.slice(end);
  }
  if (!c.find) return name;
  if (c.matchAll) {
    const flags = c.caseSensitive ? "g" : "gi";
    return name.replace(new RegExp(escapeRegex(c.find), flags), c.replace);
  }
  if (c.caseSensitive) {
    const idx = name.indexOf(c.find);
    if (idx === -1) return name;
    return name.slice(0, idx) + c.replace + name.slice(idx + c.find.length);
  }
  const idx = name.toLowerCase().indexOf(c.find.toLowerCase());
  if (idx === -1) return name;
  return name.slice(0, idx) + c.replace + name.slice(idx + c.find.length);
}

function applyInsert(name: string, c: InsertConfig, context: RuleContext): string {
  if (!c.text) return name;
  const text = resolveVariables(c.text, context);
  switch (c.position) {
    case "start":
      return text + name;
    case "end":
      return name + text;
    case "index": {
      const i = Math.min(Math.max(0, c.index), name.length);
      return name.slice(0, i) + text + name.slice(i);
    }
  }
}

function applySequence(
  name: string,
  c: SequenceConfig,
  index: number,
  context: RuleContext,
  precomputedSeqValue?: string,
): string {
  let seqValue: string;
  if (precomputedSeqValue !== undefined) {
    seqValue = precomputedSeqValue;
  } else {
    const numValue = c.start + index * c.step;
    switch (c.seqType) {
      case "numeric":
        seqValue = String(numValue).padStart(c.padding, "0");
        break;
      case "alpha":
        seqValue = toAlpha(numValue);
        break;
      case "roman":
        seqValue = toRoman(numValue);
        break;
    }
  }

  if (c.template) {
    return resolveVariables(c.template.replace(/\{n\}/g, seqValue), context);
  }
  switch (c.position) {
    case "start":
      return seqValue + name;
    case "end":
      return name + seqValue;
    case "replaceAll":
      return seqValue;
  }
}

function toWords(str: string): string[] {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function applyCaseStyle(name: string, c: CaseStyleConfig): string {
  let result = name;
  switch (c.style) {
    case "spaceToDash":
      result = result.replace(/ /g, "-");
      break;
    case "spaceToUnderscore":
      result = result.replace(/ /g, "_");
      break;
    case "dashToSpace":
      result = result.replace(/-/g, " ");
      break;
    case "underscoreToSpace":
      result = result.replace(/_/g, " ");
      break;
  }
  switch (c.mode) {
    case "uppercase":
      return result.toUpperCase();
    case "lowercase":
      return result.toLowerCase();
    case "titlecase":
      return result.replace(/\b\w/g, (ch) => ch.toUpperCase());
    case "sentencecase":
      return result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
    case "camelCase": {
      const words = toWords(result);
      return words
        .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
        .join("");
    }
    case "PascalCase": {
      const words = toWords(result);
      return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
    }
    case "kebab-case": {
      const words = toWords(result);
      return words.map((w) => w.toLowerCase()).join("-");
    }
    case "snake_case": {
      const words = toWords(result);
      return words.map((w) => w.toLowerCase()).join("_");
    }
    default:
      return result;
  }
}

function applyRegex(name: string, c: RegexConfig): string {
  if (!c.pattern) return name;
  try {
    return name.replace(new RegExp(c.pattern, c.flags || "g"), c.replacement);
  } catch {
    return name;
  }
}

function applyRemoveCleanup(name: string, c: RemoveCleanupConfig): string {
  switch (c.mode) {
    case "chars": {
      const count = Math.min(c.count, name.length);
      if (count <= 0) return name;
      return c.direction === "start" ? name.slice(count) : name.slice(0, name.length - count);
    }
    case "range": {
      const start = Math.max(0, Math.min(c.rangeStart, name.length));
      const end = Math.max(start, Math.min(c.rangeEnd, name.length));
      return name.slice(0, start) + name.slice(end);
    }
    case "cleanup": {
      let result = name;
      if (c.removeDigits) result = result.replace(/\d/g, "");
      if (c.removeEnglish) result = result.replace(/[a-zA-Z]/g, "");
      if (c.removeChinese) result = result.replace(/[\u4e00-\u9fff]/g, "");
      if (c.removeSpaces) result = result.replace(/\s+/g, "");
      if (c.removeSymbols) result = result.replace(/[^\w\s\u4e00-\u9fff]/g, "");
      return result;
    }
  }
}

/** 重组：按分隔符拆分后按目标顺序重排（留空 order 为逆序） */
function applyRecombine(name: string, c: RecombineConfig): string {
  if (!c.separator) return name;
  const parts = name.split(c.separator);
  if (parts.length <= 1) return name;
  let ordered: string[];
  if (c.order.trim()) {
    ordered = c.order
      .split(/[,，\s]+/)
      .map((s) => parseInt(s, 10) - 1)
      .filter((i) => !Number.isNaN(i) && i >= 0 && i < parts.length)
      .map((i) => parts[i]);
    if (ordered.length === 0) return name;
  } else {
    ordered = [...parts].reverse();
  }
  return ordered.join(c.joinWith || c.separator);
}

/** 片段：按字符位置提取多段后拼接 */
function applySlice(name: string, c: SliceConfig): string {
  if (c.segments.length === 0) return name;
  const parts = c.segments.map((seg) => {
    const start = Math.max(0, Math.min(seg.start, name.length));
    const end = Math.max(start, Math.min(seg.start + Math.max(0, seg.length), name.length));
    return name.slice(start, end);
  });
  return parts.join(c.joinWith);
}

/** 随机：按字符集生成长度为 length 的随机串，插到开头或结尾 */
function applyRandom(name: string, c: RandomConfig): string {
  const length = Math.max(0, c.length);
  if (length === 0) return name;
  let pool: string;
  switch (c.charset) {
    case "digits":
      pool = "0123456789";
      break;
    case "letters":
      pool = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      break;
    case "custom":
      pool = c.customChars || "abcdefghijklmnopqrstuvwxyz";
      break;
    default:
      pool = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }
  let randomPart = "";
  for (let i = 0; i < length; i++) {
    randomPart += pool[Math.floor(Math.random() * pool.length)];
  }
  return c.position === "start" ? randomPart + name : name + randomPart;
}

/** 映射：按 entries 逐条做包含替换（from → to） */
function applyMapList(name: string, c: MapListConfig): string {
  let result = name;
  for (const entry of c.entries) {
    if (!entry.from) continue;
    result = result.split(entry.from).join(entry.to);
  }
  return result;
}

// ── 入口 ──

export function applyRule(
  rule: RenameRule,
  name: string,
  ext: string,
  index: number,
  context: RuleContext,
  precomputedSeqValue?: string,
): string {
  if (!rule.enabled) return name;
  const { ruleConfig } = rule;
  switch (ruleConfig.type) {
    case "findReplace":
      return applyFindReplace(name, ruleConfig.config);
    case "insert":
      return applyInsert(name, ruleConfig.config, context);
    case "sequence":
      return applySequence(name, ruleConfig.config, index, context, precomputedSeqValue);
    case "caseStyle":
      return applyCaseStyle(name, ruleConfig.config);
    case "regex":
      return applyRegex(name, ruleConfig.config);
    case "removeCleanup":
      return applyRemoveCleanup(name, ruleConfig.config);
    case "recombine":
      return applyRecombine(name, ruleConfig.config);
    case "slice":
      return applySlice(name, ruleConfig.config);
    case "random":
      return applyRandom(name, ruleConfig.config);
    case "mapList":
      return applyMapList(name, ruleConfig.config);
  }
}

// ── 文件名校验 ──

function hasInvalidFileNameChars(name: string): boolean {
  if (/[<>:"/\\|?*]/.test(name)) return true;
  for (const ch of name) {
    if (ch.charCodeAt(0) <= 31) return true;
  }
  return false;
}

function getFilenameError(fullName: string, editablePart = fullName): PreviewResult["error"] {
  const trimmedFullName = fullName.trim();
  const trimmedEditablePart = editablePart.trim();
  if (
    trimmedFullName === "" ||
    trimmedFullName === "." ||
    trimmedEditablePart === ""
  ) {
    return "empty";
  }
  if (hasInvalidFileNameChars(fullName)) {
    return "illegal";
  }
  return undefined;
}

// ── 预览计算 ──

export function computePreview(
  files: FileEntry[],
  rules: RenameRule[],
  extensionScope: ExtensionScope,
): PreviewResult[] {
  const selectedFiles = files.filter((f) => f.selected);
  const results: PreviewResult[] = [];
  // 冲突 key = 新文件名（ZIP 模式下全部文件在同一目录）
  const nameCount = new Map<string, number>();
  const conflictKeys: string[] = [];

  // 预计算各序号规则的序号数据
  const sequenceDataMap = new Map<string, Map<string, SequenceFileData>>();
  for (const rule of rules) {
    if (!rule.enabled || rule.ruleConfig.type !== "sequence") continue;
    const seqConfig = rule.ruleConfig.config as SequenceConfig;
    sequenceDataMap.set(rule.id, computeSequenceData(selectedFiles, seqConfig));
  }

  const applyRuleWithSeqData = (
    rule: RenameRule,
    currentName: string,
    ext: string,
    globalIndex: number,
    fileId: string,
    context: RuleContext,
  ): string => {
    let effectiveIndex = globalIndex;
    let precomputedSeqValue: string | undefined;
    if (rule.ruleConfig.type === "sequence" && sequenceDataMap.has(rule.id)) {
      const fileData = sequenceDataMap.get(rule.id)!.get(fileId);
      if (fileData) {
        effectiveIndex = fileData.index;
        precomputedSeqValue = fileData.seqValue;
      }
    }
    return applyRule(rule, currentName, ext, effectiveIndex, context, precomputedSeqValue);
  };

  for (let i = 0; i < selectedFiles.length; i++) {
    const file = selectedFiles[i];
    let name: string;
    let ext: string;

    const context: RuleContext = {
      index: i,
      ext: file.extension,
      originalName: file.baseName,
      currentName: file.baseName,
    };

    switch (extensionScope) {
      case "name":
        name = file.baseName;
        ext = file.extension;
        for (const rule of rules) {
          name = applyRuleWithSeqData(rule, name, ext, i, file.id, context);
          context.currentName = name;
        }
        break;
      case "extension":
        name = file.baseName;
        ext = file.extension.startsWith(".") ? file.extension.slice(1) : file.extension;
        for (const rule of rules) {
          ext = applyRuleWithSeqData(rule, ext, "", i, file.id, context);
          context.currentName = ext;
        }
        ext = ext ? `.${ext}` : "";
        break;
      case "full":
        name = file.name;
        ext = "";
        for (const rule of rules) {
          name = applyRuleWithSeqData(rule, name, file.extension, i, file.id, context);
          context.currentName = name;
        }
        break;
    }

    const fullName = extensionScope === "full" ? name : name + ext;
    const validationTarget = extensionScope === "name" ? name : fullName;
    nameCount.set(fullName, (nameCount.get(fullName) || 0) + 1);
    conflictKeys.push(fullName);
    results.push({
      fileId: file.id,
      original: file.name,
      newName: fullName,
      hasChange: fullName !== file.name,
      conflict: !!getFilenameError(fullName, validationTarget),
      error: getFilenameError(fullName, validationTarget),
    });
  }

  // 标记同名冲突
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    if ((nameCount.get(conflictKeys[i]) || 0) > 1) {
      r.conflict = true;
    }
    const err = getFilenameError(r.newName);
    if (err) {
      r.conflict = true;
      r.error = err;
    }
  }

  return results;
}

/** 自动修复冲突：追加 " (1)"、"(2)" 后缀 */
export function autoFixConflicts(results: PreviewResult[]): PreviewResult[] {
  const conflictGroups = new Map<string, PreviewResult[]>();
  for (const result of results) {
    if (!result.conflict || result.error) continue;
    if (!conflictGroups.has(result.newName)) {
      conflictGroups.set(result.newName, []);
    }
    conflictGroups.get(result.newName)!.push(result);
  }

  const fixedResults = results.map((r) => ({ ...r }));

  for (const group of conflictGroups.values()) {
    if (group.length <= 1) continue;
    // 第一个保留原名，其余追加 (1)、(2)…
    for (let i = 1; i < group.length; i++) {
      const fixed = fixedResults.find((fr) => fr.fileId === group[i].fileId);
      if (!fixed) continue;
      const lastDot = fixed.newName.lastIndexOf(".");
      const ext = lastDot > 0 ? fixed.newName.slice(lastDot) : "";
      const base = lastDot > 0 ? fixed.newName.slice(0, lastDot) : fixed.newName;
      fixed.newName = `${base} (${i})${ext}`;
      fixed.hasChange = fixed.newName !== fixed.original;
      fixed.conflict = false;
      fixed.error = undefined;
    }
  }

  return fixedResults;
}
