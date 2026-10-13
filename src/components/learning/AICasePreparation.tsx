
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  LoaderCircle,
  Sparkles,
} from "lucide-react";

import type { CaseStudyContext } from "../../data/caseStudies";
import type { AIGeneratedCaseStudy } from "../../types/aiLearning";
import type { AIServiceState } from "../../types/aiServiceState";

type Props = {
  context: CaseStudyContext | null;
  state: AIServiceState<AIGeneratedCaseStudy>;
  onBack: () => void;
  onRetry?: () => void;
  onContinue?: () => void;
};

const contextLabels: Record<CaseStudyContext, string> = {
  DAILY_LIFE: "Kehidupan Sehari-hari",
  ENVIRONMENT: "Lingkungan",
  TECHNOLOGY: "Teknologi",
};

export default function AICasePreparation({
  context,
  state,
  onBack,
  onRetry,
  onContinue,
}: Props) {
  const contextLabel = context
    ? contextLabels[context]
    : "Belum dipilih";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">
          PEMBELAJARAN INTERAKTIF
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Persiapan Studi Kasus
        </h1>

        <p className="mt-2 text-text-secondary">
          Studi kasus akan disesuaikan dengan konteks
          pembelajaran yang telah kamu pilih.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-white p-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-primary">
          <Sparkles size={28} />
        </div>

        <h2 className="mt-6 text-xl font-bold">
          Persiapan Naskah Studi Kasus
        </h2>

        <div className="mt-6 rounded-xl border border-border bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Konteks Pembelajaran
          </p>

          <p className="mt-2 text-lg font-semibold">
            {contextLabel}
          </p>

          <p className="mt-1 text-sm text-text-secondary">
            Kinematika Gerak Lurus
          </p>
        </div>

        {/* Idle: AI integration is not active */}
        {state.status === "idle" && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <AlertCircle
                size={20}
                className="mt-0.5 shrink-0 text-amber-700"
              />

              <div>
                <p className="text-sm font-semibold text-amber-800">
                  Integrasi AI Belum Tersedia
                </p>

                <p className="mt-2 text-sm leading-relaxed text-amber-800">
                  Fitur pembuatan studi kasus otomatis
                  masih dalam tahap pengembangan.
                  Jawaban asesmen awal tersimpan di
                  browser untuk demo, tetapi belum
                  dikirim ke layanan AI.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading: waiting for AI generation */}
        {state.status === "loading" && (
          <div
            role="status"
            className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5"
          >
            <div className="flex items-center gap-3">
              <LoaderCircle
                size={22}
                className="animate-spin text-primary"
              />

              <div>
                <p className="text-sm font-semibold text-blue-800">
                  Menyiapkan Studi Kasus...
                </p>

                <p className="mt-1 text-sm text-blue-700">
                  Sistem sedang memproses permintaan
                  pembuatan studi kasus.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success: case generation completed */}
        {state.status === "success" && (
          <div
            role="status"
            className="mt-6 rounded-xl border border-green-200 bg-green-50 p-5"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2
                size={22}
                className="shrink-0 text-green-700"
              />

              <div>
                <p className="text-sm font-semibold text-green-800">
                  Studi Kasus Siap
                </p>

                <p className="mt-2 text-sm text-green-800">
                  {state.data.title}
                </p>

                <p className="mt-1 text-sm text-green-700">
                  {state.data.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error: generation failed */}
        {state.status === "error" && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5"
          >
            <p className="text-sm font-semibold text-red-800">
              Gagal Menyiapkan Studi Kasus
            </p>

            <p className="mt-2 text-sm text-red-700">
              {state.error}
            </p>

            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-800 hover:bg-red-100"
              >
                Coba Lagi
              </button>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          {state.status === "success" && onContinue && (
            <button
              type="button"
              onClick={onContinue}
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Mulai Pembelajaran
            </button>
          )}

          <button
            type="button"
            onClick={onBack}
            disabled={state.status === "loading"}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft size={17} />
            Pilih Konteks Lain
          </button>
        </div>
      </div>
    </div>
  );
}