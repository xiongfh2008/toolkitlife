"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Sends a GA4 page_view event on every client-side route change.
 * Server-rendered full page loads are already tracked by gtag('config', ...).
 */
export default function GtagTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", { page_path: pathname });
    }
  }, [pathname]);

  return null;
}
