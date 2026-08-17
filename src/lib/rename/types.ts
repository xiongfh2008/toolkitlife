/**
 * 批量重命名规则引擎的类型定义。
 * 设计参考 Rename.Tools（AGPL-3.0，仅借鉴设计，代码自研）。
 */

export interface FileEntry {
  id: string;
  /** 完整文件名（含扩展名） */
  name: string;
  /** 不含扩展名的文件名 */
  baseName: string;
  /** 扩展名（含点），如 ".jpg" */
  extension: string;
  /** 原始 File 对象，用于打包下载 */
  file: File;
  selected: boolean;
}

export interface RuleContext {
  /** 全局序号（从 0 开始） */
  index: number;
  /** 当前处理的扩展名（含点） */
  ext: string;
  /** 原始文件名（不含扩展名） */
  originalName: string;
  /** 当前规则链处理后的名称，供模板变量 {name} 使用 */
  currentName?: string;
}

/** 规则链作用于文件名的哪一部分 */
export type ExtensionScope = "name" | "extension" | "full";

export type RuleType =
  | "findReplace"
  | "insert"
  | "sequence"
  | "caseStyle"
  | "regex"
  | "removeCleanup"
  | "recombine"
  | "slice"
  | "random"
  | "mapList";

export interface FindReplaceConfig {
  find: string;
  replace: string;
  caseSensitive: boolean;
  matchAll: boolean;
  /** 按位置替换 */
  usePosition: boolean;
  fromEnd: boolean;
  positionStart: number;
  positionCount: number;
}

export interface InsertConfig {
  text: string;
  position: "start" | "end" | "index";
  index: number;
}

export interface SequenceConfig {
  seqType: "numeric" | "alpha" | "roman";
  start: number;
  step: number;
  /** 数字补零位数 */
  padding: number;
  position: "start" | "end" | "replaceAll";
  /** 模板，如 "image_{n}"；为空时按 position 拼接 */
  template: string;
  /** 序号分组范围 */
  scope: "global" | "perExtension" | "perCategory";
  /** 编号前是否排序 */
  sortBeforeNumbering: boolean;
  sortBy: "name" | "size" | "modified" | "extension";
  sortOrder: "asc" | "desc";
  naturalSort: boolean;
  /** 保留原文件名中的数字 */
  preserveOriginal: boolean;
  preservePattern: string;
  hierarchical: boolean;
  hierarchySeparator: string;
}

export interface CaseStyleConfig {
  mode:
    | "uppercase"
    | "lowercase"
    | "titlecase"
    | "sentencecase"
    | "camelCase"
    | "PascalCase"
    | "kebab-case"
    | "snake_case"
    | "none";
  style: "none" | "spaceToDash" | "spaceToUnderscore" | "dashToSpace" | "underscoreToSpace";
}

export interface RegexConfig {
  pattern: string;
  replacement: string;
  flags: string;
}

export interface RemoveCleanupConfig {
  mode: "chars" | "range" | "cleanup";
  direction: "start" | "end";
  count: number;
  rangeStart: number;
  rangeEnd: number;
  removeDigits: boolean;
  removeSymbols: boolean;
  removeSpaces: boolean;
  removeChinese: boolean;
  removeEnglish: boolean;
}

export interface RecombineConfig {
  /** 拆分分隔符，如 "-" */
  separator: string;
  /** 重排后使用的连接符；留空则沿用分隔符 */
  joinWith: string;
  /** 目标顺序（1 起逗号分隔），如 "3,1,2"；留空表示逆序 */
  order: string;
}

export interface SliceSegment {
  start: number;
  length: number;
}

export interface SliceConfig {
  /** 按顺序提取的多段片段 */
  segments: SliceSegment[];
  /** 片段之间的连接符 */
  joinWith: string;
}

export interface RandomConfig {
  charset: "digits" | "letters" | "alphanumeric" | "custom";
  customChars: string;
  length: number;
  position: "start" | "end";
}

export interface MapListConfig {
  /** 从 → 到 的映射条目 */
  entries: { from: string; to: string }[];
}

export type RuleConfig =
  | { type: "findReplace"; config: FindReplaceConfig }
  | { type: "insert"; config: InsertConfig }
  | { type: "sequence"; config: SequenceConfig }
  | { type: "caseStyle"; config: CaseStyleConfig }
  | { type: "regex"; config: RegexConfig }
  | { type: "removeCleanup"; config: RemoveCleanupConfig }
  | { type: "recombine"; config: RecombineConfig }
  | { type: "slice"; config: SliceConfig }
  | { type: "random"; config: RandomConfig }
  | { type: "mapList"; config: MapListConfig };

export interface RenameRule {
  id: string;
  enabled: boolean;
  ruleConfig: RuleConfig;
}

export interface PreviewResult {
  fileId: string;
  original: string;
  newName: string;
  hasChange: boolean;
  conflict: boolean;
  error?: "empty" | "illegal";
}

/** 各规则的默认配置工厂 */
export function getDefaultConfig(type: RuleType): RuleConfig {
  switch (type) {
    case "findReplace":
      return {
        type,
        config: {
          find: "",
          replace: "",
          caseSensitive: false,
          matchAll: true,
          usePosition: false,
          fromEnd: false,
          positionStart: 0,
          positionCount: 1,
        },
      };
    case "insert":
      return { type, config: { text: "", position: "start", index: 0 } };
    case "sequence":
      return {
        type,
        config: {
          seqType: "numeric",
          start: 1,
          step: 1,
          padding: 3,
          position: "start",
          template: "",
          scope: "global",
          sortBeforeNumbering: false,
          sortBy: "name",
          sortOrder: "asc",
          naturalSort: true,
          preserveOriginal: false,
          preservePattern: "(\\d+)",
          hierarchical: false,
          hierarchySeparator: ".",
        },
      };
    case "caseStyle":
      return { type, config: { mode: "lowercase", style: "none" } };
    case "regex":
      return { type, config: { pattern: "", replacement: "", flags: "g" } };
    case "removeCleanup":
      return {
        type,
        config: {
          mode: "chars",
          direction: "start",
          count: 1,
          rangeStart: 0,
          rangeEnd: 1,
          removeDigits: false,
          removeSymbols: false,
          removeSpaces: false,
          removeChinese: false,
          removeEnglish: false,
        },
      };
    case "recombine":
      return { type, config: { separator: "-", joinWith: "-", order: "" } };
    case "slice":
      return { type, config: { segments: [{ start: 0, length: 4 }], joinWith: "" } };
    case "random":
      return { type, config: { charset: "alphanumeric", customChars: "", length: 4, position: "end" } };
    case "mapList":
      return { type, config: { entries: [] } };
  }
}
