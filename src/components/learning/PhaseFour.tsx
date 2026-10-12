import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Send,
} from "lucide-react";

import { mockReconstruction } from "../../data/learningSession";

export type CERResponse = {
  claim: string;
  evidence: string;
  reasoning: string;
};

type Props = {
  previousAnswer: string;
  onComplete: (response: CERResponse) => void;
};

type CERField = keyof CERResponse;

const fields: CERField[] = [
  "claim",
  "evidence",
  "reasoning",
];

export default function PhaseFour({
  previousAnswer,
  onComplete,
}: Props) {
  const [responses, setResponses] = useState<CERResponse>({
    claim: "",
    evidence: "",
    reasoning: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const [visibleHints, setVisibleHints] = useState<CERField[]>([]);

  const updateResponse = (field: CERField, value: string) => {
    setResponses((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const toggleHint = (field: CERField) => {
    setVisibleHints((previous) =>
      previous.includes(field)
        ? previous.filter((item) => item !== field)
        : [...previous, field]
    );
  };

  const isValid = fields.every(
    (field) => responses[field].trim().length > 0
  );

  const handleSubmit = () => {
    if (!isValid) return;
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="rounded-xl border border-border bg-white p-7">
        <p className="text-sm font-semibold text-primary">
          FASE 4 — REKONSTRUKSI KONSEP
        </p>

        <h2 className="mt-4 text-xl font-bold">
          {mockReconstruction.title}
        </h2>

        <p className="mt-3 leading-relaxed text-text-secondary">
          {mockReconstruction.description}
        </p>

        <div className="mt-6 rounded-xl bg-slate-50 p-5">
          <p className="text-sm font-semibold text-text-secondary">
            Hasil Investigasi Sebelumnya
          </p>

          <p className="mt-3 whitespace-pre-wrap leading-relaxed">
            {previousAnswer}
          </p>
        </div>
      </div>

      {/* CER Form */}
      <div className="rounded-xl border border-border bg-white p-7">
        <h3 className="text-lg font-bold">
          Susun Penjelasan Ilmiahmu
        </h3>

        <p className="mt-2 text-sm text-text-secondary">
          Lengkapi ketiga bagian berikut untuk membangun
          argumentasi ilmiah berdasarkan bukti.
        </p>

        {!submitted ? (
          <>
            <div className="mt-8 space-y-8">
              {fields.map((field, index) => {
                const config = mockReconstruction[field];

                return (
                  <div key={field}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-primary">
                        {index + 1}
                      </div>

                      <h4 className="font-semibold">
                        {config.label}
                      </h4>
                    </div>

                    <label
                      htmlFor={`cer-${field}`}
                      className="mt-4 block text-sm leading-relaxed"
                    >
                      {config.question}
                    </label>

                    <textarea
                      id={`cer-${field}`}
                      value={responses[field]}
                      onChange={(event) =>
                        updateResponse(field, event.target.value)
                      }
                      rows={5}
                      placeholder={config.placeholder}
                      className="mt-3 w-full resize-y rounded-xl border border-border p-4 text-sm leading-relaxed outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                    />

                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => toggleHint(field)}
                        aria-expanded={visibleHints.includes(field)}
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                      >
                        <HelpCircle size={17} />
                        {visibleHints.includes(field)
                          ? "Sembunyikan Petunjuk"
                          : "Butuh Petunjuk?"}
                      </button>

                      {visibleHints.includes(field) && (
                        <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                          <p className="text-sm leading-relaxed text-blue-800">
                            {config.hint}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex justify-end border-t border-border pt-6">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isValid}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Kirim Penjelasan
                <Send size={17} />
              </button>
            </div>
          </>
        ) : (
          <div className="mt-7 space-y-6">
            <div className="rounded-xl border border-green-200 bg-green-50 p-5">
              <div className="flex items-center gap-2 font-semibold text-green-700">
                <CheckCircle2 size={20} />
                Penjelasan Tercatat
              </div>

              <div className="mt-5 space-y-5">
                {fields.map((field) => (
                  <div key={field}>
                    <p className="text-sm font-semibold text-green-800">
                      {mockReconstruction[field].label}
                    </p>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-green-950">
                      {responses[field].trim()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-blue-50 p-5">
              <p className="font-semibold text-blue-800">
                Selanjutnya: Refleksi dan Evaluasi
              </p>

              <p className="mt-2 text-sm leading-relaxed text-blue-700">
                Pada fase berikutnya, kamu akan membandingkan
                pemahaman awalmu dengan penjelasan ilmiah
                yang telah kamu susun.
              </p>
            </div>

            <div className="flex justify-end">
                <button
                type="button"
                onClick={() =>
                    onComplete({
                    claim: responses.claim.trim(),
                    evidence: responses.evidence.trim(),
                    reasoning: responses.reasoning.trim(),
                    })
                }
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                Lanjut ke Fase 5
                <ArrowRight size={17} />
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}