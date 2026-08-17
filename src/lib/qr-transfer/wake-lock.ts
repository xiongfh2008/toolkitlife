/**
 * Ported from decimen-optical-transfer v0.3.0 (MIT License)
 * Copyright (c) 2026 Evan Crawley (Bash Alarmist)
 * https://github.com/bashalarmistalt/decimen-optical-transfer
 * Used under the MIT License — see the project LICENSE for terms.
 */

/** Keep the screen awake for the duration of a transfer, best effort — a
 *  sender that sleeps mid-stream kills the transfer, but a browser without
 *  the API (or a denied request) is fine to run without it. */
export async function requestScreenWakeLock(): Promise<void> {
  try {
    await (navigator as Navigator & { wakeLock?: { request(t: "screen"): Promise<unknown> } })
      .wakeLock?.request("screen");
  } catch {
    /* fine without it */
  }
}
