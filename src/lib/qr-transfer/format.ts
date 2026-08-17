/**
 * Ported from decimen-optical-transfer v0.3.0 (MIT License)
 * Copyright (c) 2026 Evan Crawley (Bash Alarmist)
 * https://github.com/bashalarmistalt/decimen-optical-transfer
 * Used under the MIT License — see the project LICENSE for terms.
 */
/** Byte counts for humans. Deliberately coarse — these land in a status line
 *  next to a filename, not in a report. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
