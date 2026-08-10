"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const SIZE = 240;
const PAD = 20;

function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)); }

export default function CssCubicBezierPage() {
  const t = useTranslations("tools.css-cubic-bezier");
  const [x1, setX1] = useState(0.42);
  const [y1, setY1] = useState(0);
  const [x2, setX2] = useState(0.58);
  const [y2, setY2] = useState(1);
  const [duration, setDuration] = useState(1);
  const [dragging, setDragging] = useState<"p1" | "p2" | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [key, setKey] = useState(0);

  const toSvg = useCallback((x: number, y: number) => ({ cx: PAD + x * (SIZE - 2 * PAD), cy: SIZE - PAD - y * (SIZE - 2 * PAD) }), []);
  const fromSvg = useCallback((cx: number, cy: number) => ({ x: (cx - PAD) / (SIZE - 2 * PAD), y: (SIZE - PAD - cy) / (SIZE - 2 * PAD) }), []);

  const p1 = toSvg(x1, y1);
  const p2 = toSvg(x2, y2);
  const start = toSvg(0, 0);
  const end = toSvg(1, 1);

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!dragging || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const pt = fromSvg(e.clientX - rect.left, e.clientY - rect.top);
      if (dragging === "p1") {
        setX1(clamp(Number(pt.x.toFixed(3)), 0, 1));
        setY1(clamp(Number(pt.y.toFixed(3)), 0, 1));
      } else {
        setX2(clamp(Number(pt.x.toFixed(3)), 0, 1));
        setY2(clamp(Number(pt.y.toFixed(3)), 0, 1));
      }
    },
    [dragging, fromSvg]
  );

  const handlePointerUp = useCallback(() => setDragging(null), []);

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  const css = useMemo(() => `transition: all ${duration}s cubic-bezier(${x1}, ${y1}, ${x2}, ${y2});`, [duration, x1, y1, x2, y2]);
  const bezier = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;

  const presets = [
    { name: "ease", v: [0.25, 0.1, 0.25, 1] },
    { name: "linear", v: [0, 0, 1, 1] },
    { name: "ease-in", v: [0.42, 0, 1, 1] },
    { name: "ease-out", v: [0, 0, 0.58, 1] },
    { name: "ease-in-out", v: [0.42, 0, 0.58, 1] },
  ];

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="css-cubic-bezier"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.name}
                onClick={() => { setX1(p.v[0]); setY1(p.v[1]); setX2(p.v[2]); setY2(p.v[3]); }}
                className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "x1", value: x1, set: setX1, min: 0, max: 1, step: 0.01 },
              { label: "y1", value: y1, set: setY1, min: 0, max: 1, step: 0.01 },
              { label: "x2", value: x2, set: setX2, min: 0, max: 1, step: 0.01 },
              { label: "y2", value: y2, set: setY2, min: 0, max: 1, step: 0.01 },
            ].map((c) => (
              <div key={c.label}>
                <label className="mb-1 block text-sm text-zinc-300">{c.label}</label>
                <input
                  type="number"
                  min={c.min}
                  max={c.max}
                  step={c.step}
                  value={c.value}
                  onChange={(e) => c.set(clamp(Number(e.target.value), c.min, c.max))}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 outline-none focus:border-blue-500"
                />
              </div>
            ))}
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm text-zinc-300">{t("labels.duration")}</label>
              <span className="text-xs text-zinc-500">{duration}s</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={5}
              step={0.1}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              className="w-full touch-none"
              style={{ maxHeight: 280 }}
            >
              <rect x={PAD} y={PAD} width={SIZE - 2 * PAD} height={SIZE - 2 * PAD} fill="none" stroke="#3f3f46" />
              <line x1={start.cx} y1={start.cy} x2={p1.cx} y2={p1.cy} stroke="#71717a" strokeDasharray="4" />
              <line x1={end.cx} y1={end.cy} x2={p2.cx} y2={p2.cy} stroke="#71717a" strokeDasharray="4" />
              <path d={`M ${start.cx} ${start.cy} C ${p1.cx} ${p1.cy}, ${p2.cx} ${p2.cy}, ${end.cx} ${end.cy}`} fill="none" stroke="#3b82f6" strokeWidth={3} />
              <circle
                cx={p1.cx} cy={p1.cy} r={6} fill="#22c55e" stroke="#fff" strokeWidth={2}
                className="cursor-pointer"
                onPointerDown={() => setDragging("p1")}
              />
              <circle
                cx={p2.cx} cy={p2.cy} r={6} fill="#ef4444" stroke="#fff" strokeWidth={2}
                className="cursor-pointer"
                onPointerDown={() => setDragging("p2")}
              />
            </svg>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-300">{t("labels.preview")}</span>
              <button
                onClick={() => setKey((k) => k + 1)}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500 transition-colors"
              >
                {t("buttons.play")}
              </button>
            </div>
            <div className="h-16 rounded bg-zinc-800">
              <div
                key={key}
                className="h-8 w-8 rounded bg-blue-600"
                style={{
                  animation: `slide-${key} ${duration}s cubic-bezier(${x1}, ${y1}, ${x2}, ${y2}) forwards`,
                }}
              />
              <style>{`
                @keyframes slide-${key} {
                  from { transform: translateX(0); }
                  to { transform: translateX(calc(100% - 2rem)); }
                }
              `}</style>
            </div>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <pre className="overflow-x-auto text-sm text-zinc-300">{css}</pre>
            <div className="mt-3">
              <CopyButton text={bezier} label={t("buttons.copy")} />
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
