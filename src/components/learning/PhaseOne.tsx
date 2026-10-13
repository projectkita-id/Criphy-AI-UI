
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Send,
} from "lucide-react";

export type Confidence = "LOW" | "MEDIUM" | "HIGH";

export type PhaseOneResponse = {
  answer: string;
  confidence: Confidence;
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

export default function PhaseOne({
  question,
  onComplete,
}: Props) {
  const [answer, setAnswer] = useState("");
  const [confidence, setConfidence] =
    useState<Confidence | null>(null);

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!answer.trim() || !confidence) return;
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
          <div className="mt-7">
            <label
              htmlFor="student-answer"
              className="mb-3 block text-sm font-semibold"
            >
              Prediksi dan Alasanmu
            </label>

            <textarea
              id="student-answer"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              rows={6}
              placeholder="Tuliskan prediksi dan alasanmu di sini..."
              className="w-full resize-y rounded-xl border border-border p-4 text-sm leading-relaxed outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
            />
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
              disabled={!answer.trim() || !confidence}
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

            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-green-900">
              {answer.trim()}
            </p>

            <p className="mt-4 text-xs text-green-700">
              Tingkat keyakinan:{" "}
              {confidenceOptions.find(
                (option) => option.value === confidence
              )?.label}
            </p>
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
                  answer: answer.trim(),
                  confidence,
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