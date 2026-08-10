"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type Assignment = {
  id: number;
  name: string;
  score: string;
  weight: string;
};

export default function GradeCalculatorPage() {
  const t = useTranslations("tools.grade-calculator");
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: 1, name: "", score: "", weight: "" },
  ]);
  const [target, setTarget] = useState("90");
  const [nextId, setNextId] = useState(2);

  const updateAssignment = (id: number, field: keyof Assignment, value: string) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  const addAssignment = () => {
    setAssignments((prev) => [...prev, { id: nextId, name: "", score: "", weight: "" }]);
    setNextId((n) => n + 1);
  };

  const removeAssignment = (id: number) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const result = useMemo(() => {
    let weighted = 0;
    let totalWeight = 0;
    for (const assignment of assignments) {
      const score = parseFloat(assignment.score);
      const weight = parseFloat(assignment.weight);
      if (Number.isNaN(score) || Number.isNaN(weight)) continue;
      weighted += score * weight;
      totalWeight += weight;
    }
    if (totalWeight === 0) return null;
    const current = weighted / totalWeight;
    const targetNum = parseFloat(target);
    let needed: number | null = null;
    if (!Number.isNaN(targetNum) && totalWeight < 100) {
      needed = (targetNum * 100 - weighted) / (100 - totalWeight);
    }
    return {
      current: current.toFixed(2),
      needed: needed !== null ? needed.toFixed(2) : null,
      totalWeight: totalWeight.toFixed(2),
    };
  }, [assignments, target]);

  const error = result && parseFloat(result.totalWeight) > 100;

  const inputClass =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40";

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="grade-calculator"
    >
      <div className="max-w-3xl space-y-4">
        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-600/10 p-3 text-sm text-red-300">
            {t("errors.weightOverflow")}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.targetGrade")}
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder={t("placeholders.targetGrade")}
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-3">
          {assignments.map((assignment, index) => (
            <div
              key={assignment.id}
              className="grid gap-3 items-end sm:grid-cols-4 rounded-lg border border-zinc-800 bg-zinc-900 p-3"
            >
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs text-zinc-400">
                  {t("labels.assignment")} {index + 1}
                </label>
                <input
                  type="text"
                  value={assignment.name}
                  onChange={(e) => updateAssignment(assignment.id, "name", e.target.value)}
                  placeholder={t("placeholders.assignment")}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-400">
                  {t("labels.score")}
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={assignment.score}
                  onChange={(e) => updateAssignment(assignment.id, "score", e.target.value)}
                  placeholder={t("placeholders.score")}
                  className={inputClass}
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={assignment.weight}
                  onChange={(e) => updateAssignment(assignment.id, "weight", e.target.value)}
                  placeholder={t("placeholders.weight")}
                  className={inputClass}
                />
                <button
                  onClick={() => removeAssignment(assignment.id)}
                  className="shrink-0 rounded-lg bg-red-600/20 border border-red-500/40 px-3 py-2 text-sm text-red-300 hover:bg-red-600/30 transition-colors"
                >
                  {t("buttons.remove")}
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addAssignment}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
        >
          {t("buttons.addAssignment")}
        </button>

        {result && !error && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.currentGrade")}</p>
                <p className="text-4xl font-bold text-blue-400">{result.current}%</p>
              </div>
              <CopyButton text={`${result.current}%`} className="text-xs px-2 py-1" />
            </div>
            {result.needed !== null && (
              <div>
                <p className="text-sm text-zinc-400">
                  {t("labels.neededScore")} ({t("labels.remainingWeight")}:{" "}
                  {(100 - parseFloat(result.totalWeight)).toFixed(2)}%)
                </p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.needed}%
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
