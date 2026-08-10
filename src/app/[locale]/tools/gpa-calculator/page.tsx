"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const GRADES = [
  { label: "A", value: 4.0 },
  { label: "A-", value: 3.7 },
  { label: "B+", value: 3.3 },
  { label: "B", value: 3.0 },
  { label: "B-", value: 2.7 },
  { label: "C+", value: 2.3 },
  { label: "C", value: 2.0 },
  { label: "C-", value: 1.7 },
  { label: "D+", value: 1.3 },
  { label: "D", value: 1.0 },
  { label: "F", value: 0.0 },
];

type Course = {
  id: number;
  name: string;
  credits: string;
  grade: string;
};

export default function GpaCalculatorPage() {
  const t = useTranslations("tools.gpa-calculator");
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: "", credits: "", grade: "A" },
  ]);
  const [nextId, setNextId] = useState(2);

  const updateCourse = (id: number, field: keyof Course, value: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const addCourse = () => {
    setCourses((prev) => [...prev, { id: nextId, name: "", credits: "", grade: "A" }]);
    setNextId((n) => n + 1);
  };

  const removeCourse = (id: number) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const result = useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;
    for (const course of courses) {
      const credits = parseFloat(course.credits);
      const grade = GRADES.find((g) => g.label === course.grade);
      if (!grade || Number.isNaN(credits) || credits <= 0) return null;
      totalPoints += grade.value * credits;
      totalCredits += credits;
    }
    if (totalCredits === 0) return null;
    return {
      gpa: (totalPoints / totalCredits).toFixed(2),
      totalCredits: totalCredits.toFixed(1),
    };
  }, [courses]);

  const inputClass =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40";

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="gpa-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="space-y-3">
          {courses.map((course, index) => (
            <div
              key={course.id}
              className="grid gap-3 items-end sm:grid-cols-4 rounded-lg border border-zinc-800 bg-zinc-900 p-3"
            >
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs text-zinc-400">
                  {t("labels.course")} {index + 1}
                </label>
                <input
                  type="text"
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                  placeholder={t("placeholders.course")}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-400">
                  {t("labels.credits")}
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={course.credits}
                  onChange={(e) => updateCourse(course.id, "credits", e.target.value)}
                  placeholder={t("placeholders.credits")}
                  className={inputClass}
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={course.grade}
                  onChange={(e) => updateCourse(course.id, "grade", e.target.value)}
                  className={inputClass}
                >
                  {GRADES.map((g) => (
                    <option key={g.label} value={g.label}>
                      {g.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => removeCourse(course.id)}
                  className="shrink-0 rounded-lg bg-red-600/20 border border-red-500/40 px-3 py-2 text-sm text-red-300 hover:bg-red-600/30 transition-colors"
                >
                  {t("buttons.remove")}
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addCourse}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
        >
          {t("buttons.addCourse")}
        </button>

        {result && (
          <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-5">
            <div>
              <p className="text-sm text-zinc-400">{t("labels.gpa")}</p>
              <p className="text-4xl font-bold text-blue-400">{result.gpa}</p>
              <p className="text-sm text-zinc-500">
                {t("labels.totalCredits")}: {result.totalCredits}
              </p>
            </div>
            <CopyButton text={result.gpa} className="text-xs px-2 py-1" />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
