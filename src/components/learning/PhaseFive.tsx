import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  History,
  Lightbulb,
  Send,
} from "lucide-react";

import type { DemoLearningContent } from "../../data/demoLearningContent";
import type { PhaseOneResponse } from "./PhaseOne";
import type { CERResponse } from "./PhaseFour";

export type ReflectionResponse = {
  understanding: string;
  evidence: string;
};

type Props = {
  initialResponse: PhaseOneResponse;
  reconstructionResponse: CERResponse;
  content: DemoLearningContent["phaseFive"];
  onComplete: (response: ReflectionResponse) => void;
};

export default function PhaseFive({
  initialResponse,
  reconstructionResponse,
  content,
  onComplete,
}: Props) {
  const [responses, setResponses] = useState<ReflectionResponse>({
    understanding: "",
    evidence: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const isValid =
    responses.understanding.trim().length > 0 &&
    responses.evidence.trim().length > 0;

  const handleSubmit = () => {
    if (!isValid) return;
    setSubmitted(true);
  };

  const finalResponse: ReflectionResponse = {
    understanding: responses.understanding.trim(),
    evidence: responses.evidence.trim(),
  };

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="rounded-xl border border-border bg-white p-7">
        <p className="text-sm font-semibold text-primary">
          FASE 5 — REFLEKSI DAN EVALUASI
        </p>

        <h2 className="mt-4 text-xl font-bold">
          {content.title}
        </h2>

        <p className="mt-3 leading-relaxed text-text-secondary">
          {content.description}
        </p>
      </div>

      {/* Comparison */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-white p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-text-secondary">
            <History size={19} />
            PEMAHAMAN AWAL
          </div>

          <p className="mt-2 text-xs text-text-secondary">
            Jawaban dari Fase 1
          </p>

          <div className="mt-5 rounded-lg bg-slate-50 p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {initialResponse.answer}
            </p>
          </div>

          <p className="mt-4 text-xs text-text-secondary">
            Tingkat keyakinan:{" "}
            {initialResponse.confidence === "LOW"
              ? "Kurang Yakin"
              : initialResponse.confidence === "MEDIUM"
              ? "Cukup Yakin"
              : "Sangat Yakin"}
          </p>
        </div>

        <div className="rounded-xl border border-blue-100 bg-white p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Lightbulb size={19} />
            PEMAHAMAN BARU
          </div>

          <p className="mt-2 text-xs text-text-secondary">
            Penjelasan ilmiah dari Fase 4
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs font-semibold text-primary">
                Klaim
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">
                {reconstructionResponse.claim}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-primary">
                Bukti
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">
                {reconstructionResponse.evidence}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-primary">
                Penalaran
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">
                {reconstructionResponse.reasoning}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reflection form */}
      <div className="rounded-xl border border-border bg-white p-7">
        <h3 className="text-lg font-bold">
          Evaluasi Pemahamanmu
        </h3>

        <p className="mt-2 text-sm text-text-secondary">
          Jawablah pertanyaan berikut berdasarkan
          pengalaman belajarmu.
        </p>

        {!submitted ? (
          <>
            <div className="mt-7 space-y-7">
              <div>
                <label
                  htmlFor="reflection-understanding"
                  className="block text-sm font-semibold leading-relaxed"
                >
                  1. {content.understandingQuestion}
                </label>

                <textarea
                  id="reflection-understanding"
                  value={responses.understanding}
                  onChange={(event) =>
                    setResponses((previous) => ({
                      ...previous,
                      understanding: event.target.value,
                    }))
                  }
                  rows={5}
                  placeholder={content.understandingPlaceholder}
                  className="mt-3 w-full resize-y rounded-xl border border-border p-4 text-sm leading-relaxed outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="reflection-evidence"
                  className="block text-sm font-semibold leading-relaxed"
                >
                  2. {content.evidenceQuestion}
                </label>

                <textarea
                  id="reflection-evidence"
                  value={responses.evidence}
                  onChange={(event) =>
                    setResponses((previous) => ({
                      ...previous,
                      evidence: event.target.value,
                    }))
                  }
                  rows={5}
                  placeholder={content.evidencePlaceholder}
                  className="mt-3 w-full resize-y rounded-xl border border-border p-4 text-sm leading-relaxed outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end border-t border-border pt-6">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isValid}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Kirim Refleksi
                <Send size={17} />
              </button>
            </div>
          </>
        ) : (
          <div className="mt-7 space-y-6">
            <div className="rounded-xl border border-green-200 bg-green-50 p-5">
              <div className="flex items-center gap-2 font-semibold text-green-700">
                <CheckCircle2 size={20} />
                Refleksi Tercatat
              </div>

              <div className="mt-5 space-y-5">
                <div>
                  <p className="text-sm font-semibold text-green-800">
                    Perubahan Pemahaman
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-green-950">
                    {finalResponse.understanding}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-green-800">
                    Bukti yang Memengaruhi Pemahaman
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-green-950">
                    {finalResponse.evidence}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-blue-50 p-5">
              <p className="font-semibold text-blue-800">
                Pembelajaran Selesai!
              </p>

              <p className="mt-2 text-sm leading-relaxed text-blue-700">
                Kamu telah menyelesaikan kelima fase pembelajaran.
                Selanjutnya, kerjakan post-test untuk mengevaluasi
                pemahamanmu setelah belajar.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => onComplete(finalResponse)}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Lanjut ke Post-Test
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}