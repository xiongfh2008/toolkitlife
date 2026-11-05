/**
 * Shared CSV export helpers for tool pages.
 *
 * `csvSafe` neutralises spreadsheet formula injection: cells that begin with
 * = + - @ or tab/CR are prefixed with a single quote so Excel/Sheets treat
 * them as text. Applied to every user- or upstream-controlled value.
 */

export function csvSafe(value: string): string {
  // Negative numbers ("-122.40") are legitimate cell values, not formulas —
  // only guard a leading "-" when it is not followed by a plain number.
  const negativeNumber = /^-\d+(\.\d+)?$/.test(value);
  if (negativeNumber) return value;
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

export function buildCsv(headers: string[], rows: string[][]): string {
  const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
  const lines = [headers.map(escape).join(",")];
  for (const row of rows) {
    lines.push(row.map((v) => escape(csvSafe(v))).join(","));
  }
  return lines.join("\n");
}

export function downloadBlob(content: string, filename: string, mime: string): void {
  const blob = new Blob(["\uFEFF" + content], { type: mime });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
