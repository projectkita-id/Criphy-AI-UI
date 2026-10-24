import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Send,
  Table2,
} from "lucide-react";

import type { DemoLearningContent } from "../../data/demoLearningContent";
import MotionGraph from "./MotionGraph";

type Props = {
  previousAnswer: string;
  content: DemoLearningContent["phaseThree"];
  onComplete: (answer: string) => void;
};

const phaseQuestions = [
  "Apa pola yang kalian lihat pada data yang diberikan?",
  "Pada waktu mana perubahan paling jelas terjadi?",
  "Bukti apa yang paling kuat mendukung kesimpulan kalian?",
  "Apakah ada data yang tampak tidak konsisten dengan prediksi awal?",
  "Apa kesimpulan sementara yang paling tepat berdasarkan data dan pola tersebut?",
];

export default function PhaseThree({
  previousAnswer,
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
      {/* Introduction */}
      <div className="rounded-xl border border-border bg-white p-7">
        <p className="text-sm font-semibold text-primary">
          FASE 3 — INVESTIGASI BERBASIS BUKTI
        </p>

        <h2 className="mt-4 text-xl font-bold">
          {content.title}
        </h2>

        <p className="mt-3 leading-relaxed text-text-secondary">
          {content.description}
        </p>

        <div className="mt-6 rounded-xl bg-slate-50 p-5">
          <p className="text-sm font-semibold text-text-secondary">
            Jawabanmu pada Fase 2
          </p>

          <p className="mt-3 whitespace-pre-wrap leading-relaxed">
            {previousAnswer}
          </p>
        </div>
      </div>

      {/* Data table */}
      <div className="rounded-xl border border-border bg-white p-7">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Table2 size={19} />
          DATA KECEPATAN KENDARAAN
        </div>

        <p className="mt-3 text-sm text-text-secondary">
          Tabel berikut berisi data simulasi kecepatan
          kedua mobil pada interval waktu yang sama.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-border px-4 py-3 text-left">
                  Waktu (detik)
                </th>
                <th className="border border-border px-4 py-3 text-left">
                  Mobil A (km/jam)
                </th>
                <th className="border border-border px-4 py-3 text-left">
                  Mobil B (km/jam)
                </th>
              </tr>
            </thead>

            <tbody>
              {content.data.map((point) => (
                <tr
                  key={point.time}
                  className="hover:bg-slate-50"
                >
                  <td className="border border-border px-4 py-3">
                    {point.time}
                  </td>

                  <td className="border border-border px-4 py-3">
                    {point.carA}
                  </td>

                  <td className="border border-border px-4 py-3">
                    {point.carB}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Motion graph */}
      <MotionGraph data={content.data} />

      {/* Evidence-based question */}
      <div className="rounded-xl border border-border bg-white p-7">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Lightbulb size={19} />
          ANALISIS BERDASARKAN BUKTI
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
                    htmlFor={`phase-three-${index}`}
                    className="mb-3 block text-sm font-semibold"
                  >
                    {index + 1}. {prompt}
                  </label>

                  <textarea
                    id={`phase-three-${index}`}
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
                Selanjutnya: Rekonstruksi Konsep
              </p>

              <p className="mt-2 text-sm leading-relaxed text-blue-700">
                Pada fase berikutnya, kamu akan
                menyusun kesimpulan berdasarkan klaim,
                bukti, dan penalaran.
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
                Lanjut ke Fase 4
                <ArrowRight size={17} />
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}