
import { useState } from "react";
import { Activity, RotateCcw } from "lucide-react";

import {
  demoStudents,
} from "../../data/students";

import {
  demoStudentLearningHistory,
} from "../../data/studentLearningHistory";

import {
  caseStudyContexts,
  type CaseStudyContext,
} from "../../data/caseStudies";

import MonitoringStats from "../../components/admin/monitoring/MonitoringStats";
import AssessmentComparison from "../../components/admin/monitoring/AssessmentComparison";
import RecentSessions from "../../components/admin/monitoring/RecentSessions";

type ContextFilter = CaseStudyContext | "ALL";

export default function MonitoringDashboard() {
  const [contextFilter, setContextFilter] =
    useState<ContextFilter>("ALL");

  const [classFilter, setClassFilter] =
    useState("ALL");

  const classes = Array.from(
    new Set(
      demoStudents.map((student) => student.className)
    )
  ).sort();

  const filteredStudents = demoStudents.filter(
    (student) =>
      classFilter === "ALL" ||
      student.className === classFilter
  );

  const studentIds = new Set(
    filteredStudents.map((student) => student.id)
  );

  const filteredSessions = demoStudentLearningHistory
    .filter(
      (session) =>
        studentIds.has(session.studentId) &&
        (contextFilter === "ALL" ||
          session.context === contextFilter)
    )
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() -
        new Date(a.completedAt).getTime()
    );

  const hasActiveFilters =
    contextFilter !== "ALL" || classFilter !== "ALL";

  const resetFilters = () => {
    setContextFilter("ALL");
    setClassFilter("ALL");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Activity size={18} />
          MONITORING PEMBELAJARAN
        </div>

        <h1 className="mt-2 text-3xl font-bold">
          Monitoring Pembelajaran
        </h1>

        <p className="mt-2 text-text-secondary">
          Pantau aktivitas siswa dan perkembangan hasil asesmen.
        </p>
      </div>

      {/* Demo notice */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        Mode demo: seluruh statistik dan aktivitas
        menggunakan data ilustratif. Belum terhubung
        dengan database atau aktivitas siswa nyata.
      </div>

      {/* Filters */}
      <section className="rounded-2xl border border-border bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-semibold">
            Filter Monitoring
          </h2>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <RotateCcw size={15} />
              Reset Filter
            </button>
          )}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <select
            value={classFilter}
            onChange={(event) =>
              setClassFilter(event.target.value)
            }
            aria-label="Filter kelas"
            className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
          >
            <option value="ALL">Semua Kelas</option>

            {classes.map((className) => (
              <option
                key={className}
                value={className}
              >
                {className}
              </option>
            ))}
          </select>

          <select
            value={contextFilter}
            onChange={(event) =>
              setContextFilter(
                event.target.value as ContextFilter
              )
            }
            aria-label="Filter konteks"
            className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
          >
            <option value="ALL">
              Semua Konteks
            </option>

            {Object.entries(caseStudyContexts).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              )
            )}
          </select>
        </div>
      </section>

      {/* Summary */}
      <MonitoringStats
        sessions={filteredSessions}
        totalStudents={filteredStudents.length}
      />

      {/* Comparison */}
      <AssessmentComparison sessions={filteredSessions} />

      {/* History */}
      <RecentSessions
        sessions={filteredSessions}
        students={demoStudents}
      />
    </div>
  );
}