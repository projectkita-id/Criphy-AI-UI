import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Send,
} from "lucide-react";

import type { DemoLearningContent } from "../../data/demoLearningContent";

type Props = {
  initialAnswer: string;
  content: DemoLearningContent["phaseTwo"];
  onComplete: (answer: string) => void;
};

const phaseQuestions = [
  "Apa yang paling menantang dari prediksi awalmu dalam situasi ini?",
  "Bukti apa yang terlihat dari studi kasus yang bertentangan dengan prediksi awalmu?",
  "Bagaimana kamu membedakan antara yang kamu pikirkan dan yang benar-benar tampak?",
  "Informasi apa yang masih kurang untuk menguji prediksi tersebut?",
  "Apa kesimpulan sementara yang paling masuk akal saat ini?",
];

export default function PhaseTwo({
  initialAnswer,
  content,
  onComplete,
}: Props) {
  const [responses, setResponses] = useState<string[]>(
    Array(phaseQuestions.length).fill("")
  );
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const updateResponse = (index: number, value: string) => {
    setResponses((previous) => {
      const next = [...previous];
      next[index] = value;
      return next;
    });
  };

  const isComplete = responses.every((value) => value.trim().length > 0);

  const handleSubmit = () => {
    if (!isComplete) return;
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-white p-7">
        <p className="text-sm font-semibold text-primary">
          FASE 2 — KONFLIK KOGNITIF
        </p>

        <h2 className="mt-4 text-xl font-bold">
          {content.title}
        </h2>

        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm font-semibold text-amber-800">
            Situasi untuk Dianalisis
          </p>
          <p className="mt-3 leading-relaxed text-amber-950">
            {content.scenario}
          </p>
        </div>

        <div className="mt-6 rounded-xl bg-slate-50 p-5">
          <p className="text-sm font-semibold text-text-secondary">
            Prediksi Awalmu
          </p>
          <p className="mt-3 whitespace-pre-wrap leading-relaxed">
            {initialAnswer}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-7">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Lightbulb size={19} />
          PERTANYAAN REFLEKTIF
        </div>

        <h3 className="mt-5 text-xl font-semibold leading-relaxed">
          {content.question}
        </h3>

        {!submitted ? (
          <>
            <div className="mt-7 space-y-6">
              {phaseQuestions.map((prompt, index) => (
                <div key={prompt}>
                  <label
                    htmlFor={`phase-two-${index}`}
                    className="mb-3 block text-sm font-semibold"
                  >
                    {index + 1}. {prompt}
                  </label>

                  <textarea
                    id={`phase-two-${index}`}
                    value={responses[index]}
                    onChange={(event) => updateResponse(index, event.target.value)}
                    rows={4}
                    placeholder="Tuliskan jawabanmu di sini..."
                    className="w-full resize-y rounded-xl border border-border p-4 text-sm leading-relaxed outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              ))}
            </div>

            <div className="mt-5">
              {!showHint ? (
                <button
                  type="button"
                  onClick={() => setShowHint(true)}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <HelpCircle size={18} />
                  Butuh Petunjuk?
                </button>
              ) : (
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
                  <p className="font-semibold text-blue-800">
                    Petunjuk
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-blue-700">
                    {content.hint}
                  </p>
                </div>
              )}
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
            </div>

            <div className="rounded-xl bg-blue-50 p-5">
              <p className="font-semibold text-blue-800">
                Selanjutnya: Investigasi Berbasis Bukti
              </p>
              <p className="mt-2 text-sm leading-relaxed text-blue-700">
                Pada fase berikutnya, kamu akan menggunakan
                data dan bukti untuk menguji pemahamanmu.
              </p>
            </div>

            <div className="flex justify-end">
                <button
                type="button"
                onClick={() => onComplete(
                  responses
                    .map((response, index) => `${index + 1}. ${phaseQuestions[index]}\n${response.trim()}`)
                    .filter((response) => response.trim().length > 0)
                    .join("\n\n")
                )}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                Lanjut ke Fase 3
                <ArrowRight size={17} />
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}