import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Cpu,
  House,
  Leaf,
  Lightbulb,
} from "lucide-react";

type LearningContext = "DAILY_LIFE" | "ENVIRONMENT" | "TECHNOLOGY";

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

  const selected = contexts.find(
    (context) => context.id === selectedContext
  );

  const handleContinue = () => {
    if (!selectedContext) return;

    // Temporary navigation until the pre-test is implemented.
    navigate("/learn/pre-test", {
      state: { context: selectedContext },
    });
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
          Sistem akan menyesuaikan studi kasus fisika
          berdasarkan konteks yang dipilih.
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
              {isSelected && (
                <div className="absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white">
                  <Check size={16} />
                </div>
              )}

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl ${context.color}`}
              >
                <Icon size={27} />
              </div>

              <h3 className="mt-6 text-lg font-semibold">
                {context.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {context.description}
              </p>

              <p className="mt-auto pt-6 text-xs leading-relaxed text-text-secondary">
                <span className="font-semibold">Contoh: </span>
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
              {selected
                ? "Kamu siap melanjutkan ke asesmen awal."
                : "Silakan pilih salah satu konteks di atas."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleContinue}
            disabled={!selectedContext}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Lanjutkan
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}