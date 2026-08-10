"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type NumToken = { type: "num"; value: number };
type OpToken = { type: "op"; value: string };
type FuncToken = { type: "func"; value: string };
type LParenToken = { type: "lparen" };
type RParenToken = { type: "rparen" };
type Token = NumToken | OpToken | FuncToken | LParenToken | RParenToken;

const FUNCTIONS = ["sin", "cos", "tan", "log", "sqrt"];
const CONSTANTS: Record<string, number> = { pi: Math.PI, e: Math.E };

function tokenize(input: string): Token[] {
  const regex = /(?:\d+(?:\.\d*)?|\.\d+)|[A-Za-z]+|[+\-*/^()]/g;
  const tokens: Token[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(input)) !== null) {
    const s = match[0];
    if (/^\d|\./.test(s)) {
      tokens.push({ type: "num", value: parseFloat(s) });
    } else if (s === "(") {
      tokens.push({ type: "lparen" });
    } else if (s === ")") {
      tokens.push({ type: "rparen" });
    } else if (FUNCTIONS.includes(s.toLowerCase())) {
      tokens.push({ type: "func", value: s.toLowerCase() });
    } else if (s.toLowerCase() in CONSTANTS) {
      tokens.push({ type: "num", value: CONSTANTS[s.toLowerCase()] });
    } else if (/[+\-*/^]/.test(s)) {
      tokens.push({ type: "op", value: s });
    } else {
      throw new Error("Invalid token: " + s);
    }
  }
  return tokens;
}

function isOp(token: Token | undefined, ...ops: string[]): token is OpToken {
  return token?.type === "op" && ops.includes((token as OpToken).value);
}

function evaluate(expression: string, isDeg: boolean): number {
  const tokens = tokenize(expression);
  let pos = 0;

  const peek = () => tokens[pos];
  const consume = () => tokens[pos++];

  function parseExpression(): number {
    let left = parseTerm();
    while (isOp(peek(), "+", "-")) {
      const op = consume() as OpToken;
      const right = parseTerm();
      left = op.value === "+" ? left + right : left - right;
    }
    return left;
  }

  function parseTerm(): number {
    let left = parsePower();
    while (isOp(peek(), "*", "/")) {
      const op = consume() as OpToken;
      const right = parsePower();
      left = op.value === "*" ? left * right : left / right;
    }
    return left;
  }

  function parsePower(): number {
    let left = parseUnary();
    if (isOp(peek(), "^")) {
      consume();
      const right = parsePower();
      left = Math.pow(left, right);
    }
    return left;
  }

  function parseUnary(): number {
    if (isOp(peek(), "-")) {
      consume();
      return -parseUnary();
    }
    return parsePrimary();
  }

  function parsePrimary(): number {
    const token = peek();
    if (!token) throw new Error("Unexpected end of expression");

    if (token.type === "num") {
      consume();
      return token.value;
    }

    if (token.type === "lparen") {
      consume();
      const value = parseExpression();
      if (peek()?.type !== "rparen") throw new Error("Missing closing parenthesis");
      consume();
      return value;
    }

    if (token.type === "func") {
      const fn = consume() as FuncToken;
      if (peek()?.type !== "lparen") throw new Error("Missing opening parenthesis");
      consume();
      const arg = parseExpression();
      if (peek()?.type !== "rparen") throw new Error("Missing closing parenthesis");
      consume();
      const factor =
        isDeg && ["sin", "cos", "tan"].includes(fn.value)
          ? Math.PI / 180
          : 1;
      switch (fn.value) {
        case "sin":
          return Math.sin(arg * factor);
        case "cos":
          return Math.cos(arg * factor);
        case "tan":
          return Math.tan(arg * factor);
        case "log":
          return Math.log(arg);
        case "sqrt":
          return Math.sqrt(arg);
        default:
          throw new Error("Unknown function");
      }
    }

    throw new Error("Unexpected token");
  }

  const value = parseExpression();
  if (pos < tokens.length) throw new Error("Unexpected token");
  if (!Number.isFinite(value)) throw new Error("Invalid result");
  return value;
}

function formatResult(value: number): string {
  if (Number.isInteger(value)) return value.toString();
  return value
    .toPrecision(10)
    .replace(/0+$/, "")
    .replace(/\.$/, "");
}

export default function ScientificCalculatorPage() {
  const t = useTranslations("tools.scientific-calculator");
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeg, setIsDeg] = useState(true);
  const [memory, setMemory] = useState(0);

  const append = useCallback((text: string) => {
    setExpression((prev) => prev + text);
    setError(null);
  }, []);

  const clear = useCallback(() => {
    setExpression("");
    setResult(null);
    setError(null);
  }, []);

  const removeLast = useCallback(() => {
    const regex = /(?:\d+(?:\.\d*)?|\.\d+)|[A-Za-z]+|[+\-*/^()]/g;
    const tokens = expression.match(regex) || [];
    tokens.pop();
    setExpression(tokens.join(""));
    setError(null);
  }, [expression]);

  const calculate = useCallback(() => {
    if (!expression.trim()) return;
    try {
      const value = evaluate(expression, isDeg);
      const formatted = formatResult(value);
      setResult(formatted);
      setError(null);
    } catch {
      setResult(null);
      setError(t("errors.invalid"));
    }
  }, [expression, isDeg, t]);

  const memoryClear = useCallback(() => setMemory(0), []);
  const memoryRecall = useCallback(() => {
    append(memory.toString());
  }, [append, memory]);
  const memoryPlus = useCallback(() => {
    if (result !== null) setMemory((m) => m + parseFloat(result));
  }, [result]);
  const memoryMinus = useCallback(() => {
    if (result !== null) setMemory((m) => m - parseFloat(result));
  }, [result]);

  const baseBtn =
    "rounded-lg bg-zinc-800 border border-zinc-700 py-3 text-sm font-medium text-zinc-200 hover:bg-zinc-700 transition-colors";
  const opBtn =
    "rounded-lg bg-blue-600/20 border border-blue-500/40 py-3 text-sm font-medium text-blue-300 hover:bg-blue-600/30 transition-colors";

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="scientific-calculator"
    >
      <div className="max-w-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">{t("labels.expression")}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setIsDeg(true)}
              className={`text-xs px-2 py-1 rounded border transition-colors ${
                isDeg
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
              }`}
            >
              {t("options.degrees")}
            </button>
            <button
              onClick={() => setIsDeg(false)}
              className={`text-xs px-2 py-1 rounded border transition-colors ${
                !isDeg
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
              }`}
            >
              {t("options.radians")}
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
          <div className="text-right text-2xl font-mono text-zinc-100 break-all min-h-[2rem]">
            {expression || "0"}
          </div>
          {error && (
            <div className="text-right text-sm text-red-400 mt-1">{error}</div>
          )}
          {result !== null && !error && (
            <div className="text-right text-xl text-blue-400 font-mono mt-1">
              {result}
            </div>
          )}
        </div>

        <div className="grid grid-cols-5 gap-2">
          <button className={baseBtn} onClick={() => append("sin(")}>
            {t("buttons.sin")}
          </button>
          <button className={baseBtn} onClick={() => append("cos(")}>
            {t("buttons.cos")}
          </button>
          <button className={baseBtn} onClick={() => append("log(")}>
            {t("buttons.log")}
          </button>
          <button className={baseBtn} onClick={() => append("sqrt(")}>
            {t("buttons.sqrt")}
          </button>
          <button className={opBtn} onClick={() => append("^")}>
            {t("buttons.power")}
          </button>

          <button className={baseBtn} onClick={() => append("(")}>
            (
          </button>
          <button className={baseBtn} onClick={() => append(")")}>
            )
          </button>
          <button className={baseBtn} onClick={() => append("pi")}>
            π
          </button>
          <button className={baseBtn} onClick={() => append("e")}>
            e
          </button>
          <button className={opBtn} onClick={removeLast}>
            {t("buttons.delete")}
          </button>

          {[7, 8, 9].map((n) => (
            <button key={n} className={baseBtn} onClick={() => append(n.toString())}>
              {n}
            </button>
          ))}
          <button className={opBtn} onClick={clear}>
            {t("buttons.clear")}
          </button>
          <button className={opBtn} onClick={() => append("/")}>
            ÷
          </button>

          {[4, 5, 6].map((n) => (
            <button key={n} className={baseBtn} onClick={() => append(n.toString())}>
              {n}
            </button>
          ))}
          <button className={opBtn} onClick={() => append("*")}>
            ×
          </button>
          <button className={opBtn} onClick={() => append("-")}>
            −
          </button>

          {[1, 2, 3].map((n) => (
            <button key={n} className={baseBtn} onClick={() => append(n.toString())}>
              {n}
            </button>
          ))}
          <button className={opBtn} onClick={() => append("+")}>
            +
          </button>
          <button className={baseBtn} onClick={() => append(".")}>
            .
          </button>

          <button className={baseBtn} onClick={() => append("0")}>
            0
          </button>
          <button className={baseBtn} onClick={() => append("00")}>
            00
          </button>
          <button className={baseBtn} onClick={memoryClear}>
            {t("buttons.memoryClear")}
          </button>
          <button className={baseBtn} onClick={memoryRecall}>
            {t("buttons.memoryRecall")}
          </button>
          <button className={opBtn} onClick={calculate}>
            {t("buttons.equals")}
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={memoryPlus}
            className="rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
          >
            {t("buttons.memoryPlus")}
          </button>
          <button
            onClick={memoryMinus}
            className="rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
          >
            {t("buttons.memoryMinus")}
          </button>
        </div>

        {result !== null && (
          <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-3">
            <div>
              <span className="text-sm text-zinc-400">{t("labels.result")}</span>
              <p className="text-xl font-mono text-blue-400">{result}</p>
            </div>
            <CopyButton text={result} className="text-xs px-2 py-1" />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
