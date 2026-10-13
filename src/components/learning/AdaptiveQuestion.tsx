
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
  Send,
  Sparkles,
} from "lucide-react";

import type { AdaptivePhaseState } from "../../types/adaptiveLearning";

type Props = {
  state: AdaptivePhaseState;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  onNext: () => void;
  onRetry: () => void;
  onPhaseComplete: () => void;
};

export default function AdaptiveQuestion({
  state,
  onAnswerChange,
  onSubmit,
  onNext,
  onRetry,
  onPhaseComplete,
}: Props) {
  const latestAnswer = state.history.at(-1);

  const canSubmit =
    state.status === "answering" &&
    Boolean(state.currentQuestion) &&
    Boolean(state.draftAnswer.trim());

  return (
    <div className="space-y-6">
      {/* Question card */}
      {state.status === "answering" && state.currentQuestion && (
        <div className="rounded-2xl border border-border bg-white p-7">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Sparkles size={18} />
            PERTANYAAN PEMBELAJARAN
          </div>

          <h2 className="mt-5 text-xl font-semibold leading-relaxed">
            {state.currentQuestion.question}
          </h2>

          {state.currentQuestion.hint && (
            <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
              <span className="font-semibold">Petunjuk: </span>
              {state.currentQuestion.hint}
            </div>
          )}

          <label
            htmlFor="adaptive-answer"
            className="mt-7 block text-sm font-semibold"
          >
            Jawaban Kamu
          </label>

          <textarea
            id="adaptive-answer"
            value={state.draftAnswer}
            onChange={(event) =>
              onAnswerChange(event.target.value)
            }
            rows={6}
            placeholder="Tuliskan jawaban dan alasanmu..."
            className="mt-3 w-full resize-y rounded-xl border border-border p-4 text-sm leading-relaxed outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
          />

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onSubmit}
              disabled={!canSubmit}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Kirim Jawaban
              <Send size={17} />
            </button>
          </div>
        </div>
      )}

      {/* Submitting */}
      {state.status === "submitting" && (
        <div
          role="status"
          className="rounded-2xl border border-blue-200 bg-blue-50 p-7"
        >
          <div className="flex items-center gap-3">
            <LoaderCircle
              size={24}
              className="animate-spin text-primary"
            />

            <div>
              <p className="font-semibold text-blue-800">
                Memproses Jawaban...
              </p>
              <p className="mt-1 text-sm text-blue-700">
                Sistem sedang menunggu respons evaluasi.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Feedback */}
      {state.status === "feedback" && (
        <div className="rounded-2xl border border-border bg-white p-7">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Sparkles size={18} />
            UMPAN BALIK PEMBELAJARAN
          </div>

          <div className="mt-5 rounded-xl bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase text-text-secondary">
              Jawaban Sebelumnya
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
              {latestAnswer?.answer}
            </p>
          </div>

          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-5">
            <p className="text-sm font-semibold text-blue-800">
              Umpan Balik
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-blue-800">
              {latestAnswer?.feedback ??
                "Belum ada umpan balik yang diberikan."}
            </p>
          </div>

          <button
            type="button"
            onClick={onNext}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Pertanyaan Selanjutnya
            <ArrowRight size={17} />
          </button>
        </div>
      )}

      {/* Phase completed */}
      {state.status === "completed" && (
        <div className="rounded-2xl border border-green-200 bg-white p-7">
          <CheckCircle2 size={32} className="text-green-600" />

          <h2 className="mt-4 text-xl font-bold">
            Fase Pembelajaran Selesai
          </h2>

          <p className="mt-2 text-sm text-text-secondary">
            Kamu telah menyelesaikan pertanyaan pada fase ini.
          </p>

          {latestAnswer?.feedback && (
            <div className="mt-5 rounded-xl bg-green-50 p-5 text-sm leading-relaxed text-green-800">
              {latestAnswer.feedback}
            </div>
          )}

          <button
            type="button"
            onClick={onPhaseComplete}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Lanjutkan Pembelajaran
            <ArrowRight size={17} />
          </button>
        </div>
      )}

      {/* Error */}
      {state.status === "error" && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-7"
        >
          <div className="flex items-center gap-3">
            <AlertCircle size={24} className="text-red-700" />
            <p className="font-semibold text-red-800">
              Gagal Memproses Jawaban
            </p>
          </div>

          <p className="mt-3 text-sm text-red-700">
            {state.error ?? "Terjadi kesalahan."}
          </p>

          <button
            type="button"
            onClick={onRetry}
            className="mt-5 rounded-lg border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-800 hover:bg-red-100"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Idle */}
      {state.status === "idle" && (
        <div className="rounded-2xl border border-border bg-white p-7 text-center">
          <p className="text-text-secondary">
            Pertanyaan pembelajaran belum tersedia.
          </p>
        </div>
      )}
    </div>
  );
}