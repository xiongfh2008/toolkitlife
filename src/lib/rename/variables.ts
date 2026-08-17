/**
 * 模板变量解析：{date} {date:YYYY-MM-DD} {time} {datetime} {timestamp} {n} {name} {ext}
 */
import type { RuleContext } from "./types";

function formatDate(date: Date, format: string): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");

  return format
    .replace(/YYYY/g, String(year))
    .replace(/MM/g, month)
    .replace(/DD/g, day)
    .replace(/HH/g, hour)
    .replace(/mm/g, minute)
    .replace(/ss/g, second);
}

export function resolveVariables(text: string, context: RuleContext): string {
  const now = new Date();

  return text
    .replace(/\{date:([^}]+)\}/g, (_, fmt) => formatDate(now, fmt))
    .replace(/\{date\}/g, now.toISOString().slice(0, 10))
    .replace(/\{time\}/g, now.toTimeString().slice(0, 8))
    .replace(/\{datetime\}/g, now.toISOString().slice(0, 19).replace("T", "_"))
    .replace(/\{timestamp\}/g, String(now.getTime()))
    .replace(/\{n\}/g, String(context.index + 1))
    .replace(/\{name\}/g, context.currentName ?? context.originalName)
    .replace(/\{ext\}/g, context.ext.startsWith(".") ? context.ext.slice(1) : context.ext);
}
