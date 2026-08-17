/**
 * Ported from decimen-optical-transfer v0.3.0 (MIT License)
 * Copyright (c) 2026 Evan Crawley (Bash Alarmist)
 * https://github.com/bashalarmistalt/decimen-optical-transfer
 * Used under the MIT License — see the project LICENSE for terms.
 */

export function fitQrDisplaySize(
  viewportWidth: number,
  viewportHeight: number,
  containerWidth: number,
  requestedSize: number,
  horizontalChrome = 0,
): number {
  const viewportBudget = 0.9 * Math.min(viewportWidth, viewportHeight);
  const containerBudget = Math.max(1, containerWidth - horizontalChrome);
  return Math.max(1, Math.min(viewportBudget, containerBudget, requestedSize));
}
