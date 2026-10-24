
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Cpu,
  House,
  Leaf,
  Lightbulb,
} from "lucide-react";

import type { CaseStudyContext } from "../data/caseStudies";
import { loadLearningSession } from "../utils/learningStorage";
import { isSupportedLearningCase } from "../data/supportedLearningCases";
import {
  createModuleAssignment,
  fetchActiveModuleAssignment,
  type StudentModuleAssignment,
} from "../services/api";

type LearningContext = CaseStudyContext;

const contexts = [
  {
    id: "DAILY_LIFE",
    title: "Kehidupan Sehari-hari",
    description:
      "Pelajari konsep gerak melalui aktivitas yang sering ditemui dalam kehidupan sehari-hari.",
    example: "Gerak kendaraan, berjalan kaki, dan perjalanan.",
    icon: House,
    color: "bg-blue-50 text-blue-600",
  },
  {
    id: "ENVIRONMENT",
    title: "Lingkungan",
    description:
      "Jelajahi konsep gerak melalui berbagai fenomena yang terjadi di lingkungan sekitar.",
    example: "Gerak air, benda jatuh, dan fenomena alam.",
    icon: Leaf,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    id: "TECHNOLOGY",
    title: "Teknologi",
    description:
      "Pahami penerapan konsep gerak dalam teknologi dan sistem modern.",
    example: "Robotika, transportasi, dan sensor gerak.",
    icon: Cpu,
    color: "bg-purple-50 text-purple-600",
  },
] as const;

export default function ContextSelection() {
  const navigate = useNavigate();

  const [selectedContext, setSelectedContext] =
    useState<LearningContext | null>(null);
  const [activeAssignment, setActiveAssignment] =
    useState<StudentModuleAssignment | null>(null);

  useEffect(() => {
    fetchActiveModuleAssignment().then((assignment) => {
      setActiveAssignment(assignment);
      if (assignment?.context) {
        setSelectedContext(assignment.context as LearningContext);
      }
    });
  }, []);

  const savedSession = loadLearningSession();

  const selected = contexts.find(
    (context) => context.id === selectedContext
  );

  const activeContextMatch =
    selectedContext &&
    activeAssignment &&
    activeAssignment.context === selectedContext;

  const canResume = Boolean(
    (activeContextMatch ||
      (selectedContext &&
        savedSession &&
        savedSession.context === selectedContext &&
        savedSession.currentPhase >= 1 &&
        savedSession.currentPhase <= 5 &&
        savedSession.caseStudy &&
        isSupportedLearningCase(savedSession.caseStudy)))
  );

  const handleContinue = async () => {
    if (!selectedContext) return;

    const session = loadLearningSession();
    const hasResumableSession = Boolean(
      session &&
        session.context === selectedContext &&
        session.currentPhase >= 1 &&
        session.currentPhase <= 5 &&
        session.caseStudy &&
        isSupportedLearningCase(session.caseStudy)
    );

    if (hasResumableSession) {
      navigate("/learn/session", {
        state: {
          context: selectedContext,
        },
      });
      return;
    }

    try {
      if (!activeAssignment) {
        await createModuleAssignment(selectedContext);
      } else if (activeAssignment.context !== selectedContext) {
        throw new Error(
          "Kamu masih memiliki modul aktif di konteks lain. Selesaikan modul tersebut terlebih dahulu."
        );
      }

      navigate("/learn/pre-test", {
        state: {
          context: selectedContext,
        },
      });
    } catch (error) {
      console.error("Failed to assign learning module:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Gagal menyiapkan modul pembelajaran.";

      window.alert(message);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Page heading */}
      <div>
        <p className="text-sm font-semibold text-primary">
          MULAI PEMBELAJARAN
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Pilih Konteks Pembelajaran
        </h1>

        <p className="mt-3 max-w-2xl text-text-secondary">
          Pilih konteks yang paling menarik bagimu.
          Konteks yang dipilih akan digunakan untuk
          menyesuaikan studi kasus dan konflik kognitif
          dalam proses pembelajaran.
        </p>
      </div>

      {/* Learning module */}
      <div className="flex items-center gap-4 rounded-xl border border-border bg-white p-5">
        <div className="rounded-xl bg-blue-50 p-3 text-primary">
          <Lightbulb size={24} />
        </div>

        <div>
          <p className="text-xs font-medium text-text-secondary">
            MODUL PEMBELAJARAN
          </p>

          <h2 className="mt-1 font-semibold">
            Kinematika Gerak Lurus
          </h2>

          <p className="text-sm text-text-secondary">
            Fisika Kelas XI • 5 Fase Pembelajaran
          </p>
        </div>
      </div>

      {/* Context cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {contexts.map((context) => {
          const Icon = context.icon;
          const isSelected = selectedContext === context.id;

          const isResumableContext = Boolean(
            (activeAssignment &&
              activeAssignment.context === context.id) ||
            (savedSession &&
              savedSession.context === context.id &&
              savedSession.currentPhase >= 1 &&
              savedSession.currentPhase <= 5 &&
              savedSession.caseStudy &&
              isSupportedLearningCase(savedSession.caseStudy))
          );

          return (
            <button
              key={context.id}
              type="button"
              onClick={() => setSelectedContext(context.id)}
              aria-pressed={isSelected}
              className={`relative flex min-h-72 flex-col rounded-2xl border-2 bg-white p-6 text-left transition-all hover:-translate-y-1 hover:shadow-md ${
                isSelected
                  ? "border-primary shadow-sm"
                  : "border-border hover:border-blue-200"
              }`}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white">
                  <Check size={16} />
                </div>
              )}

              {/* Context icon */}
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl ${context.color}`}
              >
                <Icon size={27} />
              </div>

              <h3 className="mt-6 text-lg font-semibold">
                {context.title}
              </h3>

              {/* Resume indicator */}
              {isResumableContext && (
                <span className="mt-3 inline-flex w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  {activeAssignment?.context === context.id
                    ? "Modul aktif tersedia"
                    : `Lanjutkan Fase ${savedSession?.currentPhase}`}
                </span>
              )}

              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {context.description}
              </p>

              <p className="mt-auto pt-6 text-xs leading-relaxed text-text-secondary">
                <span className="font-semibold">
                  Contoh:{" "}
                </span>
                {context.example}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selection summary */}
      <div className="rounded-xl border border-border bg-white p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-text-secondary">
              Konteks Terpilih
            </p>

            <p className="mt-1 text-lg font-semibold">
              {selected
                ? selected.title
                : "Belum ada konteks yang dipilih"}
            </p>

            <p className="mt-1 text-sm text-text-secondary">
              {!selected
                ? "Silakan pilih salah satu konteks di atas."
                : canResume
                  ? `Kamu dapat melanjutkan pembelajaran dari Fase ${savedSession?.currentPhase} tanpa mengulang asesmen awal.`
                  : "Kamu siap melanjutkan ke asesmen awal."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleContinue}
            disabled={!selectedContext}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {canResume
              ? "Lanjutkan Pembelajaran"
              : "Lanjutkan"}

            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
