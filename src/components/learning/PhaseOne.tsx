
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Send,
  TimerReset,
} from "lucide-react";

export type Confidence = "LOW" | "MEDIUM" | "HIGH";

export type PhaseOneResponse = {
  answer: string;
  confidence: Confidence;
  answeredAt: string;
  responseTimeSeconds: number;
};

type Props = {
  question: string;
  onComplete: (response: PhaseOneResponse) => void;
};

const confidenceOptions: {
  value: Confidence;
  label: string;
}[] = [
  { value: "LOW", label: "Kurang Yakin" },
  { value: "MEDIUM", label: "Cukup Yakin" },
  { value: "HIGH", label: "Sangat Yakin" },
];

const phaseQuestions = [
  "Apa prediksi awalmu tentang situasi yang sedang kamu hadapi?",
  "Apa alasan utama yang mendukung prediksi tersebut?",
  "Apa yang paling kamu perhatikan dari situasi ini?",
  "Apa yang masih kamu ragukan atau belum yakin?",
  "Menurutmu, apa bukti atau informasi yang dibutuhkan untuk menguji prediksi ini?",
];

export default function PhaseOne({
  question,
  onComplete,
}: Props) {
  const [responses, setResponses] = useState<string[]>(
    Array(phaseQuestions.length).fill("")
  );
  const [confidence, setConfidence] =
    useState<Confidence | null>(null);
  const [responseStartedAt] = useState(() => Date.now());

  const [submitted, setSubmitted] = useState(false);

  const updateResponse = (index: number, value: string) => {
    setResponses((previous) => {
      const next = [...previous];
      next[index] = value;
      return next;
    });
  };

  const isComplete =
    responses.every((value) => value.trim().length > 0) &&
    confidence !== null;

  const handleSubmit = () => {
    if (!isComplete) return;
    setSubmitted(true);
  };

  return (
    <div className="rounded-xl border border-border bg-white p-7">
      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
        <Lightbulb size={19} />
        FASE 1 — AKTIVASI KONSEPSI AWAL
      </div>

      <h2 className="mt-5 text-xl font-semibold leading-relaxed">
        {question}
      </h2>

      {!submitted ? (
        <>
          <div className="mt-7 space-y-6">
            {phaseQuestions.map((prompt, index) => (
              <div key={prompt}>
                <label
                  htmlFor={`phase-one-${index}`}
                  className="mb-3 block text-sm font-semibold"
                >
                  {index + 1}. {prompt}
                </label>

                <textarea
                  id={`phase-one-${index}`}
                  value={responses[index]}
                  onChange={(event) => updateResponse(index, event.target.value)}
                  rows={4}
                  placeholder="Tuliskan jawabanmu di sini..."
                  className="w-full resize-y rounded-xl border border-border p-4 text-sm leading-relaxed outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                />
              </div>
            ))}
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold">
              Seberapa yakin kamu dengan jawabanmu?
            </p>

            <div className="mt-3 flex flex-wrap gap-3">
              {confidenceOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setConfidence(option.value)}
                  aria-pressed={confidence === option.value}
                  className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                    confidence === option.value
                      ? "border-primary bg-blue-50 text-primary"
                      : "border-border text-text-secondary hover:bg-slate-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-end border-t border-border pt-6">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isComplete}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Kirim Jawaban
              <Send size={17} />
            </button>
          </div>
        </>
      ) : (
        <div className="mt-7 space-y-6">
          <div className="rounded-xl border border-green-200 bg-green-50 p-5">
            <div className="flex items-center gap-2 font-semibold text-green-700">
              <CheckCircle2 size={20} />
              Jawaban Tercatat
            </div>

            <div className="mt-3 space-y-3 text-sm leading-relaxed text-green-900">
              {responses.map((response, index) => (
                <div key={`summary-${index}`}>
                  <p className="font-semibold text-green-800">
                    {index + 1}. {phaseQuestions[index]}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap">{response.trim()}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-green-700">
              <span>
                Tingkat keyakinan:{" "}
                {confidenceOptions.find(
                  (option) => option.value === confidence
                )?.label}
              </span>
              <span className="inline-flex items-center gap-1">
                <TimerReset size={14} />
                {Math.max(
                  1,
                  Math.round((Date.now() - responseStartedAt) / 1000)
                )} detik
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
            <p className="font-semibold text-blue-800">
              Langkah Selanjutnya
            </p>

            <p className="mt-2 text-sm leading-relaxed text-blue-700">
              Prediksi awalmu telah tercatat. Pada tahap
              berikutnya, kamu akan mengeksplorasi situasi
              yang dapat mendukung atau menantang prediksimu.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (!confidence) return;

                onComplete({
                  answer: responses
                    .map((response, index) => `${index + 1}. ${phaseQuestions[index]}\n${response.trim()}`)
                    .filter((response) => response.trim().length > 0)
                    .join("\n\n"),
                  confidence,
                  answeredAt: new Date().toISOString(),
                  responseTimeSeconds: Math.max(
                    1,
                    Math.round((Date.now() - responseStartedAt) / 1000)
                  ),
                });
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Lanjut ke Fase 2
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}