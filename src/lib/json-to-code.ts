/**
 * Shared JSON → source-code generator core.
 *
 * Pipeline:
 *   1. `infer` walks the sample JSON and builds a "raw" type tree
 *      (objects, arrays, maps, scalars) merging sibling/array-element shapes.
 *      Depth is capped (MAX_DEPTH) and array merging samples the first
 *      MAX_ARRAY_SAMPLE elements so pathological inputs stay cheap.
 *   2. `buildModel` assigns unique PascalCase type names (first-seen order).
 *   3. Per-language emitters turn the model into source code.
 *
 * Everything runs client-side with zero dependencies.
 */

export type CodeLang =
  | "typescript"
  | "go"
  | "java"
  | "python"
  | "kotlin"
  | "csharp"
  | "rust";

export interface GenerateResult {
  code: string;
  /** Fixed token ("invalid-json") so callers can show a localized message. */
  error?: string;
  /** Raw parser message with line/column, shown next to the localized error. */
  detail?: string;
}

const MAX_DEPTH = 50;
const MAX_ARRAY_SAMPLE = 50;

/* ------------------------------------------------------------------ */
/* Raw inference model                                                 */
/* ------------------------------------------------------------------ */

type ScalarKind = "string" | "int" | "float" | "bool" | "null" | "unknown";

type RawType =
  | { kind: ScalarKind }
  | { kind: "object"; fields: RawField[] }
  | { kind: "map"; value: RawType }
  | { kind: "array"; element: RawType };

interface RawField {
  key: string;
  /** Absent in some merged shape, or an explicit null was observed. */
  optional: boolean;
  /** An explicit null was observed for this key. */
  nullable: boolean;
  type: RawType;
}

/** Keys that are valid identifiers in every target language family. */
const VALID_KEY_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

function infer(value: unknown, depth = 0): RawType {
  if (depth > MAX_DEPTH) return { kind: "unknown" };
  if (value === null || value === undefined) return { kind: "null" };
  if (Array.isArray(value)) {
    const sample = value.slice(0, MAX_ARRAY_SAMPLE);
    if (sample.length === 0) return { kind: "array", element: { kind: "unknown" } };
    let element = infer(sample[0], depth + 1);
    for (let i = 1; i < sample.length; i++) {
      element = mergeRaw(element, infer(sample[i], depth + 1));
    }
    return { kind: "array", element };
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    // Empty objects and objects with heterogeneous / unsafe keys become maps.
    if (entries.length === 0) return { kind: "map", value: { kind: "unknown" } };
    if (!entries.every(([k]) => VALID_KEY_RE.test(k))) {
      let v: RawType = { kind: "unknown" };
      for (const [, val] of entries) v = mergeRaw(v, infer(val, depth + 1));
      return { kind: "map", value: v };
    }
    return {
      kind: "object",
      fields: entries.map(([key, val]) => ({
        key,
        optional: val === null || val === undefined,
        nullable: val === null,
        type: infer(val, depth + 1),
      })),
    };
  }
  if (typeof value === "string") return { kind: "string" };
  if (typeof value === "boolean") return { kind: "bool" };
  if (typeof value === "number") {
    return Number.isInteger(value) ? { kind: "int" } : { kind: "float" };
  }
  return { kind: "unknown" };
}

function unifyScalars(a: ScalarKind, b: ScalarKind): ScalarKind {
  if (a === b) return a;
  if (a === "null") return b;
  if (b === "null") return a;
  if (a === "unknown") return b;
  if (b === "unknown") return a;
  if ((a === "int" && b === "float") || (a === "float" && b === "int")) return "float";
  return "unknown";
}

const isScalarKind = (k: string): k is ScalarKind =>
  k === "string" || k === "int" || k === "float" || k === "bool" || k === "null" || k === "unknown";

/** Merge two inferred shapes (array elements, optional siblings, null+value). */
function mergeRaw(a: RawType, b: RawType): RawType {
  if (a.kind === "null") return b;
  if (b.kind === "null") return a;
  if (a.kind === "unknown") return b;
  if (b.kind === "unknown") return a;
  if (a.kind === "object" && b.kind === "object") {
    return { kind: "object", fields: mergeFields(a.fields, b.fields) };
  }
  if (a.kind === "array" && b.kind === "array") {
    return { kind: "array", element: mergeRaw(a.element, b.element) };
  }
  if (a.kind === "map" && b.kind === "map") {
    return { kind: "map", value: mergeRaw(a.value, b.value) };
  }
  if (isScalarKind(a.kind) && isScalarKind(b.kind)) {
    return { kind: unifyScalars(a.kind, b.kind) };
  }
  // Mixed shapes (e.g. object vs string) collapse to unknown.
  return { kind: "unknown" };
}

/** Union of two object shapes; fields missing on one side become optional. */
function mergeFields(a: RawField[], b: RawField[]): RawField[] {
  const out: RawField[] = a.map((f) => ({ ...f }));
  for (const bf of b) {
    const existing = out.find((f) => f.key === bf.key);
    if (existing) {
      existing.type = mergeRaw(existing.type, bf.type);
      existing.optional = existing.optional || bf.optional;
      existing.nullable = existing.nullable || bf.nullable;
    } else {
      out.push({ key: bf.key, optional: true, nullable: bf.nullable, type: bf.type });
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Named model                                                         */
/* ------------------------------------------------------------------ */

type ModelTypeRef =
  | { kind: ScalarKind }
  | { kind: "object"; ref: string }
  | { kind: "map"; value: ModelTypeRef }
  | { kind: "array"; element: ModelTypeRef };

interface ModelField {
  key: string; // original JSON key
  optional: boolean;
  nullable: boolean;
  type: ModelTypeRef;
}

interface ModelType {
  name: string; // unique PascalCase type name
  fields: ModelField[];
}

interface Model {
  rootName: string;
  root: ModelTypeRef;
  types: ModelType[]; // first-seen order
}

/* ---- naming helpers ---- */

function pascalName(s: string): string {
  const words = s.split(/[^A-Za-z0-9]+/).filter(Boolean);
  if (words.length === 0) return "";
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
}

function camelName(s: string): string {
  const words = s.split(/[^A-Za-z0-9]+/).filter(Boolean);
  if (words.length === 0) return "";
  const first = words[0].charAt(0).toLowerCase() + words[0].slice(1);
  return first + words.slice(1).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
}

function toSnake(s: string): string {
  let out = s.replace(/[^A-Za-z0-9]+/g, "_");
  out = out.replace(/([a-z0-9])([A-Z])/g, "$1_$2");
  out = out.replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2");
  out = out.toLowerCase().replace(/_+/g, "_").replace(/^_+|_+$/g, "");
  if (!out) return "field";
  if (/^[0-9]/.test(out)) return "_" + out;
  return out;
}

function sanitizeRootName(raw: string): string {
  let name = pascalName(raw);
  if (/^[0-9]/.test(name)) name = "Root" + name;
  return name || "Root";
}

function uniqueIn(used: Set<string>, base: string): string {
  if (base && !used.has(base)) {
    used.add(base);
    return base;
  }
  const safeBase = base || "Field";
  let n = 2;
  let name = safeBase + n;
  while (used.has(name)) {
    n++;
    name = safeBase + n;
  }
  used.add(name);
  return name;
}

function buildModel(root: RawType, rootName: string): Model {
  const types: ModelType[] = [];
  const used = new Set<string>();
  // A non-object root reserves its name for the alias/wrapper declaration.
  if (root.kind !== "object") used.add(rootName);

  const convert = (
    node: RawType,
    parent: string | null,
    key: string,
    pendingBase: string | null
  ): ModelTypeRef => {
    if (node.kind === "object") {
      const name = uniqueIn(used, pendingBase ?? (parent ?? "Root") + pascalName(key));
      const mt: ModelType = { name, fields: [] };
      types.push(mt);
      for (const f of node.fields) {
        mt.fields.push({
          key: f.key,
          optional: f.optional,
          nullable: f.nullable,
          type: convert(f.type, name, f.key, null),
        });
      }
      return { kind: "object", ref: name };
    }
    if (node.kind === "array") {
      return { kind: "array", element: convert(node.element, parent, key, pendingBase) };
    }
    if (node.kind === "map") {
      return { kind: "map", value: convert(node.value, parent, key, pendingBase) };
    }
    return { kind: node.kind };
  };

  const rootBase = root.kind === "object" ? rootName : rootName + "Item";
  const rootRef = convert(root, null, rootName, rootBase);
  return { rootName, root: rootRef, types };
}

interface ModelKinds {
  kinds: Set<string>;
  anyOptional: boolean;
}

function collectKinds(model: Model): ModelKinds {
  const kinds = new Set<string>();
  let anyOptional = false;
  const walk = (t: ModelTypeRef): void => {
    // "null" maps to the language's any/unknown bucket for imports.
    kinds.add(t.kind === "null" ? "unknown" : t.kind);
    if (t.kind === "array") walk(t.element);
    if (t.kind === "map") walk(t.value);
  };
  walk(model.root);
  for (const ty of model.types) {
    for (const f of ty.fields) {
      if (f.optional) anyOptional = true;
      walk(f.type);
    }
  }
  return { kinds, anyOptional };
}

/* ------------------------------------------------------------------ */
/* Reserved words                                                      */
/* ------------------------------------------------------------------ */

const JAVA_KEYWORDS = new Set([
  "abstract", "assert", "boolean", "break", "byte", "case", "catch", "char",
  "class", "const", "continue", "default", "do", "double", "else", "enum",
  "extends", "final", "finally", "float", "for", "goto", "if", "implements",
  "import", "instanceof", "int", "interface", "long", "native", "new",
  "package", "permits", "private", "protected", "public", "record", "return",
  "sealed", "short", "static", "strictfp", "super", "switch", "synchronized",
  "this", "throw", "throws", "transient", "try", "var", "void", "volatile",
  "while", "yield", "true", "false", "null",
]);

const KOTLIN_KEYWORDS = new Set([
  "as", "break", "class", "continue", "data", "do", "else", "false", "for",
  "fun", "if", "in", "interface", "is", "null", "object", "package", "return",
  "super", "this", "throw", "true", "try", "typealias", "typeof", "val",
  "var", "when", "while",
]);

const PYTHON_KEYWORDS = new Set([
  "and", "as", "assert", "async", "await", "break", "class", "continue",
  "def", "del", "elif", "else", "except", "finally", "for", "from", "global",
  "if", "import", "in", "is", "lambda", "nonlocal", "not", "or", "pass",
  "raise", "return", "try", "while", "with", "yield",
]);

const RUST_KEYWORDS = new Set([
  "abstract", "as", "async", "await", "become", "box", "break", "const",
  "continue", "crate", "do", "dyn", "else", "enum", "extern", "false",
  "final", "fn", "for", "gen", "if", "impl", "in", "let", "loop", "macro",
  "match", "mod", "move", "mut", "override", "priv", "pub", "ref", "return",
  "self", "static", "struct", "super", "trait", "true", "try", "type",
  "typeof", "union", "unsafe", "unsized", "use", "virtual", "where", "while",
  "yield",
]);

/** Go / C# emit PascalCase members, which can never collide with lowercase keywords. */

/* ------------------------------------------------------------------ */
/* TypeScript emitter                                                  */
/* ------------------------------------------------------------------ */

function emitTypeScript(model: Model): string {
  const typeRef = (t: ModelTypeRef): string => {
    switch (t.kind) {
      case "string":
        return "string";
      case "int":
      case "float":
        return "number";
      case "bool":
        return "boolean";
      case "null":
        return "null";
      case "unknown":
        return "unknown";
      case "object":
        return t.ref;
      case "array":
        return typeRef(t.element) + "[]";
      case "map":
        return `Record<string, ${typeRef(t.value)}>`;
    }
  };

  const lines: string[] = [];
  for (const ty of model.types) {
    if (lines.length) lines.push("");
    lines.push(`export interface ${ty.name} {`);
    for (const f of ty.fields) {
      const key = VALID_KEY_RE.test(f.key) ? f.key : JSON.stringify(f.key);
      const base = typeRef(f.type);
      const type =
        f.nullable && base !== "null" ? `${base} | null` : base;
      lines.push(`  ${key}${f.optional ? "?" : ""}: ${type};`);
    }
    lines.push("}");
  }
  if (model.root.kind !== "object") {
    if (lines.length) lines.push("");
    lines.push(`export type ${model.rootName} = ${typeRef(model.root)};`);
  }
  return lines.join("\n");
}

/* ------------------------------------------------------------------ */
/* Go emitter                                                          */
/* ------------------------------------------------------------------ */

function emitGo(model: InternalModel): string {
  const baseType = (t: ModelTypeRef): string => {
    switch (t.kind) {
      case "string":
        return "string";
      case "int":
        return "int";
      case "float":
        return "float64";
      case "bool":
        return "bool";
      case "null":
      case "unknown":
        return "interface{}";
      case "object":
        return t.ref;
      case "array":
        return "[]" + baseType(t.element);
      case "map":
        return "map[string]" + baseType(t.value);
    }
  };

  const goQuote = (s: string): string =>
    '"' + s.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';

  const goTag = (key: string, omitempty: boolean): string => {
    const content = `json:${goQuote(key + (omitempty ? ",omitempty" : ""))}`;
    return content.includes("`")
      ? '"' + content.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"'
      : "`" + content + "`";
  };

  const structLines = (ty: ModelType): string[] => {
    const names: string[] = [];
    const gtypes: string[] = [];
    const tags: string[] = [];
    const used = new Set<string>();
    for (const f of ty.fields) {
      const base = baseType(f.type);
      const isContainer = f.type.kind === "array" || f.type.kind === "map";
      const gtype =
        f.optional && !isContainer && base !== "interface{}" ? "*" + base : base;
      let name = pascalName(f.key);
      if (/^[0-9]/.test(name)) name = "F" + name;
      name = uniqueIn(used, name);
      names.push(name);
      gtypes.push(gtype);
      tags.push(goTag(f.key, f.optional));
    }
    const nameW = Math.max(...names.map((n) => n.length), 1);
    const typeW = Math.max(...gtypes.map((t) => t.length), 1);
    const out = [`type ${ty.name} struct {`];
    names.forEach((n, i) => {
      out.push(`\t${n.padEnd(nameW)} ${gtypes[i].padEnd(typeW)} ${tags[i]}`);
    });
    out.push("}");
    return out;
  };

  const out: string[] = [`package ${model.packageName ?? "main"}`, ""];
  const blocks: string[][] = [];
  if (model.root.kind !== "object") {
    blocks.push([`type ${model.rootName} ${baseType(model.root)}`]);
  }
  for (const ty of model.types) blocks.push(structLines(ty));
  out.push(...joinBlocks(blocks));
  return out.join("\n");
}

/* ------------------------------------------------------------------ */
/* Java emitter                                                        */
/* ------------------------------------------------------------------ */

function javaFieldName(key: string, used: Set<string>): { name: string; renamed: boolean } {
  let name = key;
  if (!VALID_KEY_RE.test(key) || JAVA_KEYWORDS.has(key)) {
    name = camelName(key);
    if (!name || /^[0-9]/.test(name)) name = "field" + pascalName(key);
    if (JAVA_KEYWORDS.has(name)) name = name + "Value";
  }
  name = uniqueIn(used, name);
  return { name, renamed: name !== key };
}

function emitJava(model: Model): string {
  const { kinds } = collectKinds(model);

  const typeRef = (t: ModelTypeRef, optional: boolean): string => {
    // Primitives must always be boxed inside generics (List<int> is illegal).
    switch (t.kind) {
      case "string":
        return "String";
      case "int":
        return optional ? "Integer" : "int";
      case "float":
        return optional ? "Double" : "double";
      case "bool":
        return optional ? "Boolean" : "boolean";
      case "null":
      case "unknown":
        return "Object";
      case "object":
        return t.ref;
      case "array":
        return `List<${typeRef(t.element, true)}>`;
      case "map":
        return `Map<String, ${typeRef(t.value, true)}>`;
    }
  };

  const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

  const buildClass = (ty: ModelType): string[] => {
    const used = new Set<string>();
    const entries = ty.fields.map((f) => {
      const { name, renamed } = javaFieldName(f.key, used);
      return { f, name, renamed };
    });

    const out: string[] = [`public class ${ty.name} {`];
    for (const e of entries) {
      if (e.renamed) out.push(`    @JsonProperty(${JSON.stringify(e.f.key)})`);
      out.push(`    private ${typeRef(e.f.type, e.f.optional)} ${e.name};`);
    }
    for (const e of entries) {
      const T = typeRef(e.f.type, e.f.optional);
      const getterPrefix = T === "boolean" ? "is" : "get";
      out.push("");
      out.push(`    public ${T} ${getterPrefix}${cap(e.name)}() {`);
      out.push(`        return ${e.name};`);
      out.push("    }");
      out.push("");
      out.push(`    public void set${cap(e.name)}(${T} ${e.name}) {`);
      out.push(`        this.${e.name} = ${e.name};`);
      out.push("    }");
    }
    out.push("}");
    return out;
  };

  const needsJackson =
    model.types.some((ty) => ty.fields.some((f) => javaFieldName(f.key, new Set()).renamed));

  const imports: string[] = [];
  if (needsJackson) imports.push("import com.fasterxml.jackson.annotation.JsonProperty;");
  if (kinds.has("array")) imports.push("import java.util.List;");
  if (kinds.has("map")) imports.push("import java.util.Map;");

  const lines: string[] = [...imports];
  if (imports.length) lines.push("");

  const emitRootWrapper = (): void => {
    const T = typeRef(model.root, false);
    lines.push(`public class ${model.rootName} {`);
    lines.push(`    private ${T} value;`);
    lines.push("");
    lines.push(`    public ${T} getValue() {`);
    lines.push("        return value;");
    lines.push("    }");
    lines.push("");
    lines.push(`    public void setValue(${T} value) {`);
    lines.push("        this.value = value;");
    lines.push("    }");
    lines.push("}");
  };

  if (model.root.kind !== "object") emitRootWrapper();
  model.types.forEach((ty) => {
    if (lines.length && lines[lines.length - 1] !== "") lines.push("");
    lines.push(...buildClass(ty));
  });
  return lines.join("\n");
}

/* ------------------------------------------------------------------ */
/* Python emitter                                                      */
/* ------------------------------------------------------------------ */

function emitPython(model: Model): string {
  const { kinds, anyOptional } = collectKinds(model);
  const { rootName, root } = model;

  const typeRef = (t: ModelTypeRef, optional: boolean): string => {
    const inner = (() => {
      switch (t.kind) {
        case "string":
          return "str";
        case "int":
          return "int";
        case "float":
          return "float";
        case "bool":
          return "bool";
        case "null":
        case "unknown":
          return "Any";
        case "object":
          return t.ref;
        case "array":
          return `List[${typeRef(t.element, false)}]`;
        case "map":
          return `Dict[str, ${typeRef(t.value, false)}]`;
      }
    })();
    return optional ? `Optional[${inner}]` : inner;
  };

  const classBlock = (ty: ModelType): string[] => {
    const used = new Set<string>();
    const entries = ty.fields.map((f) => {
      let name = toSnake(f.key);
      if (PYTHON_KEYWORDS.has(name)) name = name + "_";
      name = uniqueIn(used, name);
      return { f, name };
    });
    // Dataclasses require defaulted fields after non-defaulted ones.
    const required = entries.filter((e) => !e.f.optional);
    const optional = entries.filter((e) => e.f.optional);
    const out: string[] = ["@dataclass", `class ${ty.name}:`];
    if (entries.length === 0) out.push("    pass");
    for (const e of required) {
      out.push(`    ${e.name}: ${typeRef(e.f.type, false)}`);
    }
    for (const e of optional) {
      out.push(`    ${e.name}: ${typeRef(e.f.type, true)} = field(default=None)`);
    }
    return out;
  };

  const typingImports: string[] = [];
  if (kinds.has("unknown")) typingImports.push("Any");
  if (kinds.has("map")) typingImports.push("Dict");
  if (kinds.has("array") || root.kind === "array") typingImports.push("List");
  if (anyOptional) typingImports.push("Optional");

  const lines: string[] = [];
  lines.push(
    anyOptional ? "from dataclasses import dataclass, field" : "from dataclasses import dataclass"
  );
  if (typingImports.length) lines.push(`from typing import ${typingImports.join(", ")}`);
  lines.push("");

  const blocks: string[][] = [];
  if (root.kind !== "object") blocks.push([`${rootName} = ${typeRef(root, false)}`]);
  for (const ty of model.types) blocks.push(classBlock(ty));

  return lines.join("\n") + "\n\n" + blocks.map((b) => b.join("\n")).join("\n\n");
}

/* ------------------------------------------------------------------ */
/* Kotlin emitter                                                      */
/* ------------------------------------------------------------------ */

const sameIgnoringCase = (a: string, b: string): boolean => a.toLowerCase() === b.toLowerCase();

function emitKotlin(model: Model): string {
  const typeRef = (t: ModelTypeRef, optional: boolean): string => {
    const inner = (() => {
      switch (t.kind) {
        case "string":
          return "String";
        case "int":
          return "Int";
        case "float":
          return "Double";
        case "bool":
          return "Boolean";
        case "null":
        case "unknown":
          return "Any";
        case "object":
          return t.ref;
        case "array":
          return `List<${typeRef(t.element, false)}>`;
        case "map":
          return `Map<String, ${typeRef(t.value, false)}>`;
      }
    })();
    return optional ? inner + "?" : inner;
  };

  const kotlinField = (key: string, used: Set<string>): string => {
    let name = key;
    if (!VALID_KEY_RE.test(key) || KOTLIN_KEYWORDS.has(key)) {
      name = camelName(key);
      if (!name || /^[0-9]/.test(name)) name = "field" + pascalName(key);
      if (KOTLIN_KEYWORDS.has(name)) name = name + "Value";
    }
    return uniqueIn(used, name);
  };

  const fieldBlocks = model.types.map((ty) => {
    const used = new Set<string>();
    const entries = ty.fields.map((f) => {
      const name = kotlinField(f.key, used);
      return { f, name, renamed: !sameIgnoringCase(name, f.key) };
    });
    const out: string[] = [`data class ${ty.name}(`];
    entries.forEach((e, i) => {
      const tail = i === entries.length - 1 ? "" : ",";
      const def = e.f.optional ? " = null" : "";
      if (e.renamed) out.push(`    @JsonProperty(${JSON.stringify(e.f.key)})`);
      out.push(`    val ${e.name}: ${typeRef(e.f.type, e.f.optional)}${def}${tail}`);
    });
    out.push(")");
    return out;
  });

  const needsJackson = model.types.some((ty) => {
    const used = new Set<string>();
    return ty.fields.some((f) => !sameIgnoringCase(kotlinField(f.key, used), f.key));
  });

  const lines: string[] = [];
  if (needsJackson) {
    lines.push("import com.fasterxml.jackson.annotation.JsonProperty", "");
  }
  if (model.root.kind !== "object") {
    lines.push(`typealias ${model.rootName} = ${typeRef(model.root, false)}`);
    if (fieldBlocks.length) lines.push("");
  }
  lines.push(...joinBlocks(fieldBlocks));
  return lines.join("\n");
}

/* ------------------------------------------------------------------ */
/* C# emitter                                                          */
/* ------------------------------------------------------------------ */

function emitCSharp(model: Model): string {
  const { kinds } = collectKinds(model);

  const typeRef = (t: ModelTypeRef, optional: boolean): string => {
    const inner = (() => {
      switch (t.kind) {
        case "string":
          return "string";
        case "int":
          return "int";
        case "float":
          return "double";
        case "bool":
          return "bool";
        case "null":
        case "unknown":
          return "object";
        case "object":
          return t.ref;
        case "array":
          return `List<${typeRef(t.element, false)}>`;
        case "map":
          return `Dictionary<string, ${typeRef(t.value, false)}>`;
      }
    })();
    return optional ? inner + "?" : inner;
  };

  let needsNewtonsoft = false;
  const classBlocks = model.types.map((ty) => {
    const used = new Set<string>();
    const entries = ty.fields.map((f) => {
      let name = pascalName(f.key);
      if (/^[0-9]/.test(name)) name = "Field" + name;
      name = uniqueIn(used, name);
      // Serializers match camelCase → PascalCase automatically; an attribute is
      // only needed when the key differs beyond casing (e.g. snake_case).
      return { f, name, renamed: !sameIgnoringCase(name, f.key) };
    });
    if (entries.some((e) => e.renamed)) needsNewtonsoft = true;
    const out: string[] = [`public class ${ty.name}`];
    out.push("{");
    entries.forEach((e, i) => {
      if (i > 0) out.push("");
      if (e.renamed) out.push(`    [JsonProperty(${JSON.stringify(e.f.key)})]`);
      out.push(`    public ${typeRef(e.f.type, e.f.optional)} ${e.name} { get; set; }`);
    });
    out.push("}");
    return out;
  });

  const usings: string[] = [];
  if (kinds.has("array") || kinds.has("map")) {
    usings.push("using System.Collections.Generic;");
  }
  if (needsNewtonsoft) usings.push("using Newtonsoft.Json;");

  const lines: string[] = [...usings];
  if (usings.length) lines.push("");

  if (model.root.kind !== "object") {
    lines.push(`public class ${model.rootName}`, "{", `    public ${typeRef(model.root, false)} Value { get; set; }`, "}");
  }
  lines.push(...joinBlocks(classBlocks));
  return lines.join("\n");
}

/* ------------------------------------------------------------------ */
/* Rust emitter                                                        */
/* ------------------------------------------------------------------ */

function emitRust(model: Model): string {
  const { kinds } = collectKinds(model);

  const typeRef = (t: ModelTypeRef, optional: boolean): string => {
    const inner = (() => {
      switch (t.kind) {
        case "string":
          return "String";
        case "int":
          return "i64";
        case "float":
          return "f64";
        case "bool":
          return "bool";
        case "null":
        case "unknown":
          return "Value";
        case "object":
          return t.ref;
        case "array":
          return `Vec<${typeRef(t.element, false)}>`;
        case "map":
          return `HashMap<String, ${typeRef(t.value, false)}>`;
      }
    })();
    return optional ? `Option<${inner}>` : inner;
  };

  const rustQuote = (s: string): string =>
    '"' + s.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';

  const structBlocks = model.types.map((ty) => {
    const used = new Set<string>();
    const entries = ty.fields.map((f) => {
      let name = toSnake(f.key);
      if (RUST_KEYWORDS.has(name)) name = name + "_";
      name = uniqueIn(used, name);
      return { f, name, renamed: name !== f.key };
    });
    // If every field name maps back to its JSON key via camelCase, a single
    // rename_all attribute replaces per-field renames.
    const allCamel =
      entries.length > 0 && entries.every((e) => camelName(e.name) === e.f.key);
    const out: string[] = ["#[derive(Serialize, Deserialize)]"];
    if (allCamel) out.push("#[serde(rename_all = \"camelCase\")]");
    out.push(`pub struct ${ty.name} {`);
    for (const e of entries) {
      if (e.renamed && !allCamel) out.push(`    #[serde(rename = ${rustQuote(e.f.key)})]`);
      out.push(`    pub ${e.name}: ${typeRef(e.f.type, e.f.optional)},`);
    }
    out.push("}");
    return out;
  });

  const lines: string[] = ["use serde::{Deserialize, Serialize};"];
  if (kinds.has("map")) lines.push("use std::collections::HashMap;");
  if (kinds.has("unknown")) lines.push("use serde_json::Value;");

  const blocks: string[][] = [];
  if (model.root.kind !== "object") {
    blocks.push([`pub type ${model.rootName} = ${typeRef(model.root, false)};`]);
  }
  for (const b of structBlocks) blocks.push(b);
  if (blocks.length) lines.push("", ...joinBlocks(blocks));
  return lines.join("\n");
}

/* ------------------------------------------------------------------ */
/* Shared helpers                                                      */
/* ------------------------------------------------------------------ */

/** Join emitter blocks with a single blank line between them. */
function joinBlocks(blocks: string[][]): string[] {
  const out: string[] = [];
  blocks.forEach((b, i) => {
    if (i > 0) out.push("");
    out.push(...b);
  });
  return out;
}

/** Raw parser message enriched with line/column when the engine reports an offset. */
function describeParseError(input: string, error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);
  const posMatch = /position (\d+)/.exec(raw);
  if (posMatch) {
    const pos = Math.min(Number(posMatch[1]), input.length);
    const before = input.slice(0, pos);
    const line = (before.match(/\n/g) ?? []).length + 1;
    const column = pos - (before.lastIndexOf("\n") + 1) + 1;
    return `${raw} (line ${line}, column ${column})`;
  }
  return raw;
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

interface InternalModel extends Model {
  packageName?: string;
}

const EMITTERS: Record<CodeLang, (model: InternalModel) => string> = {
  typescript: emitTypeScript,
  go: emitGo,
  java: emitJava,
  python: emitPython,
  kotlin: emitKotlin,
  csharp: emitCSharp,
  rust: emitRust,
};

/**
 * Convert a JSON sample into source code for the requested language.
 * Returns `{ code: "" }` for empty input and
 * `{ code: "", error: "invalid-json", detail }` for unparsable JSON so
 * callers can show a localized message plus technical position info.
 */
export function generate(
  input: string,
  rootName: string,
  lang: CodeLang,
  packageName?: string
): GenerateResult {
  if (!input || !input.trim()) return { code: "" };
  let data: unknown;
  try {
    data = JSON.parse(input);
  } catch (e) {
    return { code: "", error: "invalid-json", detail: describeParseError(input, e) };
  }
  const model: InternalModel = buildModel(infer(data), sanitizeRootName(rootName));
  model.packageName = packageName;
  return { code: EMITTERS[lang](model) };
}
