"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

// 8 standard test colors: RGB primaries + CMY secondaries + black/white.
// Black reveals backlight bleed; white reveals dead/dark pixels and uniformity;
// R/G/B expose stuck sub-pixels; CMY confirm with complementary colors.
const COLORS = [
  "#000000", // black
  "#ffffff", // white
  "#ff0000", // red
  "#00ff00", // green
  "#0000ff", // blue
  "#00ffff", // cyan
  "#ff00ff", // magenta
  "#ffff00", // yellow
] as const;

const COLOR_KEYS = [
  "black",
  "white",
  "red",
  "green",
  "blue",
  "cyan",
  "magenta",
  "yellow",
] as const;

// Index of the grayscale-gradient entry (second mode: banding / uniformity).
const GRADIENT_INDEX = COLORS.length;

export default function ScreenColorTestPage() {
  const t = useTranslations("tools.screen-color-test");

  const [active, setActive] = useState<number | null>(null);
  const [hintVisible, setHintVisible] = useState(true);
  const wakeLockRef = useRef<{ release: () => Promise<void> } | null>(null);
  const activeRef = useRef<number | null>(null);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const exitTest = useCallback(() => {
    setActive(null);
    if (wakeLockRef.current) {
      void wakeLockRef.current.release().catch(() => {});
      wakeLockRef.current = null;
    }
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => {});
    }
  }, []);

  const step = useCallback((dir: 1 | -1) => {
    setActive((prev) =>
      prev === null ? prev : (prev + dir + GRADIENT_INDEX + 1) % (GRADIENT_INDEX + 1)
    );
  }, []);

  const startTest = useCallback(
    (index: number) => {
      setActive(index);
      setHintVisible(true);
      window.setTimeout(() => setHintVisible(false), 3000);
      // Best-effort: keep the screen awake during inspection.
      const nav = navigator as Navigator & {
        wakeLock?: { request: (type: "screen") => Promise<{ release: () => Promise<void> }> };
      };
      nav.wakeLock
        ?.request("screen")
        .then((lock) => {
          wakeLockRef.current = lock;
        })
        .catch(() => {});
      // Best-effort: hide browser chrome for edge-to-edge inspection.
      void document.documentElement.requestFullscreen?.().catch(() => {});
    },
    []
  );

  // Keyboard controls while the test overlay is open.
  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        exitTest();
      } else if ([" ", "Enter", "ArrowRight", "ArrowDown", "PageDown"].includes(e.key)) {
        e.preventDefault();
        step(1);
      } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        step(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, exitTest, step]);

  // Leaving fullscreen (Esc / F11) also closes the test overlay.
  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement && activeRef.current !== null) {
        exitTest();
      }
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, [exitTest]);

  // Re-acquire the wake lock when the tab becomes visible again mid-test.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible" && activeRef.current !== null) {
        const nav = navigator as Navigator & {
          wakeLock?: { request: (type: "screen") => Promise<{ release: () => Promise<void> }> };
        };
        nav.wakeLock
          ?.request("screen")
          .then((lock) => {
            wakeLockRef.current = lock;
          })
          .catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  useEffect(() => exitTest, [exitTest]);

  const faqs: FAQ[] = [
    {
      question: t("faqs.0.question"),
      answer: t("faqs.0.answer"),
    },
    {
      question: t("faqs.1.question"),
      answer: t("faqs.1.answer"),
    },
    {
      question: t("faqs.2.question"),
      answer: t("faqs.2.answer"),
    },
    {
      question: t("faqs.3.question"),
      answer: t("faqs.3.answer"),
    },
  ];

  const relatedTools: RelatedTool[] = [
    { name: t("related.0.name"), href: "/tools/image-palette" },
    { name: t("related.1.name"), href: "/tools/screen-recorder" },
    { name: t("related.2.name"), href: "/tools/solid-color-image" },
  ];

  return (
    <ToolLayout
      title={t("title")}
      slug="screen-color-test"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={t.raw("keywords") as string[]}
    >
      <div className="max-w-4xl space-y-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-1 text-base font-medium text-zinc-100">{t("labels.pickTitle")}</h2>
          <p className="mb-4 text-sm leading-relaxed text-zinc-400">{t("labels.pickDesc")}</p>
          <button
            onClick={() => startTest(0)}
            className="mb-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-500 sm:text-base"
          >
            <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-current sm:h-5 sm:w-5">
              <path d="M3 3h7v2H5v5H3V3zm11 0h7v7h-2V5h-5V3zM3 14h2v5h5v2H3v-7zm18 0v7h-7v-2h5v-5h2z" />
            </svg>
            {t("labels.startTest")}
          </button>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {COLORS.map((hex, i) => (
              <button
                key={hex}
                onClick={() => startTest(i)}
                className="group overflow-hidden rounded-lg border border-zinc-700 transition-colors hover:border-blue-500"
              >
                <span
                  className="block h-16 w-full transition-transform group-hover:scale-[1.02]"
                  style={{ backgroundColor: hex }}
                />
                <span className="block bg-zinc-800 py-1.5 text-center text-xs text-zinc-300 group-hover:text-zinc-100">
                  {t(`colors.${COLOR_KEYS[i]}`)}
                </span>
              </button>
            ))}
            <button
              onClick={() => startTest(GRADIENT_INDEX)}
              className="group overflow-hidden rounded-lg border border-zinc-700 transition-colors hover:border-blue-500"
            >
              <span
                className="block h-16 w-full transition-transform group-hover:scale-[1.02]"
                style={{ background: "linear-gradient(to right, #000000, #ffffff)" }}
              />
              <span className="block bg-zinc-800 py-1.5 text-center text-xs text-zinc-300 group-hover:text-zinc-100">
                {t("colors.gradient")}
              </span>
            </button>
          </div>
        </div>
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-[100] cursor-pointer"
          style={
            active === GRADIENT_INDEX
              ? { background: "linear-gradient(to right, #000000, #ffffff)" }
              : { backgroundColor: COLORS[active] }
          }
          onClick={() => step(1)}
          role="button"
          aria-label={t("labels.overlayAria")}
        >
          <p
            className={`pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-md bg-black/60 px-4 py-2 text-xs text-white transition-opacity duration-500 ${
              hintVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {t("labels.hint")}
          </p>
        </div>
      )}
    </ToolLayout>
  );
}
